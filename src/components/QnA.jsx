import React from "react";
import AnswerBtn from "./AnswerBtn";

function QnA(props) {

  function selectAnswer(answerButtonId) {
    props.selectAnswer(props.id, answerButtonId);
  }

  const answerBtns = props.answers.map(answer => {

    let revealStyle = '';
    if (props.reveal) {
      if (answer.correct) {
        revealStyle = 'green'
      }
      else if (props.selected === answer.id && !answer.correct) {
        revealStyle = 'red';
      }
      else {
        revealStyle = 'grayed'
      }
    } else {
      revealStyle = false;
    }

    return (
      <AnswerBtn
        key={answer.id}
        id={answer.id}
        selected={props.selected === answer.id}
        text={answer.text}
        selectAnswer={selectAnswer}
        reveal={revealStyle}
      />
    );
  })

  
  return (
    <div className="question">
      <h3
        className="question-title"
        dangerouslySetInnerHTML={{ __html: props.prompt }}
      ></h3>
      <div className="answers">{answerBtns}</div>
      <hr />
    </div>
  );
}

export default QnA;
