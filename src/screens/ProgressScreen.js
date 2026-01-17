import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProgressScreen({ route, navigation }) {
  const { goal } = route.params || {};

  if (!goal) {
    return (
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>No Goal Selected</Title>
            <Paragraph>Please select a goal to view progress.</Paragraph>
            <Button onPress={() => navigation.goBack()}>Go Back</Button>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const progress = goal.current / goal.target;
  const isCompleted = progress >= 1;
  const remainingValue = goal.target - goal.current;

  // Generate weekly progress data (mock data for visualization)
  const weeklyProgress = [
    { week: 'Week 1', value: goal.current * 0.2 },
    { week: 'Week 2', value: goal.current * 0.4 },
    { week: 'Week 3', value: goal.current * 0.6 },
    { week: 'Week 4', value: goal.current * 0.8 },
    { week: 'Week 5', value: goal.current },
  ];

  const maxValue = Math.max(...weeklyProgress.map(w => w.value), goal.target);

  return (
    <ScrollView style={styles.container}>
      {/* Goal Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{goal.title}</Title>
            {isCompleted && (
              <MaterialCommunityIcons 
                name="check-circle" 
                size={32} 
                color="#4caf50"
              />
            )}
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Paragraph style={styles.currentLabel}>Current Progress</Paragraph>
              <Title style={styles.currentValue}>
                {goal.current.toFixed(1)} {goal.unit}
              </Title>
            </View>
            
            <View style={styles.targetInfo}>
              <Paragraph style={styles.targetLabel}>Target</Paragraph>
              <Title style={styles.targetValue}>
                {goal.target} {goal.unit}
              </Title>
            </View>
          </View>

          <ProgressBar 
            progress={Math.min(progress, 1)} 
            color={isCompleted ? '#4caf50' : '#6200ee'}
            style={styles.mainProgressBar}
          />

          <View style={styles.percentageContainer}>
            <Paragraph style={styles.percentage}>
              {Math.min((progress * 100), 100).toFixed(1)}% Complete
            </Paragraph>
            {!isCompleted && (
              <Paragraph style={styles.remaining}>
                {remainingValue.toFixed(1)} {goal.unit} to go
              </Paragraph>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Statistics */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Statistics</Title>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <MaterialCommunityIcons name="chart-line" size={32} color="#6200ee" />
              <Paragraph style={styles.statValue}>
                {((goal.current / goal.target) * 100).toFixed(0)}%
              </Paragraph>
              <Paragraph style={styles.statLabel}>Progress</Paragraph>
            </View>

            <View style={styles.statBox}>
              <MaterialCommunityIcons name="calendar-check" size={32} color="#4ecdc4" />
              <Paragraph style={styles.statValue}>
                {Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))}
              </Paragraph>
              <Paragraph style={styles.statLabel}>Days Left</Paragraph>
            </View>

            <View style={styles.statBox}>
              <MaterialCommunityIcons name="speedometer" size={32} color="#ff6b6b" />
              <Paragraph style={styles.statValue}>
                {(goal.current / 5).toFixed(1)}
              </Paragraph>
              <Paragraph style={styles.statLabel}>Per Week</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Weekly Progress Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Weekly Progress</Title>
          
          <View style={styles.chartContainer}>
            {weeklyProgress.map((item, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (item.value / maxValue) * 150,
                        backgroundColor: index === weeklyProgress.length - 1 ? '#6200ee' : '#b39ddb'
                      }
                    ]}
                  />
                </View>
                <Paragraph style={styles.barLabel}>{item.week}</Paragraph>
                <Paragraph style={styles.barValue}>
                  {item.value.toFixed(1)}
                </Paragraph>
              </View>
            ))}
          </View>

          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#6200ee' }]} />
              <Paragraph style={styles.legendText}>Current</Paragraph>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#b39ddb' }]} />
              <Paragraph style={styles.legendText}>Previous</Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Milestones */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Milestones</Title>
          
          <View style={styles.milestone}>
            <MaterialCommunityIcons 
              name={progress >= 0.25 ? "check-circle" : "circle-outline"} 
              size={24} 
              color={progress >= 0.25 ? "#4caf50" : "#ccc"}
            />
            <View style={styles.milestoneContent}>
              <Paragraph style={styles.milestoneTitle}>25% Complete</Paragraph>
              <Paragraph style={styles.milestoneValue}>
                {(goal.target * 0.25).toFixed(1)} {goal.unit}
              </Paragraph>
            </View>
          </View>

          <View style={styles.milestone}>
            <MaterialCommunityIcons 
              name={progress >= 0.5 ? "check-circle" : "circle-outline"} 
              size={24} 
              color={progress >= 0.5 ? "#4caf50" : "#ccc"}
            />
            <View style={styles.milestoneContent}>
              <Paragraph style={styles.milestoneTitle}>50% Complete</Paragraph>
              <Paragraph style={styles.milestoneValue}>
                {(goal.target * 0.5).toFixed(1)} {goal.unit}
              </Paragraph>
            </View>
          </View>

          <View style={styles.milestone}>
            <MaterialCommunityIcons 
              name={progress >= 0.75 ? "check-circle" : "circle-outline"} 
              size={24} 
              color={progress >= 0.75 ? "#4caf50" : "#ccc"}
            />
            <View style={styles.milestoneContent}>
              <Paragraph style={styles.milestoneTitle}>75% Complete</Paragraph>
              <Paragraph style={styles.milestoneValue}>
                {(goal.target * 0.75).toFixed(1)} {goal.unit}
              </Paragraph>
            </View>
          </View>

          <View style={styles.milestone}>
            <MaterialCommunityIcons 
              name={progress >= 1 ? "check-circle" : "circle-outline"} 
              size={24} 
              color={progress >= 1 ? "#4caf50" : "#ccc"}
            />
            <View style={styles.milestoneContent}>
              <Paragraph style={styles.milestoneTitle}>Goal Complete!</Paragraph>
              <Paragraph style={styles.milestoneValue}>
                {goal.target} {goal.unit}
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Motivation */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Keep Going! 💪</Title>
          {isCompleted ? (
            <Paragraph style={styles.motivationText}>
              Congratulations! You've achieved your goal. Time to set a new one!
            </Paragraph>
          ) : progress >= 0.75 ? (
            <Paragraph style={styles.motivationText}>
              You're so close! Just a little more to reach your goal!
            </Paragraph>
          ) : progress >= 0.5 ? (
            <Paragraph style={styles.motivationText}>
              Great progress! You're halfway there. Keep up the excellent work!
            </Paragraph>
          ) : progress >= 0.25 ? (
            <Paragraph style={styles.motivationText}>
              Good start! Stay consistent and you'll reach your goal in no time!
            </Paragraph>
          ) : (
            <Paragraph style={styles.motivationText}>
              Every journey begins with a single step. You've got this!
            </Paragraph>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  progressInfo: {
    flex: 1,
  },
  currentLabel: {
    fontSize: 12,
    color: '#666',
  },
  currentValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  targetInfo: {
    alignItems: 'flex-end',
  },
  targetLabel: {
    fontSize: 12,
    color: '#666',
  },
  targetValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainProgressBar: {
    height: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  percentageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  percentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  remaining: {
    fontSize: 14,
    color: '#666',
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
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingVertical: 10,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  bar: {
    width: 40,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 5,
  },
  barValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  milestoneContent: {
    marginLeft: 15,
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  milestoneValue: {
    fontSize: 12,
    color: '#666',
  },
  motivationText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666',
  },
  bottomPadding: {
    height: 20,
  },
});