# FitTrack Pro - Gym & Fitness Tracking App

A comprehensive React Native mobile application for gym enthusiasts to track workouts, nutrition, and fitness goals.

## 📱 Project Requirements Compliance

### ✅ Mandatory Requirements
- **8+ Screens**: Home, Workouts, Add Workout, Workout Detail, Nutrition, Profile, Goals, Progress
- **API Methods**: GET (fetch workouts), POST (create workout), PUT (update workout)
- **Navigation Types**: Stack Navigation & Bottom Tab Navigation
- **UI Framework**: React Native Paper (Material Design components)
- **Sensors**: Camera (profile photos), Accelerometer (step counter)
- **Remote Repository**: GitHub ready with proper structure

## 🚀 Features

### Core Functionality
1. **Workout Tracking**
   - Create, view, edit, and delete workouts
   - Track exercises, sets, reps, and weight
   - Workout history with detailed statistics

2. **Nutrition Management**
   - Daily calorie tracking
   - Meal logging with macronutrients
   - Water intake monitoring

3. **Fitness Goals**
   - Set and track fitness goals
   - Progress visualization
   - Goal completion tracking

4. **Profile Management**
   - User profile with photo (Camera sensor)
   - Body measurements tracking
   - Settings and preferences

5. **Activity Tracking**
   - Step counter using accelerometer
   - Daily activity monitoring
   - Activity history

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **UI Library**: React Native Paper
- **API**: JSONPlaceholder + Custom Mock API
- **State Management**: React Hooks (useState, useEffect)
- **Sensors**: expo-camera, expo-sensors
- **Storage**: AsyncStorage

## 📦 Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📂 Project Structure

```
/
├── App.js                      # Main app entry point
├── package.json               # Dependencies
├── src/
│   ├── screens/              # All app screens (8+)
│   │   ├── HomeScreen.js
│   │   ├── WorkoutsScreen.js
│   │   ├── AddWorkoutScreen.js
│   │   ├── WorkoutDetailScreen.js
│   │   ├── NutritionScreen.js
│   │   ├── GoalsScreen.js
│   │   ├── ProgressScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/           # Navigation setup
│   │   └── AppNavigator.js
│   ├── services/            # API services
│   │   └── api.js
│   ├── components/          # Reusable components
│   │   ├── WorkoutCard.js
│   │   ├── StatCard.js
│   │   └── GoalItem.js
│   └── utils/              # Helper functions
│       └── storage.js
```

## 🔌 API Endpoints

The app uses a combination of JSONPlaceholder and mock API:

- **GET**: `/workouts` - Fetch all workouts
- **POST**: `/workouts` - Create new workout
- **PUT**: `/workouts/:id` - Update existing workout

## 📱 Sensors Used

1. **Camera** (expo-camera)
   - Profile photo capture
   - Exercise form documentation
   
2. **Accelerometer** (expo-sensors)
   - Step counting
   - Activity level detection
   - Movement tracking

## 🧭 Navigation Structure

### Bottom Tab Navigation
- Home
- Workouts
- Nutrition
- Profile

### Stack Navigation
- Workout Stack: Workouts List → Add Workout → Workout Detail
- Goals Stack: Goals List → Add Goal → Goal Detail

## 👥 Team Contribution Guidelines

Each team member should:
1. Create a feature branch: `feature/your-name-feature`
2. Make at least 5 meaningful commits
3. Follow commit message conventions
4. Submit pull requests for review

### Sample Commit Messages
```
feat: Add workout creation screen
fix: Resolve navigation bug in profile screen
style: Update workout card styling
docs: Add API documentation
refactor: Optimize workout list rendering
```

## 🎯 Development Roadmap

### Phase 1 - Foundation (Commits 1-5)
- [ ] Setup project structure
- [ ] Implement navigation
- [ ] Create basic screens
- [ ] Setup API services
- [ ] Integrate UI framework

### Phase 2 - Core Features (Commits 6-10)
- [ ] Workout CRUD operations
- [ ] Nutrition tracking
- [ ] Goals management
- [ ] Camera integration
- [ ] Accelerometer integration

### Phase 3 - Polish (Commits 11-15)
- [ ] Add loading states
- [ ] Error handling
- [ ] Data persistence
- [ ] UI improvements
- [ ] Testing and bug fixes

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes (at least 5 commits per person)
4. Push to the branch
5. Create a Pull Request

## 📧 Contact

For questions or support, please contact the development team.
