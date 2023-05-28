import { Container, Sprite, Texture } from 'pixi.js';
import { PlayfieldPositionDescription } from './PlayfieldPositionDescription';
import * as PIXI from 'pixi.js';
import { GameEventEmitter } from './EventEmmiter';

export class Field extends Container {
  public id: number;

  constructor(game: any, resources: any, texture: number, id: number) {
    super();
    this.id = id;
    this.changeTexture(0);
  }

  public changeTexture(texture: 0 | 1 | 2) {
    if (texture === 0) {
      this.addChild(this.textureCreator('win_highlight', true, false));
    } else if (texture === 1) {
      this.children[0].destroy();
      this.addChild(this.textureCreator('cross-draw_19', false, true));
    } else if (texture === 2) {
      this.children[0].destroy();
      this.addChild(this.textureCreator('circle-draw_19', false, true));
    }
  }

  private textureCreator(textureName: string, interactive: boolean, visible: boolean) {
    const resultTexture = new Sprite(Texture.from(textureName));
    resultTexture.anchor.set(0.5, 0.5);
    resultTexture.alpha = visible ? 1 : 0;
    resultTexture.interactive = interactive;
    resultTexture.buttonMode = interactive;
    resultTexture.position.set(PlayfieldPositionDescription[this.id].x, PlayfieldPositionDescription[this.id].y);
    resultTexture.once('pointerdown', () => {
      GameEventEmitter.emit('FIELD_CLICK_HANDLER', this.id);
    });
    return resultTexture;
  }

  public activateInteractive() {
    this.children[0].interactive = true;
    this.children[0].buttonMode = true;
  }

  public disableInteractive() {
    this.children[0].interactive = false;
    this.children[0].buttonMode = false;
  }
}
