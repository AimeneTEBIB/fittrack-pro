import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Chip, ActivityIndicator, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWorkouts, deleteWorkout } from '../services/api';

export default function WorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  // Add listener for when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkouts();
    });

    return unsubscribe;
  }, [navigation]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      // GET request to fetch workouts
      const data = await getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWorkouts();
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await deleteWorkout(workoutId);
      loadWorkouts();
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Paragraph style={styles.loadingText}>Loading workouts...</Paragraph>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <MaterialCommunityIcons 
                name="dumbbell" 
                size={64} 
                color="#ccc" 
                style={styles.emptyIcon}
              />
              <Title style={styles.emptyTitle}>No Workouts Yet</Title>
              <Paragraph style={styles.emptyText}>
                Start tracking your fitness journey by adding your first workout!
              </Paragraph>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('AddWorkout')}
                style={styles.emptyButton}
              >
                Add First Workout
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Title style={styles.summaryTitle}>Workout Summary</Title>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Paragraph style={styles.summaryValue}>
                      {workouts.length}
                    </Paragraph>
                    <Paragraph style={styles.summaryLabel}>Total</Paragraph>
                  </View>
                  <View style={styles.summaryItem}>
                    <Paragraph style={styles.summaryValue}>
                      {workouts.filter(w => w.completed).length}
                    </Paragraph>
                    <Paragraph style={styles.summaryLabel}>Completed</Paragraph>
                  </View>
                  <View style={styles.summaryItem}>
                    <Paragraph style={styles.summaryValue}>
                      {workouts.reduce((sum, w) => sum + (w.calories || 0), 0)}
                    </Paragraph>
                    <Paragraph style={styles.summaryLabel}>Calories</Paragraph>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {workouts.map((workout) => (
              <Card 
                key={workout.id} 
                style={styles.workoutCard}
                onPress={() => navigation.navigate('WorkoutDetail', { workout })}
              >
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                      <Title style={styles.workoutTitle}>{workout.title}</Title>
                      {workout.completed && (
                        <Chip 
                          icon="check" 
                          style={styles.completedChip}
                          textStyle={styles.chipText}
                        >
                          Completed
                        </Chip>
                      )}
                    </View>
                    <MaterialCommunityIcons 
                      name="chevron-right" 
                      size={24} 
                      color="#666"
                    />
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons 
                        name="calendar" 
                        size={16} 
                        color="#666" 
                      />
                      <Paragraph style={styles.infoText}>
                        {formatDate(workout.date)}
                      </Paragraph>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons 
                        name="clock-outline" 
                        size={16} 
                        color="#666" 
                      />
                      <Paragraph style={styles.infoText}>
                        {workout.duration} min
                      </Paragraph>
                    </View>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons 
                        name="fire" 
                        size={16} 
                        color="#ff6b6b" 
                      />
                      <Paragraph style={styles.infoText}>
                        {workout.calories} cal
                      </Paragraph>
                    </View>
                  </View>

                  <Paragraph style={styles.exerciseCount}>
                    {workout.exercises.length} exercises
                  </Paragraph>

                  <View style={styles.actionButtons}>
                    <Button
                      mode="outlined"
                      icon="pencil"
                      onPress={() => navigation.navigate('WorkoutDetail', { 
                        workout,
                        editMode: true 
                      })}
                      style={styles.actionBtn}
                    >
                      Edit
                    </Button>
                    <Button
                      mode="text"
                      icon="delete"
                      onPress={() => handleDeleteWorkout(workout.id)}
                      style={styles.actionBtn}
                      textColor="#d32f2f"
                    >
                      Delete
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Workout"
        onPress={() => navigation.navigate('AddWorkout')}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  summaryCard: {
    margin: 10,
    elevation: 4,
    backgroundColor: '#6200ee',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryLabel: {
    color: '#fff',
    fontSize: 12,
  },
  workoutCard: {
    margin: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  completedChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
  },
  chipText: {
    color: '#fff',
    fontSize: 10,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '500',
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
  },
  actionBtn: {
    marginRight: 10,
  },
  emptyCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  emptyButton: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});