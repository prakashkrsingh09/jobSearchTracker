# Job Search Tracker 📱

A modern React Native mobile application for tracking job applications with Firebase Firestore integration, featuring a beautiful UI and comprehensive job management capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Job Search Tracker is a cross-platform mobile application built with React Native that helps users efficiently track their job applications. The app features a modern, interactive UI with Firebase Firestore backend integration for real-time data synchronization.

## ✨ Features

### 🎨 **Modern UI/UX**
- **Beautiful Job Cards**: Clean, card-based design with shadows and rounded corners
- **Status Badges**: Color-coded status indicators (Applied, Interview, Offer, Rejected)
- **Interactive Elements**: Smooth animations and touch feedback
- **Pull-to-Refresh**: Refresh data with intuitive pull gesture
- **Loading States**: Professional loading screens with progress indicators

### 📊 **Job Management**
- **Add New Jobs**: Comprehensive form with validation for all job fields
- **Edit Jobs**: Full-featured edit modal with change tracking
- **Delete Jobs**: Safe deletion with confirmation dialogs
- **View Details**: Complete job information display with placeholders for missing data

### 🔥 **Firebase Integration**
- **Real-time Sync**: Instant data synchronization with Firestore
- **Offline Support**: Works offline with automatic sync when connected
- **Secure**: Firebase security rules and authentication ready
- **Scalable**: Cloud-based backend that scales automatically

### 📱 **Cross-Platform**
- **iOS & Android**: Native performance on both platforms
- **Responsive Design**: Adapts to different screen sizes
- **Safe Area**: Proper handling of device notches and status bars

### 🛡️ **Data Management**
- **Field Validation**: Required field validation with visual feedback
- **Change Tracking**: Tracks what fields were modified during edits
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Integrity**: Consistent data structure across all operations

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.4
- **Language**: TypeScript 5.8.3
- **Backend**: Firebase Firestore
- **Authentication**: Firebase Auth (ready for implementation)
- **State Management**: React Hooks (useState, useEffect)
- **Styling**: StyleSheet with modern design patterns
- **Navigation**: React Navigation (ready for implementation)
- **Platform**: iOS & Android

## 📁 Project Structure

```
jobSearchTracker/
├── src/                           # Source code directory
│   ├── components/                # Reusable UI components
│   │   ├── AddJobModal.tsx        # Modal for adding new jobs
│   │   ├── EditJobModal.tsx       # Modal for editing jobs
│   │   ├── ErrorDisplay.tsx       # Error display component
│   │   ├── LoadingSpinner.tsx     # Loading spinner component
│   │   └── index.ts              # Component exports
│   ├── firebase/                  # Firebase configuration
│   │   └── config.js             # Firestore setup
│   ├── screens/                   # Screen components
│   │   └── JobListScreen.js      # Main job listing screen
│   ├── services/                  # API and data services
│   │   └── jobService.js         # Job CRUD operations
│   ├── types/                     # TypeScript type definitions
│   │   ├── env.d.ts              # Environment types
│   │   └── index.ts              # Type exports
│   └── utils/                     # Utility functions
│       └── constants.ts          # App constants
├── android/                       # Android-specific files
├── ios/                          # iOS-specific files
├── App.tsx                       # Main app component
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase project setup

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/prakashkrsingh09/jobSearchTracker.git
   cd jobSearchTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the application**
   ```bash
   # For Android
   npm run android
   
   # For iOS
   npm run ios
   ```

## ⚙️ Configuration

### Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)

2. **Enable Firestore Database**
   - Go to Firestore Database in Firebase Console
   - Create database in production mode
   - Set up security rules (start with test mode for development)

3. **Add Firebase configuration**
   - Download `google-services.json` for Android
   - Download `GoogleService-Info.plist` for iOS
   - Place them in `android/app/` and `ios/jobSearchTracker/` respectively

4. **Configure Firestore**
   - Update `src/firebase/config.js` with your project configuration
   - Set up Firestore collections structure

### Environment Variables

Create a `.env` file in the root directory:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## 🛠️ Development

### Available Scripts

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run tests
npm test

# Lint code
npm run lint

# Clean build
npm run clean
```

### Code Structure

- **Components**: Reusable UI components with TypeScript
- **Screens**: Main application screens
- **Services**: Data layer with Firebase integration
- **Types**: TypeScript interfaces and type definitions
- **Utils**: Helper functions and constants

### Key Features Implementation

#### Job Management
- **Add Job**: `AddJobModal` component with form validation
- **Edit Job**: `EditJobModal` with change tracking
- **Delete Job**: Confirmation dialog with safe deletion
- **View Jobs**: Card-based layout with status indicators

#### Firebase Integration
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Real-time Updates**: Automatic data synchronization
- **Error Handling**: Comprehensive error management
- **Offline Support**: Works without internet connection

## 📱 Screenshots

### Main Job List Screen
![Main Screen](screenshots/Main.png)
*Clean, modern job list with status badges and interactive cards*

### Add New Job Modal
![Add Job Screen](screenshots/AddNewJobDetails.png)
*Comprehensive form for adding new job applications with validation*

### Edit Job Modal
![Edit Job Screen](screenshots/edit.png)
*Full-featured editing interface with change tracking*

### Job Card Details
![Job Card](screenshots/job-card-details.png)
*Detailed job information with placeholders for missing data*

### Status Indicators
![Status Badges](screenshots/status-badges.png)
*Color-coded status system: Applied (Blue), Interview (Orange), Offer (Green), Rejected (Red)*

### Loading States
![Loading Screen](screenshots/loading-screen.png)
*Professional loading interface with progress indicators*

### Empty State
![Empty State](screenshots/empty-state.png)
*Clean empty state when no jobs are available*

---

**Note**: To add your own screenshots:
1. Take screenshots of your app running on device/emulator
2. Save them in the `screenshots/` directory
3. Name them according to the references above
4. Recommended format: PNG, 1080x1920 or similar mobile resolution

## 🔧 Customization

### Adding New Fields
1. Update the job data interface in `types/index.ts`
2. Add field to the modal forms
3. Update the display components
4. Modify Firestore schema

### Styling
- Modify `StyleSheet` objects in components
- Update color scheme in constants
- Customize status badge colors
- Adjust spacing and typography

### Firebase Rules
```javascript
// Example Firestore security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /jobs/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

### Android
1. Generate signed APK
2. Upload to Google Play Store
3. Configure Firebase for production

### iOS
1. Archive the app in Xcode
2. Upload to App Store Connect
3. Configure Firebase for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Test on both iOS and Android
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Firebase team for robust backend services
- Contributors who helped improve the project

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

---

**Made with ❤️ using React Native and Firebase**