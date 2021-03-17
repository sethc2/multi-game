import React from "react";
import { createNumberEquationRenderProblem, getRandomInt } from "./util";

export interface AdditionProblem {
  firstAddend: number;
  secondAddend: number;
  type: "addition";
}
export interface AdditionGameSettings {
  maxNumber: number;
}

export const additionGameCreator = {
  name: "Addition" as const,
  createGame: ({ maxNumber }: AdditionGameSettings) => {
    const getNewProblem = () => {
      const firstAddend = getRandomInt(maxNumber) + 1;
      const secondAddend = getRandomInt(maxNumber) + 1;
      const problem: AdditionProblem = {
        firstAddend,
        secondAddend,
        type: "addition",
      };
      return problem;
    };
    const getActualAnswer = (problem: AdditionProblem) =>
      problem.firstAddend + problem.secondAddend;

    const isAnswerCorrect = (problem: AdditionProblem, answer: number) =>
      getActualAnswer(problem) === answer;
    return {
      renderProblem: createNumberEquationRenderProblem(
        "+",
        "firstAddend",
        "secondAddend",
        isAnswerCorrect
      ),
      isAnswerCorrect,
      renderPossibleAnswer: (answer: number) => (
        <div className="possibleAnswerContainer">{answer}</div>
      ),
      getNewProblem,
      getActualAnswer,
      getPossibleAnswers: (currentProblem: AdditionProblem) => {
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
