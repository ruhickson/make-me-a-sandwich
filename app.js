// Meal Planning App - Main JavaScript File

class MealPlanner {
    constructor() {
        this.userData = {};
        this.mealPlan = {};
        this.shoppingList = {};
        this.ingredientPrices = this.initializeIngredientPrices();
        this.currentQuestionnairePage = 1;
        this.totalQuestionnairePages = 4;
        this.userProfile = null;
        this.settings = this.getDefaultSettings();
        this.isLoggedIn = false;
        
        this.initializeEventListeners();
        this.checkLoginStatus();
    }

    initializeIngredientPrices() {
        return {
            // Proteins
            'chicken breast': { price: 8.50, unit: 'per kg' },
            'beef': { price: 12.00, unit: 'per kg' },
            'salmon': { price: 15.00, unit: 'per kg' },
            'tuna': { price: 3.50, unit: 'per can' },
            'white fish': { price: 10.00, unit: 'per kg' },
            'eggs': { price: 3.50, unit: 'per dozen' },
            'protein powder': { price: 25.00, unit: 'per kg' },
            
            // Dairy & Alternatives
            'milk': { price: 1.20, unit: 'per liter' },
            'yogurt': { price: 2.50, unit: 'per 500g' },
            'greek yogurt': { price: 3.50, unit: 'per 500g' },
            'cheese': { price: 8.00, unit: 'per kg' },
            'feta': { price: 6.00, unit: 'per 200g' },
            'mozzarella': { price: 7.50, unit: 'per kg' },
            'parmesan': { price: 12.00, unit: 'per kg' },
            'cream cheese': { price: 2.50, unit: 'per 200g' },
            'cottage cheese': { price: 3.00, unit: 'per 500g' },
            
            // Grains & Breads
            'bread': { price: 2.50, unit: 'per loaf' },
            'pasta': { price: 1.50, unit: 'per 500g' },
            'tortilla': { price: 2.00, unit: 'per pack' },
            'oats': { price: 3.00, unit: 'per kg' },
            'quinoa': { price: 6.00, unit: 'per kg' },
            'rice': { price: 2.50, unit: 'per kg' },
            'rice cakes': { price: 2.00, unit: 'per pack' },
            'granola': { price: 4.50, unit: 'per 500g' },
            
            // Fruits & Vegetables
            'apple': { price: 0.50, unit: 'each' },
            'banana': { price: 0.30, unit: 'each' },
            'berries': { price: 4.00, unit: 'per 300g' },
            'orange': { price: 0.60, unit: 'each' },
            'grapes': { price: 3.50, unit: 'per kg' },
            'tomatoes': { price: 2.50, unit: 'per kg' },
            'cucumber': { price: 1.00, unit: 'each' },
            'lettuce': { price: 1.50, unit: 'each' },
            'carrots': { price: 1.50, unit: 'per kg' },
            'celery': { price: 2.00, unit: 'per bunch' },
            'avocado': { price: 1.50, unit: 'each' },
            'vegetables': { price: 3.00, unit: 'per kg' },
            
            // Nuts & Seeds
            'almonds': { price: 8.00, unit: 'per kg' },
            'cashews': { price: 10.00, unit: 'per kg' },
            'walnuts': { price: 9.00, unit: 'per kg' },
            'peanut butter': { price: 3.50, unit: 'per 500g' },
            'chia seeds': { price: 6.00, unit: 'per 500g' },
            'seeds': { price: 4.00, unit: 'per 500g' },
            'nuts': { price: 8.50, unit: 'per kg' },
            'dried fruit': { price: 5.00, unit: 'per 500g' },
            
            // Pantry Items
            'honey': { price: 4.00, unit: 'per 500g' },
            'olive oil': { price: 6.00, unit: 'per liter' },
            'soy sauce': { price: 2.50, unit: 'per 500ml' },
            'balsamic': { price: 3.50, unit: 'per 250ml' },
            'salt': { price: 1.00, unit: 'per kg' },
            'herbs': { price: 2.00, unit: 'per bunch' },
            'lemon': { price: 0.40, unit: 'each' },
            'ginger': { price: 3.00, unit: 'per kg' },
            'curry powder': { price: 2.50, unit: 'per 100g' },
            'coconut milk': { price: 2.00, unit: 'per 400ml' },
            'vanilla': { price: 4.00, unit: 'per 100ml' },
            'popcorn kernels': { price: 2.50, unit: 'per kg' },
            'mayo': { price: 2.00, unit: 'per 500ml' },
            'onion': { price: 1.50, unit: 'per kg' },
            'sprouts': { price: 2.00, unit: 'per 200g' },
            'chicken': { price: 8.50, unit: 'per kg' },
            'dressing': { price: 3.00, unit: 'per 250ml' },
            'protein': { price: 12.00, unit: 'per kg' },
            'basil': { price: 2.50, unit: 'per bunch' },
            'dark chocolate': { price: 4.00, unit: 'per 200g' },
            'hummus': { price: 3.50, unit: 'per 300g' },
            'cream cheese': { price: 2.50, unit: 'per 200g' },
            'fruit': { price: 4.00, unit: 'per kg' },
            'protein bar': { price: 2.50, unit: 'each' }
        };
    }

