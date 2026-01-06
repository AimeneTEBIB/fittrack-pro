import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - using JSONPlaceholder as base + local storage for gym data
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Local storage keys
const WORKOUTS_KEY = '@fittrack_workouts';
const GOALS_KEY = '@fittrack_goals';
const NUTRITION_KEY = '@fittrack_nutrition';

// API Service for Workouts

/**
 * GET - Fetch all workouts
 */
export const getWorkouts = async () => {
  try {
    // Try to get from local storage first
    const localData = await AsyncStorage.getItem(WORKOUTS_KEY);
    
    if (localData) {
      return JSON.parse(localData);
    }
    
    // If no local data, return sample workouts
    const sampleWorkouts = [
      {
        id: 1,
        title: 'Upper Body Strength',
        date: new Date().toISOString(),
        duration: 45,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 10, weight: 80 },
          { name: 'Pull-ups', sets: 3, reps: 12, weight: 0 },
          { name: 'Shoulder Press', sets: 3, reps: 10, weight: 30 }
        ],
        calories: 320,
        completed: true
      },
      {
        id: 2,
        title: 'Leg Day',
        date: new Date().toISOString(),
        duration: 60,
        exercises: [
          { name: 'Squats', sets: 5, reps: 8, weight: 100 },
          { name: 'Leg Press', sets: 4, reps: 12, weight: 150 },
          { name: 'Lunges', sets: 3, reps: 10, weight: 20 }
        ],
        calories: 450,
        completed: false
      }
    ];
    
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(sampleWorkouts));
    return sampleWorkouts;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

/**
 * POST - Create a new workout
 */
export const createWorkout = async (workoutData) => {
  try {
    // Simulate API call
    const response = await axios.post(`${API_BASE_URL}/posts`, {
      title: workoutData.title,
      body: JSON.stringify(workoutData),
      userId: 1
    });
    
    // Add to local storage
    const existingWorkouts = await getWorkouts();
    const newWorkout = {
      id: Date.now(),
      ...workoutData,
      date: new Date().toISOString(),
      completed: false
    };
    
    const updatedWorkouts = [...existingWorkouts, newWorkout];
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    
    return newWorkout;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

/**
 * PUT - Update an existing workout
 */
export const updateWorkout = async (workoutId, updatedData) => {
  try {
    // Simulate API call
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

/**
 * DELETE - Delete a workout (bonus)
 */
export const deleteWorkout = async (workoutId) => {
  try {
    const existingWorkouts = await getWorkouts();
    const updatedWorkouts = existingWorkouts.filter(w => w.id !== workoutId);
    await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(updatedWorkouts));
    return true;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

// Goals API

export const getGoals = async () => {
  try {
    const localData = await AsyncStorage.getItem(GOALS_KEY);
    
    if (localData) {
      return JSON.parse(localData);
    }
    
    const sampleGoals = [
      {
        id: 1,
        title: 'Lose 10kg',
        target: 10,
        current: 3,
        unit: 'kg',
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'weight'
      },
      {
        id: 2,
        title: 'Run 5km',
        target: 5,
        current: 2.5,
        unit: 'km',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'cardio'
      }
    ];
    
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(sampleGoals));
    return sampleGoals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const createGoal = async (goalData) => {
  try {
    const existingGoals = await getGoals();
    const newGoal = {
      id: Date.now(),
      ...goalData,
      current: 0
    };
    
    const updatedGoals = [...existingGoals, newGoal];
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
    
    return newGoal;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};

export const updateGoal = async (goalId, updatedData) => {
  try {
    const existingGoals = await getGoals();
    const updatedGoals = existingGoals.map(goal =>
      goal.id === goalId ? { ...goal, ...updatedData } : goal
    );
    
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(updatedGoals));
    return updatedGoals.find(g => g.id === goalId);
  } catch (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
};

// Nutrition API

export const getNutritionData = async () => {
  try {
    const localData = await AsyncStorage.getItem(NUTRITION_KEY);
    
    if (localData) {
      return JSON.parse(localData);
    }
    
    const sampleData = {
      today: {
        calories: 1850,
        protein: 120,
        carbs: 200,
        fats: 60,
        water: 6,
        goal: {
          calories: 2200,
          protein: 150,
          carbs: 250,
          fats: 70,
          water: 8
        }
      },
      meals: [
        {
          id: 1,
          name: 'Breakfast',
          calories: 450,
          protein: 30,
          carbs: 50,
          fats: 15,
          time: '08:00'
        },
        {
          id: 2,
          name: 'Lunch',
          calories: 650,
          protein: 45,
          carbs: 70,
          fats: 20,
          time: '13:00'
        }
      ]
    };
    
    await AsyncStorage.setItem(NUTRITION_KEY, JSON.stringify(sampleData));
    return sampleData;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

export const updateNutritionData = async (nutritionData) => {
  try {
    await AsyncStorage.setItem(NUTRITION_KEY, JSON.stringify(nutritionData));
    return nutritionData;
  } catch (error) {
    console.error('Error updating nutrition data:', error);
    throw error;
  }
};

export default {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getGoals,
  createGoal,
  updateGoal,
  getNutritionData,
  updateNutritionData
};