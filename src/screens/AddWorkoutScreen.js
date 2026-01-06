import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  TextInput, 
  Button, 
  Paragraph,
  IconButton,
  Chip
} from 'react-native-paper';
import { createWorkout } from '../services/api';

export default function AddWorkoutScreen({ navigation }) {
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weight: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const addExercise = () => {
    setExercises([
      ...exercises,
      { name: '', sets: '', reps: '', weight: '' }
    ]);
  };

  const removeExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const updateExercise = (index, field, value) => {
    const newExercises = [...exercises];
    newExercises[index][field] = value;
    setExercises(newExercises);
  };

  const calculateCalories = () => {
    // Simple calculation: duration * 7 (average calories per minute for moderate exercise)
    return parseInt(duration) * 7 || 0;
  };

  const validateForm = () => {
    if (!workoutTitle.trim()) {
      Alert.alert('Error', 'Please enter a workout title');
      return false;
    }

    if (!duration || parseInt(duration) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration');
      return false;
    }

    const validExercises = exercises.filter(ex => ex.name.trim());
    if (validExercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise');
      return false;
    }

    return true;
  };

  const handleSaveWorkout = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Filter out empty exercises
      const validExercises = exercises
        .filter(ex => ex.name.trim())
        .map(ex => ({
          name: ex.name,
          sets: parseInt(ex.sets) || 0,
          reps: parseInt(ex.reps) || 0,
          weight: parseInt(ex.weight) || 0
        }));

      const workoutData = {
        title: workoutTitle,
        duration: parseInt(duration),
        exercises: validExercises,
        calories: calculateCalories(),
      };

      // POST request to create workout
      await createWorkout(workoutData);

      Alert.alert(
        'Success',
        'Workout created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create workout. Please try again.');
      console.error('Error creating workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Workout Details</Title>
          
          <TextInput
            label="Workout Title *"
            value={workoutTitle}
            onChangeText={setWorkoutTitle}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Upper Body Day, Leg Day"
          />

          <TextInput
            label="Duration (minutes) *"
            value={duration}
            onChangeText={setDuration}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            placeholder="e.g., 45"
          />

          <View style={styles.calorieInfo}>
            <Paragraph style={styles.label}>Estimated Calories:</Paragraph>
            <Chip icon="fire" style={styles.calorieChip}>
              {calculateCalories()} cal
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Exercises</Title>
            <Button
              mode="contained"
              icon="plus"
              onPress={addExercise}
              compact
            >
              Add Exercise
            </Button>
          </View>

          {exercises.map((exercise, index) => (
            <Card key={index} style={styles.exerciseCard}>
              <Card.Content>
                <View style={styles.exerciseHeader}>
                  <Paragraph style={styles.exerciseNumber}>
                    Exercise {index + 1}
                  </Paragraph>
                  {exercises.length > 1 && (
                    <IconButton
                      icon="delete"
                      size={20}
                      onPress={() => removeExercise(index)}
                    />
                  )}
                </View>

                <TextInput
                  label="Exercise Name *"
                  value={exercise.name}
                  onChangeText={(text) => updateExercise(index, 'name', text)}
                  mode="outlined"
                  style={styles.input}
                  placeholder="e.g., Bench Press"
                />

                <View style={styles.exerciseRow}>
                  <TextInput
                    label="Sets"
                    value={exercise.sets}
                    onChangeText={(text) => updateExercise(index, 'sets', text)}
                    mode="outlined"
                    keyboardType="numeric"
                    style={[styles.input, styles.smallInput]}
                    placeholder="3"
                  />

                  <TextInput
                    label="Reps"
                    value={exercise.reps}
                    onChangeText={(text) => updateExercise(index, 'reps', text)}
                    mode="outlined"
                    keyboardType="numeric"
                    style={[styles.input, styles.smallInput]}
                    placeholder="10"
                  />

                  <TextInput
                    label="Weight (kg)"
                    value={exercise.weight}
                    onChangeText={(text) => updateExercise(index, 'weight', text)}
                    mode="outlined"
                    keyboardType="numeric"
                    style={[styles.input, styles.smallInput]}
                    placeholder="50"
                  />
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="contained"
            onPress={handleSaveWorkout}
            loading={loading}
            disabled={loading}
            style={styles.saveButton}
            icon="content-save"
          >
            Save Workout
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </Button>
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
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    marginBottom: 12,
  },
  calorieInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  calorieChip: {
    backgroundColor: '#ff6b6b',
  },
  exerciseCard: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    marginVertical: 10,
    paddingVertical: 5,
  },
  cancelButton: {
    marginBottom: 10,
  },
  bottomPadding: {
    height: 20,
  },
});