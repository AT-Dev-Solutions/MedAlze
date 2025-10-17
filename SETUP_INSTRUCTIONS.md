# MedAlze AI - Medical Imaging Analysis Platform

A comprehensive medical imaging platform built with React Native Expo that enables radiologists, doctors, and patients to collaborate on X-ray analysis using AI technology.

## Features

### For Radiologists
- Register and manage patients
- Upload X-ray images for AI analysis
- Dummy MobileNet model integration (easily replaceable)
- Gemini AI-powered medical analysis
- Assign reports to doctors
- Add radiologist notes to reports

### For Doctors
- View assigned X-ray reports
- Review AI-generated analysis
- Create prescriptions with medications
- Add precautions and recommendations
- Automatic report delivery to patients

### For Patients
- View X-ray reports and AI analysis
- Access prescriptions from doctors
- Download reports and prescriptions as PDF
- Secure access to medical records

## Technology Stack

- **Framework**: React Native with Expo
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage (X-ray images)
- **AI Integration**:
  - Dummy MobileNet model for anomaly detection (replaceable)
  - Google Gemini AI for medical text analysis
- **UI**: Custom component library with professional medical theme
- **Navigation**: Expo Router with role-based routing

## Prerequisites

1. Node.js (v18 or higher)
2. npm or yarn
3. Expo CLI
4. Firebase account
5. Google Cloud account (for Gemini API)

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name and follow setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Enable **Google** as sign-in provider
4. Add your app's authorized domains

### 3. Create Firestore Database

1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode**
4. Choose a location for your database

### 4. Set Up Firebase Storage

1. Go to **Storage**
2. Click "Get Started"
3. Use default security rules (we'll update them)
4. Choose storage location

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click "Web" (</>) to add a web app
4. Register app and copy the config values

### 6. Configure Google Sign-In

#### For Web:
- Already configured through Firebase Console

#### For Android:
1. In Firebase Console, download `google-services.json`
2. Get SHA-1 certificate fingerprint:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```
3. Add SHA-1 to Firebase project settings
4. Download updated `google-services.json`
5. Place it in your Android app directory

#### For iOS:
1. Download `GoogleService-Info.plist` from Firebase Console
2. Add to your iOS app directory
3. Configure URL schemes in `Info.plist`

## Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Click "Create API Key"
4. Copy the API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Update environment variables in `.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

## Firestore Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Patients collection
    match /patients/{patientId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'radiologist';
      allow update: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'radiologist';
    }

    // Doctors collection
    match /doctors/{doctorId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == doctorId;
    }

    // Radiologists collection
    match /radiologists/{radiologistId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == radiologistId;
    }

    // Reports collection
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'radiologist';
      allow update: if request.auth != null;
    }

    // Prescriptions collection
    match /prescriptions/{prescriptionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor';
      allow update: if request.auth != null &&
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'doctor';
    }

    // Notifications collection
    match /notifications/{notificationId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Firebase Storage Rules

Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // X-ray images
    match /xrays/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
                     request.resource.size < 10 * 1024 * 1024 &&
                     request.resource.contentType.matches('image/.*');
    }

    // Profile images
    match /profiles/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the Expo development server. You can then:
- Press `w` to open in web browser
- Scan QR code with Expo Go app (iOS/Android)

### Building for Production

#### Web:
```bash
npm run build:web
```

#### Android APK:
```bash
eas build --platform android --profile preview
```

#### iOS:
```bash
eas build --platform ios --profile preview
```

Note: Building native apps requires Expo Application Services (EAS) configuration.

## Replacing the Dummy AI Model

The current implementation uses a dummy MobileNet model that returns mock anomaly detection results. To replace it with your trained model:

1. Open `services/aiService.ts`
2. Locate the `detectAnomalies` function
3. Replace the mock implementation with your actual model:

```typescript
export const detectAnomalies = async (imageUri: string): Promise<DetectedAnomaly[]> => {
  // Load your trained TensorFlow model
  await tf.ready();
  const model = await tf.loadLayersModel('path/to/your/model.json');

  // Preprocess image
  const image = await loadAndPreprocessImage(imageUri);

  // Run inference
  const predictions = model.predict(image) as tf.Tensor;
  const results = await predictions.array();

  // Convert predictions to DetectedAnomaly format
  return parseModelOutput(results);
};
```

## User Roles and Workflow

1. **User Registration**:
   - All users sign in with Google
   - On first sign-in, users select their role (Radiologist/Doctor/Patient)
   - Doctors and Radiologists provide additional credentials

2. **Radiologist Workflow**:
   - Register patients in the system
   - Upload X-ray images
   - AI automatically detects anomalies
   - Gemini generates medical analysis
   - Assign report to a doctor

3. **Doctor Workflow**:
   - Receive notification of new report
   - Review X-ray, AI analysis, and radiologist notes
   - Create prescription with medications and precautions
   - Report automatically sent to patient

4. **Patient Workflow**:
   - Receive notification when report is ready
   - View X-ray image and AI analysis
   - Read doctor's prescription and recommendations
   - Download reports as PDF

## Project Structure

```
├── app/                          # Expo Router screens
│   ├── (radiologist)/           # Radiologist module
│   ├── (doctor)/                # Doctor module
│   ├── (patient)/               # Patient module
│   ├── index.tsx                # Welcome/Login screen
│   └── onboarding.tsx           # Role selection screen
├── components/                   # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── LoadingScreen.tsx
├── config/                       # Configuration files
│   └── firebase.ts              # Firebase initialization
├── constants/                    # App constants
│   └── theme.ts                 # Theme colors, spacing, etc.
├── contexts/                     # React contexts
│   └── AuthContext.tsx          # Authentication context
├── services/                     # Business logic and API calls
│   ├── authService.ts           # Authentication
│   ├── patientService.ts        # Patient operations
│   ├── doctorService.ts         # Doctor operations
│   ├── reportService.ts         # Report operations
│   ├── prescriptionService.ts   # Prescription operations
│   ├── storageService.ts        # Firebase Storage
│   ├── aiService.ts             # AI/ML integration
│   └── notificationService.ts   # Notifications
└── types/                        # TypeScript type definitions
    └── index.ts
```

## Key Features Implementation Status

✅ Google Sign-In authentication
✅ Role-based access control
✅ Patient registration (Radiologist)
✅ X-ray image upload
✅ Dummy MobileNet integration (replaceable)
✅ Gemini AI analysis
✅ Report generation and assignment
✅ Firebase Firestore integration
✅ Firebase Storage integration
✅ Professional medical-grade UI
✅ Cross-platform compatibility (Web, iOS, Android)

🚧 Doctor prescription creation (placeholder)
🚧 Patient PDF generation (placeholder)
🚧 Real-time notifications (basic structure)

## Troubleshooting

### Firebase Authentication Issues
- Ensure Google Sign-In is enabled in Firebase Console
- Verify OAuth consent screen is configured
- Check that authorized domains include your development domain

### Build Errors
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check that all environment variables are set correctly

### Image Upload Issues
- Verify Firebase Storage rules allow authenticated writes
- Check file size limits (default: 10MB)
- Ensure proper permissions for camera and gallery access

## Next Steps

1. Complete doctor prescription module
2. Implement patient PDF generation
3. Add real-time push notifications
4. Replace dummy model with trained TensorFlow model
5. Add report history and analytics
6. Implement search and filter features
7. Add data export functionality

## Support

For issues or questions:
1. Check Firebase Console for error logs
2. Review Expo logs during development
3. Verify all environment variables are correctly set
4. Ensure Firebase security rules are properly configured

## License

This project is for educational and development purposes.