    checkLoginStatus() {
        // Check if user has existing data
        const hasUserData = localStorage.getItem('mealPlannerUserData');
        const hasUserProfile = localStorage.getItem('mealPlannerUserProfile');
        
        if (hasUserData && hasUserProfile) {
            // User has existing data - show welcome back screen
            this.loadUserData();
            this.loadUserProfile();
            
            // Fix any old placeholder URLs in the profile
            if (this.userProfile && this.userProfile.avatar && this.userProfile.avatar.includes('via.placeholder.com')) {
                const initial = this.userProfile.name.charAt(0).toUpperCase();
                this.userProfile.avatar = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+${initial}PC90ZXh0Pgo8L3N2Zz4K`;
                this.saveUserProfile();
            }
            
            this.showWelcomeBack();
        } else {
            // New user - show login screen
            this.showNewUserLogin();
        }
    }

    showWelcomeBack() {
        const welcomeBackSection = document.getElementById('welcome-back-section');
        const newUserSection = document.getElementById('new-user-section');
        
        welcomeBackSection.style.display = 'block';
        newUserSection.style.display = 'none';
        
        // Update user info
        if (this.userProfile) {
            document.getElementById('welcome-avatar').src = this.userProfile.avatar;
            document.getElementById('welcome-name').textContent = this.userProfile.name;
            document.getElementById('welcome-email').textContent = this.userProfile.email;
        }
    }

    showNewUserLogin() {
        const welcomeBackSection = document.getElementById('welcome-back-section');
        const newUserSection = document.getElementById('new-user-section');
        
        welcomeBackSection.style.display = 'none';
        newUserSection.style.display = 'block';
    }

    initializeEventListeners() {
        // Login screen events
        const googleSigninBtn = document.getElementById('google-signin-btn');
        const emailSigninBtn = document.getElementById('email-signin-btn');
        const guestBtn = document.getElementById('guest-btn');
        const continueBtn = document.getElementById('continue-btn');
        const newPlanBtn = document.getElementById('new-plan-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (googleSigninBtn) {
            googleSigninBtn.addEventListener('click', () => {
                this.handleGoogleSignIn();
            });
        }

        if (emailSigninBtn) {
            emailSigninBtn.addEventListener('click', () => {
                this.handleEmailSignIn();
            });
        }

        if (guestBtn) {
            guestBtn.addEventListener('click', () => {
                this.handleGuestLogin();
            });
        }

        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.continueWithExistingPlan();
            });
        }

        if (newPlanBtn) {
            newPlanBtn.addEventListener('click', () => {
                this.startFresh();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Main app events (only initialize if main app is visible)
        this.initializeMainAppEvents();
    }

    initializeMainAppEvents() {
        // Menu navigation
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const screenId = e.target.dataset.screen;
                this.showScreen(screenId);
                this.updateMenuActiveState();
            });
        });

        // Welcome screen
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.showScreen('questionnaire-screen');
                this.updateMenuActiveState();
            });
        }

        // Questionnaire navigation
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextQuestionnairePage();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.previousQuestionnairePage();
            });
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleFormSubmission();
            });
        }

        // Meal plan actions
        const shoppingListBtn = document.getElementById('shopping-list-btn');
        const newPlanBtn = document.getElementById('new-plan-btn');

        if (shoppingListBtn) {
            shoppingListBtn.addEventListener('click', () => {
                this.showShoppingList();
            });
        }

        if (newPlanBtn) {
            newPlanBtn.addEventListener('click', () => {
                this.showScreen('questionnaire-screen');
                this.updateMenuActiveState();
            });
        }

        // Shopping list actions
        const searchSupermarketBtn = document.getElementById('search-supermarket-btn');
        const backToMealPlanBtn = document.getElementById('back-to-meal-plan-btn');

        if (searchSupermarketBtn) {
            searchSupermarketBtn.addEventListener('click', () => {
                this.searchSupermarket();
            });
        }

        if (backToMealPlanBtn) {
            backToMealPlanBtn.addEventListener('click', () => {
                this.showScreen('meal-plan-screen');
                this.updateMenuActiveState();
            });
        }

        // Calendar actions
        const createCalendarBtn = document.getElementById('create-calendar-btn');
        const downloadIcsBtn = document.getElementById('download-ics-btn');

        if (createCalendarBtn) {
            createCalendarBtn.addEventListener('click', () => {
                this.createCalendarReminders();
            });
        }

        if (downloadIcsBtn) {
            downloadIcsBtn.addEventListener('click', () => {
                this.downloadICSFile();
            });
        }

        // Account actions
        const accountGoogleSigninBtn = document.getElementById('google-signin-btn');
        const accountEmailSigninBtn = document.getElementById('email-signin-btn');
        const signoutBtn = document.getElementById('signout-btn');
        const deleteAccountBtn = document.getElementById('delete-account-btn');

        if (accountGoogleSigninBtn) {
            accountGoogleSigninBtn.addEventListener('click', () => {
                this.handleGoogleSignIn();
            });
        }

        if (accountEmailSigninBtn) {
            accountEmailSigninBtn.addEventListener('click', () => {
                this.handleEmailSignIn();
            });
        }

        if (signoutBtn) {
            signoutBtn.addEventListener('click', () => {
                this.handleSignOut();
            });
        }

        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.handleDeleteAccount();
            });
        }

        // Settings actions
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const notificationsToggle = document.getElementById('notifications-toggle');
        const autosaveToggle = document.getElementById('autosave-toggle');
        const weightUnit = document.getElementById('weight-unit');
        const heightUnit = document.getElementById('height-unit');
        const exportDataBtn = document.getElementById('export-data-btn');
        const clearDataBtn = document.getElementById('clear-data-btn');
        const privacyPolicyBtn = document.getElementById('privacy-policy-btn');

        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.handleDarkModeToggle(e.target.checked);
            });
        }

        if (notificationsToggle) {
            notificationsToggle.addEventListener('change', (e) => {
                this.handleNotificationsToggle(e.target.checked);
            });
        }

        if (autosaveToggle) {
            autosaveToggle.addEventListener('change', (e) => {
                this.handleAutosaveToggle(e.target.checked);
            });
        }

        if (weightUnit) {
            weightUnit.addEventListener('change', (e) => {
                this.handleWeightUnitChange(e.target.value);
            });
        }

        if (heightUnit) {
            heightUnit.addEventListener('change', (e) => {
                this.handleHeightUnitChange(e.target.value);
            });
        }

        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportUserData();
            });
        }

        if (clearDataBtn) {
            clearDataBtn.addEventListener('click', () => {
                this.clearAllData();
            });
        }

        if (privacyPolicyBtn) {
            privacyPolicyBtn.addEventListener('click', () => {
                this.showPrivacyPolicy();
            });
        }

        // Cooking days validation
        const cookingDayCheckboxes = document.querySelectorAll('input[name="cooking-days"]');
        cookingDayCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validateCookingDays();
            });
        });

        // Touch/swipe support for questionnaire
        this.initializeSwipeSupport();
        
        // Load settings
        this.loadSettings();
    }

    initializeSwipeSupport() {
        const questionnairePages = document.querySelector('.questionnaire-pages');
        if (!questionnairePages) return;
        
        let startX = 0;
        let endX = 0;

        questionnairePages.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        questionnairePages.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });

        // Mouse support for desktop
        questionnairePages.addEventListener('mousedown', (e) => {
            startX = e.clientX;
        });

        questionnairePages.addEventListener('mouseup', (e) => {
            endX = e.clientX;
            this.handleSwipe(startX, endX);
        });
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next page
                this.nextQuestionnairePage();
            } else {
                // Swipe right - previous page
                this.previousQuestionnairePage();
            }
        }
    }

    nextQuestionnairePage() {
        if (this.currentQuestionnairePage < this.totalQuestionnairePages) {
            this.currentQuestionnairePage++;
            this.updateQuestionnairePage();
        }
    }

    previousQuestionnairePage() {
        if (this.currentQuestionnairePage > 1) {
            this.currentQuestionnairePage--;
            this.updateQuestionnairePage();
        }
    }

    updateQuestionnairePage() {
        // Hide all pages
        document.querySelectorAll('.questionnaire-page').forEach(page => {
            page.classList.remove('active');
        });

        // Show current page
        const currentPage = document.querySelector(`[data-page="${this.currentQuestionnairePage}"]`);
        if (currentPage) {
            currentPage.classList.add('active');
        }

        // Update progress
        this.updateProgress();

        // Update navigation buttons
        this.updateNavigationButtons();
    }

    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const progressPercentage = (this.currentQuestionnairePage / this.totalQuestionnairePages) * 100;

        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `${this.currentQuestionnairePage} of ${this.totalQuestionnairePages}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');

        // Previous button
        prevBtn.disabled = this.currentQuestionnairePage === 1;

        // Next/Submit button
        if (this.currentQuestionnairePage === this.totalQuestionnairePages) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }

    updateMenuActiveState() {
        const currentScreen = document.querySelector('.screen.active');
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === currentScreen.id) {
                item.classList.add('active');
            }
        });
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
        
