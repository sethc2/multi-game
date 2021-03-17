import React, { useCallback, useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { GameCreators } from "./games";
// import { useGame } from "./useGame";
import { BasicMultipleChoiceGameRunner, GameRunnerProps } from "./GameRunner";
import { GameSettings } from "./GameSettings";

function App() {
  // const [gameType, setGameType] = useState<GameType>("MultiplicationGame");
  const [selectedLevel, setSelectedLevel] = useState(9);
  const [started, setStarted] = useState(false);
  // const { game } = useGame(gameType, { maxNumber: 9 });
  const [numberCorrect, setNumberCorrect] = useState<number | null>(null);
  const [numberWrong, setNumberWrong] = useState<number | null>(null);
  const handleDone = useCallback<GameRunnerProps["onDone"]>((params) => {
    setStarted(false);
    setNumberCorrect(params.numberCorrect);

    setNumberWrong(params.numberWrong);
  }, []);

  return (
    <div className="App">
      {started ? (
        <BasicMultipleChoiceGameRunner
          game={GameCreators[0].createGame({ maxNumber: 9 })}
          delayAfterRightAnswer={10}
          onDone={handleDone}
        ></BasicMultipleChoiceGameRunner>
      ) : (
        <GameSettings />
        // <div className="fullFlex">
        //   <GameTypeSelector gameType={gameType} setGameType={setGameType} />
        //   <LevelSelect
        //     selectedLevel={selectedLevel}
        //     setSelectedLevel={setSelectedLevel}
        //   />
        //   <div className="gameStartContainer">
        //     <button onClick={() => setStarted(true)}>Start</button>
        //     {numberCorrect && <div>You got {numberCorrect}!</div>}
        //     {numberWrong && <div>You missed {numberWrong}</div>}
        //   </div>
        // </div>
      )}
    </div>
  );
}

// const LevelSelect: React.FC<{
//   selectedLevel: number;
//   setSelectedLevel: (level: number) => void;
// }> = ({ selectedLevel, setSelectedLevel }) => {
//   const levels = useMemo(() => {
//     const levelArray: number[] = [];
//     for (let index = 4; index <= 20; index++) {
//       levelArray.push(index);
//     }
//     return levelArray;
//   }, []);
//   return (
//     <div className="levelSelector">
//       {levels.map((level) => (
//         <button
//           onClick={() => setSelectedLevel(level)}
//           className={`level ${level === selectedLevel ? "selectedLevel" : ""}`}
//         >
//           {level}
//         </button>
//       ))}
//     </div>
//   );
// };

// const GameTypeSelector: React.FC<{
//   gameType: GameType;
//   setGameType: (gameType: GameType) => void;
// }> = ({ gameType, setGameType }) => {
//   return (
//     <div className="gameTypeSelector">
//       <button
//         className={
//           gameType === "MultiplicationGame"
//             ? "gameTypeSelected"
//             : "gameTypeUnselected"
//         }
//         onClick={() => setGameType("MultiplicationGame")}
//       >
//         Multiplication game
//       </button>
//       <button
//         className={
//           gameType === "AdditionGame"
//             ? "gameTypeSelected"
//             : "gameTypeUnselected"
//         }
//         onClick={() => setGameType("AdditionGame")}
//       >
//         Addition game
//       </button>
//     </div>
//   );
// };

export default App;
