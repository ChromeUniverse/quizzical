import React from "react";

function AnswerBtn(props) {
  return (
    <button
      className={`
        answer-btn
        ${!props.reveal && props.selected ? "answer-btn-selected" : ""}
        ${props.reveal ? `answer-btn-${props.reveal}` : ''}
      `}
      onClick={() => props.selectAnswer(props.id)}
      dangerouslySetInnerHTML={{__html: props.text}}
    >
    </button>
  );
}

export default AnswerBtn;
