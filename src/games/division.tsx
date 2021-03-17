import React from "react";
import { createNumberEquationRenderProblem, getRandomInt } from "./util";

export interface DivisionProblem {
  dividend: number;
  divisor: number;
  type: "division";
}
export interface DivisionGameSettings {
  maxNumber: number;
}
export const divisionGameCreator = {
  name: "Division" as const,
  createGame: ({ maxNumber }: DivisionGameSettings) => {
    const getNewProblem = () => {
      const quotient = getRandomInt(maxNumber) + 1;
      const divisor = getRandomInt(maxNumber) + 1;
      const problem: DivisionProblem = {
        divisor,
        dividend: quotient * divisor,
        type: "division",
      };
      return problem;
    };
    const getActualAnswer = (problem: DivisionProblem) =>
      problem.dividend / problem.divisor;
    const isAnswerCorrect = (problem: DivisionProblem, answer: number) =>
      getActualAnswer(problem) === answer;
    return {
      renderProblem: createNumberEquationRenderProblem(
        "÷",
        "dividend",
        "divisor",
        isAnswerCorrect
      ),
      isAnswerCorrect,
      renderPossibleAnswer: (answer: number) => (
        <div className="possibleAnswerContainer">{answer}</div>
      ),
      getNewProblem,
      getActualAnswer,
      getPossibleAnswers: (currentProblem: DivisionProblem) => {
        const answers = new Set<number>();
        answers.add(getActualAnswer(currentProblem));
        while (answers.size < 4) {
          answers.add(getActualAnswer(getNewProblem()));
        }
        return Array.from(answers).sort((a, b) => a - b) as [
          number,
          number,
          number,
          number
        ];
      },
    };
  },
};
