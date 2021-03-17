import React, { useCallback, useMemo, useState } from "react";

import { BasicMultipleChoiceGameRunner } from "../GameRunner";
import { GameType, GameCreators, Game } from "../games";
import { HowLongForAmountGame, TimedGameRunner } from "../TimeGame";
import "./styles.scss";

export interface GameSettingsProps {}

const styles = [
  "How many in a minute?",
  "How long to get 30",
  "Endless",
] as const;

type Style = typeof styles[0 | 1 | 2];

export interface Settings {
  Name: string;
  Game: GameType;
  Level: number;
  Style: Style;
}

const stepsAndNames = ["Name", "Game", "Level", "Style", "GameRun"] as const;

type Step = typeof stepsAndNames[0 | 1 | 2 | 3 | 4];

export const GameSettings: React.FC<{}> = () => {
  const [step, setStep] = useState<Step>("Name");
  const [settings, setSettings] = useState<Partial<Settings>>({});
  const onNext = () => {
    const stepIndex = stepsAndNames.findIndex((x) => x === step);
    setStep(stepsAndNames[stepIndex + 1]);
  };
  const onBack = () => {
    const stepIndex = stepsAndNames.findIndex((x) => x === step);
    setStep(stepsAndNames[stepIndex - 1]);
  };

  const hideBack = step === "Name";
  const disableNext = step === "GameRun" || settings[step] === undefined;

  const [lastGameResults, setLastGameResults] = useState<{
    numberCorrect: number;
    numberWrong: number;
    seconds?: number;
  } | null>(null);

  return (
    <div className="fullFlex">
      {step === "GameRun" && (
        <GameRun
          settings={settings as Settings}
          onDone={(params) => {
            setLastGameResults(params);
            setStep("Style");
          }}
        ></GameRun>
      )}
      {step !== "GameRun" && (
        <>
          <div className="headerFlex">
            <h1>Select {step}</h1>
          </div>
          <div className="bodyFlex">
            {step === "Name" && (
              <NameSelect
                selectedName={settings.Name || null}
                setSelectedName={(selectedName) => {
                  setSettings({ ...settings, Name: selectedName });
                  setStep("Game");
                }}
              />
            )}
            {step === "Game" && (
              <>
                <span>Name: {settings.Name}</span>
                <GameSelect
                  selectedGame={settings.Game || null}
                  setSelectedGame={(selectedGame) => {
                    setSettings({ ...settings, Game: selectedGame });
                    setStep("Level");
                  }}
                />
              </>
            )}
            {step === "Level" && (
              <>
                <span>Name: {settings.Name}</span>
                <span>Game: {settings.Game}</span>
                <LevelSelect
                  selectedLevel={settings.Level || null}
                  setSelectedLevel={(selectedLevel) => {
                    setSettings({ ...settings, Level: selectedLevel });
                    setStep("Style");
                  }}
                />
              </>
            )}
            {step === "Style" && (
              <>
                <span>Name: {settings.Name}</span>
                <span>Game: {settings.Game}</span>
                <span>Level: {settings.Level}</span>
                <GameStyleSelect
                  selectedStyle={settings.Style || null}
                  setSelectedStyle={(style) => {
                    setSettings({ ...settings, Style: style });
                  }}
                />
                {settings.Style && (
                  <button
                    onClick={() => setStep("GameRun")}
                    className="bigStart"
                  >
                    Start
                  </button>
                )}
              </>
            )}
          </div>
          {
            <div className="footerFlex">
              {lastGameResults && (
                <>
                  <div>
                    You got {lastGameResults.numberCorrect}
                    {settings.Style === "How long to get 30"
                      ? ` in ${lastGameResults.seconds || 0} seconds`
                      : ""}
                    !
                  </div>
                  <div>You missed {lastGameResults.numberWrong}</div>
                </>
              )}
            </div>
          }
          <div className="controls">
            <button
              disabled={hideBack}
              className={hideBack ? "hiddenButton" : ""}
              onClick={onBack}
            >
              Back
            </button>
            <button
              disabled={disableNext}
              onClick={onNext}
              className={step === "Style" ? "hiddenButton" : ""}
            >
              {step}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export const GameRun: React.FC<{
  settings: Settings;
  onDone: (params: {
    numberCorrect: number;
    numberWrong: number;
    seconds?: number;
  }) => void;
}> = ({ settings, onDone }) => {
  const game = useMemo(() => {
    const gameCreator = GameCreators.find((x) => x.name === settings.Game);
    if (gameCreator) {
      return gameCreator.createGame({ maxNumber: settings.Level as number });
    }
  }, [settings]);

  if (settings.Style === "How many in a minute?") {
    return (
      <TimedGameRunner
        game={game as Game}
        goal={60}
        gameTimeSeconds={60}
        onDone={onDone}
      ></TimedGameRunner>
    );
  }
  if (settings.Style === "Endless") {
    return (
      <BasicMultipleChoiceGameRunner
        game={game as Game}
        delayAfterRightAnswer={800}
        onDone={onDone}
      ></BasicMultipleChoiceGameRunner>
    );
  }
  if (settings.Style === "How long to get 30") {
    return (
      <HowLongForAmountGame
        game={game as Game}
        goal={30}
        onDone={onDone}
      ></HowLongForAmountGame>
    );
  }
  return <div></div>;
};

export const GameStyleSelect: React.FC<{
  selectedStyle: Style | null;
  setSelectedStyle: (style: Style) => void;
}> = ({ selectedStyle, setSelectedStyle }) => {
  return (
    <>
      {styles.map((style) => (
        <button
          key={style}
          className={`optionSelect ${
            style === selectedStyle ? "selectedBorder" : ""
          }`}
          onClick={() => setSelectedStyle(style)}
        >
          {style}
        </button>
      ))}
    </>
  );
};

export const LevelSelect: React.FC<{
  selectedLevel: number | null;
  setSelectedLevel: (level: number) => void;
}> = ({ selectedLevel, setSelectedLevel }) => {
  const levels = useMemo(() => {
    const levelArray: number[] = [];
    for (let index = 4; index <= 20; index++) {
      levelArray.push(index);
    }
    return levelArray;
  }, []);
  return (
    <div className="levelSelect">
      {levels.map((level) => (
        <button
          key={level}
          className={`optionSelect ${
            level === selectedLevel ? "selectedBorder" : ""
          }`}
          onClick={() => setSelectedLevel(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export const GameSelect: React.FC<{
  selectedGame: GameType | null;
  setSelectedGame: (game: GameType) => void;
}> = ({ setSelectedGame, selectedGame }) => {
  return (
    <>
      {GameCreators.map((x) => (
        <button
          key={x.name}
          className={`optionSelect ${
            x.name === selectedGame ? "selectedBorder" : ""
          }`}
          onClick={() => setSelectedGame(x.name)}
        >
          {x.name}
        </button>
      ))}
    </>
  );
};

export const NameSelect: React.FC<{
  selectedName: string | null;
  setSelectedName: (name: string) => void;
}> = ({ setSelectedName, selectedName }) => {
  const [availableNames, setAvailableNames] = useState<string[]>(() => {
    const namesSettingsJson = window.localStorage.getItem("namesSettings");
    if (namesSettingsJson) {
      const namesSettings = JSON.parse(namesSettingsJson);
      if (namesSettings.version === 1) {
        return namesSettings.names;
      }
    }
    return [];
  });

  const addName = useCallback(
    (newName: string) => {
      if (
        !availableNames.find(
          (x) => x.toLocaleLowerCase() === newName.toLocaleLowerCase()
        )
      ) {
        const newAvailableNames = [...availableNames, newName].sort((a, b) =>
          a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase())
        );
        setAvailableNames(newAvailableNames);
        window.localStorage.setItem(
          "namesSettings",
          JSON.stringify({ version: 1, names: newAvailableNames }, null, " ")
        );
        setNewNameInput(null);
        setSelectedName(newName);
      }
    },
    [availableNames]
  );

  const [newNameInput, setNewNameInput] = useState<string | null>(null);
  return (
    <>
      {availableNames.map((name) => (
        <button
          key={name}
          onClick={() => setSelectedName(name)}
          className={`optionSelect ${
            name === selectedName ? "selectedBorder" : ""
          }`}
        >
          {name}
        </button>
      ))}
      {newNameInput !== null && (
        <span>
          <input
            value={newNameInput}
            placeholder="New name"
            onChange={(e) => setNewNameInput(e.target.value)}
          ></input>
          <button
            onClick={() => {
              addName(newNameInput);
            }}
          >
            Save
          </button>
        </span>
      )}
      {newNameInput === null && (
        <button onClick={() => setNewNameInput("")} className="addNewName">
          +Add new
        </button>
      )}
    </>
  );
};
