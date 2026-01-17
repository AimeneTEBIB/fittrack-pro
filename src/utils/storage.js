import AsyncStorage from '@react-native-async-storage/async-storage';



/**
 * Store any data (will be converted to JSON)
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 * @returns {Promise<boolean>} - Success status
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(` Data saved: ${key}`);
    return true;
  } catch (error) {
    console.error(` Error storing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Retrieve data from storage
 * @param {string} key - Storage key
 * @returns {Promise<any|null>} - Retrieved data or null
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    console.log(` Data retrieved: ${key}`, data ? '(exists)' : '(not found)');
    return data;
  } catch (error) {
    console.error(` Error retrieving data for key "${key}":`, error);
    return null;
  }
};

/**
 * Remove specific data from storage
 * @param {string} key - Storage key
 * @returns {Promise<boolean>} - Success status
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(` Data removed: ${key}`);
    return true;
  } catch (error) {
    console.error(` Error removing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Clear all data from storage
 * @returns {Promise<boolean>} - Success status
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    console.log(' All data cleared from storage');
    return true;
  } catch (error) {
    console.error(' Error clearing storage:', error);
    return false;
  }
};

/**
 * Get all keys in storage
 * @returns {Promise<string[]>} - Array of all keys
 */
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('All keys retrieved:', keys);
    return keys;
  } catch (error) {
    console.error(' Error getting all keys:', error);
    return [];
  }
};

// Storage keys constants (helps avoid typos)
export const STORAGE_KEYS = {
  PROFILE_IMAGE: 'profileImage',
  USER_PROFILE: 'userProfile',
  WORKOUTS: 'workouts',
  GOALS: 'goals',
  NUTRITION: 'nutrition',
  MEALS: 'meals',
};

export default {
  storeData,
  getData,
  removeData,
  clearAll,
  getAllKeys,
  STORAGE_KEYS,
};