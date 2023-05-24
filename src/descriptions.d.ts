export type SpriteLoadDescription = {
  name: string;
  url: string;
};

export interface AssetsMapTypeDescriptions {
  sprites?: Array<SpriteLoadDescription>;
}
