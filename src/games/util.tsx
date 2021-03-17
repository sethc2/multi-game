export function getRandomInt(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

export function getNumberAnswers(
  currentAnswer: number,
  getRandomAnswer: () => number
) {
  const answers = new Set<number>();
  answers.add(currentAnswer);
  while (answers.size < 4) {
    answers.add(getRandomAnswer());
  }
  return Array.from(answers).sort((a, b) => a - b) as [
    number,
    number,
    number,
    number
  ];
}

export function createNumberEquationRenderProblem<
  TProblem extends {},
  TFirstKey extends keyof TProblem,
  TSecondKey extends keyof TProblem
>(
  sign: string,
  firstKey: TFirstKey,
  secondKey: TSecondKey,
  isAnswerCorrect: (problem: TProblem, givenAnswer: number) => boolean
) {
  return (problem: TProblem, givenAnswer: number | null) => (
    <div className="numberEquationProblem">
      <span>{problem[firstKey]}</span>
      <span>{sign}</span>
      <span>{problem[secondKey]}</span>
      <span>=</span>
      <span
        className={`problemAnswerQuestion ${
          givenAnswer
            ? isAnswerCorrect(problem, givenAnswer)
              ? "problemAnswerCorrect"
              : "problemAnswerWrong"
            : ""
        }`}
      >
        {givenAnswer === null ? "?" : givenAnswer}
      </span>
    </div>
  );
}
