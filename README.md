# Job Search Tracker 📱

A React Native mobile application for tracking job applications with Google Sheets integration.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [NPM Packages](#npm-packages)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Job Search Tracker is a cross-platform mobile application built with React Native that helps users track their job applications. The app integrates with Google Sheets API to fetch and display job application data in real-time.

## ✨ Features

- 📊 **Google Sheets Integration**: Real-time data fetching from Google Sheets
- 🔄 **Pull-to-Refresh**: Refresh data with a simple pull gesture
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎨 **Modern UI**: Clean, intuitive interface with loading states
- ⚡ **Fast Performance**: Optimized with React Native best practices
- 🔒 **Secure**: Environment-based configuration management
- 🛠️ **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: React Native 0.81.4
- **Language**: TypeScript 5.8.3
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Styling**: StyleSheet
- **Environment**: react-native-dotenv
- **Platform**: iOS & Android

## 📁 Project Structure

```
jobSearchTracker/
├── src/                           # Source code directory
│   ├── components/                # Reusable UI components
│   │   ├── ErrorDisplay.tsx       # Error display component
│   │   ├── LoadingSpinner.tsx     # Loading spinner component
│   │   ├── SheetDataRow.tsx      # Row display for sheet data
│   │   └── index.ts              # Component exports
│   ├── services/                 # API services and data fetching
│   │   ├── api.ts               # Axios configuration
│   │   └── googleSheetsService.ts # Google Sheets API service
│   ├── views/                   # Screen components
│   │   ├── HomeView.tsx         # Main home screen
│   │   └── index.ts            # View exports
│   ├── types/                  # TypeScript type definitions
│   │   ├── env.d.ts           # Environment variables types
│   │   └── index.ts           # Common types
│   ├── config/                # Configuration files
│   │   ├── constants.ts       # App constants and configuration
│   │   └── test.ts           # Configuration testing
│   └── utils/                # Utility functions
│       └── constants.ts      # App constants and configuration
├── android/                  # Android-specific code
├── ios/                     # iOS-specific code
├── __tests__/              # Test files
├── .env                    # Environment variables
├── App.tsx                 # Main app component
├── package.json           # NPM dependencies
├── babel.config.js        # Babel configuration
├── metro.config.js        # Metro bundler configuration
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 🚀 Installation

### Prerequisites

- Node.js >= 20
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobSearchTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key
GOOGLE_SHEETS_ID=your_google_sheets_id
GOOGLE_SHEETS_NAME=Sheet2

# API Configuration
API_BASE_URL=https://sheets.googleapis.com/v4/spreadsheets
API_TIMEOUT=10000

# App Configuration
APP_NAME=Job Search Tracker
APP_VERSION=1.0.0
```

### Google Sheets Setup

1. Create a Google Sheet with your job application data
2. Enable Google Sheets API in Google Cloud Console
3. Generate an API key
4. Update the `.env` file with your credentials

## 🏃‍♂️ Development

### Running the App

```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios
```

### Development Commands

```bash
# Lint code
npm run lint

# Run tests
npm test

# Clear Metro cache
npx react-native start --reset-cache
```

## 📦 NPM Packages

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.1.0 | React library |
| `react-native` | 0.81.4 | React Native framework |
| `axios` | Latest | HTTP client for API calls |
| `react-native-dotenv` | Latest | Environment variable support |
| `react-native-safe-area-context` | ^5.5.2 | Safe area handling |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.8.3 | TypeScript support |
| `@types/react` | ^19.1.0 | React TypeScript definitions |
| `@types/jest` | ^29.5.13 | Jest TypeScript definitions |
| `eslint` | ^8.19.0 | Code linting |
| `prettier` | 2.8.8 | Code formatting |
| `jest` | ^29.6.3 | Testing framework |
| `@babel/core` | ^7.25.2 | Babel compiler |
| `@react-native/babel-preset` | 0.81.4 | React Native Babel preset |

### React Native CLI Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@react-native-community/cli` | 20.0.0 | React Native CLI |
| `@react-native-community/cli-platform-android` | 20.0.0 | Android platform support |
| `@react-native-community/cli-platform-ios` | 20.0.0 | iOS platform support |
| `@react-native/metro-config` | 0.81.4 | Metro bundler configuration |
| `@react-native/typescript-config` | 0.81.4 | TypeScript configuration |

## 🔌 API Integration

### Google Sheets API

The app integrates with Google Sheets API to fetch job application data:

- **Endpoint**: `https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{SHEET_NAME}`
- **Authentication**: API Key
- **Data Format**: JSON with `values` array

### Service Architecture

- **`api.ts`**: Axios configuration with interceptors
- **`googleSheetsService.ts`**: Google Sheets API integration
- **Error Handling**: Comprehensive error states and retry functionality

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📱 Platform Support

- **Android**: API level 21+ (Android 5.0+)
- **iOS**: iOS 11.0+
- **React Native**: 0.81.4

## 🔧 Development Tools

### Recommended VS Code Extensions

- **React Native Tools**: Microsoft
- **TypeScript Importer**: pmneo
- **ES7+ React/Redux/React-Native snippets**: dsznajder
- **Prettier - Code formatter**: Prettier
- **ESLint**: Microsoft

### Debugging

- **React Native Debugger**: Standalone debugging tool
- **Flipper**: Facebook's debugging platform
- **Chrome DevTools**: For JavaScript debugging

## 🚀 Deployment

### Android

```bash
# Generate release APK
cd android
./gradlew assembleRelease
```

### iOS

1. Open `ios/jobSearchTracker.xcworkspace` in Xcode
2. Select your target device/simulator
3. Build and run (⌘+R)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow ESLint configuration
- Use Prettier for code formatting
- Write TypeScript with proper types
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer Information

### Project Maintainer
- **Name**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [@yourusername]

### Development Environment
- **Node.js**: >= 20
- **npm**: Latest
- **React Native CLI**: Latest
- **Platform**: macOS (for iOS development)

### Getting Help

- 📖 [React Native Documentation](https://reactnative.dev/docs/getting-started)
- 🐛 [Report Issues](https://github.com/yourusername/jobSearchTracker/issues)
- 💬 [Discussions](https://github.com/yourusername/jobSearchTracker/discussions)

---

**Happy Coding! 🚀**