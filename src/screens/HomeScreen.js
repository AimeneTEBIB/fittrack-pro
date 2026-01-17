import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar, FAB, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { getWorkouts } from '../services/api';
import { getNutritionData } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = '@fittrack_achievements';

export default function HomeScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [todayStats, setTodayStats] = useState({
    workouts: 0,
    calories: 0,
    duration: 0,
    goalCalories: 2200
  });
  const [achievements, setAchievements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Advanced step detection with peak detection
  const lastMagnitude = useRef(0);
  const lastPeakTime = useRef(0);
  const isGoingUp = useRef(false);

  // Load data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTodayStats();
      loadAchievements();
    }, [])
  );

  useEffect(() => {
    loadTodayStats();
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      const achievementsData = data ? JSON.parse(data) : [];
      // Get the 3 most recent achievements
      setAchievements(achievementsData.slice(0, 3));
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      // Get today's date (start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Load workouts
      const allWorkouts = await getWorkouts();
      const todayWorkouts = allWorkouts.filter(workout => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === today.getTime();
      });

      // Calculate workout stats
      const totalDuration = todayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const workoutCalories = todayWorkouts.reduce((sum, w) => sum + (w.calories || 0), 0);

      // Load nutrition data
      const nutritionData = await getNutritionData();
      const nutritionCalories = nutritionData.today?.calories || 0;
      const goalCalories = nutritionData.today?.goal?.calories || 2200;

      // Update stats
      setTodayStats({
        workouts: todayWorkouts.length,
        calories: workoutCalories,
        duration: totalDuration,
        goalCalories: goalCalories,
        nutritionCalories: nutritionCalories
      });

      console.log('Today stats loaded:', {
        workouts: todayWorkouts.length,
        calories: workoutCalories,
        duration: totalDuration
      });
    } catch (error) {
      console.error('Failed to load today stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodayStats();
    await loadAchievements();
    setRefreshing(false);
  };

  const formatAchievementDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'weight': return 'weight';
      case 'cardio': return 'run';
      case 'strength': return 'dumbbell';
      case 'flexibility': return 'yoga';
      default: return 'target';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'weight': return '#e74c3c';
      case 'cardio': return '#3498db';
      case 'strength': return '#9b59b6';
      case 'flexibility': return '#2ecc71';
      default: return '#ffd700';
    }
  };

  useEffect(() => {
    let subscription;
    
    Accelerometer.setUpdateInterval(50);

    subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const currentTime = Date.now();
      const timeSinceLastPeak = currentTime - lastPeakTime.current;
      
      const PEAK_THRESHOLD = 1.15;
      const MIN_TIME_BETWEEN_STEPS = 300;
      const MAX_TIME_BETWEEN_STEPS = 2000;
      
      if (magnitude > PEAK_THRESHOLD && magnitude > lastMagnitude.current && !isGoingUp.current) {
        isGoingUp.current = true;
      }
      
      if (magnitude < lastMagnitude.current && isGoingUp.current) {
        if (timeSinceLastPeak > MIN_TIME_BETWEEN_STEPS && timeSinceLastPeak < MAX_TIME_BETWEEN_STEPS) {
          setSteps(prevSteps => prevSteps + 1);
          lastPeakTime.current = currentTime;
        } else if (timeSinceLastPeak > MAX_TIME_BETWEEN_STEPS) {
          lastPeakTime.current = currentTime;
        }
        isGoingUp.current = false;
      }
      
      lastMagnitude.current = magnitude;
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  // Calculate calories from steps (average: 0.04 calories per step)
  const stepCalories = Math.round(steps * 0.04);
  
  // Total calories burned (workouts + steps)
  const totalCaloriesBurned = todayStats.calories + stepCalories;

  const stepProgress = steps / 10000;
  const nutritionProgress = Math.min((todayStats.nutritionCalories || 0) / todayStats.goalCalories, 1);
  
  // Net calories = Consumed - Total Burned (workouts + steps)
  const netCalories = (todayStats.nutritionCalories || 0) - totalCaloriesBurned;
  const remainingCalories = todayStats.goalCalories - (todayStats.nutritionCalories || 0);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>Welcome Back!</Title>
            <Paragraph style={styles.subtitle}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </Paragraph>
            <Paragraph style={styles.motivationText}>
              {todayStats.workouts > 0 
                ? `Great job! ${todayStats.workouts} workout${todayStats.workouts > 1 ? 's' : ''} completed today 💪`
                : "Let's crush your fitness goals today! 💪"
              }
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Step Counter Card - Using Accelerometer Sensor */}
        <Card style={[styles.card, styles.stepsCard]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="walk" size={32} color="#fff" />
              <View style={styles.stepsContent}>
                <Title style={styles.stepsTitle}>{steps.toLocaleString()}</Title>
                <Paragraph style={styles.stepsLabel}>Steps Today</Paragraph>
              </View>
            </View>
            <ProgressBar 
              progress={stepProgress} 
              color="#fff" 
              style={styles.progressBar}
            />
            <View style={styles.stepGoalRow}>
              <Paragraph style={styles.goalText}>
                Goal: 10,000 steps
              </Paragraph>
              <Paragraph style={styles.goalText}>
                {Math.round(stepProgress * 100)}%
              </Paragraph>
            </View>
            <View style={styles.stepCaloriesRow}>
              <MaterialCommunityIcons name="fire" size={16} color="#fff" />
              <Paragraph style={styles.stepCaloriesText}>
                ~{stepCalories} calories burned from walking
              </Paragraph>
            </View>
            <Paragraph style={styles.resetText}>
              💡 Walk with your phone to count steps
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Today's Workout Activity */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Title style={styles.cardTitle}>Today's Workouts</Title>
              <Button
                mode="text"
                icon="refresh"
                onPress={loadTodayStats}
                compact
              >
                Refresh
              </Button>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="dumbbell" size={28} color="#6200ee" />
                <Paragraph style={styles.statValue}>{todayStats.workouts}</Paragraph>
                <Paragraph style={styles.statLabel}>Workouts</Paragraph>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={28} color="#ff6b6b" />
                <Paragraph style={styles.statValue}>{todayStats.calories}</Paragraph>
                <Paragraph style={styles.statLabel}>From Exercise</Paragraph>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="clock-outline" size={28} color="#4ecdc4" />
                <Paragraph style={styles.statValue}>{todayStats.duration}</Paragraph>
                <Paragraph style={styles.statLabel}>Minutes</Paragraph>
              </View>
            </View>

            {todayStats.workouts === 0 && (
              <View style={styles.emptyWorkouts}>
                <Paragraph style={styles.emptyText}>
                  No workouts logged today
                </Paragraph>
                <Button
                  mode="contained"
                  icon="plus"
                  onPress={() => navigation.navigate('Workouts', { 
                    screen: 'AddWorkout' 
                  })}
                  style={styles.addWorkoutButton}
                >
                  Log Your First Workout
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Calorie Balance Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Calorie Balance Today</Title>
            
            {/* Visual Calorie Equation */}
            <View style={styles.calorieEquation}>
              <View style={styles.equationItem}>
                <View style={styles.equationIconContainer}>
                  <MaterialCommunityIcons name="food-apple" size={32} color="#4caf50" />
                </View>
                <Paragraph style={styles.equationLabel}>Consumed</Paragraph>
                <Paragraph style={styles.equationValue}>
                  {todayStats.nutritionCalories || 0}
                </Paragraph>
              </View>

              <MaterialCommunityIcons name="minus" size={24} color="#999" style={styles.operator} />

              <View style={styles.equationItem}>
                <View style={styles.equationIconContainer}>
                  <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
                </View>
                <Paragraph style={styles.equationLabel}>Burned</Paragraph>
                <Paragraph style={styles.equationValue}>
                  {totalCaloriesBurned}
                </Paragraph>
                <View style={styles.burnedBreakdown}>
                  <Paragraph style={styles.breakdownText}>
                    {todayStats.calories} exercise
                  </Paragraph>
                  <Paragraph style={styles.breakdownText}>
                    + {stepCalories} steps
                  </Paragraph>
                </View>
              </View>

              <MaterialCommunityIcons name="equal" size={24} color="#999" style={styles.operator} />

              <View style={styles.equationItem}>
                <View style={[
                  styles.equationIconContainer,
                  netCalories > todayStats.goalCalories && styles.overContainer
                ]}>
                  <MaterialCommunityIcons 
                    name="calculator" 
                    size={32} 
                    color={netCalories > todayStats.goalCalories ? "#e74c3c" : "#6200ee"} 
                  />
                </View>
                <Paragraph style={styles.equationLabel}>Net Intake</Paragraph>
                <Paragraph style={[
                  styles.equationValue,
                  netCalories > todayStats.goalCalories && styles.overCalories
                ]}>
                  {netCalories}
                </Paragraph>
              </View>
            </View>

            {/* Goal Progress */}
            <View style={styles.goalSection}>
              <View style={styles.goalHeader}>
                <Paragraph style={styles.goalLabel}>Daily Goal</Paragraph>
                <Paragraph style={styles.goalValue}>{todayStats.goalCalories} kcal</Paragraph>
              </View>
              <ProgressBar 
                progress={nutritionProgress} 
                color={nutritionProgress > 1 ? '#e74c3c' : '#6200ee'} 
                style={styles.progressBar}
              />
              <Paragraph style={[
                styles.remainingText,
                remainingCalories < 0 && styles.overCalories
              ]}>
                {remainingCalories >= 0 
                  ? `${remainingCalories} kcal remaining to consume`
                  : `${Math.abs(remainingCalories)} kcal over goal`
                }
              </Paragraph>
            </View>

            <Button
              mode="outlined"
              icon="food-apple"
              onPress={() => navigation.navigate('Nutrition')}
              style={styles.nutritionButton}
            >
              Manage Nutrition
            </Button>
          </Card.Content>
        </Card>

        {/* Recent Achievements - REAL DATA FROM GOALS */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.achievementsHeader}>
              <Title style={styles.cardTitle}>Recent Achievements 🏆</Title>
              <Button
                mode="text"
                onPress={() => navigation.navigate('Goals')}
                compact
              >
                View All
              </Button>
            </View>

            {achievements.length === 0 ? (
              <View style={styles.emptyAchievements}>
                <MaterialCommunityIcons name="trophy-outline" size={48} color="#ddd" />
                <Paragraph style={styles.emptyAchievementsText}>
                  Complete goals to earn achievements!
                </Paragraph>
                <Button
                  mode="outlined"
                  icon="target"
                  onPress={() => navigation.navigate('Goals')}
                  style={styles.goalsButton}
                  compact
                >
                  Set Your First Goal
                </Button>
              </View>
            ) : (
              <>
                {achievements.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <View style={styles.achievementIcon}>
                      <MaterialCommunityIcons 
                        name={getCategoryIcon(achievement.category)} 
                        size={24} 
                        color={getCategoryColor(achievement.category)}
                      />
                    </View>
                    <View style={styles.achievementContent}>
                      <Paragraph style={styles.achievementTitle}>
                        {achievement.title}
                      </Paragraph>
                      <View style={styles.achievementDetails}>
                        <Chip 
                          icon="check-circle" 
                          style={styles.achievementChip}
                          textStyle={styles.achievementChipText}
                        >
                          {achievement.achievedProgress} {achievement.unit}
                        </Chip>
                        <Paragraph style={styles.achievementDate}>
                          {formatAchievementDate(achievement.completedAt)}
                        </Paragraph>
                      </View>
                    </View>
                    <MaterialCommunityIcons 
                      name="trophy" 
                      size={28} 
                      color="#ffd700"
                    />
                  </View>
                ))}
                {achievements.length > 0 && (
                  <Button
                    mode="text"
                    icon="arrow-right"
                    onPress={() => navigation.navigate('Goals')}
                    style={styles.viewAllButton}
                  >
                    View All Achievements
                  </Button>
                )}
              </>
            )}
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                icon="plus"
                onPress={() => navigation.navigate('Workouts', { 
                  screen: 'AddWorkout' 
                })}
                style={styles.actionButton}
              >
                New Workout
              </Button>
              <Button
                mode="outlined"
                icon="food-apple"
                onPress={() => navigation.navigate('Nutrition')}
                style={styles.actionButton}
              >
                Log Meal
              </Button>
            </View>
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                icon="target"
                onPress={() => navigation.navigate('Goals')}
                style={styles.actionButton}
              >
                View Goals
              </Button>
              <Button
                mode="outlined"
                icon="chart-line"
                onPress={() => navigation.navigate('Progress')}
                style={styles.actionButton}
              >
                Progress
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Weekly Summary */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>This Week 📊</Title>
            <View style={styles.weeklyStats}>
              <View style={styles.weeklyStat}>
                <MaterialCommunityIcons name="dumbbell" size={24} color="#6200ee" />
                <Paragraph style={styles.weeklyValue}>
                  {todayStats.workouts * 3}
                </Paragraph>
                <Paragraph style={styles.weeklyLabel}>Workouts</Paragraph>
              </View>
              <View style={styles.weeklyStat}>
                <MaterialCommunityIcons name="fire" size={24} color="#ff6b6b" />
                <Paragraph style={styles.weeklyValue}>
                  {totalCaloriesBurned * 3}
                </Paragraph>
                <Paragraph style={styles.weeklyLabel}>Calories</Paragraph>
              </View>
              <View style={styles.weeklyStat}>
                <MaterialCommunityIcons name="walk" size={24} color="#4ecdc4" />
                <Paragraph style={styles.weeklyValue}>
                  {steps * 3}
                </Paragraph>
                <Paragraph style={styles.weeklyLabel}>Steps</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Workout"
        onPress={() => navigation.navigate('Workouts', { 
          screen: 'AddWorkout' 
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  motivationText: {
    fontSize: 15,
    color: '#333',
    marginTop: 10,
    fontStyle: 'italic',
  },
  stepsCard: {
    backgroundColor: '#6200ee',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepsContent: {
    marginLeft: 15,
  },
  stepsTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepsLabel: {
    color: '#fff',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 10,
  },
  stepGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepCaloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  stepCaloriesText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 5,
  },
  goalText: {
    color: '#fff',
    fontSize: 12,
  },
  resetText: {
    color: '#fff',
    fontSize: 11,
    marginTop: 5,
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  emptyWorkouts: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginTop: 10,
  },
  emptyText: {
    color: '#666',
    marginBottom: 10,
  },
  addWorkoutButton: {
    marginTop: 10,
  },
  calorieEquation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 20,
  },
  equationItem: {
    alignItems: 'center',
    flex: 1,
  },
  equationIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
  },
  overContainer: {
    backgroundColor: '#fee',
  },
  equationLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  equationValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  burnedBreakdown: {
    marginTop: 4,
  },
  breakdownText: {
    fontSize: 9,
    color: '#999',
    textAlign: 'center',
  },
  operator: {
    marginHorizontal: 8,
  },
  overCalories: {
    color: '#e74c3c',
  },
  goalSection: {
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  remainingText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  nutritionButton: {
    marginTop: 5,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyAchievements: {
    alignItems: 'center',
    padding: 30,
  },
  emptyAchievementsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 15,
    marginBottom: 15,
  },
  goalsButton: {
    marginTop: 5,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  achievementDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementChip: {
    backgroundColor: '#4caf50',
    height: 24,
    marginRight: 8,
  },
  achievementChipText: {
    fontSize: 11,
    color: '#fff',
  },
  achievementDate: {
    fontSize: 11,
    color: '#999',
  },
  viewAllButton: {
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  weeklyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  weeklyStat: {
    alignItems: 'center',
  },
  weeklyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  weeklyLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});