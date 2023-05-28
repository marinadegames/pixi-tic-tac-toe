import * as PIXI from 'pixi.js';
import { Container, Sprite, Texture } from 'pixi.js';
import type { MatrixType } from '../descriptions';
import { Field } from './Field';
import { GameEventEmitter } from './EventEmmiter';
import { PlayfieldPositionDescription } from './PlayfieldPositionDescription';

export class Playfield extends Container {
  private readonly playfield: Sprite;
  private fields: Array<Array<Field>>;

  // init
  private matrix: MatrixType = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  private resources: any;
  private game: any;

  constructor(game: any, resources: any) {
    super();
    this.game = game;
    this.resources = resources;
    this.fields = [[], [], []];

    this.playfield = new Sprite(Texture.from('playfield'));
    this.playfield.anchor.set(0.5, 0.5);
    this.addChild(this.playfield);
    this.fieldsCreator();

    // @ts-ignore
    window['FIELDS'] = this.fields;

    GameEventEmitter.on('FIELD_CLICK_HANDLER', (args) => this.clickFieldHandler(args));
  }

  private fieldsCreator() {
    let counterIterable = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const field = new Field(this.game, this.resources, this.matrix[i][j], counterIterable);
        this.fields[i].push(field);
        this.addChild(field);
        counterIterable++;
      }
    }
  }

  private clickFieldHandler(id: number) {
    this.buttonsDisabling();
    const animCross = this.createAnimation(this.resources.sequence.textures, 'cross-draw');
    animCross.loop = false;
    animCross.anchor.set(0.5, 0.5);
    this.addChild(animCross);
    animCross.animationSpeed = 0.6;

    let counterIterable = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (counterIterable === id) {
          this.matrix[i][j] = 1;
          animCross.position.set(PlayfieldPositionDescription[id].x, PlayfieldPositionDescription[id].y);
          animCross.play();
          animCross.onComplete = () => {
            this.fields[i][j].changeTexture(1);
            animCross.destroy();
            this.checkPlayerWin();
          };
          return;
        } else {
          counterIterable++;
        }
      }
    }
  }

  public createAnimation(textures: Array<any>, includeString: string) {
    let resultArrSeq = [];
    for (let i = 0; i < Object.keys(textures).length; i++) {
      const currentTexture = Object.keys(textures)[i];
      if (currentTexture.includes(includeString)) {
        resultArrSeq.push(Texture.from(Object.keys(textures)[i]));
      }
    }
    return new PIXI.AnimatedSprite(resultArrSeq);
  }

  private checkPlayerWin() {
    let counterLastChance = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          counterLastChance++;
        }
      }
    }

    if (this.checkWinLines(1) === true) {
      this.endGame(1);
    } else {
      if (counterLastChance < 1) {
        // draw
        this.endGame(0);
      } else {
        this.opponentMove();
      }
    }
  }

  private checkOpponentWin() {
    let counterLastChance = 0;
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          counterLastChance++;
        }
      }
    }

    if (counterLastChance < 1) {
      // draw
      this.endGame(0);
    } else {
      if (this.checkWinLines(2) === true) {
        // opponent win
        this.endGame(2);
      } else {
        this.buttonsActivate();
      }
    }
  }

  private checkWinLines(checking: 1 | 2) {
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

  private opponentMove() {
    let counterIterable = 0;
    let possiblePositionsForCircleDraw = [];

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          possiblePositionsForCircleDraw.push(PlayfieldPositionDescription[counterIterable].id - 1);
          counterIterable++;
        } else {
          counterIterable++;
        }
      }
    }
    const getPosition = Math.floor(Math.random() * possiblePositionsForCircleDraw.length);
    const resultChoice = possiblePositionsForCircleDraw[getPosition];

    counterIterable = 0;

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (counterIterable === resultChoice) {
          this.matrix[i][j] = 2;
          this.drawCircle(i, j, resultChoice);
          return;
        } else {
          counterIterable++;
        }
      }
    }
  }

  private drawCircle(posX: number, posY: number, position: number) {
    const animCircle = this.createAnimation(this.resources.sequence.textures, 'circle-draw');
    animCircle.loop = false;
    animCircle.anchor.set(0.5, 0.5);
    this.addChild(animCircle);
    animCircle.animationSpeed = 0.6;
    animCircle.position.set(PlayfieldPositionDescription[position].x, PlayfieldPositionDescription[position].y);
    animCircle.play();
    animCircle.onComplete = () => {
      this.fields[posX][posY].changeTexture(2);
      this.checkOpponentWin();
      animCircle.destroy();
      return;
    };
  }

  private buttonsActivate() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] === 0) {
          this.fields[i][j].activateInteractive();
        }
      }
    }
  }

  private buttonsDisabling() {
    for (let i = 0; i < this.fields.length; i++) {
      for (let j = 0; j < this.fields[i].length; j++) {
        this.fields[i][j].disableInteractive();
      }
    }
  }

  private endGame(whoIsWin: 0 | 1 | 2) {
    this.buttonsDisabling();

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
