import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar,
  Button,
  TextInput,
  Portal,
  Modal,
  IconButton,
  Chip,
  Divider
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNutritionData, updateNutritionData } from '../services/api';

export default function NutritionScreen() {
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    loadNutritionData();
  }, []);

  const loadNutritionData = async () => {
    try {
      const data = await getNutritionData();
      setNutritionData(data);
    } catch (error) {
      console.error('Failed to load nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWater = async () => {
    if (!nutritionData) return;

    const currentWater = nutritionData.today.water;
    const goalWater = nutritionData.today.goal.water;

    // Check if goal is reached
    if (currentWater >= goalWater) {
      Alert.alert(
        '🎉 Water Goal Reached!',
        `Congratulations! You've reached your daily water goal of ${goalWater} glasses.`,
        [
          {
            text: 'Reset to 0',
            onPress: async () => {
              const updatedData = {
                ...nutritionData,
                today: {
                  ...nutritionData.today,
                  water: 0
                }
              };
              await updateNutritionData(updatedData);
              setNutritionData(updatedData);
            }
          },
          {
            text: 'Continue Adding',
            onPress: async () => {
              const updatedData = {
                ...nutritionData,
                today: {
                  ...nutritionData.today,
                  water: currentWater + 1
                }
              };
              await updateNutritionData(updatedData);
              setNutritionData(updatedData);
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } else {
      // Normal add water
      const updatedData = {
        ...nutritionData,
        today: {
          ...nutritionData.today,
          water: currentWater + 1
        }
      };

      await updateNutritionData(updatedData);
      setNutritionData(updatedData);

      // Show encouragement when close to goal
      if (currentWater + 1 === goalWater) {
        Alert.alert(
          '🎉 Great Job!',
          `You've reached your water goal for today! Keep up the good work!`
        );
      }
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name || !newMeal.calories) {
      Alert.alert('Missing Information', 'Please enter at least a meal name and calories.');
      return;
    }

    const meal = {
      id: Date.now(),
      name: newMeal.name,
      calories: parseInt(newMeal.calories),
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fats: parseInt(newMeal.fats) || 0,
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    const updatedData = {
      ...nutritionData,
      today: {
        ...nutritionData.today,
        calories: nutritionData.today.calories + meal.calories,
        protein: nutritionData.today.protein + meal.protein,
        carbs: nutritionData.today.carbs + meal.carbs,
        fats: nutritionData.today.fats + meal.fats
      },
      meals: [...nutritionData.meals, meal]
    };

    await updateNutritionData(updatedData);
    setNutritionData(updatedData);
    setModalVisible(false);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fats: '' });
    
    Alert.alert('Success', 'Meal added successfully!');
  };

  const handleDeleteMeal = (mealId) => {
    const mealToDelete = nutritionData.meals.find(m => m.id === mealId);
    
    Alert.alert(
      'Delete Meal',
      `Are you sure you want to delete "${mealToDelete.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedMeals = nutritionData.meals.filter(m => m.id !== mealId);
            
            const updatedData = {
              ...nutritionData,
              today: {
                ...nutritionData.today,
                calories: nutritionData.today.calories - mealToDelete.calories,
                protein: nutritionData.today.protein - mealToDelete.protein,
                carbs: nutritionData.today.carbs - mealToDelete.carbs,
                fats: nutritionData.today.fats - mealToDelete.fats
              },
              meals: updatedMeals
            };

            await updateNutritionData(updatedData);
            setNutritionData(updatedData);
          }
        }
      ]
    );
  };

  const handleResetDay = () => {
    Alert.alert(
      'Reset Today\'s Data',
      'This will clear all meals and reset your daily nutrition. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const updatedData = {
              ...nutritionData,
              today: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fats: 0,
                water: 0,
                goal: nutritionData.today.goal // Keep the goals
              },
              meals: []
            };

            await updateNutritionData(updatedData);
            setNutritionData(updatedData);
            Alert.alert('Success', 'Daily data has been reset!');
          }
        }
      ]
    );
  };

  if (loading || !nutritionData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Paragraph>Loading nutrition data...</Paragraph>
      </View>
    );
  }

  const { today, meals } = nutritionData;
  const calorieProgress = Math.min(today.calories / today.goal.calories, 1);
  const proteinProgress = Math.min(today.protein / today.goal.protein, 1);
  const carbsProgress = Math.min(today.carbs / today.goal.carbs, 1);
  const fatsProgress = Math.min(today.fats / today.goal.fats, 1);
  const waterProgress = Math.min(today.water / today.goal.water, 1);

  const caloriesRemaining = Math.max(today.goal.calories - today.calories, 0);
  const isOverCalories = today.calories > today.goal.calories;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header with Date and Reset */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <View>
                <Title style={styles.dateTitle}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Title>
                <Paragraph style={styles.subtitle}>Track your daily nutrition</Paragraph>
              </View>
              <Button
                mode="outlined"
                icon="refresh"
                onPress={handleResetDay}
                compact
                textColor="#e74c3c"
                style={styles.resetButton}
              >
                Reset Day
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Daily Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Daily Summary</Title>
            
            {/* Calories */}
            <View style={styles.macroSection}>
              <View style={styles.macroHeader}>
                <Paragraph style={styles.macroLabel}>Calories</Paragraph>
                <Paragraph style={[
                  styles.macroValue,
                  isOverCalories && styles.overGoalText
                ]}>
                  {today.calories} / {today.goal.calories} kcal
                </Paragraph>
              </View>
              <ProgressBar 
                progress={calorieProgress} 
                color={isOverCalories ? '#e74c3c' : '#6200ee'} 
                style={styles.progressBar}
              />
              <Paragraph style={[
                styles.remaining,
                isOverCalories && styles.overGoalText
              ]}>
                {isOverCalories 
                  ? `${today.calories - today.goal.calories} kcal over goal` 
                  : `${caloriesRemaining} kcal remaining`
                }
              </Paragraph>
            </View>

            <Divider style={styles.divider} />

            {/* Macronutrients */}
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="food-steak" size={28} color="#e74c3c" />
                <Paragraph style={styles.macroItemValue}>{today.protein}g</Paragraph>
                <Paragraph style={styles.macroItemLabel}>Protein</Paragraph>
                <Paragraph style={styles.macroGoal}>Goal: {today.goal.protein}g</Paragraph>
                <ProgressBar 
                  progress={proteinProgress} 
                  color="#e74c3c" 
                  style={styles.smallProgress}
                />
              </View>

              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="bread-slice" size={28} color="#f39c12" />
                <Paragraph style={styles.macroItemValue}>{today.carbs}g</Paragraph>
                <Paragraph style={styles.macroItemLabel}>Carbs</Paragraph>
                <Paragraph style={styles.macroGoal}>Goal: {today.goal.carbs}g</Paragraph>
                <ProgressBar 
                  progress={carbsProgress} 
                  color="#f39c12" 
                  style={styles.smallProgress}
                />
              </View>

              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="food-drumstick" size={28} color="#3498db" />
                <Paragraph style={styles.macroItemValue}>{today.fats}g</Paragraph>
                <Paragraph style={styles.macroItemLabel}>Fats</Paragraph>
                <Paragraph style={styles.macroGoal}>Goal: {today.goal.fats}g</Paragraph>
                <ProgressBar 
                  progress={fatsProgress} 
                  color="#3498db" 
                  style={styles.smallProgress}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Water Intake */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.waterHeader}>
              <Title style={styles.cardTitle}>💧 Water Intake</Title>
              <Button
                mode="contained"
                icon="water"
                onPress={handleAddWater}
                compact
                style={styles.waterButton}
              >
                +1 Glass
              </Button>
            </View>
            
            <View style={styles.waterInfo}>
              <MaterialCommunityIcons 
                name="cup-water" 
                size={52} 
                color={waterProgress >= 1 ? '#27ae60' : '#3498db'} 
              />
              <View style={styles.waterStats}>
                <Paragraph style={styles.waterValue}>
                  {today.water} / {today.goal.water} glasses
                </Paragraph>
                <ProgressBar 
                  progress={waterProgress} 
                  color={waterProgress >= 1 ? '#27ae60' : '#3498db'} 
                  style={styles.progressBar}
                />
                {waterProgress >= 1 && (
                  <Chip 
                    icon="check-circle" 
                    style={styles.goalReachedChip}
                    textStyle={styles.chipText}
                  >
                    Goal Reached!
                  </Chip>
                )}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Meals */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.mealsHeader}>
              <Title style={styles.cardTitle}>
                🍽️ Today's Meals ({meals.length})
              </Title>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => setModalVisible(true)}
                compact
              >
                Add Meal
              </Button>
            </View>

            {meals.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons 
                  name="food-off" 
                  size={48} 
                  color="#ccc" 
                />
                <Paragraph style={styles.emptyText}>
                  No meals logged yet
                </Paragraph>
                <Paragraph style={styles.emptySubtext}>
                  Tap "Add Meal" to start tracking
                </Paragraph>
              </View>
            ) : (
              meals.map((meal, index) => (
                <Card key={meal.id} style={styles.mealCard}>
                  <Card.Content>
                    <View style={styles.mealHeader}>
                      <View style={styles.mealTitleContainer}>
                        <Title style={styles.mealName}>{meal.name}</Title>
                        <Paragraph style={styles.mealTime}>{meal.time}</Paragraph>
                      </View>
                      <IconButton
                        icon="delete"
                        iconColor="#e74c3c"
                        size={20}
                        onPress={() => handleDeleteMeal(meal.id)}
                      />
                    </View>
                    
                    <View style={styles.mealStats}>
                      <View style={styles.mealStat}>
                        <MaterialCommunityIcons name="fire" size={18} color="#ff6b6b" />
                        <Paragraph style={styles.mealStatText}>
                          {meal.calories} kcal
                        </Paragraph>
                      </View>
                      <View style={styles.mealStat}>
                        <MaterialCommunityIcons name="food-steak" size={18} color="#e74c3c" />
                        <Paragraph style={styles.mealStatText}>
                          {meal.protein}g
                        </Paragraph>
                      </View>
                      <View style={styles.mealStat}>
                        <MaterialCommunityIcons name="bread-slice" size={18} color="#f39c12" />
                        <Paragraph style={styles.mealStatText}>
                          {meal.carbs}g
                        </Paragraph>
                      </View>
                      <View style={styles.mealStat}>
                        <MaterialCommunityIcons name="food-drumstick" size={18} color="#3498db" />
                        <Paragraph style={styles.mealStatText}>
                          {meal.fats}g
                        </Paragraph>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Add Meal Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>🍽️ Add New Meal</Title>
          
          <TextInput
            label="Meal Name *"
            value={newMeal.name}
            onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Breakfast, Lunch, Snack"
          />

          <TextInput
            label="Calories (kcal) *"
            value={newMeal.calories}
            onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="e.g., 450"
          />

          <Paragraph style={styles.optionalLabel}>Macronutrients (optional)</Paragraph>
          <View style={styles.macroInputs}>
            <TextInput
              label="Protein (g)"
              value={newMeal.protein}
              onChangeText={(text) => setNewMeal({ ...newMeal, protein: text })}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.smallInput]}
            />
            <TextInput
              label="Carbs (g)"
              value={newMeal.carbs}
              onChangeText={(text) => setNewMeal({ ...newMeal, carbs: text })}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.smallInput]}
            />
            <TextInput
              label="Fats (g)"
              value={newMeal.fats}
              onChangeText={(text) => setNewMeal({ ...newMeal, fats: text })}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.smallInput]}
            />
          </View>

          <Button
            mode="contained"
            onPress={handleAddMeal}
            style={styles.modalButton}
            icon="check"
          >
            Add Meal
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  resetButton: {
    borderColor: '#e74c3c',
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  macroSection: {
    marginBottom: 15,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  overGoalText: {
    color: '#e74c3c',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  remaining: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  divider: {
    marginVertical: 15,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroItemValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  macroItemLabel: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
  },
  macroGoal: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  smallProgress: {
    width: 70,
    height: 6,
    borderRadius: 3,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  waterButton: {
    backgroundColor: '#3498db',
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waterStats: {
    flex: 1,
    marginLeft: 20,
  },
  waterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  goalReachedChip: {
    marginTop: 10,
    backgroundColor: '#27ae60',
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#fff',
  },
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 15,
    fontSize: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    marginTop: 5,
    fontSize: 14,
  },
  mealCard: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#6200ee',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTitleContainer: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  mealStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  mealStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealStatText: {
    fontSize: 13,
    marginLeft: 5,
    fontWeight: '500',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  optionalLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 5,
  },
  macroInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginRight: 8,
  },
  modalButton: {
    marginTop: 10,
  },
  bottomPadding: {
    height: 20,
  },
});