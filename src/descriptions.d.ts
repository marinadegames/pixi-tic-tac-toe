import { ImageResource } from 'pixi.js';

export type SpriteLoadDescription = {
  name: string;
  url: string;
};

export interface AssetsMapTypeDescriptions {
  sprites?: Array<SpriteLoadDescription>;
  sequences?: Array<SequencesLoadDescription>;
}

export type SequencesLoadDescription = {
  name: string;
  url: string;
};

export type MatrixType = Array<Array<number>>;

export type PositionType = {
  id: number;
  x: number;
  y: number;
};
