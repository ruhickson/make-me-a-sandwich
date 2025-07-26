import React from 'react';

const MealPlanScreen = ({ onViewShopping }) => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Meal Plan Screen</h2>
        <p>This will show the generated meal plan.</p>
        <button className="btn btn-secondary" onClick={onViewShopping}>
          View Shopping List
        </button>
      </div>
    </div>
  );
};

export default MealPlanScreen; 