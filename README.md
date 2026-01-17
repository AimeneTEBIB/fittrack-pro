# FitTrack Pro - Gym & Fitness Tracking App

A comprehensive React Native mobile application for tracking workouts, nutrition, and fitness goals.

## Project Overview

This application was developed as a mobile application project demonstrating full-stack React Native development with Expo. The app includes workout tracking, nutrition monitoring, goal setting, and uses device sensors for enhanced functionality.

## Requirements Met

### Screens (8 Required)
The application includes 8 screens:
- HomeScreen - Dashboard with step counter
- WorkoutsScreen - Workout list with GET API
- AddWorkoutScreen - Create workouts with POST API
- WorkoutDetailScreen - Edit workouts with PUT API
- NutritionScreen - Track meals and calories
- GoalsScreen - Set and manage fitness goals
- ProgressScreen - View detailed progress statistics
- ProfileScreen - User profile with camera integration

### API Methods (3 Required)
- GET - Fetch workouts from storage/API
- POST - Create new workout entries
- PUT - Update existing workout data

### Navigation (2 Types)
- Stack Navigation - Used for workout and goal flows
- Bottom Tab Navigation - Main app navigation between sections

### UI Framework
- React Native Paper - Material Design components throughout the application

### Sensors (2 Required)
- Camera - Profile photo capture using expo-camera
- Accelerometer - Step counting using expo-sensors

### Repository
- Hosted on GitHub with 6 commits
- Includes comprehensive documentation

## Technology Stack

- Framework: React Native with Expo SDK 54
- Navigation: React Navigation (Stack + Bottom Tabs)
- UI Library: React Native Paper
- API: JSONPlaceholder (mock) + AsyncStorage
- State Management: React Hooks
- Sensors: expo-camera, expo-sensors
- Storage: AsyncStorage for data persistence

## Features

### Workout Tracking
The workout tracking system allows users to create, view, edit, and delete workouts. Each workout includes exercises with sets, reps, and weight tracking. The system uses GET, POST, and PUT API methods to manage workout data.

### Nutrition Management
Users can track daily calorie intake, log meals with macronutrients (protein, carbs, fats), and monitor water intake. The nutrition screen includes progress bars showing daily goals and remaining targets. Water goal completion includes an alert system with reset functionality.

### Fitness Goals
The goals system allows users to set fitness targets with deadlines. Progress is tracked and visualized with progress bars and statistics. Users can view detailed progress screens showing weekly trends and milestone completion.

### Profile Management
Users can manage their profile including personal information (name, age, height, weight, fitness goals) and capture profile photos using the device camera. All profile data persists using AsyncStorage.

### Activity Tracking
The home screen includes a step counter using the device accelerometer. Steps are tracked in real-time and displayed with progress visualization.

## Installation and Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
fittrack-pro/
├── App.js                      # Application entry point
├── package.json               # Dependencies and scripts
├── src/
│   ├── screens/              # Application screens
│   │   ├── HomeScreen.js
│   │   ├── WorkoutsScreen.js
│   │   ├── AddWorkoutScreen.js
│   │   ├── WorkoutDetailScreen.js
│   │   ├── NutritionScreen.js
│   │   ├── GoalsScreen.js
│   │   ├── ProgressScreen.js
│   │   └── ProfileScreen.js
│   ├── navigation/           # Navigation configuration
│   │   └── AppNavigator.js
│   ├── services/            # API services
│   │   └── api.js
│   └── utils/              # Utility functions
│       └── storage.js
```

## API Implementation

The application uses a hybrid approach for data management:
- JSONPlaceholder API for simulated external API calls
- AsyncStorage for local data persistence
- All workout, goal, and nutrition data persists locally

API Methods:
- getWorkouts() - Retrieves workout list
- createWorkout(data) - Creates new workout
- updateWorkout(id, data) - Updates existing workout
- Similar patterns for goals and nutrition data

## Development Timeline

### Commit 1 - December 18, 2025
Initial project setup including React Native configuration, Expo setup, and dependency installation. Configured package.json, babel.config.js, and .gitignore files.

### Commit 2 - December 28, 2025
Created the main App component and integrated React Native Paper provider. Established the foundation for the application theme and styling system.

### Commit 3 - January 2, 2026
Implemented navigation structure using both Stack and Bottom Tab navigation. Configured navigation routes and screen parameters for all application flows.

### Commit 4 - January 6, 2026
Developed core workout screens and implemented all three required API methods. Created HomeScreen with accelerometer integration, WorkoutsScreen with GET, AddWorkoutScreen with POST, and WorkoutDetailScreen with PUT operations.

### Commit 5 - January 17, 2026
Added remaining application screens including nutrition tracking, goal management, progress visualization, and profile management with camera sensor integration. Completed comprehensive project documentation.

### Commit 6 - January 17, 2026
Implemented data persistence using AsyncStorage for profile data and images. Added water goal completion alerts with reset functionality. Enhanced storage utilities with improved error handling and logging.

## Sensor Implementation

### Camera Sensor
The camera sensor is implemented in ProfileScreen using expo-camera. Users can capture profile photos which are stored using AsyncStorage and persist across app sessions. The implementation includes proper permission handling for both iOS and Android.

### Accelerometer Sensor
The accelerometer is implemented in HomeScreen for step counting. The sensor detects device movement and increments the step counter based on movement patterns. Step data is displayed with progress visualization.

## Data Persistence

AsyncStorage is used throughout the application for data persistence:
- Profile images and user data
- Workout history
- Goal progress
- Nutrition logs
- All data persists across app restarts

## Cross-Platform Compatibility

The application is fully compatible with both iOS and Android platforms using Expo. A single codebase serves both platforms with no platform-specific code required. All features work identically on both platforms.

## Testing

The application was tested on physical devices using Expo Go. All features including camera access, accelerometer functionality, data persistence, and API operations were verified working correctly.

## Author

Aimene TEBIB

## Contact

aymentebib44@gmail.com

## License

This project was created as an academic project for mobile application development coursework.