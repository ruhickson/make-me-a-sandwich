import React from 'react';
import { useMealPlanner } from '../../context/MealPlannerContext';

const CalendarScreen = () => {
  const { mealPlan } = useMealPlanner();

  if (!mealPlan || !mealPlan.week) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h2>Calendar</h2>
          <p>No meal plan found. Generate a plan first.</p>
        </div>
      </div>
    );
  }

  const getMealForDay = (dayName, mealType) => {
    const meals = mealPlan.meals?.[mealType] || [];
    return meals.find(meal => meal.day === dayName);
  };

  return (
    <div className="container">
      <div className="weekly-calendar">
        <div className="calendar-header">
          <div className="calendar-header-content">
            <div className="days-header">
              <div className="meal-plan-title-card">
                <h3>Your Meal Plan</h3>
              </div>
              {mealPlan.week.map((day, index) => (
                <div key={index} className="day-header-cell">
                  <h3>{day.name}</h3>
                  <p>{day.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-content">
          {['breakfasts', 'lunches', 'dinners', 'snacks'].map(mealType => {
            const mealTypeLabels = { breakfasts: 'Breakfast', lunches: 'Lunch', dinners: 'Dinner', snacks: 'Snack' };
            return (
              <div key={mealType} className="meal-row">
                <div className="meal-type-label">
                  <div className={`meal-type ${mealType.slice(0, -1)}`}>
                    {mealTypeLabels[mealType]}
                  </div>
                </div>
                <div className="meal-slots">
                  {mealPlan.week.map((day, dayIndex) => {
                    const meal = getMealForDay(day.name, mealType);
                    return (
                      <div key={dayIndex} className="meal-slot" style={{ backgroundColor: meal?.color }}>
                        <h4 title={meal?.name}>{meal?.name}</h4>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarScreen; 