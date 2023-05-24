import { Application } from 'pixi.js';
import './global.scss';
import { assetsMap } from './assetsMap';
import type { SpriteLoadDescription } from './descriptions';
import { Playfield } from './objects/Playfield';

// load assets

class Game {
  private game: Application;

  public playfield: Playfield;

  constructor() {
    this.game = new Application({
      width: screen.width,
      height: screen.height,
      backgroundColor: 0x00c1ac,
    });
    document.body.appendChild(this.game.view);
    this.loadAssets();
  }

  private loadAssets() {
    assetsMap.sprites?.forEach((sprite: SpriteLoadDescription) => {
      this.game.loader.add(sprite.name, sprite.url);
    });
    this.game.loader.load(() => this.startGame());
    this.game.renderer.resize(window.innerWidth, window.innerHeight);
  }

  private startGame() {
    this.game.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);
    console.log('GAME IS STARTED!');

    this.playfield = new Playfield(this.game.stage);
  }
}

// init
new Game();
