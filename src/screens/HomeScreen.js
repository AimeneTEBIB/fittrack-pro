import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [steps, setSteps] = useState(0);
  const [todayStats, setTodayStats] = useState({
    workouts: 2,
    calories: 850,
    duration: 105,
    goalCalories: 2200
  });

  // Advanced step detection with peak detection
  const lastMagnitude = useRef(0);
  const lastPeakTime = useRef(0);
  const isGoingUp = useRef(false);

  useEffect(() => {
    let subscription;
    
    Accelerometer.setUpdateInterval(50); // 50ms for smoother detection

    subscription = Accelerometer.addListener(accelerometerData => {
      const { x, y, z } = accelerometerData;
      
      // Calculate total acceleration magnitude
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      // Peak detection algorithm
      const currentTime = Date.now();
      const timeSinceLastPeak = currentTime - lastPeakTime.current;
      
      // Configuration
      const PEAK_THRESHOLD = 1.15; // Minimum acceleration to be considered a peak
      const VALLEY_THRESHOLD = 0.95; // Maximum acceleration for a valley
      const MIN_TIME_BETWEEN_STEPS = 300; // Minimum 300ms between steps (max ~200 steps/min)
      const MAX_TIME_BETWEEN_STEPS = 2000; // Maximum 2 seconds between steps
      
      // Detect peaks (local maxima)
      if (magnitude > PEAK_THRESHOLD && magnitude > lastMagnitude.current && !isGoingUp.current) {
        isGoingUp.current = true;
      }
      
      // Detect when we're coming down from a peak
      if (magnitude < lastMagnitude.current && isGoingUp.current) {
        // We just passed a peak!
        if (timeSinceLastPeak > MIN_TIME_BETWEEN_STEPS && timeSinceLastPeak < MAX_TIME_BETWEEN_STEPS) {
          // Valid step detected
          setSteps(prevSteps => prevSteps + 1);
          lastPeakTime.current = currentTime;
        } else if (timeSinceLastPeak > MAX_TIME_BETWEEN_STEPS) {
          // Reset if too much time has passed (user stopped walking)
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

  const calorieProgress = todayStats.calories / todayStats.goalCalories;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Welcome Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.welcomeTitle}>Welcome Back!</Title>
            <Paragraph style={styles.subtitle}>
              Let's crush your fitness goals today 💪
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
              progress={steps / 10000} 
              color="#fff" 
              style={styles.progressBar}
            />
            <Paragraph style={styles.goalText}>Goal: 10,000 steps</Paragraph>
            <Paragraph style={styles.resetText}>
              💡 Walk with your phone to count steps
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Today's Stats */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Today's Activity</Title>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="dumbbell" size={24} color="#6200ee" />
                <Paragraph style={styles.statValue}>{todayStats.workouts}</Paragraph>
                <Paragraph style={styles.statLabel}>Workouts</Paragraph>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fire" size={24} color="#ff6b6b" />
                <Paragraph style={styles.statValue}>{todayStats.calories}</Paragraph>
                <Paragraph style={styles.statLabel}>Calories</Paragraph>
              </View>
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#4ecdc4" />
                <Paragraph style={styles.statValue}>{todayStats.duration}</Paragraph>
                <Paragraph style={styles.statLabel}>Minutes</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Calorie Tracking */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Calorie Tracking</Title>
            <View style={styles.calorieInfo}>
              <Paragraph style={styles.calorieText}>
                {todayStats.calories} / {todayStats.goalCalories} kcal
              </Paragraph>
              <Paragraph style={styles.calorieRemaining}>
                {todayStats.goalCalories - todayStats.calories} kcal remaining
              </Paragraph>
            </View>
            <ProgressBar 
              progress={calorieProgress} 
              color="#6200ee" 
              style={styles.progressBar}
            />
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
          </Card.Content>
        </Card>

        {/* Recent Achievements */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Achievements 🏆</Title>
            <View style={styles.achievementItem}>
              <MaterialCommunityIcons name="trophy" size={24} color="#ffd700" />
              <Paragraph style={styles.achievementText}>
                Completed 5 workouts this week!
              </Paragraph>
            </View>
            <View style={styles.achievementItem}>
              <MaterialCommunityIcons name="star" size={24} color="#ffd700" />
              <Paragraph style={styles.achievementText}>
                New personal record: Bench Press 85kg
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
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
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  calorieInfo: {
    marginBottom: 10,
  },
  calorieText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calorieRemaining: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  achievementText: {
    marginLeft: 10,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});
