import { Container, Sprite, Texture } from 'pixi.js';
import type { MatrixType } from '../descriptions';
import { PlayfieldPositionDescription } from './PlayfieldPositionDescription';

export class Playfield {
  private readonly playfield: Sprite;

  private matrix: MatrixType;

  private container: Container;

  constructor(container: Container) {
    this.playfield = new Sprite(Texture.from('playfield'));
    this.container = container;
    this.container.addChild(this.playfield);

    this.playfield.anchor.set(0.5, 0.5);

    this.matrix = [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2],
    ];

    this.drawCrossesAndZeros();
  }

  private drawCrossesAndZeros() {
    let counterIterable = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const num = this.matrix[i][j];
        if (num === 0) {
          // todo
          this.container.addChild(this.spriteCreator('cross', PlayfieldPositionDescription[counterIterable].x, PlayfieldPositionDescription[counterIterable].y));
        } else if (num === 1) {
          // cross
          this.container.addChild(this.spriteCreator('cross', PlayfieldPositionDescription[counterIterable].x, PlayfieldPositionDescription[counterIterable].y));
        } else if (num === 2) {
          // zero
          this.container.addChild(this.spriteCreator('zero', PlayfieldPositionDescription[counterIterable].x, PlayfieldPositionDescription[counterIterable].y));
        }
        console.log(counterIterable);
        counterIterable++;
      }
    }
  }

  private spriteCreator(texture: string, x: number, y: number): Sprite {
    const sprite = new Sprite(Texture.from(texture));
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(x, y);
    return sprite;
  }
}
