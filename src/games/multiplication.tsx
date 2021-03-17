import React from "react";
import { createNumberEquationRenderProblem, getRandomInt } from "./util";

export interface MultiplicationProblem {
  multiplicand: number;
  multiplier: number;
  type: "multiplication";
}
export interface MultiplicationGameSettings {
  maxNumber: number;
}
export const multiplicationGameCreator = {
  name: "Multiplication" as const,
  createGame: ({ maxNumber }: MultiplicationGameSettings) => {
    const getNewProblem = () => {
      const multiplicand = getRandomInt(maxNumber) + 1;
      const multiplier = getRandomInt(maxNumber) + 1;
      const problem: MultiplicationProblem = {
        multiplicand,
        multiplier,
        type: "multiplication",
      };
      return problem;
    };
    const getActualAnswer = (problem: MultiplicationProblem) =>
      problem.multiplicand * problem.multiplier;
    const isAnswerCorrect = (problem: MultiplicationProblem, answer: number) =>
      getActualAnswer(problem) === answer;
    return {
      renderProblem: createNumberEquationRenderProblem(
        "X",
        "multiplicand",
        "multiplier",
        isAnswerCorrect
      ),
      isAnswerCorrect,
      renderPossibleAnswer: (answer: number) => (
        <div className="possibleAnswerContainer">{answer}</div>
      ),
      getNewProblem,
      getActualAnswer,
      getPossibleAnswers: (currentProblem: MultiplicationProblem) => {
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
