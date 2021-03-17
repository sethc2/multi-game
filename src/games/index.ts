import { additionGameCreator } from "./addition";
import { multiplicationGameCreator } from "./multiplication";
import { divisionGameCreator } from "./division";
import { numberBondGameCreator } from "./numberBonds";
export type { AdditionGameSettings } from "./addition";
export type { MultiplicationGameSettings } from "./multiplication";
export type { DivisionGameSettings } from "./division";

export const GameCreators = [
  additionGameCreator,
  multiplicationGameCreator,
  divisionGameCreator,
  numberBondGameCreator,
];

export type GameCreator = typeof GameCreators[0 | 1];
export type GameType = GameCreator["name"];
export type Game = ReturnType<GameCreator["createGame"]>;
