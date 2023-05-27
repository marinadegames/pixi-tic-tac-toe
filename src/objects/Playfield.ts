import { Container, Rectangle, Sprite, Texture } from 'pixi.js';
import type { MatrixType } from '../descriptions';
import { PlayfieldPositionDescription } from './PlayfieldPositionDescription';

export class Playfield {
  private readonly playfield: Sprite;

  private matrix: MatrixType;

  private container: Container;

  private needToDestroyChild = [];

  private restartButton: Rectangle;

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

    this.restartButton = new Rectangle(100, 100, 300, 100);
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
          // empty field
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

  private computerMove() {
    const resultPosX = Math.floor(Math.random() * 3);
    const resultPosY = Math.floor(Math.random() * 3);

    if (this.matrix[resultPosX][resultPosY] === 0) {
      this.matrix[resultPosX].splice(resultPosY, 1, 2);
    } else {
      let counterCheckLastField = 0;
      for (let i = 0; i < this.matrix.length; i++) {
        for (let j = 0; j < this.matrix[i].length; j++) {
          if (this.matrix[i][j] === 0) {
            counterCheckLastField++;
          }
        }
      }
      if (counterCheckLastField <= 1) {
        this.endGame(0);
      } else {
        this.computerMove();
      }
    }
  }

  private createHighlightBackground(x: number, y: number, id: number, isInteractive: boolean, isVisible?: boolean): Sprite {
    const highlightSprite = new Sprite(Texture.from('win_highlight'));
    highlightSprite.anchor.set(0.5, 0.5);
    highlightSprite.position.set(x, y);
    highlightSprite.alpha = isVisible ? 1 : 0;
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
    let counterIterable = 1;
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

    if (this.checkWin(1) === true) {
      // player win
      this.drawCrossesAndZeros();
      this.endGame(1);
    } else {
      this.computerMove();
      this.drawCrossesAndZeros();
      if (this.checkWin(2) === true) {
        this.endGame(2);
      }
    }
  }

  private checkWin(checking: 1 | 2) {
    //1 = player, 2 = pc
    // check horizontal lines
    for (let i = 0; i < 3; i++) {
      if (this.matrix[i][0] === checking && this.matrix[i][1] === checking && this.matrix[i][2] === checking) {
        return true;
      }
    }

    // check vertical lines
    for (let i = 0; i < 3; i++) {
      if (this.matrix[0][i] === checking && this.matrix[1][i] === checking && this.matrix[2][i] === checking) {
        return true;
      }
    }

    // check diagonal
    for (let i = 0; i < 3; i++) {
      if (this.matrix[0][0] === checking && this.matrix[1][1] === checking && this.matrix[2][2] === checking) {
        return true;
      } else if (this.matrix[0][2] === checking && this.matrix[1][1] === checking && this.matrix[2][0] === checking) {
        return true;
      }
    }

    // no win
    return false;
  }

  private endGame(whoIsWin: 0 | 1 | 2) {
    if (whoIsWin === 0) {
      console.log('DRAW');
    }
    if (whoIsWin === 1) {
      console.log('PLAYER IS WIN!');
    }
    if (whoIsWin === 2) {
      console.log('PC IS WIN!');
    }
  }
}
