import React from 'react';

const ShoppingListScreen = ({ onBack }) => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Shopping List Screen</h2>
        <p>This will show the shopping list.</p>
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Meal Plan
        </button>
      </div>
    </div>
  );
};

export default ShoppingListScreen; 