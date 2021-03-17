import { doesNotReject } from "node:assert";
import { useCallback, useMemo, useState } from "react";
import { Game } from "./games";

export type Problem = any;
export type Answer = any;
export interface UseGameRunnerParams {
  game: Game;
  delayAfterRightAnswer?: number;
}

export function useGameRunner({
  game,
  delayAfterRightAnswer,
}: UseGameRunnerParams) {
  const {
    getNewProblem,
    getPossibleAnswers,
    isAnswerCorrect,
    renderPossibleAnswer,
    renderProblem,
  } = game;

  const [numberCorrect, setNumberCorrect] = useState(0);
  const [numberWrong, setNumberWrong] = useState(0);

  const [currentProblem, setCurrentProblem] = useState<Problem>(
    game.getNewProblem()
  );
  const [guessedAnswer, setGuessedAnswer] = useState<Answer | null>(null);

  const renderedProblem = useMemo(() => {
    return renderProblem(currentProblem, guessedAnswer);
  }, [currentProblem, renderProblem, guessedAnswer]);

  const answers = useMemo(() => {
    return getPossibleAnswers(currentProblem);
  }, [currentProblem, getPossibleAnswers]);

  const handleChoseAnswer = useCallback(
    (answerIndex: number) => {
      const answer = answers[answerIndex];
      setGuessedAnswer(answer);
      if (isAnswerCorrect(currentProblem, answer)) {
        if (guessedAnswer === null) {
          setNumberCorrect(numberCorrect + 1);
        }
        if (delayAfterRightAnswer) {
          window.setTimeout(() => {
            setGuessedAnswer(null);
            setCurrentProblem(getNewProblem());
          }, delayAfterRightAnswer);
        } else {
          setGuessedAnswer(null);
        }
      } else {
        if (guessedAnswer === null) {
          setNumberWrong(numberWrong + 1);
        }
      }
    },
    [
      answers,
      isAnswerCorrect,
      getNewProblem,
      currentProblem,
      numberCorrect,
      numberWrong,
      delayAfterRightAnswer,
    ]
  );

  const possibleRenderedAnswers = useMemo(() => {
    return answers.map((x) => renderPossibleAnswer(x));
  }, [renderPossibleAnswer, answers]);

  const onReset = useCallback(() => {
    setNumberWrong(0);
    setNumberCorrect(0);
    setCurrentProblem(getNewProblem());
  }, [getNewProblem]);
  return {
    currentProblem: currentProblem,
    onChoseAnswer: handleChoseAnswer,
    renderedProblem: renderedProblem,
    numberCorrect: numberCorrect,
    numberWrong: numberWrong,
    possibleRenderedAnswers: possibleRenderedAnswers,
    onReset,
  };
}
export interface GameRunnerProps extends UseGameRunnerParams {
  onDone: (params: { numberCorrect: number; numberWrong: number }) => void;
}
export function BasicMultipleChoiceGameRunner({
  game,
  delayAfterRightAnswer = 500,
  onDone,
}: GameRunnerProps) {
  const {
    currentProblem,
    numberCorrect,
    numberWrong,
    onChoseAnswer,
    possibleRenderedAnswers,
    renderedProblem,
  } = useGameRunner({ game, delayAfterRightAnswer });
  return (
    <GameDisplay
      currentProblem={currentProblem}
      onChoseAnswer={onChoseAnswer}
      renderedProblem={renderedProblem}
      possibleRenderedAnswers={possibleRenderedAnswers}
      footer={
        <>
          <div>Nubmer correct: {numberCorrect}</div>
          <div>Number wrong: {numberWrong}</div>
          <button onClick={() => onDone({ numberCorrect, numberWrong })}>
            Done
          </button>
        </>
      }
    ></GameDisplay>
  );
}

export interface GameDisplayProps {
  possibleRenderedAnswers: JSX.Element[];
  onChoseAnswer: (answerIndex: number) => void;
  renderedProblem: JSX.Element;
  currentProblem: Problem;
  footer: JSX.Element;
  timer?: JSX.Element;
}
export function GameDisplay({
  possibleRenderedAnswers,
  onChoseAnswer,
  renderedProblem,
  footer,
  timer,
}: GameDisplayProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp") {
      onChoseAnswer(0);
    }
    if (e.key === "ArrowLeft") {
      onChoseAnswer(1);
    }
    if (e.key === "ArrowRight") {
      onChoseAnswer(2);
    }
    if (e.key === "ArrowDown") {
      onChoseAnswer(3);
    }
  };

  return (
    <div
      className="gameRunnerContainer"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="gameRunnerProblem">{renderedProblem}</div>
      <div className="gameRunnerAnswersSection">
        <div className="gameRunnerAnswers">
          {possibleRenderedAnswers.map((x, index) => (
            <button onClick={() => onChoseAnswer(index)} key={index}>
              {x}
            </button>
          ))}
        </div>
        {timer || null}
      </div>
      <div className="gameRunnerResults">{footer}</div>
    </div>
  );
}
