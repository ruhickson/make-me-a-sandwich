import React from 'react';

const QuestionnaireScreen = ({ onComplete }) => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Questionnaire Screen</h2>
        <p>This will contain the questionnaire form.</p>
        <button className="btn btn-primary" onClick={onComplete}>
          Complete Questionnaire
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireScreen; 