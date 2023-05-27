import { Container, Sprite, Texture } from 'pixi.js';
import type { MatrixType } from '../descriptions';
import { Field } from './Field';
import * as PIXI from 'pixi.js';
import { GameEventEmitter } from './EventEmmiter';
import { PlayfieldPositionDescription } from './PlayfieldPositionDescription';
import { isMainThread } from 'worker_threads';

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

    console.log(this.matrix);
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
            this.checkWin();
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

  private checkWin() {
    if (this.checkWinLines(1) === true) {
      // player win
      this.endGame(1);
    } else {
      this.opponentMove();
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
    const getPosition = Math.floor(Math.random() * 9);
    let counterIterable = 0;

    console.log(getPosition);

    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (counterIterable === getPosition && this.matrix[i][j] === 0) {
          const animCircle = this.createAnimation(this.resources.sequence.textures, 'circle-draw');
          animCircle.loop = false;
          animCircle.anchor.set(0.5, 0.5);
          this.addChild(animCircle);
          animCircle.animationSpeed = 0.6;
          animCircle.position.set(PlayfieldPositionDescription[getPosition].x, PlayfieldPositionDescription[getPosition].y);
          animCircle.play();
          animCircle.onComplete = () => {
            this.matrix[i][j] = 2;
            this.fields[i][j].changeTexture(2);
            this.checkWin();
            animCircle.stop();
          };
        } else {
          counterIterable++;
        }
      }
    }
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

  // private spriteCreator(texture: string, x: number, y: number): Sprite {
  //   const sprite = new Sprite(Texture.from(texture));
  //   sprite.anchor.set(0.5, 0.5);
  //   sprite.position.set(x, y);
  //   return sprite;
  // }

  // private drawCrossesAndZeros() {
  //   let counterIterable = 0;
  //   for (let i = 0; i < this.matrix.length; i++) {
  //     for (let j = 0; j < this.matrix[i].length; j++) {
  //       const num = this.matrix[i][j];
  //       const posX = PlayfieldPositionDescription[counterIterable].x;
  //       const posY = PlayfieldPositionDescription[counterIterable].y;
  //       const posId = PlayfieldPositionDescription[counterIterable].id;
  //       if (num === 0) {
  //         // empty field
  //         const item = this.createHighlightBackground(posX, posY, posId, true);
  //         this.container.addChild(item);
  //         this.needToDestroyChild.push(item);
  //       } else if (num === 1) {
  //         // cross, player
  //         this.container.addChild(this.createHighlightBackground(posX, posY, posId, false));
  //         this.container.addChild(this.spriteCreator('cross-draw_19', posX, posY));
  //       } else if (num === 2) {
  //         // zero, pc
  //         this.container.addChild(this.createHighlightBackground(posX, posY, posId, false));
  //         this.container.addChild(this.spriteCreator('zero', posX, posY));
  //       }
  //       counterIterable++;
  //     }
  //   }
  // }
  //
  // private computerMove() {
  //   const resultPosX = Math.floor(Math.random() * 3);
  //   const resultPosY = Math.floor(Math.random() * 3);
  //
  //   if (this.matrix[resultPosX][resultPosY] === 0) {
  //     this.matrix[resultPosX].splice(resultPosY, 1, 2);
  //   } else {
  //     let counterCheckLastField = 0;
  //     for (let i = 0; i < this.matrix.length; i++) {
  //       for (let j = 0; j < this.matrix[i].length; j++) {
  //         if (this.matrix[i][j] === 0) {
  //           counterCheckLastField++;
  //         }
  //       }
  //     }
  //     if (counterCheckLastField <= 1) {
  //       this.endGame(0);
  //     } else {
  //       this.computerMove();
  //     }
  //   }
  // }
  //
  // private createHighlightBackground(x: number, y: number, id: number, isInteractive: boolean, isVisible?: boolean): Sprite {
  //   const highlightSprite = new Sprite(Texture.from('win_highlight'));
  //   highlightSprite.anchor.set(0.5, 0.5);
  //   highlightSprite.position.set(x, y);
  //   highlightSprite.alpha = isVisible ? 1 : 0;
  //   if (isInteractive) {
  //     highlightSprite.interactive = true;
  //     highlightSprite.buttonMode = true;
  //     highlightSprite.once('pointerdown', () => this.fieldClickHandler(id));
  //   }
  //   return highlightSprite;
  // }
  //
  // private spriteCreator(texture: string, x: number, y: number): Sprite {
  //   const sprite = new Sprite(Texture.from(texture));
  //   sprite.anchor.set(0.5, 0.5);
  //   sprite.position.set(x, y);
  //   return sprite;
  // }
  //
  // private fieldClickHandler(id: number) {
  //   console.log('yes');
  //
  //   const crossAnimation: PIXI.AnimatedSprite = this.createAnimation(this.resources.sequence.textures, 'cross-draw');
  //   crossAnimation.loop = false;
  //   crossAnimation.animationSpeed = 0.7;
  //   crossAnimation.anchor.set(0.5, 0.5);
  //   this.container.addChild(crossAnimation);
  //
  //   this.needToDestroyChild?.forEach((child) => child.destroy());
  //   this.needToDestroyChild = [];
  //   let counterIterable = 1;
  //   for (let i = 0; i < this.matrix.length; i++) {
  //     for (let j = 0; j < this.matrix[i].length; j++) {
  //       if (counterIterable === id) {
  //         this.matrix[i].splice(j, 1, 1);
  //         crossAnimation.position.set(PlayfieldPositionDescription[i].x, PlayfieldPositionDescription[j].y);
  //         crossAnimation.play();
  //         crossAnimation.onComplete = () => {
  //           this.checkWin();
  //         };
  //       } else {
  //         counterIterable++;
  //       }
  //     }
  //   }
  // }
  //
  // private checkWin() {
  //   if (this.checkWinLines(1) === true) {
  //     // player win
  //     this.drawCrossesAndZeros();
  //     this.endGame(1);
  //   } else {
  //     this.computerMove();
  //     this.drawCrossesAndZeros();
  //     if (this.checkWinLines(2) === true) {
  //       this.endGame(2);
  //     }
  //   }
  // }
  //
  // private checkWinLines(checking: 1 | 2) {
  //   //1 = player, 2 = pc
  //   // check horizontal lines
  //   for (let i = 0; i < 3; i++) {
  //     if (this.matrix[i][0] === checking && this.matrix[i][1] === checking && this.matrix[i][2] === checking) {
  //       return true;
  //     }
  //   }
  //
  //   // check vertical lines
  //   for (let i = 0; i < 3; i++) {
  //     if (this.matrix[0][i] === checking && this.matrix[1][i] === checking && this.matrix[2][i] === checking) {
  //       return true;
  //     }
  //   }
  //
  //   // check diagonal
  //   for (let i = 0; i < 3; i++) {
  //     if (this.matrix[0][0] === checking && this.matrix[1][1] === checking && this.matrix[2][2] === checking) {
  //       return true;
  //     } else if (this.matrix[0][2] === checking && this.matrix[1][1] === checking && this.matrix[2][0] === checking) {
  //       return true;
  //     }
  //   }
  //
  //   // no win
  //   return false;
  // }
  //
  // private endGame(whoIsWin: 0 | 1 | 2) {
  //   if (whoIsWin === 0) {
  //     console.log('DRAW');
  //   }
  //   if (whoIsWin === 1) {
  //     console.log('PLAYER IS WIN!');
  //   }
  //   if (whoIsWin === 2) {
  //     console.log('PC IS WIN!');
  //   }
  // }
  //
}
