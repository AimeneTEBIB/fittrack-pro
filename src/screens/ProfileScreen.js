import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button,
  Avatar,
  List,
  Divider,
  TextInput,
  Portal,
  Modal
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [profileImage, setProfileImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Aimene TEBIB',
    age: '25',
    height: '188',
    weight: '80',
    goal: 'Build Muscle and lose fat'
  });

  const takePhoto = async () => {
    if (cameraRef && permission?.granted) {
      try {
        const photo = await cameraRef.takePictureAsync();
        setProfileImage(photo.uri);
        setShowCamera(false);
        Alert.alert('Success', 'Profile photo updated!');
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Success', 'Profile photo updated!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handlePhotoOptions = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            if (!permission) {
              const { granted } = await requestPermission();
              if (granted) {
                setShowCamera(true);
              } else {
                Alert.alert('Permission Required', 'Camera permission is required to take photos');
              }
            } else if (permission.granted) {
              setShowCamera(true);
            } else {
              Alert.alert('Permission Required', 'Camera permission is required to take photos');
            }
          }
        },
        {
          text: 'Choose from Library',
          onPress: pickImage
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    setEditModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing="front"
          ref={(ref) => setCameraRef(ref)}
        >
          <View style={styles.cameraControls}>
            <Button
              mode="contained"
              onPress={takePhoto}
              icon="camera"
              style={styles.captureButton}
            >
              Capture
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowCamera(false)}
              style={styles.cancelButton}
              textColor="#fff"
            >
              Cancel
            </Button>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {profileImage ? (
                  <Avatar.Image 
                    size={100} 
                    source={{ uri: profileImage }}
                  />
                ) : (
                  <Avatar.Icon 
                    size={100} 
                    icon="account" 
                    style={styles.avatar}
                  />
                )}
                <Button
                  mode="text"
                  icon="camera"
                  onPress={handlePhotoOptions}
                  compact
                  style={styles.changePhotoButton}
                >
                  Change Photo
                </Button>
              </View>
              
              <View style={styles.profileInfo}>
                <Title style={styles.name}>{userProfile.name}</Title>
                <Paragraph style={styles.goal}>{userProfile.goal}</Paragraph>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Paragraph style={styles.statValue}>{userProfile.age}</Paragraph>
                    <Paragraph style={styles.statLabel}>Years</Paragraph>
                  </View>
                  <View style={styles.statItem}>
                    <Paragraph style={styles.statValue}>{userProfile.height}</Paragraph>
                    <Paragraph style={styles.statLabel}>cm</Paragraph>
                  </View>
                  <View style={styles.statItem}>
                    <Paragraph style={styles.statValue}>{userProfile.weight}</Paragraph>
                    <Paragraph style={styles.statLabel}>kg</Paragraph>
                  </View>
                </View>
              </View>
            </View>

            <Button
              mode="contained"
              icon="pencil"
              onPress={() => setEditModalVisible(true)}
              style={styles.editButton}
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>

        {/* Body Measurements */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Body Measurements</Title>
            
            <View style={styles.measurementGrid}>
              <View style={styles.measurementBox}>
                <MaterialCommunityIcons name="human-male-height" size={32} color="#6200ee" />
                <Paragraph style={styles.measurementValue}>{userProfile.height} cm</Paragraph>
                <Paragraph style={styles.measurementLabel}>Height</Paragraph>
              </View>
              
              <View style={styles.measurementBox}>
                <MaterialCommunityIcons name="weight-kilogram" size={32} color="#6200ee" />
                <Paragraph style={styles.measurementValue}>{userProfile.weight} kg</Paragraph>
                <Paragraph style={styles.measurementLabel}>Weight</Paragraph>
              </View>
              
              <View style={styles.measurementBox}>
                <MaterialCommunityIcons name="calculator" size={32} color="#6200ee" />
                <Paragraph style={styles.measurementValue}>
                  {(parseFloat(userProfile.weight) / Math.pow(parseFloat(userProfile.height) / 100, 2)).toFixed(1)}
                </Paragraph>
                <Paragraph style={styles.measurementLabel}>BMI</Paragraph>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Settings</Title>
            
            <List.Item
              title="Notifications"
              description="Workout reminders and updates"
              left={props => <List.Icon {...props} icon="bell" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            
            <List.Item
              title="Units"
              description="Metric (kg, cm)"
              left={props => <List.Icon {...props} icon="ruler" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            
            <List.Item
              title="Privacy"
              description="Data and account settings"
              left={props => <List.Icon {...props} icon="lock" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
            <Divider />
            
            <List.Item
              title="Help & Support"
              description="FAQs and contact support"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {}}
            />
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>About</Title>
            <Paragraph style={styles.aboutText}>
              FitTrack Pro v1.0.0{'\n'}
              Your ultimate fitness companion for a better health{'\n\n'}
              © 2025_Aimene_tebib_mobile_application_project
            </Paragraph>
            
            <Button
              mode="outlined"
              icon="logout"
              onPress={() => Alert.alert('Logout', 'Logout functionality would go here')}
              style={styles.logoutButton}
            >
              Logout
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          contentContainerStyle={styles.modal}
        >
          <Title style={styles.modalTitle}>Edit Profile</Title>
          
          <TextInput
            label="Name"
            value={userProfile.name}
            onChangeText={(text) => setUserProfile({ ...userProfile, name: text })}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Age"
            value={userProfile.age}
            onChangeText={(text) => setUserProfile({ ...userProfile, age: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Height (cm)"
            value={userProfile.height}
            onChangeText={(text) => setUserProfile({ ...userProfile, height: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Weight (kg)"
            value={userProfile.weight}
            onChangeText={(text) => setUserProfile({ ...userProfile, weight: text })}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            label="Fitness Goal"
            value={userProfile.goal}
            onChangeText={(text) => setUserProfile({ ...userProfile, goal: text })}
            mode="outlined"
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSaveProfile}
            style={styles.modalButton}
          >
            Save Changes
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => setEditModalVisible(false)}
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    padding: 20,
  },
  captureButton: {
    marginBottom: 10,
  },
  cancelButton: {
    borderColor: '#fff',
  },
  headerCard: {
    margin: 10,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  changePhotoButton: {
    marginTop: 10,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goal: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  editButton: {
    marginTop: 10,
  },
  card: {
    margin: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  measurementGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  measurementBox: {
    alignItems: 'center',
    flex: 1,
  },
  measurementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  measurementLabel: {
    fontSize: 12,
    color: '#666',
  },
  aboutText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
    marginBottom: 15,
  },
  logoutButton: {
    marginTop: 10,
  },
  bottomPadding: {
    height: 20,
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
    marginBottom: 15,
  },
  modalButton: {
    marginTop: 10,
  },
});
