# FitTrack Pro - Technical Documentation

## Table of Contents
1. Project Overview
2. Architecture
3. Screen Details
4. API Implementation
5. Navigation Structure
6. Sensor Integration
7. Data Persistence
8. Styling and Theming
9. Testing
10. Deployment

## Project Overview

FitTrack Pro is a comprehensive fitness tracking mobile application built with React Native and Expo. The application provides workout tracking, nutrition monitoring, goal setting, and progress visualization capabilities. It demonstrates full-stack mobile development including API integration, sensor usage, data persistence, and cross-platform compatibility.

### Technology Stack
- React Native 0.81.5
- Expo SDK 54
- React Navigation 6.x
- React Native Paper 5.12.3
- AsyncStorage 2.2.0
- Expo Camera 17.0.10
- Expo Sensors 15.0.8

### Project Requirements
This application was developed to meet specific academic requirements including 8 screens, 3 API methods (GET, POST, PUT), 2 navigation types (Stack and Tab), React Native Paper UI framework, and 2 device sensors (Camera and Accelerometer).

## Architecture

### Application Structure
The application follows a component-based architecture with clear separation of concerns:

```
fittrack-pro/
├── App.js                          # Application entry point
├── src/
│   ├── navigation/                 # Navigation configuration
│   │   └── AppNavigator.js        # Stack and Tab navigators
│   ├── screens/                    # Screen components
│   │   ├── HomeScreen.js          # Dashboard with accelerometer
│   │   ├── WorkoutsScreen.js      # Workout list (GET)
│   │   ├── AddWorkoutScreen.js    # Create workout (POST)
│   │   ├── WorkoutDetailScreen.js # Edit workout (PUT)
│   │   ├── NutritionScreen.js     # Nutrition tracking
│   │   ├── GoalsScreen.js         # Goal management
│   │   ├── ProgressScreen.js      # Progress visualization
│   │   └── ProfileScreen.js       # Profile with camera
│   ├── services/                   # Business logic
│   │   └── api.js                 # API methods and data management
│   └── utils/                      # Utility functions
│       └── storage.js             # AsyncStorage helpers
```

### Design Patterns
- Component-based architecture
- Hooks for state management (useState, useEffect)
- Functional components throughout
- Centralized API service
- Utility functions for common operations

## Screen Details

### HomeScreen
Purpose: Main dashboard displaying activity summary and step counter

Features:
- Real-time step counter using accelerometer
- Daily activity summary cards
- Quick navigation to other sections
- Progress visualization

Implementation:
- Uses expo-sensors for accelerometer data
- Processes movement data to detect steps
- Updates UI in real-time
- Displays statistics cards using React Native Paper

Key Components:
- Card components for statistics
- ProgressBar for daily goals
- MaterialCommunityIcons for visual elements
- Accelerometer subscription management

### WorkoutsScreen
Purpose: Display list of all workouts with summary information

Features:
- Workout list with pull-to-refresh
- Summary statistics card
- Navigation to workout details
- Floating action button for new workouts
- GET API integration

Implementation:
- Fetches workouts using getWorkouts() from API service
- useEffect hook loads data on mount and focus
- RefreshControl for pull-to-refresh functionality
- Navigation to AddWorkout and WorkoutDetail screens

Data Display:
- Workout title and completion status
- Date, duration, and calories
- Exercise count
- Edit and delete actions

### AddWorkoutScreen
Purpose: Create new workout entries

Features:
- Workout information form
- Dynamic exercise list
- Automatic calorie calculation
- Form validation
- POST API integration

Implementation:
- Form state management with useState
- Dynamic exercise array manipulation
- Validation before submission
- createWorkout() API call
- Navigation back to workout list on success

Form Fields:
- Workout title (required)
- Duration in minutes (required)
- Exercise list with sets, reps, weight
- Automatic calorie estimation

### WorkoutDetailScreen
Purpose: View and edit existing workout details

Features:
- Detailed workout information display
- Inline editing capability
- Completion status toggle
- Exercise table
- PUT API integration

Implementation:
- Route parameters for workout data
- Edit mode state management
- updateWorkout() API call
- DataTable for exercise display
- TextInput components for editing

Edit Capabilities:
- Update workout title
- Modify duration and calories
- Edit exercise details
- Toggle completion status

### NutritionScreen
Purpose: Track daily nutrition and water intake

Features:
- Calorie tracking with goals
- Macronutrient breakdown (protein, carbs, fats)
- Water intake monitoring
- Meal logging
- Water goal completion alerts

Implementation:
- getNutritionData() and updateNutritionData() from API
- Progress bars for each macro
- Modal for adding meals
- Alert system for water goals
- Real-time progress updates

Special Features:
- Water goal alert with reset option
- Meal time tracking
- Remaining calorie display
- Visual macro breakdown

### GoalsScreen
Purpose: Set and manage fitness goals

Features:
- Goal creation form
- Goal category selection
- Progress tracking
- Deadline management
- Goal list display

Implementation:
- getGoals() and createGoal() API methods
- Goal category icons and colors
- Progress calculation
- Navigation to progress details
- Alert.prompt for progress updates

