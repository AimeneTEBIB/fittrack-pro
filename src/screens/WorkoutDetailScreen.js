import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button,
  Chip,
  DataTable,
  TextInput
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateWorkout } from '../services/api';

export default function WorkoutDetailScreen({ route, navigation }) {
  const { workout, editMode = false } = route.params;
  const [isEditing, setIsEditing] = useState(editMode);
  const [editedWorkout, setEditedWorkout] = useState(workout);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      const updatedData = {
        ...editedWorkout,
        completed: !editedWorkout.completed
      };

      // PUT request to update workout
      await updateWorkout(workout.id, updatedData);
      
      setEditedWorkout(updatedData);
      
      Alert.alert(
        'Success',
        `Workout marked as ${updatedData.completed ? 'completed' : 'incomplete'}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update workout status');
      console.error('Error updating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);

      // PUT request to update workout
      await updateWorkout(workout.id, editedWorkout);
      
      Alert.alert(
        'Success',
        'Workout updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsEditing(false);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update workout');
      console.error('Error updating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...editedWorkout.exercises];
    newExercises[index][field] = field === 'name' ? value : parseInt(value) || 0;
    setEditedWorkout({ ...editedWorkout, exercises: newExercises });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {isEditing ? (
                <TextInput
                  value={editedWorkout.title}
                  onChangeText={(text) => 
                    setEditedWorkout({ ...editedWorkout, title: text })
                  }
                  mode="outlined"
                  style={styles.titleInput}
                />
              ) : (
                <Title style={styles.title}>{editedWorkout.title}</Title>
              )}
              {editedWorkout.completed && !isEditing && (
                <Chip 
                  icon="check-circle" 
                  style={styles.completedChip}
                  textStyle={styles.chipText}
                >
                  Completed
                </Chip>
              )}
            </View>
          </View>

          <Paragraph style={styles.date}>
            {formatDate(editedWorkout.date)}
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Statistics Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Workout Stats</Title>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="clock-outline" size={32} color="#6200ee" />
              {isEditing ? (
                <TextInput
                  value={editedWorkout.duration.toString()}
                  onChangeText={(text) => 
                    setEditedWorkout({ ...editedWorkout, duration: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.statInput}
                  dense
                />
              ) : (
                <Paragraph style={styles.statValue}>
                  {editedWorkout.duration}
                </Paragraph>
              )}
              <Paragraph style={styles.statLabel}>Minutes</Paragraph>
            </View>

            <View style={styles.statBox}>
              <MaterialCommunityIcons name="fire" size={32} color="#ff6b6b" />
              {isEditing ? (
                <TextInput
                  value={editedWorkout.calories.toString()}
                  onChangeText={(text) => 
                    setEditedWorkout({ ...editedWorkout, calories: parseInt(text) || 0 })
                  }
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.statInput}
                  dense
                />
              ) : (
                <Paragraph style={styles.statValue}>
                  {editedWorkout.calories}
                </Paragraph>
              )}
              <Paragraph style={styles.statLabel}>Calories</Paragraph>
            </View>

            <View style={styles.statBox}>
              <MaterialCommunityIcons name="dumbbell" size={32} color="#4ecdc4" />
              <Paragraph style={styles.statValue}>
                {editedWorkout.exercises.length}
              </Paragraph>
              <Paragraph style={styles.statLabel}>Exercises</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Exercises Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Exercises</Title>
          
          {isEditing ? (
            // Edit mode
            editedWorkout.exercises.map((exercise, index) => (
              <Card key={index} style={styles.exerciseCard}>
                <Card.Content>
                  <Paragraph style={styles.exerciseNumber}>
                    Exercise {index + 1}
                  </Paragraph>
                  
                  <TextInput
                    label="Name"
                    value={exercise.name}
                    onChangeText={(text) => updateExercise(index, 'name', text)}
                    mode="outlined"
                    style={styles.input}
                  />

                  <View style={styles.exerciseRow}>
                    <TextInput
                      label="Sets"
                      value={exercise.sets.toString()}
                      onChangeText={(text) => updateExercise(index, 'sets', text)}
                      mode="outlined"
                      keyboardType="numeric"
                      style={[styles.input, styles.smallInput]}
                    />
                    <TextInput
                      label="Reps"
                      value={exercise.reps.toString()}
                      onChangeText={(text) => updateExercise(index, 'reps', text)}
                      mode="outlined"
                      keyboardType="numeric"
                      style={[styles.input, styles.smallInput]}
                    />
                    <TextInput
                      label="Weight"
                      value={exercise.weight.toString()}
                      onChangeText={(text) => updateExercise(index, 'weight', text)}
                      mode="outlined"
                      keyboardType="numeric"
                      style={[styles.input, styles.smallInput]}
                    />
                  </View>
                </Card.Content>
              </Card>
            ))
          ) : (
            // View mode
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Exercise</DataTable.Title>
                <DataTable.Title numeric>Sets</DataTable.Title>
                <DataTable.Title numeric>Reps</DataTable.Title>
                <DataTable.Title numeric>Weight</DataTable.Title>
              </DataTable.Header>

              {editedWorkout.exercises.map((exercise, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{exercise.name}</DataTable.Cell>
                  <DataTable.Cell numeric>{exercise.sets}</DataTable.Cell>
                  <DataTable.Cell numeric>{exercise.reps}</DataTable.Cell>
                  <DataTable.Cell numeric>{exercise.weight}kg</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          )}
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.card}>
        <Card.Content>
          {isEditing ? (
            <>
              <Button
                mode="contained"
                onPress={handleSaveEdit}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon="content-save"
              >
                Save Changes
              </Button>
              <Button
                mode="outlined"
                onPress={() => {
                  setEditedWorkout(workout);
                  setIsEditing(false);
                }}
                style={styles.button}
                disabled={loading}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                mode="contained"
                onPress={handleToggleComplete}
                loading={loading}
                disabled={loading}
                style={styles.button}
                icon={editedWorkout.completed ? "close-circle" : "check-circle"}
              >
                Mark as {editedWorkout.completed ? 'Incomplete' : 'Complete'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => setIsEditing(true)}
                style={styles.button}
                icon="pencil"
              >
                Edit Workout
              </Button>
            </>
          )}
        </Card.Content>
      </Card>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  header: {
    marginBottom: 5,
  },
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  titleInput: {
    marginBottom: 10,
  },
  completedChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#4caf50',
  },
  chipText: {
    color: '#fff',
  },
  date: {
    color: '#666',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statInput: {
    width: 60,
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  exerciseCard: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    marginVertical: 5,
  },
  bottomPadding: {
    height: 20,
  },
});