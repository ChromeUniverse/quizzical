import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import QnA from "./components/QnA";
import shuffle from "./shuffle";

function Quiz() {
  const [gameState, setGameState] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [reveal, setReveal] = useState(false);

  async function generateQuiz() {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=5&type=multiple"
    );
    const data = await res.json();
    const questionsArray = data.results;

    const newQuestions = questionsArray.map((qData) => {
      const answers = [
        { id: nanoid(), correct: true, text: qData.correct_answer },
        { id: nanoid(), correct: false, text: qData.incorrect_answers[0] },
        { id: nanoid(), correct: false, text: qData.incorrect_answers[1] },
        { id: nanoid(), correct: false, text: qData.incorrect_answers[2] },
      ];

      return {
        id: nanoid(),
        question: qData.question,
        answers: shuffle(answers),
        selected: false,
      };
    });

    setQuestions(newQuestions);
  }

  // toggle answer selection
  function selectAnswer(questionId, answerButtonId) {

    if (gameState !== 1) return;

    setQuestions((oldQuestions) => {
      // find the target question
      const index = oldQuestions.findIndex((q) => q.id === questionId);
      const targetQuestion = oldQuestions[index];

      // mutate questions in place
      const newQuestions = [
        ...oldQuestions.slice(0, index),
        {
          ...targetQuestion,
          // toggle selection logic:
          selected:
            targetQuestion.selected === answerButtonId ? false : answerButtonId,
        },
        ...oldQuestions.slice(index + 1),
      ];

      return newQuestions;
    });
  }

  function checkCorrectAnswers() {
    let correctCount = 0;
    questions.forEach((q) => {
      if (!q.selected) return;
      const selectedAnswer = q.answers.find((a) => a.id === q.selected);
      if (selectedAnswer.correct) correctCount += 1;
    });
    setCorrectCount(correctCount);
    console.log(correctCount);
  }

  async function handleClick() {

    if (gameState === 0) {
      await generateQuiz();
      setGameState(1);
    } else if (gameState === 1) {
      setReveal(true);
      checkCorrectAnswers();
      setGameState(2);
    } else if (gameState === 2) {
      await generateQuiz();
      setGameState(1);
      setReveal(false);
    }
  }

  const questionElements = questions.map((q) => (
    <QnA
      key={q.id}
      id={q.id}
      prompt={q.question}
      answers={q.answers}
      selected={q.selected}
      reveal={reveal}
      selectAnswer={selectAnswer}
    />
  ));

  let btnText = "";
  if (gameState === 0) btnText = "Start quiz";
  else if (gameState === 1) btnText = "Check answers";
  else if (gameState === 2) btnText = "Play again";

  let footerText = "";
  if (gameState === 2) footerText = `You scored ${correctCount}/5 correct answers`;

  return (
    <main className="main">
      {gameState === 0 ? (
        <section className="intro">
          <h1 className="intro-title">Quizzical</h1>
          <h2 className="intro-desc">Bet you can't beat this quiz cuz it's hard af lmao 🤪</h2>
          <button className="intro-btn" onClick={handleClick}>
            Start Game
          </button>
        </section>
      ) : (
        <section className="quiz">
          {questionElements}
          <div className="main-footer">
            <p className="main-footer-text">{footerText}</p>
            <button className="main-btn" onClick={handleClick}>
              {btnText}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default Quiz;