Goal Types:
- Weight loss/gain
- Cardio performance
- Strength training
- Flexibility improvement

### ProgressScreen
Purpose: Detailed progress visualization for specific goals

Features:
- Progress overview with percentage
- Weekly progress chart
- Milestone tracking
- Statistics summary
- Motivational messages

Implementation:
- Route parameters for goal data
- Progress calculation
- Bar chart visualization
- Milestone completion status
- Dynamic motivational content

Visualizations:
- Current vs target comparison
- Weekly progress bars
- Milestone checkpoints
- Days remaining countdown

### ProfileScreen
Purpose: User profile management with camera integration

Features:
- Profile photo capture
- Personal information editing
- Body measurements
- Settings access
- Camera sensor integration
- AsyncStorage persistence

Implementation:
- expo-camera for photo capture
- expo-image-picker for gallery selection
- AsyncStorage for data persistence
- Permission handling
- Modal for profile editing

Data Persistence:
- Profile image saved to AsyncStorage
- User profile data (name, age, height, weight, goal)
- Data loads on component mount
- Updates persist across app sessions

## API Implementation

### Service Architecture
Location: src/services/api.js

The API service provides a centralized location for all data operations. It uses a hybrid approach combining JSONPlaceholder for simulated external API calls and AsyncStorage for local data persistence.

### Storage Keys
```javascript
const WORKOUTS_KEY = '@fittrack_workouts';
const GOALS_KEY = '@fittrack_goals';
const NUTRITION_KEY = '@fittrack_nutrition';
```

### GET Method Implementation

```javascript
export const getWorkouts = async () => {
  try {
    // Attempt to load from AsyncStorage
    const localData = await AsyncStorage.getItem(WORKOUTS_KEY);
    
    if (localData) {
      return JSON.parse(localData);
    }
    
    // If no local data, return sample workouts
    const sampleWorkouts = [...];
    
    // Save sample data for future use
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(sampleWorkouts));
    return sampleWorkouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};
```

Purpose: Retrieve workout data from local storage
Usage: WorkoutsScreen component
Returns: Array of workout objects

### POST Method Implementation

```javascript
export const createWorkout = async (workoutData) => {
  try {
    // Simulate external API call
    const response = await axios.post(`${API_BASE_URL}/posts`, {
      title: workoutData.title,
      body: JSON.stringify(workoutData),
      userId: 1
    });
    
    // Create local workout object
    const newWorkout = {
      id: Date.now(),
      ...workoutData,
      date: new Date().toISOString(),
      completed: false
    };
    
    // Add to existing workouts
    const existingWorkouts = await getWorkouts();
    const updatedWorkouts = [...existingWorkouts, newWorkout];
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    
    return newWorkout;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};
```

Purpose: Create new workout entry
Usage: AddWorkoutScreen component
Returns: Newly created workout object

### PUT Method Implementation

```javascript
export const updateWorkout = async (workoutId, updatedData) => {
  try {
    // Simulate external API call
    await axios.put(`${API_BASE_URL}/posts/${workoutId}`, {
      title: updatedData.title,
      body: JSON.stringify(updatedData),
      userId: 1
    });
    
    // Update in local storage
    const existingWorkouts = await getWorkouts();
    const updatedWorkouts = existingWorkouts.map(workout =>
      workout.id === workoutId ? { ...workout, ...updatedData } : workout
    );
    
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    
    return updatedWorkouts.find(w => w.id === workoutId);
  } catch (error) {
    console.error('Error updating workout:', error);
    throw error;
  }
};
```

Purpose: Update existing workout data
Usage: WorkoutDetailScreen component
Returns: Updated workout object

### Error Handling
All API methods include try-catch blocks for error handling. Errors are logged to console and thrown to allow components to handle them appropriately with user feedback.

## Navigation Structure

### Navigator Configuration
Location: src/navigation/AppNavigator.js

The application uses React Navigation 6.x with both Stack and Tab navigation patterns.

### Stack Navigators

#### Workout Stack
```javascript
function WorkoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen 
        name="WorkoutsList" 
        component={WorkoutsScreen}
        options={{ title: 'My Workouts' }}
      />
      <Stack.Screen 
        name="AddWorkout" 
        component={AddWorkoutScreen}
        options={{ title: 'Add Workout' }}
      />
      <Stack.Screen 
        name="WorkoutDetail" 
        component={WorkoutDetailScreen}
        options={{ title: 'Workout Details' }}
      />
    </Stack.Navigator>
  );
}
```

Purpose: Manage workout-related screen flow
Screens: WorkoutsList → AddWorkout, WorkoutsList → WorkoutDetail

#### Goals Stack
```javascript
function GoalsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' }
      }}
    >
      <Stack.Screen 
        name="GoalsList" 
        component={GoalsScreen}
        options={{ title: 'My Goals' }}
      />
      <Stack.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress Tracking' }}
      />
    </Stack.Navigator>
  );
}
```

Purpose: Manage goal-related screen flow
Screens: GoalsList → Progress

### Tab Navigator

