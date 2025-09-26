import React, { useState } from 'react';
import { useMealPlanner } from '../../context/MealPlannerContext';

const QuestionnaireScreen = ({ onComplete }) => {
  
  const { setUserData, currentQuestionnairePage, setQuestionnairePage, totalQuestionnairePages } = useMealPlanner();
  const [formData, setFormData] = useState({
    // Basic Info
    age: '',
    height: '',
    weight: '',
    gender: '',
    
    // Dietary Restrictions
    dietaryPreferences: [],
    allergies: [],
    
    // Cooking Experience & Preferences
    cookingExperience: '',
    cookingTime: '',
    healthGoals: '',
    
    // Cooking Equipment
    cookingEquipment: [],
    
    // Cooking Schedule
    cookingDays: []
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleCookingDayChange = (day, checked) => {
    setFormData(prev => {
      if (checked && prev.cookingDays.length < 2) {
        return {
          ...prev,
          cookingDays: [...prev.cookingDays, day]
        };
      } else if (!checked) {
        return {
          ...prev,
          cookingDays: prev.cookingDays.filter(d => d !== day)
        };
      }
      return prev;
    });
  };

  const nextPage = () => {
    if (currentQuestionnairePage < totalQuestionnairePages) {
      setQuestionnairePage(currentQuestionnairePage + 1);
    }
  };

  const prevPage = () => {
    if (currentQuestionnairePage > 1) {
      setQuestionnairePage(currentQuestionnairePage - 1);
    }
  };

  const handleComplete = () => {
    setUserData(formData);
    onComplete();
  };

  const renderBasicInfo = () => (
    <div className="questionnaire-page">
      <h2>Basic Information</h2>
      <p>Let's start with some basic details to personalize your meal plan.</p>
      
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          placeholder="25"
          min="13"
          max="120"
        />
      </div>

      <div className="form-group">
        <label htmlFor="height">Height (cm)</label>
        <input
          type="number"
          id="height"
          value={formData.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          placeholder="170"
          min="100"
          max="250"
        />
      </div>

      <div className="form-group">
        <label htmlFor="weight">Weight (kg)</label>
        <input
          type="number"
          id="weight"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          placeholder="70"
          min="30"
          max="200"
        />
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={formData.gender === 'male'}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            />
            Male
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={formData.gender === 'female'}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            />
            Female
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={formData.gender === 'other'}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            />
            Other
          </label>
        </div>
      </div>
    </div>
  );

  const renderDietaryRestrictions = () => (
    <div className="questionnaire-page">
      <h2>Dietary Restrictions</h2>
      <p>Tell us about any dietary preferences and allergies.</p>
      
      <div className="form-group">
        <label>Dietary Preferences</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.dietaryPreferences.includes('vegetarian')}
              onChange={(e) => handleArrayChange('dietaryPreferences', 'vegetarian', e.target.checked)}
            />
            Vegetarian
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.dietaryPreferences.includes('vegan')}
              onChange={(e) => handleArrayChange('dietaryPreferences', 'vegan', e.target.checked)}
            />
            Vegan
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.dietaryPreferences.includes('gluten_free')}
              onChange={(e) => handleArrayChange('dietaryPreferences', 'gluten_free', e.target.checked)}
            />
            Gluten Free
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.dietaryPreferences.includes('dairy_free')}
              onChange={(e) => handleArrayChange('dietaryPreferences', 'dairy_free', e.target.checked)}
            />
            Dairy Free
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="allergies">Allergies (comma separated)</label>
        <textarea
          id="allergies"
          value={formData.allergies.join(', ')}
          onChange={(e) => handleInputChange('allergies', e.target.value.split(',').map(item => item.trim()).filter(item => item))}
          placeholder="nuts, shellfish, eggs"
          rows="3"
        />
      </div>
    </div>
  );

  const renderCookingExperience = () => (
    <div className="questionnaire-page">
      <h2>Cooking Experience & Preferences</h2>
      <p>Help us tailor recipes to your skill level and preferences.</p>
      
      <div className="form-group">
        <label>Cooking Experience</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="cookingExperience"
              value="beginner"
              checked={formData.cookingExperience === 'beginner'}
              onChange={(e) => handleInputChange('cookingExperience', e.target.value)}
            />
            Beginner - I'm learning to cook
          </label>
          <label>
            <input
              type="radio"
              name="cookingExperience"
              value="intermediate"
              checked={formData.cookingExperience === 'intermediate'}
              onChange={(e) => handleInputChange('cookingExperience', e.target.value)}
            />
            Intermediate - I can follow recipes well
          </label>
          <label>
            <input
              type="radio"
              name="cookingExperience"
              value="advanced"
              checked={formData.cookingExperience === 'advanced'}
              onChange={(e) => handleInputChange('cookingExperience', e.target.value)}
            />
            Advanced - I can improvise and create dishes
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Preferred Cooking Time</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="cookingTime"
              value="quick"
              checked={formData.cookingTime === 'quick'}
              onChange={(e) => handleInputChange('cookingTime', e.target.value)}
            />
            Quick (15-30 minutes)
          </label>
          <label>
            <input
              type="radio"
              name="cookingTime"
              value="medium"
              checked={formData.cookingTime === 'medium'}
              onChange={(e) => handleInputChange('cookingTime', e.target.value)}
            />
            Medium (30-60 minutes)
          </label>
          <label>
            <input
              type="radio"
              name="cookingTime"
              value="relaxed"
              checked={formData.cookingTime === 'relaxed'}
              onChange={(e) => handleInputChange('cookingTime', e.target.value)}
            />
            Relaxed (1+ hours)
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Health Goals</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="healthGoals"
              value="weight_loss"
              checked={formData.healthGoals === 'weight_loss'}
              onChange={(e) => handleInputChange('healthGoals', e.target.value)}
            />
            Weight Loss
          </label>
          <label>
            <input
              type="radio"
              name="healthGoals"
              value="maintenance"
              checked={formData.healthGoals === 'maintenance'}
              onChange={(e) => handleInputChange('healthGoals', e.target.value)}
            />
            Maintenance
          </label>
          <label>
            <input
              type="radio"
              name="healthGoals"
              value="muscle_gain"
              checked={formData.healthGoals === 'muscle_gain'}
              onChange={(e) => handleInputChange('healthGoals', e.target.value)}
            />
            Muscle Gain
          </label>
        </div>
      </div>
    </div>
  );

  const renderCookingEquipment = () => (
    <div className="questionnaire-page">
      <h2>Cooking Equipment</h2>
      <p>What cooking equipment do you have available?</p>
      
      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={formData.cookingEquipment.includes('oven')}
            onChange={(e) => handleArrayChange('cookingEquipment', 'oven', e.target.checked)}
          />
          Oven
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.cookingEquipment.includes('hob')}
            onChange={(e) => handleArrayChange('cookingEquipment', 'hob', e.target.checked)}
          />
          Hob/Stovetop
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.cookingEquipment.includes('microwave')}
            onChange={(e) => handleArrayChange('cookingEquipment', 'microwave', e.target.checked)}
          />
          Microwave
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.cookingEquipment.includes('air_fryer')}
            onChange={(e) => handleArrayChange('cookingEquipment', 'air_fryer', e.target.checked)}
          />
          Air Fryer
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.cookingEquipment.includes('slow_cooker')}
            onChange={(e) => handleArrayChange('cookingEquipment', 'slow_cooker', e.target.checked)}
          />
          Slow Cooker
        </label>
        <label>
          <input
            type="checkbox"
            checked={formData.cookingEquipment.includes('blender')}
            onChange={(e) => handleArrayChange('cookingEquipment', 'blender', e.target.checked)}
          />
          Blender
        </label>
      </div>
    </div>
  );

  const renderCookingSchedule = () => (
    <div className="questionnaire-page">
      <h2>Cooking Schedule</h2>
      <p>Select exactly 2 days when you prefer to cook your meals.</p>
      
      <div className="form-group">
        <label>Cooking Days (select exactly 2)</label>
        <div className="checkbox-group">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={formData.cookingDays.includes(day.toLowerCase())}
                onChange={(e) => handleCookingDayChange(day.toLowerCase(), e.target.checked)}
                disabled={!formData.cookingDays.includes(day.toLowerCase()) && formData.cookingDays.length >= 2}
              />
              {day}
            </label>
          ))}
        </div>
        {formData.cookingDays.length > 0 && (
          <p className="selection-info">
            Selected: {formData.cookingDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
            {formData.cookingDays.length < 2 && ` (${2 - formData.cookingDays.length} more needed)`}
          </p>
        )}
      </div>
    </div>
  );

  const renderPages = () => {
    switch (currentQuestionnairePage) {
      case 1:
        return renderBasicInfo();
      case 2:
        return renderDietaryRestrictions();
      case 3:
        return renderCookingExperience();
      case 4:
        return renderCookingEquipment();
      case 5:
        return renderCookingSchedule();
      default:
        return renderBasicInfo();
    }
  };

  return (
    <div className="container">
      <div className="questionnaire-container">
        <div className="questionnaire-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentQuestionnairePage / totalQuestionnairePages) * 100}%` }}
            ></div>
          </div>
          <p>Step {currentQuestionnairePage} of {totalQuestionnairePages}</p>
        </div>

        <div className="questionnaire-content">
          {renderPages()}
        </div>

        <div className="questionnaire-navigation">
          {currentQuestionnairePage > 1 && (
            <button className="btn btn-secondary" onClick={prevPage}>
              Previous
            </button>
          )}
          
          {currentQuestionnairePage < totalQuestionnairePages ? (
            <button className="btn btn-primary" onClick={nextPage}>
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleComplete}>
              Generate Meal Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireScreen; 