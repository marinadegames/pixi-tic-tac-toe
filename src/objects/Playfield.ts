import { Container, Sprite, Texture } from 'pixi.js';
import type { MatrixType } from '../descriptions';
import { PlayfieldPositionDescription } from './PlayfieldPositionDescription';

export class Playfield {
  private readonly playfield: Sprite;

  private matrix: MatrixType;

  private container: Container;

  private needToDestroyChild = [];

  private savePlayerPosition = [];

  private saveRobotPosition = [];

  constructor(container: Container) {
    this.playfield = new Sprite(Texture.from('playfield'));
    this.container = container;
    this.container.addChild(this.playfield);
    this.playfield.anchor.set(0.5, 0.5);
    this.matrix = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    this.drawCrossesAndZeros();
  }

  private drawCrossesAndZeros() {
    let counterIterable = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const num = this.matrix[i][j];
        const posX = PlayfieldPositionDescription[counterIterable].x;
        const posY = PlayfieldPositionDescription[counterIterable].y;
        const posId = PlayfieldPositionDescription[counterIterable].id;
        if (num === 0) {
          // todo
          const item = this.createHighlightBackground(posX, posY, posId, true);
          this.container.addChild(item);
          this.needToDestroyChild.push(item);
        } else if (num === 1) {
          // cross, player
          this.container.addChild(this.createHighlightBackground(posX, posY, posId, false));
          this.container.addChild(this.spriteCreator('cross', posX, posY));
        } else if (num === 2) {
          // zero, pc
          this.container.addChild(this.createHighlightBackground(posX, posY, posId, false));
          this.container.addChild(this.spriteCreator('zero', posX, posY));
        }
        counterIterable++;
      }
    }
  }

  private createHighlightBackground(x: number, y: number, id: number, isInteractive: boolean): Sprite {
    const highlightSprite = new Sprite(Texture.from('win_highlight'));
    highlightSprite.anchor.set(0.5, 0.5);
    highlightSprite.position.set(x, y);
    highlightSprite.alpha = 0;
    if (isInteractive) {
      highlightSprite.interactive = true;
      highlightSprite.buttonMode = true;
      highlightSprite.on('pointerdown', () => this.fieldClickHandler(id));
    }
    return highlightSprite;
  }

  private spriteCreator(texture: string, x: number, y: number): Sprite {
    const sprite = new Sprite(Texture.from(texture));
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(x, y);
    return sprite;
  }

  private fieldClickHandler(id: number) {
    this.needToDestroyChild?.forEach((child) => child.destroy());
    this.needToDestroyChild = [];
    this.savePlayerPosition.push(id);
    let counterIterable = 1;
    // let newMatrix = Object.assign(this.matrix);
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (counterIterable === id) {
          this.matrix[i].splice(j, 1, 1);
          counterIterable++;
          break;
        } else {
          counterIterable++;
        }
      }
    }
    console.log(this.matrix);
    console.log(this.checkWinLinesPlayer());
    this.drawCrossesAndZeros();
  }

  private checkWinLinesPlayer() {
    // check horizontal lines
    for (let i = 0; i < 3; i++) {
      if (this.matrix[i][0] === 1 && this.matrix[i][1] === 1 && this.matrix[i][2] === 1) {
        return true;
      }
    }

    // check vertical lines
    for (let i = 0; i < 3; i++) {
      if (this.matrix[0][i] === 1 && this.matrix[1][i] === 1 && this.matrix[2][i] === 1) {
        return true;
      }
    }

    // check diagonal
    for (let i = 0; i < 3; i++) {
      if (
        (this.matrix[0][0] === 1 && this.matrix[1][1] === 1 && this.matrix[2][2] === 1) ||
        (this.matrix[0][2] === 1 && this.matrix[1][1] && this.matrix[2][0] === 1)
      ) {
        return true;
      }
    }

    // no win
    return false;
  }
}
