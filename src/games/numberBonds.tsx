import React from "react";
import { additionGameCreator, AdditionProblem } from "./addition";
import { createNumberEquationRenderProblem, getRandomInt } from "./util";

export interface NumberBondProblem {
  additionProblem: AdditionProblem;
  blank: "firstAddend" | "secondAddend" | "sum";
  type: "numberBond";
}
export interface NumberBondSettings {
  maxNumber: number;
}

const blanks = ["firstAddend", "secondAddend", "sum"] as const;
export const numberBondGameCreator = {
  name: "NumberBond" as const,
  createGame: ({ maxNumber }: NumberBondSettings) => {
    const additionGame = additionGameCreator.createGame({ maxNumber });
    const getNewProblem = () => {
      const additionProblem = additionGame.getNewProblem();
      const blank = blanks[getRandomInt(3)];
      return {
        additionProblem,
        blank,
      } as NumberBondProblem;
    };
    const getActualAnswer = (problem: NumberBondProblem) => {
      if (problem.blank === "firstAddend") {
        return problem.additionProblem.firstAddend;
      }
      if (problem.blank === "secondAddend") {
        return problem.additionProblem.secondAddend;
      }
      return additionGame.getActualAnswer(problem.additionProblem);
    };

    const isAnswerCorrect = (problem: NumberBondProblem, answer: number) =>
      getActualAnswer(problem) === answer;
    return {
      renderProblem: (
        problem: NumberBondProblem,
        givenAnswer: number | null
      ) => (
        <div className="numberBondProblem">
          <div className="numberBondTop">
            <span
              className={`numberBondQuestion ${
                givenAnswer && problem.blank === "sum"
                  ? isAnswerCorrect(problem, givenAnswer)
                    ? "problemAnswerCorrect"
                    : "problemAnswerWrong"
                  : ""
              }`}
            >
              {problem.blank === "sum"
                ? givenAnswer
                  ? givenAnswer
                  : "?"
                : additionGame.getActualAnswer(problem.additionProblem)}
            </span>
          </div>
          <div className="numberBondBottom">
            <span
              className={`numberBondQuestion ${
                givenAnswer && problem.blank === "firstAddend"
                  ? isAnswerCorrect(problem, givenAnswer)
                    ? "problemAnswerCorrect"
                    : "problemAnswerWrong"
                  : ""
              }`}
            >
              {problem.blank === "firstAddend"
                ? givenAnswer
                  ? givenAnswer
                  : "?"
                : problem.additionProblem.firstAddend}
            </span>
            <span
              className={`numberBondQuestion ${
                givenAnswer && problem.blank === "secondAddend"
                  ? isAnswerCorrect(problem, givenAnswer)
                    ? "problemAnswerCorrect"
                    : "problemAnswerWrong"
                  : ""
              }`}
            >
              {problem.blank === "secondAddend"
                ? givenAnswer
                  ? givenAnswer
                  : "?"
                : problem.additionProblem.secondAddend}
            </span>
          </div>
        </div>
      ),
      isAnswerCorrect,
      renderPossibleAnswer: (answer: number) => (
        <div className="possibleAnswerContainer">{answer}</div>
      ),
      getNewProblem,
      getActualAnswer,
      getPossibleAnswers: (currentProblem: NumberBondProblem) => {
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
