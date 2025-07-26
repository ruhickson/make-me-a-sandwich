# 🥪 Make Me A Sandwich - Meal Planning Webapp

A lightweight, personalized meal planning webapp that creates custom meal plans based on your preferences, dietary restrictions, and available cooking equipment.

## ✨ Features

### 🎯 Personalized Meal Planning
- **Smart Questionnaire**: Collects age, height, weight, goals, dietary preferences, and allergies
- **Equipment-Based Planning**: Considers your available cooking equipment (oven, hob, microwave, air fryer, etc.)
- **Flexible Scheduling**: Choose two cooking days per week for optimal meal prep

### 🍽️ Comprehensive Meal Plans
- **7 Simple Dinners**: Each taking no more than 1 hour total prep + cook time
- **7 Quick Lunches**: Each prepared in under 5 minutes
- **7 Easy Breakfasts**: Most can be pre-made for convenience
- **14 Smart Snacks**: Healthy options like nuts, fruits, and protein-rich snacks

### 🛒 Smart Shopping Integration
- **Automated Shopping Lists**: All ingredients categorized and quantified
- **Supermarket Search**: Direct integration with online grocery delivery
- **Organized Categories**: Proteins, dairy, grains, fruits/vegetables, nuts/seeds, pantry items

### 🎨 Modern, Lightweight Design
- **Responsive Design**: Works perfectly on mobile and desktop
- **Fast Loading**: No heavy frameworks, pure JavaScript
- **Beautiful UI**: Modern gradient design with smooth animations
- **Local Storage**: Saves your preferences for future use

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local development server)

### Installation & Running

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd make-me-a-sandwich
   ```

2. **Start the development server**
   ```bash
   # Using Python (recommended)
   python -m http.server 8000
   
   # Or using npm
   npm start
   ```

3. **Open your browser**
   Navigate to `http://localhost:8000`

4. **Start planning!**
   - Fill out the questionnaire
   - Select your cooking days
   - Generate your personalized meal plan
   - View your shopping list
   - Search for ingredients at your local supermarket

## 📱 How It Works

### 1. User Onboarding
- Complete a short questionnaire about your preferences
- Select your available cooking equipment
- Choose two cooking days per week

### 2. Meal Generation
- The app generates 21 meals (7 breakfasts, 7 lunches, 7 dinners)
- Plus 14 snacks for between meals
- All meals respect your dietary restrictions and allergies
- Meals are distributed across your two cooking days

### 3. Shopping List Creation
- Automatically generates a comprehensive shopping list
- Categorizes ingredients for easy shopping
- Quantifies ingredients based on meal frequency

### 4. Supermarket Integration
- One-click search for all ingredients at your local online supermarket
- Opens a new tab with your shopping list ready to search

## 🛠️ Technical Details

### Architecture
- **Frontend**: Pure HTML, CSS, JavaScript (no frameworks)
- **Storage**: Local browser storage for user preferences
- **Styling**: Modern CSS with gradients and animations
- **Responsive**: Mobile-first design approach

### File Structure
```
make-me-a-sandwich/
├── index.html          # Main HTML file
├── styles.css          # Modern CSS styling
├── app.js             # Main JavaScript logic
├── package.json       # Project configuration
├── README.md          # This file
└── PRODUCT_VISION.md  # Product requirements
```

### Key Features
- **Dietary Filtering**: Automatically filters meals based on vegetarian, vegan, gluten-free, dairy-free preferences
- **Equipment Matching**: Only suggests meals you can actually cook
- **Time Optimization**: Ensures meals fit your time constraints
- **Smart Distribution**: Spreads cooking load across two days

## 🎯 Target Users

- **Busy Professionals**: Who need quick, healthy meal solutions
- **Health-Conscious Individuals**: Looking for balanced, nutritious meals
- **Dietary Restrictions**: Vegetarian, vegan, gluten-free, dairy-free diets
- **Meal Prep Beginners**: Simple, achievable meal plans
- **Budget-Conscious**: Efficient shopping lists and meal planning

## 🔧 Customization

The app is designed to be easily customizable:

- **Add New Meals**: Edit the meal arrays in `app.js`
- **Modify Dietary Rules**: Update the filtering logic
- **Change Styling**: Modify `styles.css` for different themes
- **Add Equipment**: Extend the equipment options in the HTML

## 📊 Performance

- **Lightweight**: No heavy frameworks or dependencies
- **Fast Loading**: Optimized for quick startup
- **Offline Capable**: Works without internet after initial load
- **Mobile Optimized**: Responsive design for all devices

## 🤝 Contributing

This is a simple, lightweight project perfect for:
- Learning modern web development
- Understanding meal planning algorithms
- Practicing responsive design
- Exploring dietary restriction handling

Feel free to fork and modify for your own needs!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Made with ❤️ for healthy, simple meal planning** 