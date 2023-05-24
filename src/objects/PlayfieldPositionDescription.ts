import type { PositionType } from '../descriptions';

export const PlayfieldPositionDescription: Array<PositionType> = [
  {
    id: 1,
    x: -220,
    y: -220,
  },
  {
    id: 2,
    x: 0,
    y: -220,
  },
  {
    id: 3,
    x: 220,
    y: -220,
  },
  {
    id: 4,
    x: -220,
    y: 0,
  },
  {
    id: 5,
    x: 0,
    y: 0,
  },
  {
    id: 6,
    x: 220,
    y: 0,
  },
  {
    id: 7,
    x: -220,
    y: 220,
  },
  {
    id: 8,
    x: 0,
    y: 220,
  },
  {
    id: 9,
    x: 220,
    y: 220,
  },
];

export const winLines: Array<Array<number>> = [
  [1, 2, 3],
  [1, 4, 7],
  [1, 5, 9],
  [2, 5, 8],
  [3, 6, 9],
  [3, 5, 7],
  [4, 5, 6],
  [7, 8, 9],
];
