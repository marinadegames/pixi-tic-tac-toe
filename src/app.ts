import { Application } from 'pixi.js';
import './global.scss';
import { assetsMap } from './assetsMap';
import type { SpriteLoadDescription } from './descriptions';
// import { assetsMap } from './assetsMap';
// import type { SpriteLoadDescription } from './descriptions';

// load assets

export default class Game {
  private game: Application;

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
    this.game.loader.load(this.startGame);
  }

  private startGame() {
    console.log('GAME IS STARTED!!!');
  }
}

// init
new Game();
