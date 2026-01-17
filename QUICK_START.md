# FitTrack Pro - Quick Start Guide

## Installation

```bash
# Clone the repository
git clone https://github.com/AimeneTEBIB/fittrack-pro.git
cd fittrack-pro

# Install dependencies
npm install
```

## Running the Application

```bash
# Start Expo development server
npm start
```

After starting, you have several options:
- Press 'a' for Android emulator
- Press 'i' for iOS simulator (Mac only)
- Scan QR code with Expo Go app on your phone

## Testing the Features

### Home Screen
The home screen displays the step counter. Shake your device or walk around to see the step count increase. The accelerometer sensor tracks movement in real-time.

### Workouts
Navigate to the Workouts tab to view sample workouts. You can add new workouts using the floating action button, edit existing workouts by tapping on them, and mark workouts as complete.

### Nutrition
The Nutrition tab allows you to log meals and track daily calorie intake. Add water intake by tapping the +1 Glass button. When you reach your daily water goal, you'll receive a completion alert.

### Goals
Set fitness goals in the Goals tab. Track your progress and view detailed statistics in the Progress screen.

### Profile
In the Profile tab, you can take a profile photo using the camera, edit your personal information, and view body measurements. All profile data persists using AsyncStorage.

## Common Issues

### Module Not Found
If you encounter module not found errors, clear the cache and reinstall:
```bash
rm -rf node_modules
npm install
npm start -- --clear
```

### Metro Bundler Error
Reset the Metro bundler:
```bash
npx expo start -c
```

### Camera Not Working
Check device permissions:
- Android: Settings > Apps > Expo Go > Permissions > Camera
- iOS: Settings > Expo Go > Camera

### Accelerometer Not Updating
The accelerometer works best on physical devices. Emulators and simulators may not accurately simulate accelerometer data.

## Project Structure

The application follows a standard React Native structure:

```
fittrack-pro/
├── App.js                   # Application entry point
├── package.json            # Dependencies
├── src/
│   ├── navigation/        # Navigation setup
│   ├── screens/          # All application screens
│   ├── services/         # API services
│   └── utils/           # Utility functions
```

## Key Files

- App.js - Main application component with React Native Paper provider
- src/navigation/AppNavigator.js - Navigation configuration
- src/services/api.js - API methods (GET, POST, PUT)
- src/utils/storage.js - AsyncStorage helpers
- src/screens/ - All application screens

## Requirements Verification

The application meets all project requirements:

8 Screens: HomeScreen, WorkoutsScreen, AddWorkoutScreen, WorkoutDetailScreen, NutritionScreen, GoalsScreen, ProgressScreen, ProfileScreen

3 API Methods: GET (fetch workouts), POST (create workout), PUT (update workout)

2 Navigation Types: Stack Navigation and Bottom Tab Navigation

UI Framework: React Native Paper throughout

2 Sensors: Camera (profile photos) and Accelerometer (step counter)

Repository: GitHub with 6 commits

## Testing Checklist

Before presenting the project, verify:

Navigation: All tabs work, screen transitions are smooth
API Operations: Create, read, and update workouts successfully
Sensors: Camera captures photos, accelerometer counts steps
Data Persistence: Profile data and images persist after closing app
Forms: Validation works, success messages appear
UI: All screens display correctly, no layout issues

## Development Notes

The application uses Expo SDK 54 for development. All dependencies are compatible with both iOS and Android platforms. Data persistence is handled through AsyncStorage, and the API implementation uses a combination of JSONPlaceholder for mock external calls and local storage for data persistence.

## Support

For issues or questions, contact aymentebib44@gmail.com