        // Reset questionnaire if going to questionnaire screen
        if (screenId === 'questionnaire-screen') {
            this.currentQuestionnairePage = 1;
            this.updateQuestionnairePage();
        }
    }

    validateCookingDays() {
        const selectedDays = document.querySelectorAll('input[name="cooking-days"]:checked');
        const submitBtn = document.getElementById('submit-btn');
        
        if (selectedDays.length === 2) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Generate Meal Plan';
        } else if (selectedDays.length > 2) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Please select exactly 2 days';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = `Select ${2 - selectedDays.length} more day${2 - selectedDays.length === 1 ? '' : 's'}`;
        }
    }

    handleFormSubmission() {
        // Collect form data from all pages
        const formData = new FormData();
        
        // Basic Information (Page 1)
        formData.append('age', document.getElementById('age').value);
        formData.append('height', document.getElementById('height').value);
        formData.append('weight', document.getElementById('weight').value);
        
        // Goals & Preferences (Page 2)
        formData.append('goal', document.getElementById('goal').value);
        document.querySelectorAll('input[name="dietary"]:checked').forEach(checkbox => {
            formData.append('dietary', checkbox.value);
        });
        formData.append('allergies', document.getElementById('allergies').value);
        
        // Cooking Equipment (Page 3)
        document.querySelectorAll('input[name="equipment"]:checked').forEach(checkbox => {
            formData.append('equipment', checkbox.value);
        });
        
        // Cooking Schedule (Page 4)
        document.querySelectorAll('input[name="cooking-days"]:checked').forEach(checkbox => {
            formData.append('cooking-days', checkbox.value);
        });
        
        // Collect form data
        this.userData = {
            age: parseInt(formData.get('age')),
            height: parseInt(formData.get('height')),
            weight: parseInt(formData.get('weight')),
            goal: formData.get('goal'),
            dietary: Array.from(formData.getAll('dietary')),
            allergies: formData.get('allergies').split(',').map(item => item.trim()).filter(item => item),
            equipment: Array.from(formData.getAll('equipment')),
            cookingDays: Array.from(formData.getAll('cooking-days'))
        };

        // Validate cooking days
        if (this.userData.cookingDays.length !== 2) {
            alert('Please select exactly 2 cooking days');
            return;
        }

        // Save user data
        this.saveUserData();
        
        // Generate meal plan
        this.generateMealPlan();
        
        // Show meal plan screen
        this.showScreen('meal-plan-screen');
        this.updateMenuActiveState();
    }

    generateMealPlan() {
        const meals = this.createMealPlan();
        this.mealPlan = meals;
        this.generateShoppingList();
        this.displayMealPlan();
    }

    createMealPlan() {
        const meals = {
            breakfasts: this.generateBreakfasts(),
            lunches: this.generateLunches(),
            dinners: this.generateDinners(),
            snacks: this.generateSnacks()
        };

        // Distribute meals across cooking days
        return this.distributeMeals(meals);
    }

    generateBreakfasts() {
        const breakfasts = [
            { name: "Overnight Oats with Berries", time: "5 min", ingredients: ["oats", "milk", "berries", "honey"] },
            { name: "Greek Yogurt Parfait", time: "3 min", ingredients: ["greek yogurt", "granola", "honey", "berries"] },
            { name: "Smoothie Bowl", time: "5 min", ingredients: ["banana", "berries", "yogurt", "granola"] },
            { name: "Avocado Toast", time: "5 min", ingredients: ["bread", "avocado", "eggs", "salt"] },
            { name: "Protein Pancakes", time: "10 min", ingredients: ["protein powder", "eggs", "banana", "milk"] },
            { name: "Chia Pudding", time: "5 min", ingredients: ["chia seeds", "milk", "honey", "vanilla"] },
            { name: "Breakfast Burrito", time: "8 min", ingredients: ["tortilla", "eggs", "cheese", "vegetables"] }
        ];

        return this.filterByDietary(breakfasts);
    }

    generateLunches() {
        const lunches = [
            { name: "Mediterranean Salad", time: "5 min", ingredients: ["lettuce", "tomatoes", "cucumber", "olives", "feta"] },
            { name: "Tuna Sandwich", time: "5 min", ingredients: ["bread", "tuna", "mayo", "celery", "onion"] },
            { name: "Hummus Wrap", time: "4 min", ingredients: ["tortilla", "hummus", "vegetables", "sprouts"] },
            { name: "Quinoa Bowl", time: "5 min", ingredients: ["quinoa", "vegetables", "chicken", "dressing"] },
            { name: "Greek Salad", time: "4 min", ingredients: ["cucumber", "tomatoes", "olives", "feta", "olive oil"] },
            { name: "Avocado Rice Bowl", time: "5 min", ingredients: ["rice", "avocado", "vegetables", "soy sauce"] },
            { name: "Caprese Sandwich", time: "4 min", ingredients: ["bread", "mozzarella", "tomatoes", "basil", "balsamic"] }
        ];

        return this.filterByDietary(lunches);
    }

    generateDinners() {
        const dinners = [
            { name: "Grilled Chicken with Vegetables", time: "25 min", ingredients: ["chicken breast", "vegetables", "olive oil", "herbs"] },
            { name: "Salmon with Quinoa", time: "20 min", ingredients: ["salmon", "quinoa", "vegetables", "lemon"] },
            { name: "Stir Fry", time: "15 min", ingredients: ["vegetables", "protein", "soy sauce", "rice"] },
            { name: "Pasta Primavera", time: "20 min", ingredients: ["pasta", "vegetables", "olive oil", "parmesan"] },
            { name: "Beef Stir Fry", time: "18 min", ingredients: ["beef", "vegetables", "soy sauce", "ginger"] },
            { name: "Vegetarian Curry", time: "25 min", ingredients: ["vegetables", "coconut milk", "curry powder", "rice"] },
            { name: "Baked Fish with Herbs", time: "20 min", ingredients: ["white fish", "herbs", "lemon", "vegetables"] }
        ];

        return this.filterByDietary(dinners);
    }

    generateSnacks() {
        const snacks = [
            { name: "Mixed Nuts", time: "0 min", ingredients: ["almonds", "cashews", "walnuts"] },
            { name: "Apple with Peanut Butter", time: "2 min", ingredients: ["apple", "peanut butter"] },
            { name: "Greek Yogurt", time: "1 min", ingredients: ["greek yogurt", "honey"] },
            { name: "Dark Chocolate", time: "0 min", ingredients: ["dark chocolate"] },
            { name: "Carrot Sticks", time: "2 min", ingredients: ["carrots", "hummus"] },
            { name: "Trail Mix", time: "0 min", ingredients: ["nuts", "dried fruit", "seeds"] },
            { name: "Banana", time: "0 min", ingredients: ["banana"] },
            { name: "Cottage Cheese", time: "1 min", ingredients: ["cottage cheese", "fruit"] },
            { name: "Rice Cakes", time: "0 min", ingredients: ["rice cakes", "peanut butter"] },
            { name: "Orange", time: "0 min", ingredients: ["orange"] },
            { name: "Popcorn", time: "3 min", ingredients: ["popcorn kernels", "olive oil"] },
            { name: "Celery Sticks", time: "2 min", ingredients: ["celery", "cream cheese"] },
            { name: "Grapes", time: "0 min", ingredients: ["grapes"] },
            { name: "Protein Bar", time: "0 min", ingredients: ["protein bar"] }
        ];

        return this.filterByDietary(snacks);
    }

    filterByDietary(meals) {
        return meals.filter(meal => {
            // Filter based on dietary preferences
            if (this.userData.dietary.includes('vegetarian')) {
                if (meal.ingredients.some(ing => ['chicken', 'beef', 'salmon', 'tuna', 'fish'].includes(ing))) {
                    return false;
                }
            }
            if (this.userData.dietary.includes('vegan')) {
                if (meal.ingredients.some(ing => ['chicken', 'beef', 'salmon', 'tuna', 'fish', 'eggs', 'cheese', 'milk', 'yogurt', 'feta', 'mozzarella', 'parmesan', 'cream cheese'].includes(ing))) {
                    return false;
                }
            }
            if (this.userData.dietary.includes('gluten-free')) {
                if (meal.ingredients.some(ing => ['bread', 'pasta', 'tortilla'].includes(ing))) {
                    return false;
                }
            }
            if (this.userData.dietary.includes('dairy-free')) {
                if (meal.ingredients.some(ing => ['cheese', 'milk', 'yogurt', 'feta', 'mozzarella', 'parmesan', 'cream cheese'].includes(ing))) {
                    return false;
                }
            }
            return true;
        });
    }

    distributeMeals(meals) {
        const [day1, day2] = this.userData.cookingDays;
        
        return {
            [day1]: {
                breakfasts: meals.breakfasts.slice(0, 4),
                lunches: meals.lunches.slice(0, 4),
                dinners: meals.dinners.slice(0, 4),
                snacks: meals.snacks.slice(0, 7)
            },
            [day2]: {
                breakfasts: meals.breakfasts.slice(4, 7),
                lunches: meals.lunches.slice(4, 7),
                dinners: meals.dinners.slice(4, 7),
                snacks: meals.snacks.slice(7, 14)
            }
        };
    }

    generateShoppingList() {
        const allIngredients = new Map();
        
        // Collect all ingredients from meal plan
        Object.values(this.mealPlan).forEach(day => {
            Object.values(day).forEach(mealType => {
                mealType.forEach(meal => {
                    meal.ingredients.forEach(ingredient => {
                        const count = allIngredients.get(ingredient) || 0;
                        allIngredients.set(ingredient, count + 1);
                    });
                });
            });
        });

        // Categorize ingredients with pricing
        this.shoppingList = {
            'Proteins': this.categorizeIngredientsWithPricing(allIngredients, ['chicken', 'beef', 'salmon', 'tuna', 'fish', 'eggs', 'protein powder']),
            'Dairy & Alternatives': this.categorizeIngredientsWithPricing(allIngredients, ['milk', 'yogurt', 'greek yogurt', 'cheese', 'feta', 'mozzarella', 'parmesan', 'cream cheese', 'cottage cheese']),
            'Grains & Breads': this.categorizeIngredientsWithPricing(allIngredients, ['bread', 'pasta', 'tortilla', 'oats', 'quinoa', 'rice', 'rice cakes', 'granola']),
            'Fruits & Vegetables': this.categorizeIngredientsWithPricing(allIngredients, ['apple', 'banana', 'berries', 'orange', 'grapes', 'tomatoes', 'cucumber', 'lettuce', 'carrots', 'celery', 'avocado', 'vegetables']),
            'Nuts & Seeds': this.categorizeIngredientsWithPricing(allIngredients, ['almonds', 'cashews', 'walnuts', 'peanut butter', 'chia seeds', 'seeds', 'nuts', 'dried fruit']),
            'Pantry Items': this.categorizeIngredientsWithPricing(allIngredients, ['honey', 'olive oil', 'soy sauce', 'balsamic', 'salt', 'herbs', 'lemon', 'ginger', 'curry powder', 'coconut milk', 'vanilla', 'popcorn kernels', 'mayo', 'onion', 'sprouts', 'dressing', 'basil', 'dark chocolate', 'hummus', 'fruit', 'protein bar'])
        };
    }

    categorizeIngredientsWithPricing(allIngredients, categoryItems) {
        const category = {};
        categoryItems.forEach(item => {
            if (allIngredients.has(item)) {
                const quantity = allIngredients.get(item);
                const priceInfo = this.ingredientPrices[item] || { price: 0, unit: 'unknown' };
                category[item] = {
                    quantity: quantity,
                    price: priceInfo.price,
                    unit: priceInfo.unit,
                    totalCost: priceInfo.price * quantity
                };
            }
        });
        return category;
    }

    displayMealPlan() {
        const container = document.getElementById('meal-plan-content');
        container.innerHTML = '';

        Object.entries(this.mealPlan).forEach(([day, meals]) => {
            const dayElement = document.createElement('div');
            dayElement.className = 'meal-day';
            
            const dayName = day.charAt(0).toUpperCase() + day.slice(1);
            dayElement.innerHTML = `
                <h3>${dayName} - Cooking Day</h3>
                <div class="meal-section">
                    <h4>Breakfasts (${meals.breakfasts.length})</h4>
                    ${meals.breakfasts.map(meal => `
                        <div class="meal-item">
                            <span class="meal-name">${meal.name}</span>
                            <span class="meal-time">${meal.time}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="meal-section">
                    <h4>Lunches (${meals.lunches.length})</h4>
                    ${meals.lunches.map(meal => `
                        <div class="meal-item">
                            <span class="meal-name">${meal.name}</span>
                            <span class="meal-time">${meal.time}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="meal-section">
                    <h4>Dinners (${meals.dinners.length})</h4>
                    ${meals.dinners.map(meal => `
                        <div class="meal-item">
                            <span class="meal-name">${meal.name}</span>
                            <span class="meal-time">${meal.time}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="meal-section">
                    <h4>Snacks (${meals.snacks.length})</h4>
                    ${meals.snacks.map(meal => `
                        <div class="meal-item">
                            <span class="meal-name">${meal.name}</span>
                            <span class="meal-time">${meal.time}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            
            container.appendChild(dayElement);
        });
    }

    showShoppingList() {
        const container = document.getElementById('shopping-list-content');
        container.innerHTML = '';

        let totalCost = 0;

        Object.entries(this.shoppingList).forEach(([category, items]) => {
            if (Object.keys(items).length > 0) {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'shopping-category-card';
                
                let categoryTotal = 0;
                const itemsList = Object.entries(items).map(([item, details]) => {
                    categoryTotal += details.totalCost;
                    return `
                        <div class="shopping-item">
                            <span class="item-name">${item}</span>
                            <span class="item-details">
                                <span class="item-quantity">${details.quantity}</span>
                                <span class="item-price">£${details.price.toFixed(2)}/${details.unit}</span>
                                <span class="item-total">£${details.totalCost.toFixed(2)}</span>
                            </span>
                        </div>
                    `;
                }).join('');

                categoryElement.innerHTML = `
                    <div class="category-header">
                        <h3>${category}</h3>
                        <span class="category-total">£${categoryTotal.toFixed(2)}</span>
                    </div>
                    ${itemsList}
                `;
                
                container.appendChild(categoryElement);
                totalCost += categoryTotal;
            }
        });

        // Add total cost display
        const totalElement = document.createElement('div');
        totalElement.className = 'shopping-total';
        totalElement.innerHTML = `
            <div class="total-header">
                <h2>Total Estimated Cost</h2>
                <span class="total-amount">£${totalCost.toFixed(2)}</span>
            </div>
            <p class="total-note">*Prices are estimates based on average UK supermarket prices</p>
        `;
        
        container.appendChild(totalElement);
        this.showScreen('shopping-list-screen');
        this.updateMenuActiveState();
    }

    createCalendarReminders() {
        const cookingReminders = document.getElementById('cooking-reminders').checked;
        const eatingReminders = document.getElementById('eating-reminders').checked;
        const shoppingReminders = document.getElementById('shopping-reminders').checked;

        if (!cookingReminders && !eatingReminders && !shoppingReminders) {
            alert('Please select at least one type of reminder');
            return;
        }

        const breakfastTime = document.getElementById('breakfast-time').value;
        const lunchTime = document.getElementById('lunch-time').value;
        const dinnerTime = document.getElementById('dinner-time').value;

        // Get next week's dates
        const nextWeek = this.getNextWeekDates();
        
        let calendarEvents = [];

        // Add cooking reminders
        if (cookingReminders) {
            Object.keys(this.mealPlan).forEach(cookingDay => {
                const dayIndex = this.getDayIndex(cookingDay);
                const date = nextWeek[dayIndex];
                
                calendarEvents.push({
                    title: `🍳 Cooking Day - Meal Prep`,
                    description: `Time to prepare meals for the week. Check your meal plan for today's recipes.`,
                    start: new Date(`${date}T10:00:00`),
                    end: new Date(`${date}T12:00:00`),
                    location: 'Kitchen'
                });
            });
        }

        // Add eating reminders
        if (eatingReminders) {
            nextWeek.forEach((date, dayIndex) => {
                const dayName = this.getDayName(dayIndex);
                
                // Breakfast
                calendarEvents.push({
                    title: `🌅 Breakfast Time`,
                    description: `Time for breakfast! Check your meal plan for today's breakfast.`,
                    start: new Date(`${date}T${breakfastTime}:00`),
                    end: new Date(`${date}T${this.addMinutes(breakfastTime, 30)}:00`),
                    location: 'Kitchen'
                });

                // Lunch
                calendarEvents.push({
                    title: `🍽️ Lunch Time`,
                    description: `Time for lunch! Check your meal plan for today's lunch.`,
                    start: new Date(`${date}T${lunchTime}:00`),
                    end: new Date(`${date}T${this.addMinutes(lunchTime, 30)}:00`),
                    location: 'Kitchen'
                });

                // Dinner
                calendarEvents.push({
                    title: `🌙 Dinner Time`,
                    description: `Time for dinner! Check your meal plan for today's dinner.`,
                    start: new Date(`${date}T${dinnerTime}:00`),
                    end: new Date(`${date}T${this.addMinutes(dinnerTime, 60)}:00`),
                    location: 'Kitchen'
                });
            });
        }

        // Add shopping reminder
        if (shoppingReminders) {
            const shoppingDate = nextWeek[0]; // Monday
            calendarEvents.push({
                title: `🛒 Shopping Day`,
                description: `Time to buy ingredients for this week's meal plan. Check your shopping list!`,
                start: new Date(`${shoppingDate}T09:00:00`),
                end: new Date(`${shoppingDate}T10:00:00`),
                location: 'Supermarket'
            });
        }

        // Create calendar events
        this.addToCalendar(calendarEvents);
        
        alert(`✅ Created ${calendarEvents.length} calendar reminders for next week!`);
    }

    downloadICSFile() {
        const cookingReminders = document.getElementById('cooking-reminders').checked;
        const eatingReminders = document.getElementById('eating-reminders').checked;
        const shoppingReminders = document.getElementById('shopping-reminders').checked;

        if (!cookingReminders && !eatingReminders && !shoppingReminders) {
            alert('Please select at least one type of reminder');
            return;
        }

        const breakfastTime = document.getElementById('breakfast-time').value;
        const lunchTime = document.getElementById('lunch-time').value;
        const dinnerTime = document.getElementById('dinner-time').value;

        const nextWeek = this.getNextWeekDates();
        let icsContent = this.generateICSHeader();

        // Add cooking reminders
        if (cookingReminders) {
            Object.keys(this.mealPlan).forEach(cookingDay => {
                const dayIndex = this.getDayIndex(cookingDay);
                const date = nextWeek[dayIndex];
                
                icsContent += this.generateICSEvent({
                    title: '🍳 Cooking Day - Meal Prep',
                    description: 'Time to prepare meals for the week. Check your meal plan for today\'s recipes.',
                    start: new Date(`${date}T10:00:00`),
                    end: new Date(`${date}T12:00:00`),
                    location: 'Kitchen'
                });
            });
        }

        // Add eating reminders
        if (eatingReminders) {
            nextWeek.forEach((date, dayIndex) => {
                // Breakfast
                icsContent += this.generateICSEvent({
                    title: '🌅 Breakfast Time',
                    description: 'Time for breakfast! Check your meal plan for today\'s breakfast.',
                    start: new Date(`${date}T${breakfastTime}:00`),
                    end: new Date(`${date}T${this.addMinutes(breakfastTime, 30)}:00`),
                    location: 'Kitchen'
                });

                // Lunch
                icsContent += this.generateICSEvent({
                    title: '🍽️ Lunch Time',
                    description: 'Time for lunch! Check your meal plan for today\'s lunch.',
                    start: new Date(`${date}T${lunchTime}:00`),
                    end: new Date(`${date}T${this.addMinutes(lunchTime, 30)}:00`),
                    location: 'Kitchen'
                });

                // Dinner
                icsContent += this.generateICSEvent({
                    title: '🌙 Dinner Time',
                    description: 'Time for dinner! Check your meal plan for today\'s dinner.',
                    start: new Date(`${date}T${dinnerTime}:00`),
                    end: new Date(`${date}T${this.addMinutes(dinnerTime, 60)}:00`),
                    location: 'Kitchen'
                });
            });
        }

        // Add shopping reminder
        if (shoppingReminders) {
            const shoppingDate = nextWeek[0]; // Monday
            icsContent += this.generateICSEvent({
                title: '🛒 Shopping Day',
                description: 'Time to buy ingredients for this week\'s meal plan. Check your shopping list!',
                start: new Date(`${shoppingDate}T09:00:00`),
                end: new Date(`${shoppingDate}T10:00:00`),
                location: 'Supermarket'
            });
        }

        icsContent += 'END:VCALENDAR';

        // Download the file
        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'meal-plan-reminders.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('📥 ICS file downloaded! Import it into your calendar app.');
    }

    generateICSHeader() {
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Make Me A Sandwich//Meal Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;
    }

    generateICSEvent(event) {
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        return `BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
`;
    }

    getNextWeekDates() {
        const dates = [];
        const today = new Date();
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + (8 - today.getDay()) % 7);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(nextMonday);
            date.setDate(nextMonday.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        
        return dates;
    }

    getDayIndex(dayName) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return days.indexOf(dayName.toLowerCase());
    }

    getDayName(dayIndex) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        return days[dayIndex];
    }

    addMinutes(timeString, minutes) {
        const [hours, mins] = timeString.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMins = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    }

    addToCalendar(events) {
        // Try to add to Google Calendar
        if (window.gapi && window.gapi.auth) {
            // Google Calendar API integration would go here
            console.log('Google Calendar integration not implemented');
        }
        
        // For now, just log the events
        console.log('Calendar events:', events);
        
        // You could also try to open the default calendar app
        const firstEvent = events[0];
        if (firstEvent) {
            const startDate = firstEvent.start.toISOString().split('T')[0];
            const startTime = firstEvent.start.toTimeString().split(' ')[0];
            const endTime = firstEvent.end.toTimeString().split(' ')[0];
            
            // Try to open calendar with the first event
            const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(firstEvent.title)}&dates=${startDate}T${startTime.replace(/:/g, '')}Z/${startDate}T${endTime.replace(/:/g, '')}Z&details=${encodeURIComponent(firstEvent.description)}&location=${encodeURIComponent(firstEvent.location)}`;
            
            window.open(calendarUrl, '_blank');
        }
    }

    searchSupermarket() {
        const items = Object.values(this.shoppingList)
            .flatMap(category => Object.keys(category))
            .join(', ');
        
        // Open supermarket search in new tab
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(items + ' grocery delivery')}`;
        window.open(searchUrl, '_blank');
    }

    saveUserData() {
        localStorage.setItem('mealPlannerUserData', JSON.stringify(this.userData));
    }

    loadUserData() {
        const saved = localStorage.getItem('mealPlannerUserData');
        if (saved) {
            this.userData = JSON.parse(saved);
        }
    }

    // Settings and Account Management (Placeholder functions)
    handleGoogleSignIn() {
        console.log('Google sign-in clicked');
        
        // Simulate Google sign-in
        const mockUser = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SkQ8L3RleHQ+Cjwvc3ZnPgo='
        };
        
        this.userProfile = mockUser;
        this.saveUserProfile();
        this.enterMainApp();
        
        // Show success message
        setTimeout(() => {
            alert('✅ Successfully signed in with Google!');
        }, 500);
    }

    handleEmailSignIn() {
        console.log('Email sign-in clicked');
        
        const email = document.getElementById('login-email')?.value || document.getElementById('email')?.value;
        const password = document.getElementById('login-password')?.value || document.getElementById('password')?.value;
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        // Simulate email sign-in
        const mockUser = {
            name: email.split('@')[0],
            email: email,
            avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+' + email.charAt(0).toUpperCase() + 'PC90ZXh0Pgo8L3N2Zz4K'
        };
        
        this.userProfile = mockUser;
        this.saveUserProfile();
        this.enterMainApp();
        
        setTimeout(() => {
            alert('✅ Successfully signed in!');
        }, 500);
    }

    handleGuestLogin() {
        console.log('Guest login clicked');
        
        const mockUser = {
            name: 'Guest User',
            email: 'guest@makemeasandwich.app',
            avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RzwvdGV4dD4KPC9zdmc+Cg=='
        };
        
        this.userProfile = mockUser;
        this.saveUserProfile();
        this.enterMainApp();
        
        setTimeout(() => {
            alert('👋 Welcome! You can create a meal plan as a guest.');
        }, 500);
    }

    continueWithExistingPlan() {
        this.enterMainApp();
        
        // If user has existing meal plan, show it
        if (this.mealPlan && Object.keys(this.mealPlan).length > 0) {
            this.showScreen('meal-plan-screen');
            this.displayMealPlan();
        } else {
            this.showScreen('welcome-screen');
        }
    }

    startFresh() {
        // Clear existing data
        this.userData = {};
        this.mealPlan = {};
        this.shoppingList = {};
        this.saveUserData();
        
        this.enterMainApp();
        this.showScreen('questionnaire-screen');
    }

    handleLogout() {
        this.isLoggedIn = false;
        this.userProfile = null;
        this.saveUserProfile();
        
        // Hide main app and show login screen
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
        
        // Reset login screen
        this.showNewUserLogin();
    }

    enterMainApp() {
        this.isLoggedIn = true;
        
        console.log('Entering main app...');
        
        // Hide login screen and show main app
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        
        if (mainApp) {
            mainApp.style.display = 'block';
        }
        
        // Update account UI
        this.updateAccountUI();
        
        console.log('Main app should now be visible');
    }

    handleSignOut() {
        this.userProfile = null;
        this.saveUserProfile();
        this.updateAccountUI();
        
        setTimeout(() => {
            alert('👋 Successfully signed out!');
        }, 500);
    }

    handleDeleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            this.userProfile = null;
            this.userData = {};
            this.mealPlan = {};
            this.shoppingList = {};
            this.saveUserProfile();
            this.saveUserData();
            this.updateAccountUI();
            
            setTimeout(() => {
                alert('🗑️ Account deleted successfully');
            }, 500);
        }
    }

    updateAccountUI() {
        const loginSection = document.getElementById('login-section');
        const profileSection = document.getElementById('profile-section');
        
        if (this.userProfile) {
            loginSection.style.display = 'none';
            profileSection.style.display = 'block';
            
            document.getElementById('user-name').textContent = this.userProfile.name;
            document.getElementById('user-email').textContent = this.userProfile.email;
            
            // Fix old placeholder URLs
            let avatarUrl = this.userProfile.avatar;
            if (avatarUrl && avatarUrl.includes('via.placeholder.com')) {
                // Replace with a simple SVG avatar
                const initial = this.userProfile.name.charAt(0).toUpperCase();
                avatarUrl = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+${initial}PC90ZXh0Pgo8L3N2Zz4K`;
                this.userProfile.avatar = avatarUrl;
                this.saveUserProfile();
            }
            
            document.getElementById('user-avatar').src = avatarUrl;
        } else {
            loginSection.style.display = 'block';
            profileSection.style.display = 'none';
        }
    }

    saveUserProfile() {
        localStorage.setItem('mealPlannerUserProfile', JSON.stringify(this.userProfile));
    }

    loadUserProfile() {
        const saved = localStorage.getItem('mealPlannerUserProfile');
        if (saved) {
            this.userProfile = JSON.parse(saved);
            this.updateAccountUI();
        }
    }

    // Settings methods
    handleDarkModeToggle(enabled) {
        this.settings.darkMode = enabled;
        this.saveSettings();
        
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    handleNotificationsToggle(enabled) {
        this.settings.notifications = enabled;
        this.saveSettings();
        
        if (enabled) {
            // Request notification permission
            if ('Notification' in window) {
                Notification.requestPermission();
            }
        }
    }

    handleAutosaveToggle(enabled) {
        this.settings.autosave = enabled;
        this.saveSettings();
    }

    handleWeightUnitChange(unit) {
        this.settings.weightUnit = unit;
        this.saveSettings();
    }

    handleHeightUnitChange(unit) {
        this.settings.heightUnit = unit;
        this.saveSettings();
    }

    exportUserData() {
        const exportData = {
            userData: this.userData,
            mealPlan: this.mealPlan,
            shoppingList: this.shoppingList,
            settings: this.settings,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'meal-planner-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('📥 Data exported successfully!');
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.clear();
            this.userData = {};
            this.mealPlan = {};
            this.shoppingList = {};
            this.userProfile = null;
            this.settings = this.getDefaultSettings();
            
            // Reset form fields
            document.getElementById('questionnaire-form')?.reset();
            
            alert('🗑️ All data cleared successfully!');
        }
    }

    showPrivacyPolicy() {
        const policyText = `
Privacy Policy for Make Me A Sandwich

1. Data Collection
- We collect basic user information for meal planning
- All data is stored locally on your device
- No personal data is sent to external servers

2. Data Usage
- Your data is used solely for meal planning purposes
- We do not share your data with third parties
- You can export or delete your data at any time

3. Data Storage
- All data is stored in your browser's local storage
- Data persists until you clear it or delete your account
- You can export your data for backup purposes

4. Your Rights
- You can access all your data through the settings page
- You can export your data at any time
- You can delete your account and all associated data
- You can clear all data without deleting your account

5. Contact
- For privacy concerns, contact: privacy@makemeasandwich.app
        `;
        
        alert(policyText);
    }

    getDefaultSettings() {
        return {
            darkMode: false,
            notifications: true,
            autosave: true,
            weightUnit: 'kg',
            heightUnit: 'cm'
        };
    }

    saveSettings() {
        localStorage.setItem('mealPlannerSettings', JSON.stringify(this.settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('mealPlannerSettings');
        if (saved) {
            this.settings = JSON.parse(saved);
        } else {
            this.settings = this.getDefaultSettings();
        }
        
        // Apply settings to UI
        document.getElementById('dark-mode-toggle').checked = this.settings.darkMode;
        document.getElementById('notifications-toggle').checked = this.settings.notifications;
        document.getElementById('autosave-toggle').checked = this.settings.autosave;
        document.getElementById('weight-unit').value = this.settings.weightUnit;
        document.getElementById('height-unit').value = this.settings.heightUnit;
        
        // Apply dark mode if enabled
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MealPlanner();
}); 