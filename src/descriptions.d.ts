export type SpriteLoadDescription = {
  name: string;
  url: string;
};

export interface AssetsMapTypeDescriptions {
  sprites?: Array<SpriteLoadDescription>;
}

export type MatrixType = Array<Array<number>>;

export type PositionType = {
  id: number;
  x: number;
  y: number;
};
