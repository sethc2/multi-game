import { useMemo } from "react";
import { GameCreators, GameType } from "./games";

export type Teset = GameType;
// export function useGame<TGameType extends GameType>(
//   gameType: TGameType,
//   settings: GameSettingsByType<TGameType>
// ) {
//   const game = useMemo(() => {
//     return GameCreators.find(x => x.[gameType](settings);
//   }, [gameType]);

//   return { game };
// }
