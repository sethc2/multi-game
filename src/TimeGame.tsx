import { useCallback, useEffect, useRef, useState } from "react";
import { GameDisplay, useGameRunner } from "./GameRunner";
import { Game } from "./games";

export interface TimedGameRunnerProps {
  game: Game;
  goal: number;
  gameTimeSeconds?: number;
  onDone: (params: { numberCorrect: number; numberWrong: number }) => void;
}

export const TimedGameRunner: React.FC<TimedGameRunnerProps> = ({
  game,
  goal,
  gameTimeSeconds = 60,
  onDone,
}) => {
  const countdownTime = 3;
  const [timeRemaining, setTimeRemaining] = useState<number>(
    gameTimeSeconds + countdownTime
  );

  const timeRemainingRef = useRef(timeRemaining);
  timeRemainingRef.current = timeRemaining;

  const intervalRef = useRef<number>(0);

  const {
    onReset,
    numberWrong,
    numberCorrect,
    currentProblem,
    ...gameDisplayProps
  } = useGameRunner({
    game,
    delayAfterRightAnswer: 10,
  });

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      if (timeRemainingRef.current <= 1) {
        clearInterval(intervalRef.current);
      }
      setTimeRemaining(timeRemainingRef.current - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!timeRemaining) {
      onDone({ numberCorrect, numberWrong });
    }
  }, [timeRemaining]);

  const countDownTimeLeft = timeRemaining - gameTimeSeconds;

  const [timerLeftPercent, setTimerLeftPercent] = useState(100);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerLeftRef = useRef(timerLeftPercent);
  timerLeftRef.current = timerLeftPercent;
  useEffect(() => {
    if (countDownTimeLeft <= 0) {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = setInterval(() => {
          const ratePerSecond = goal / timeRemaining;

          const newPercent = timerLeftRef.current - ratePerSecond;
          if (newPercent <= 0) {
            setTimerLeftPercent(0);
          } else {
            setTimerLeftPercent(newPercent);
          }
        }, 10);
      }
    }
  }, [countDownTimeLeft]);

  useEffect(() => {
    setTimerLeftPercent(100);
  }, [currentProblem]);

  return (
    <div className="timedGameRunner">
      {countDownTimeLeft <= 0 && (
        <GameDisplay
          {...gameDisplayProps}
          currentProblem={currentProblem}
          footer={
            <>
              <div>Time remaining: {timeRemaining}</div>
              <div>Nubmer correct: {numberCorrect}</div>
              <div>Number wrong: {numberWrong}</div>
            </>
          }
          timer={
            <div className="gameRunnerTimer ">
              <div
                className="timerGone"
                style={{ height: `${100 - timerLeftPercent}%` }}
              ></div>
              <div
                className="timerRemaining"
                style={{ height: `${timerLeftPercent}%` }}
              ></div>
            </div>
          }
        ></GameDisplay>
      )}
      {countDownTimeLeft > 0 && (
        <div className="gameCountdown">{timeRemaining - gameTimeSeconds}</div>
      )}
    </div>
  );
};

export interface HowLongForAmountGameProps {
  game: Game;
  goal: number;
  onDone: (params: {
    numberCorrect: number;
    numberWrong: number;
    seconds: number;
  }) => void;
}

export const HowLongForAmountGame: React.FC<HowLongForAmountGameProps> = ({
  game,
  goal,
  onDone,
}) => {
  const [timeCount, setTimecount] = useState<number>(0);
  const countdownTime = 3;
  const timeCountRef = useRef(timeCount);
  timeCountRef.current = timeCount;

  const intervalRef = useRef<number>(0);

  const {
    onReset,
    numberWrong,
    numberCorrect,
    currentProblem,
    ...gameDisplayProps
  } = useGameRunner({
    game,
    delayAfterRightAnswer: 10,
  });

  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      if (numberCorrect >= goal || timeCount > 10000) {
        clearInterval(intervalRef.current);
      }
      setTimecount(timeCountRef.current + 1);
    }, 1000);
  }, []);

  useEffect(() => {
    if (numberCorrect >= goal) {
      onDone({
        numberCorrect,
        numberWrong,
        seconds: timeCount - countdownTime,
      });
    }
  }, [numberCorrect, numberWrong, timeCount]);

  return (
    <div className="timedGameRunner">
      {timeCount >= countdownTime && (
        <GameDisplay
          {...gameDisplayProps}
          currentProblem={currentProblem}
          footer={
            <>
              <div>Time count: {timeCount}</div>
              <div>Nubmer correct: {numberCorrect}</div>
              <div>Number wrong: {numberWrong}</div>
            </>
          }
        ></GameDisplay>
      )}
      {timeCount < countdownTime && (
        <div className="gameCountdown">{countdownTime - timeCount}</div>
      )}
    </div>
  );
};
