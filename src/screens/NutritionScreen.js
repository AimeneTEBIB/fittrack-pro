import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar,
  Button,
  TextInput,
  Portal,
  Modal
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

    const updatedData = {
      ...nutritionData,
      today: {
        ...nutritionData.today,
        water: nutritionData.today.water + 1
      }
    };

    await updateNutritionData(updatedData);
    setNutritionData(updatedData);
  };

  const handleAddMeal = async () => {
    if (!newMeal.name || !newMeal.calories) return;

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
  };

  if (loading || !nutritionData) {
    return <View style={styles.container}><Paragraph>Loading...</Paragraph></View>;
  }

  const { today, meals } = nutritionData;
  const calorieProgress = today.calories / today.goal.calories;
  const proteinProgress = today.protein / today.goal.protein;
  const carbsProgress = today.carbs / today.goal.carbs;
  const fatsProgress = today.fats / today.goal.fats;
  const waterProgress = today.water / today.goal.water;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Daily Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Today's Nutrition</Title>
            
            {/* Calories */}
            <View style={styles.macroSection}>
              <View style={styles.macroHeader}>
                <Paragraph style={styles.macroLabel}>Calories</Paragraph>
                <Paragraph style={styles.macroValue}>
                  {today.calories} / {today.goal.calories} kcal
                </Paragraph>
              </View>
              <ProgressBar 
                progress={calorieProgress} 
                color="#6200ee" 
                style={styles.progressBar}
              />
              <Paragraph style={styles.remaining}>
                {today.goal.calories - today.calories} kcal remaining
              </Paragraph>
            </View>

            {/* Macronutrients */}
            <View style={styles.macrosGrid}>
              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="food-steak" size={24} color="#e74c3c" />
                <Paragraph style={styles.macroItemValue}>{today.protein}g</Paragraph>
                <Paragraph style={styles.macroItemLabel}>Protein</Paragraph>
                <ProgressBar 
                  progress={proteinProgress} 
                  color="#e74c3c" 
                  style={styles.smallProgress}
                />
              </View>

              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="bread-slice" size={24} color="#f39c12" />
                <Paragraph style={styles.macroItemValue}>{today.carbs}g</Paragraph>
                <Paragraph style={styles.macroItemLabel}>Carbs</Paragraph>
                <ProgressBar 
                  progress={carbsProgress} 
                  color="#f39c12" 
                  style={styles.smallProgress}
                />
              </View>

              <View style={styles.macroItem}>
                <MaterialCommunityIcons name="food-drumstick" size={24} color="#3498db" />
                <Paragraph style={styles.macroItemValue}>{today.fats}g</Paragraph>
                <Paragraph style={styles.macroItemLabel}>Fats</Paragraph>
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
              <Title style={styles.cardTitle}>Water Intake</Title>
              <Button
                mode="contained"
                icon="water"
                onPress={handleAddWater}
                compact
              >
                +1 Glass
              </Button>
            </View>
            
            <View style={styles.waterInfo}>
              <MaterialCommunityIcons name="cup-water" size={48} color="#3498db" />
              <View style={styles.waterStats}>
                <Paragraph style={styles.waterValue}>
                  {today.water} / {today.goal.water} glasses
                </Paragraph>
                <ProgressBar 
                  progress={waterProgress} 
                  color="#3498db" 
                  style={styles.progressBar}
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Meals */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.mealsHeader}>
              <Title style={styles.cardTitle}>Today's Meals</Title>
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
              <Paragraph style={styles.emptyText}>No meals logged yet</Paragraph>
            ) : (
              meals.map((meal) => (
                <Card key={meal.id} style={styles.mealCard}>
                  <Card.Content>
                    <View style={styles.mealHeader}>
                      <Title style={styles.mealName}>{meal.name}</Title>
                      <Paragraph style={styles.mealTime}>{meal.time}</Paragraph>
                    </View>
                    
                    <View style={styles.mealStats}>
                      <View style={styles.mealStat}>
                        <MaterialCommunityIcons name="fire" size={16} color="#666" />
                        <Paragraph style={styles.mealStatText}>
                          {meal.calories} kcal
                        </Paragraph>
                      </View>
                      <View style={styles.mealStat}>
                        <Paragraph style={styles.mealStatText}>
                          P: {meal.protein}g
                        </Paragraph>
                      </View>
                      <View style={styles.mealStat}>
                        <Paragraph style={styles.mealStatText}>
                          C: {meal.carbs}g
                        </Paragraph>
                      </View>
                      <View style={styles.mealStat}>
                        <Paragraph style={styles.mealStatText}>
                          F: {meal.fats}g
                        </Paragraph>
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Meal Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Add Meal</Title>
          
          <TextInput
            label="Meal Name"
            value={newMeal.name}
            onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Calories (kcal)"
            value={newMeal.calories}
            onChangeText={(text) => setNewMeal({ ...newMeal, calories: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

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
  card: {
    margin: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  macroSection: {
    marginBottom: 20,
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
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  remaining: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  macrosGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  macroItemLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  smallProgress: {
    width: 60,
    height: 6,
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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
  mealsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 20,
  },
  mealCard: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
  },
  mealTime: {
    fontSize: 12,
    color: '#666',
  },
  mealStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mealStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealStatText: {
    fontSize: 12,
    marginLeft: 5,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 10,
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
});