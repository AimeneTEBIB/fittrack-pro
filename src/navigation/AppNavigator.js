import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutsScreen from '../screens/WorkoutsScreen';
import AddWorkoutScreen from '../screens/AddWorkoutScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import NutritionScreen from '../screens/NutritionScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Workout Stack Navigator
function WorkoutStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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

// Goals Stack Navigator
function GoalsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
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

// Main Tab Navigator
function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'dumbbell' : 'dumbbell';
          } else if (route.name === 'Nutrition') {
            iconName = focused ? 'food-apple' : 'food-apple-outline';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'target' : 'target';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#6200ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen 
        name="Goals" 
        component={GoalsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default AppNavigator;