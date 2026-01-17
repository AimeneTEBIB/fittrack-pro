# FitTrack Pro - Quick Start Guide

### Step 1: Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd fittrack-pro

# Install dependencies
npm install
```

### Step 2: Run the App
```bash
# Start Expo development server
npm start

# Then choose:
# - Press 'a' for Android
# - Press 'i' for iOS  
# - Scan QR code with Expo Go app on your phone
```

### Step 3: Explore Features

#### Try These First:
1. **Home Tab** - See the step counter in action (shake your device!)
2. **Workouts Tab** - View sample workouts, try adding a new one
3. **Nutrition Tab** - Log a meal and track calories
4. **Goals Tab** - Set a fitness goal
5. **Profile Tab** - Take a profile photo with camera

---

## Requirements Checklist

#### Screens (8+ Required) ✓
- [ ] HomeScreen
- [ ] WorkoutsScreen
- [ ] AddWorkoutScreen
- [ ] WorkoutDetailScreen
- [ ] NutritionScreen
- [ ] GoalsScreen
- [ ] ProgressScreen
- [ ] ProfileScreen

#### API Methods (3 Required) ✓
- [ ] GET - Fetch workouts (WorkoutsScreen)
- [ ] POST - Create workout (AddWorkoutScreen)
- [ ] PUT - Update workout (WorkoutDetailScreen)

#### Navigation (2 Types) ✓
- [ ] Stack Navigation (Workout flows, Goal flows)
- [ ] Bottom Tab Navigation (Main tabs)

#### UI Framework ✓
- [ ] React Native Paper implemented throughout

#### Sensors (2 Required) ✓
- [ ] Camera (ProfileScreen - profile photos)
- [ ] Accelerometer (HomeScreen - step counter)

#### Repository ✓
- [ ] Code on GitHub/GitLab/Bitbucket
- [ ] Each member has 5+ commits
- [ ] Commits are meaningful and descriptive

---

## 👥 Team Workflow

### Initial Setup (Do This Together)
```bash
# One person creates repo on GitHub
# Everyone else clones it

git clone <repo-url>
cd fittrack-pro
npm install
```

### Individual Work
```bash
# Create your feature branch
git checkout -b feature/yourname-feature

# Make changes, then commit
git add .
git commit -m "feat: your description"

# Push to GitHub
git push origin feature/yourname-feature

# Create Pull Request on GitHub
# Have teammate review and merge
```




**Test Navigation:**
- Tap all tabs
- Go to workout detail and back
- Add workout and verify it appears

**Test API:**
- Create workout → Check it's saved
- Update workout → Verify changes
- Refresh workouts → Data persists

**Test Sensors:**
- Take profile photo → Photo displays
- Shake device → Steps increase

**Test Forms:**
- Submit empty form → See validation
- Submit valid form → Success message

---

## Common Issues & Fixes

### "Cannot find module"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### "Metro bundler error"
```bash
# Reset Metro
expo start -c
```

### "Camera not working"
```bash
# Check permissions in device settings
# Android: Settings > Apps > Expo Go > Permissions
# iOS: Settings > Expo Go > Camera
```

### "Accelerometer not updating"
```bash
# Make sure you're testing on physical device
# Accelerometer doesn't work well in simulators
```

---

## Key Files to Know

```
fittrack-pro/
│
├── App.js                          # App entry point
├── package.json                    # Dependencies
├── app.json                        # Expo configuration
│
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation setup (Stack + Tabs)
│   │
│   ├── services/
│   │   └── api.js                 # API methods (GET, POST, PUT)
│   │
│   ├── screens/
│   │   ├── HomeScreen.js          # Dashboard + Accelerometer
│   │   ├── WorkoutsScreen.js      # Workouts list + GET
│   │   ├── AddWorkoutScreen.js    # Add workout + POST
│   │   ├── WorkoutDetailScreen.js # Detail view + PUT
│   │   ├── NutritionScreen.js     # Meal tracking
│   │   ├── GoalsScreen.js         # Goals management
│   │   ├── ProgressScreen.js      # Progress charts
│   │   └── ProfileScreen.js       # Profile + Camera
│   │
│   └── utils/
│       └── storage.js             # AsyncStorage helpers
│
├── README.md                       # Project overview
├── DOCUMENTATION.md                # Full documentation
└── GIT_GUIDE.md                   # Git workflow guide
```