```javascript
function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          // Icon selection logic
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff'
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutStack} options={{ headerShown: false }} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Goals" component={GoalsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

Purpose: Main application navigation
Tabs: Home, Workouts (Stack), Nutrition, Goals (Stack), Profile

### Navigation Patterns
- Tab navigation for main sections
- Stack navigation for drill-down flows
- Nested navigators for complex flows
- Consistent header styling
- Custom tab bar icons

## Sensor Integration

### Camera Sensor

Package: expo-camera
Implementation: ProfileScreen component

#### Permission Handling
```javascript
const [permission, requestPermission] = useCameraPermissions();

// Check and request permission
if (!permission) {
  const { granted } = await requestPermission();
  if (granted) {
    setShowCamera(true);
  } else {
    Alert.alert('Permission Required', 'Camera permission is required');
  }
}
```

#### Photo Capture
```javascript
const takePhoto = async () => {
  if (cameraRef && permission?.granted) {
    try {
      const photo = await cameraRef.takePictureAsync();
      setProfileImage(photo.uri);
      
      // Save to AsyncStorage
      await storeData('profileImage', photo.uri);
      
      setShowCamera(false);
      Alert.alert('Success', 'Profile photo updated and saved!');
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  }
};
```

Features:
- Permission request and handling
- Front camera mode
- Photo capture
- Image preview
- AsyncStorage persistence
- Alternative image picker option

### Accelerometer Sensor

Package: expo-sensors
Implementation: HomeScreen component

#### Sensor Setup
```javascript
const [steps, setSteps] = useState(0);
const [subscription, setSubscription] = useState(null);

useEffect(() => {
  // Subscribe to accelerometer
  const sub = Accelerometer.addListener(accelerometerData => {
    const { x, y, z } = accelerometerData;
    // Step detection logic
  });
  
  setSubscription(sub);
  
  // Cleanup
  return () => sub && sub.remove();
}, []);
```

#### Step Detection
Movement is analyzed to detect steps based on acceleration changes. A threshold is used to filter out minor movements and count only significant steps.

Features:
- Real-time movement detection
- Step counting algorithm
- Progress visualization
- Automatic cleanup
- Works on physical devices

## Data Persistence

### AsyncStorage Implementation

Location: src/utils/storage.js

#### Storage Utility Functions

```javascript
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`✅ Data saved: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error storing data for key "${key}":`, error);
    return false;
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log(`✅ Data retrieved: ${key}`, data ? '(exists)' : '(not found)');
    return data;
  } catch (error) {
    console.error(`❌ Error retrieving data for key "${key}":`, error);
    return null;
  }
};
```

#### Storage Keys
```javascript
export const STORAGE_KEYS = {
  PROFILE_IMAGE: 'profileImage',
  USER_PROFILE: 'userProfile',
  WORKOUTS: 'workouts',
  GOALS: 'goals',
  NUTRITION: 'nutrition',
  MEALS: 'meals',
};
```

### Data That Persists
- User profile information
- Profile photos
- Workout history
- Goal progress
- Nutrition logs
- Meal entries

### Implementation Examples

#### Profile Data Persistence
```javascript
// Save profile data
const handleSaveProfile = async () => {
  try {
    await storeData('userProfile', userProfile);
    Alert.alert('Success', 'Profile updated and saved successfully!');
  } catch (error) {
    Alert.alert('Error', 'Failed to save profile');
  }
};

// Load profile data
useEffect(() => {
  const loadSavedData = async () => {
    const savedProfile = await getData('userProfile');
    if (savedProfile) {
      setUserProfile(savedProfile);
    }
  };
  loadSavedData();
}, []);
```

## Styling and Theming

### Theme Configuration
Primary Color: #6200ee (Purple)
UI Framework: React Native Paper
Design System: Material Design

### Consistent Styling Patterns
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  // Additional styles
});
```

### Component Styling
All screens use consistent:
- Card components for content sections
- Elevation for depth
- Consistent spacing (10px margins)
- Purple accent color
- Material icons throughout

## Testing

### Testing Approach
The application was tested using:
- Physical devices with Expo Go
- Android phone for sensor testing
- iOS device verification
- Manual testing of all features

### Test Scenarios
1. Navigation: Verified all navigation flows work correctly
2. API Operations: Tested GET, POST, PUT methods
3. Sensors: Tested camera and accelerometer on device
4. Data Persistence: Verified data survives app restart
5. Forms: Tested validation and submission
6. UI: Verified layouts on different screen sizes

### Known Limitations
- Accelerometer works best on physical devices
- Camera requires physical device
- Some features require specific permissions

## Deployment

### Build Configuration
The application uses Expo for deployment which simplifies the build process for both platforms.

### iOS Deployment
```bash
expo build:ios
```
Requirements: Apple Developer account

### Android Deployment
```bash
expo build:android
```
Requirements: Google Play Developer account

### Development Build
```bash
npm start
```
For testing with Expo Go during development

## Conclusion

FitTrack Pro demonstrates comprehensive mobile application development including navigation, API integration, sensor usage, data persistence, and cross-platform compatibility. The application successfully meets all academic requirements while providing a functional and user-friendly fitness tracking experience.

## Author

Aimene TEBIB
aymentebib44@gmail.com

## Last Updated

January 2026
