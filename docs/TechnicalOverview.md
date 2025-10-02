## Job Search Tracker — Technical Overview

This document provides a technical explanation of the Job Search Tracker mobile application so you can share the project with recruiters, teammates, or open‑source contributors. It focuses on architecture, core flows, major components, and key implementation choices.

### 1) Tech Stack
- **Framework**: React Native 0.81.4 (Hermes)
- **Language**: TypeScript for app code, JavaScript where noted
- **Navigation**: `@react-navigation/native` + native stack
- **Backend**: Firebase (Auth + Firestore)
- **HTTP**: Axios instance with interceptors
- **State**: Local component state; Firestore provides real-time sync
- **Tooling**: Jest for tests, ESLint + Prettier

### 2) High-Level Architecture
- **Entry**: `App.tsx` decides between authenticated app (`JobListScreen`) and `AuthEmailScreen` by observing Firebase Auth state. It shows a configurable animated `SplashScreen` during startup.
- **Data Layer**: `src/firebase/config.js` exposes `firebaseAuth`, `db`, and user-scoped collection helpers. Services (`src/services/*.js|ts`) encapsulate Firestore CRUD and profile operations.
- **UI Layer**: Screens and components in `src/screens` and `src/components` render lists, forms, and modals for managing job applications.
- **Configuration**: `src/config/constants.ts` and `src/config/splashConfig.ts` provide runtime and UI config; environment variables are supported via `react-native-dotenv` with fallbacks.

### 3) Core Features & Flows
- **Authentication**
  - Uses Firebase Auth (`firebaseAuth.onAuthStateChanged`) to reactively route users.
  - `AuthEmailScreen` handles email-based auth (extensible to providers).

- **Job Application Management**
  - CRUD operations wrapped in `src/services/jobService.js` using user-scoped Firestore collections:
    - `addJobApplication(jobData)` adds metadata (`user_id`, `created_at`, `updated_at`).
    - `getJobApplications()` queries and orders by `created_at` desc.
    - `updateJobApplication(jobId, changes)` supports both object updates and change arrays.
    - `deleteJobApplication(jobId)` removes a job doc.
  - `JobListScreen` loads jobs, shows a modern card UI with status badges and placeholders, and opens modals for add/edit.

- **User Profile Management**
  - `src/services/userService.js` provides `createUserProfile`, `getUserProfile`, `updateUserProfile`, and `deleteUserAccount` (which cascades deletion of user subcollections).

- **Splash Experience**
  - `src/components/SplashScreen.tsx` is an animated splash with logo/background, fade/scale/slide, and loading dots.
  - Configuration presets live in `src/config/splashConfig.ts` and are selected in `App.tsx`.

### 4) Data Model (Firestore)
- Root collection: `users/{uid}`
  - Subcollection: `jobs/{jobId}` — application fields (e.g., `company_name`, `job_title`, `job_application_status`, `applied_date`, etc.) plus timestamps.
  - Subcollection: `settings/*` — user preferences.

All job queries are scoped to the authenticated user via helpers in `src/firebase/config.js` (`getUserJobsCollection`). Security rules should enforce user isolation.

### 5) Networking Layer
`src/services/api.ts` configures an Axios client using `getConfig()` from `src/config/constants.ts`:
- `baseURL` and `timeout` are sourced from env or fallback constants.
- Interceptors log requests/responses and centralize error handling.
- Though Firestore SDK is primary for persistence, this client enables future integrations (e.g., Sheets/REST).

### 6) Notable Implementation Details
- **Change Tracking for Edits**: `updateJobApplication` accepts a change array (`{ field, previousValue, newValue }`) and compacts it to a Firestore update object, ensuring consistent `updated_at` writes.
- **Resilience & Placeholders**: UI renders placeholder text for missing optional fields to maintain layout integrity.
- **Safe Operations**: Deletions require user confirmation; errors surface via alerts/console for developer diagnostics.
- **Theming & Safe Areas**: Uses `react-native-safe-area-context` and honors system color scheme for StatusBar.

### 7) Build & Run
- Android: `npm run android`
- iOS: `npm run ios` (run `pod install` in `ios/` first)
- Start bundler: `npm start`
- Test: `npm test`

### 8) Configuration & Environment
- `.env` values (via `@env`) can override fallbacks in `src/config/constants.ts`:
  - `GOOGLE_SHEETS_API_KEY`, `GOOGLE_SHEETS_ID`, `GOOGLE_SHEETS_NAME`, `API_BASE_URL`, `API_TIMEOUT`, `APP_NAME`, `APP_VERSION`.
- Firebase app credentials must be added to platform projects (`google-services.json` for Android, `GoogleService-Info.plist` for iOS) and initialized by `@react-native-firebase/*` packages.

### 9) Extensibility Roadmap
- Add push notifications for status changes.
- Introduce filters/sorting and search across jobs.
- Add analytics for application funnel metrics.
- Support additional auth providers (Google, Apple).
- Offline-first enhancements with local caching and optimistic updates.

### 10) Repository Pointers
- App entry: `App.tsx`
- Auth & Firestore setup: `src/firebase/config.js`
- Job services: `src/services/jobService.js`
- User services: `src/services/userService.js`
- Axios client: `src/services/api.ts`
- UI screens: `src/screens/JobListScreen.js`, `src/screens/AuthEmailScreen.js`
- UI components: `src/components/*` (e.g., `SplashScreen.tsx`, `AddJobModal.tsx`, `EditJobModal.tsx`)
- Config: `src/config/constants.ts`, `src/config/splashConfig.ts`

---

For a product‑focused overview and screenshots, see `README.md`. This document is intended for technical audiences who want to understand how the app is built and how to extend it.


