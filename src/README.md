# Job Search Tracker - Source Code Structure

This directory contains the organized source code for the Job Search Tracker React Native application.

## 📁 Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorDisplay.tsx     # Error display component
│   ├── LoadingSpinner.tsx   # Loading spinner component
│   ├── SheetDataRow.tsx     # Row display for sheet data
│   └── index.ts             # Component exports
├── services/            # API services and data fetching
│   ├── api.ts               # Axios configuration
│   └── googleSheetsService.ts # Google Sheets API service
├── types/               # TypeScript type definitions
│   ├── env.d.ts             # Environment variables types
│   └── index.ts             # Common types
├── utils/               # Utility functions and constants
│   └── constants.ts          # App constants and configuration
└── views/               # Screen components
    ├── HomeView.tsx          # Main home screen
    └── index.ts              # View exports
```

## 🔧 Key Features

### Services Layer
- **Axios Configuration**: Centralized HTTP client with interceptors
- **Google Sheets Service**: Dedicated service for Google Sheets API integration
- **Environment Variables**: Secure configuration management

### Components
- **Reusable Components**: Modular, reusable UI components
- **TypeScript Support**: Full type safety throughout
- **Consistent Styling**: Standardized design system

### Views
- **Screen Components**: Organized by feature/screen
- **State Management**: Local state with hooks
- **Error Handling**: Comprehensive error states

## 🚀 Usage

### Environment Variables
Create a `.env` file in the project root with:
```env
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_ID=your_sheet_id
GOOGLE_SHEETS_NAME=Sheet2
API_BASE_URL=https://sheets.googleapis.com/v4/spreadsheets
API_TIMEOUT=10000
```

### Adding New Components
1. Create component file in `src/components/`
2. Export from `src/components/index.ts`
3. Import using: `import { ComponentName } from '../components'`

### Adding New Services
1. Create service file in `src/services/`
2. Use the configured axios instance from `api.ts`
3. Export service functions/classes

### Adding New Views
1. Create view file in `src/views/`
2. Export from `src/views/index.ts`
3. Import using: `import { ViewName } from '../views'`

## 📱 Components Overview

- **LoadingSpinner**: Displays loading states with customizable text
- **ErrorDisplay**: Shows error messages with retry functionality
- **SheetDataRow**: Renders individual rows from Google Sheets data

## 🔌 Services Overview

- **api.ts**: Axios instance with request/response interceptors
- **googleSheetsService.ts**: Google Sheets API integration with TypeScript interfaces

## 🎯 Best Practices

1. **Type Safety**: Always define TypeScript interfaces
2. **Error Handling**: Use try-catch blocks and proper error states
3. **Component Reusability**: Create generic, reusable components
4. **Service Layer**: Keep API logic separate from UI components
5. **Environment Variables**: Use .env for sensitive configuration
