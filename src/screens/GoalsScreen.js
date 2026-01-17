import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar,
  Button,
  FAB,
  Portal,
  Modal,
  TextInput,
  Menu,
  Divider,
  IconButton,
  Chip
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACHIEVEMENTS_KEY = '@fittrack_achievements';

export default function GoalsScreen({ navigation }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [achievementsVisible, setAchievementsVisible] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    unit: 'kg',
    deadline: '',
    category: 'weight'
  });

  useEffect(() => {
    loadGoals();
    loadAchievements();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
      Alert.alert('Error', 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = async () => {
    try {
      const data = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      setAchievements(data ? JSON.parse(data) : []);
      console.log('Achievements loaded:', data ? JSON.parse(data).length : 0);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.target) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createGoal({
        ...newGoal,
        target: parseFloat(newGoal.target),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      await loadGoals();
      setModalVisible(false);
      setNewGoal({
        title: '',
        target: '',
        unit: 'kg',
        deadline: '',
        category: 'weight'
      });
      Alert.alert('Success', 'Goal created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create goal');
      console.error(error);
    }
  };

  const handleUpdateProgress = async (goalId, currentProgress) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      const newProgress = parseFloat(currentProgress);

      if (isNaN(newProgress)) {
        Alert.alert('Error', 'Please enter a valid number');
        return;
      }

      await updateGoal(goalId, {
        ...goal,
        current: newProgress
      });

      await loadGoals();
      
      // Check if goal is completed
      if (newProgress >= goal.target) {
        Alert.alert(
          '🎉 Goal Achieved!',
          `Congratulations! You've reached your goal: ${goal.title}`,
          [
            {
              text: 'Archive',
              onPress: () => handleArchiveGoal(goalId)
            },
            {
              text: 'Keep',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update progress');
      console.error('Error in handleUpdateProgress:', error);
    }
  };

  const handleDeleteGoal = (goalId) => {
    const goal = goals.find(g => g.id === goalId);
    
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete "${goal.title}"? This cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting goal:', goalId);
              await deleteGoal(goalId);
              await loadGoals();
              Alert.alert('Success', 'Goal deleted successfully');
            } catch (error) {
              console.error('Error in handleDeleteGoal:', error);
              Alert.alert('Error', `Failed to delete goal: ${error.message}`);
            }
          }
        }
      ]
    );
  };

  const handleArchiveGoal = async (goalId) => {
    try {
      console.log('Starting archive process for goal:', goalId);
      
      const goal = goals.find(g => g.id === goalId);
      
      if (!goal) {
        throw new Error('Goal not found');
      }
      
      console.log('Goal to archive:', goal);
      
      // Create achievement object
      const achievement = {
        ...goal,
        completedAt: new Date().toISOString(),
        achievedProgress: goal.current
      };
      
      console.log('Achievement created:', achievement);
      
      // Load existing achievements
      const existingAchievementsData = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
      const existingAchievements = existingAchievementsData ? JSON.parse(existingAchievementsData) : [];
      
      console.log('Existing achievements:', existingAchievements.length);
      
      // Add new achievement to the beginning
      const updatedAchievements = [achievement, ...existingAchievements];
      
      // Save achievements
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updatedAchievements));
      console.log('Achievement saved to storage');
      
      // Delete from goals
      console.log('Deleting goal from goals list...');
      await deleteGoal(goalId);
      console.log('Goal deleted from storage');
      
      // Reload both lists
      await loadGoals();
      await loadAchievements();
      
      console.log('Archive process completed successfully');
      
      Alert.alert(
        'Success! 🏆',
        'Goal archived to achievements!',
        [
          { 
            text: 'View Achievements', 
            onPress: () => setAchievementsVisible(true) 
          },
          {
            text: 'OK',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('Error in handleArchiveGoal:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      Alert.alert(
        'Archive Failed', 
        `Could not archive goal: ${error.message}\n\nPlease try again or delete the goal instead.`
      );
    }
  };

  const handleDeleteAchievement = (achievementId) => {
    Alert.alert(
      'Delete Achievement',
      'Remove this achievement from your history?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = achievements.filter(a => a.id !== achievementId);
              await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(updated));
              setAchievements(updated);
              Alert.alert('Success', 'Achievement deleted');
            } catch (error) {
              console.error('Failed to delete achievement:', error);
              Alert.alert('Error', 'Failed to delete achievement');
            }
          }
        }
      ]
    );
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
      default: return '#6200ee';
    }
  };

  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return 'Expired';
    if (daysLeft === 0) return 'Today';
    if (daysLeft === 1) return '1 day left';
    return `${daysLeft} days left`;
  };

  const formatCompletedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <Title style={styles.summaryTitle}>Goals Overview</Title>
              <Button
                mode="text"
                icon="trophy"
                onPress={() => setAchievementsVisible(true)}
                textColor="#fff"
                compact
              >
                Achievements ({achievements.length})
              </Button>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Paragraph style={styles.summaryValue}>{goals.length}</Paragraph>
                <Paragraph style={styles.summaryLabel}>Active</Paragraph>
              </View>
              <View style={styles.summaryItem}>
                <Paragraph style={styles.summaryValue}>
                  {goals.filter(g => (g.current / g.target) >= 1).length}
                </Paragraph>
                <Paragraph style={styles.summaryLabel}>Completed</Paragraph>
              </View>
              <View style={styles.summaryItem}>
                <Paragraph style={styles.summaryValue}>
                  {goals.filter(g => g.current > 0 && g.current < g.target).length}
                </Paragraph>
                <Paragraph style={styles.summaryLabel}>In Progress</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Goals List */}
        {goals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <MaterialCommunityIcons 
                name="target" 
                size={64} 
                color="#ccc" 
                style={styles.emptyIcon}
              />
              <Title style={styles.emptyTitle}>No Active Goals</Title>
              <Paragraph style={styles.emptyText}>
                Set your first fitness goal and start tracking your progress!
              </Paragraph>
            </Card.Content>
          </Card>
        ) : (
          goals.map((goal) => {
            const progress = goal.current / goal.target;
            const isCompleted = progress >= 1;
            const categoryColor = getCategoryColor(goal.category);

            return (
              <Card 
                key={goal.id} 
                style={styles.goalCard}
                onPress={() => navigation.navigate('Progress', { goal })}
              >
                <Card.Content>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleContainer}>
                      <MaterialCommunityIcons 
                        name={getCategoryIcon(goal.category)} 
                        size={24} 
                        color={categoryColor}
                      />
                      <Title style={styles.goalTitle}>{goal.title}</Title>
                    </View>
                    <View style={styles.headerActions}>
                      {isCompleted && (
                        <Chip 
                          icon="check-circle" 
                          style={styles.completedChip}
                          textStyle={styles.chipText}
                        >
                          Done
                        </Chip>
                      )}
                      <IconButton
                        icon="delete"
                        iconColor="#e74c3c"
                        size={20}
                        onPress={() => handleDeleteGoal(goal.id)}
                      />
                    </View>
                  </View>

                  <View style={styles.progressSection}>
                    <View style={styles.progressText}>
                      <Paragraph style={styles.currentValue}>
                        {goal.current.toFixed(1)} {goal.unit}
                      </Paragraph>
                      <Paragraph style={styles.targetValue}>
                        / {goal.target} {goal.unit}
                      </Paragraph>
                    </View>
                    <Paragraph style={styles.percentage}>
                      {Math.min((progress * 100), 100).toFixed(0)}%
                    </Paragraph>
                  </View>

                  <ProgressBar 
                    progress={Math.min(progress, 1)} 
                    color={isCompleted ? '#4caf50' : categoryColor}
                    style={styles.progressBar}
                  />

                  <View style={styles.goalFooter}>
                    <View style={styles.deadlineContainer}>
                      <MaterialCommunityIcons 
                        name="calendar-clock" 
                        size={16} 
                        color="#666"
                      />
                      <Paragraph style={styles.deadline}>
                        {formatDeadline(goal.deadline)}
                      </Paragraph>
                    </View>
                    
                    <View style={styles.footerButtons}>
                      <Button
                        mode="text"
                        onPress={() => {
                          Alert.prompt(
                            'Update Progress',
                            `Current: ${goal.current} ${goal.unit}\nEnter new value:`,
                            (value) => handleUpdateProgress(goal.id, value),
                            'plain-text',
                            goal.current.toString()
                          );
                        }}
                        compact
                      >
                        Update
                      </Button>
                      {isCompleted && (
                        <Button
                          mode="text"
                          onPress={() => handleArchiveGoal(goal.id)}
                          compact
                          icon="archive"
                          textColor="#4caf50"
                        >
                          Archive
                        </Button>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Add Goal FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="New Goal"
        onPress={() => setModalVisible(true)}
      />

      {/* Add Goal Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Create New Goal</Title>
          
          <TextInput
            label="Goal Title *"
            value={newGoal.title}
            onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Lose weight, Run 5km"
          />

          <Menu
            visible={categoryMenuVisible}
            onDismiss={() => setCategoryMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setCategoryMenuVisible(true)}
                style={styles.input}
                icon={getCategoryIcon(newGoal.category)}
              >
                Category: {newGoal.category}
              </Button>
            }
          >
            <Menu.Item onPress={() => {
              setNewGoal({ ...newGoal, category: 'weight' });
              setCategoryMenuVisible(false);
            }} title="Weight Loss" />
            <Menu.Item onPress={() => {
              setNewGoal({ ...newGoal, category: 'cardio' });
              setCategoryMenuVisible(false);
            }} title="Cardio" />
            <Menu.Item onPress={() => {
              setNewGoal({ ...newGoal, category: 'strength' });
              setCategoryMenuVisible(false);
            }} title="Strength" />
            <Menu.Item onPress={() => {
              setNewGoal({ ...newGoal, category: 'flexibility' });
              setCategoryMenuVisible(false);
            }} title="Flexibility" />
          </Menu>

          <View style={styles.targetRow}>
            <TextInput
              label="Target *"
              value={newGoal.target}
              onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
              mode="outlined"
              keyboardType="numeric"
              style={[styles.input, styles.targetInput]}
            />
            <TextInput
              label="Unit"
              value={newGoal.unit}
              onChangeText={(text) => setNewGoal({ ...newGoal, unit: text })}
              mode="outlined"
              style={[styles.input, styles.unitInput]}
              placeholder="kg, km, reps"
            />
          </View>

          <Button
            mode="contained"
            onPress={handleCreateGoal}
            style={styles.modalButton}
            icon="check"
          >
            Create Goal
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => setModalVisible(false)}
            style={styles.modalButton}
          >
            Cancel
          </Button>
        </Modal>

        {/* Achievements Modal */}
        <Modal
          visible={achievementsVisible}
          onDismiss={() => setAchievementsVisible(false)}
          contentContainerStyle={styles.achievementsModal}
        >
          <Title style={styles.modalTitle}>🏆 Achievements</Title>
          
          <ScrollView style={styles.achievementsList}>
            {achievements.length === 0 ? (
              <View style={styles.emptyAchievements}>
                <MaterialCommunityIcons name="trophy-outline" size={48} color="#ccc" />
                <Paragraph style={styles.emptyText}>
                  Complete goals to earn achievements!
                </Paragraph>
              </View>
            ) : (
              achievements.map((achievement) => (
                <Card key={achievement.id} style={styles.achievementCard}>
                  <Card.Content>
                    <View style={styles.achievementHeader}>
                      <View style={styles.achievementTitle}>
                        <MaterialCommunityIcons 
                          name={getCategoryIcon(achievement.category)} 
                          size={20} 
                          color={getCategoryColor(achievement.category)}
                        />
                        <Paragraph style={styles.achievementName}>
                          {achievement.title}
                        </Paragraph>
                      </View>
                      <IconButton
                        icon="delete"
                        iconColor="#e74c3c"
                        size={18}
                        onPress={() => handleDeleteAchievement(achievement.id)}
                      />
                    </View>
                    <Paragraph style={styles.achievementDetail}>
                      Achieved: {achievement.achievedProgress} {achievement.unit}
                    </Paragraph>
                    <Paragraph style={styles.achievementDate}>
                      ✓ Completed on {formatCompletedDate(achievement.completedAt)}
                    </Paragraph>
                  </Card.Content>
                </Card>
              ))
            )}
          </ScrollView>
          
          <Button
            mode="outlined"
            onPress={() => setAchievementsVisible(false)}
            style={styles.modalButton}
          >
            Close
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
  summaryCard: {
    margin: 10,
    elevation: 4,
    backgroundColor: '#6200ee',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
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
  goalCard: {
    margin: 10,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedChip: {
    backgroundColor: '#4caf50',
    marginRight: 8,
  },
  chipText: {
    color: '#fff',
    fontSize: 11,
  },
  goalTitle: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1,
  },
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressText: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  targetValue: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  percentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  footerButtons: {
    flexDirection: 'row',
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  achievementsModal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  targetInput: {
    flex: 2,
    marginRight: 10,
  },
  unitInput: {
    flex: 1,
  },
  modalButton: {
    marginTop: 10,
  },
  achievementsList: {
    maxHeight: 400,
    marginBottom: 10,
  },
  emptyAchievements: {
    alignItems: 'center',
    padding: 30,
  },
  achievementCard: {
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#ffd700',
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  achievementDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
});