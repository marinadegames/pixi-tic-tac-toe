import { Application } from 'pixi.js';

const app = new Application<HTMLCanvasElement>({
  width: 1400,
  height: 800,
  backgroundColor: 'blue',
});

document.body.appendChild(app.view);

app.view.width = 1400;
app.view.height = 800;
