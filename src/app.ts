import './global.scss';
import { assetsMap } from './assetsMap';
import type { SpriteLoadDescription } from './descriptions';
import { Playfield } from './objects/Playfield';
import * as PIXI from 'pixi.js';

// load assets

export class Game {
  private game: PIXI.Application;

  public playfield: Playfield;

  constructor() {
    this.game = new PIXI.Application({
      width: screen.width,
      height: screen.height,
      backgroundColor: 0x00c1ac,
      antialias: true,
    });
    document.body.appendChild(this.game.view);
    this.loadAssets();
  }

  private loadAssets() {
    assetsMap.sprites?.forEach((sprite: SpriteLoadDescription) => {
      this.game.loader.add(sprite.name, sprite.url);
    });
    assetsMap.sequences?.forEach((seq: SpriteLoadDescription) => {
      this.game.loader.add(seq.name, seq.url);
    });
    this.game.loader.load((loader, res) => this.startGame(loader, res));
    this.game.renderer.resize(window.innerWidth, window.innerHeight);
  }

  private startGame(loader: any, res: any) {
    this.game.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);
    this.playfield = new Playfield(this.game, res);
    this.game.stage.addChild(this.playfield);
  }
}

// init
new Game();
