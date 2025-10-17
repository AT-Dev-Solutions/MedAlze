# MedAlze AI - Medical Imaging Analysis Platform

> A comprehensive medical imaging platform with AI-powered X-ray analysis, built with React Native Expo and Firebase.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue)
![Expo](https://img.shields.io/badge/Expo-54.0.10-black)
![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange)

---

## 🌟 Features

### For Radiologists
- ✅ Register and manage patients with full medical history
- ✅ Upload X-ray images (camera or gallery)
- ✅ AI-powered anomaly detection
- ✅ Gemini AI medical text analysis
- ✅ Assign reports to doctors
- ✅ Add radiologist notes and observations
- ✅ View report history

### For Doctors
- 🚧 Review assigned X-ray reports
- 🚧 View AI-generated analysis
- 🚧 Create prescriptions with medications
- 🚧 Add precautions and recommendations
- 🚧 Automatic report delivery to patients

### For Patients
- 🚧 View X-ray reports
- 🚧 Read AI analysis and doctor's notes
- 🚧 Access prescriptions
- 🚧 Download reports as PDF
- 🚧 Secure medical record access

---

## 🏗️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React Native with Expo SDK 54 |
| **Language** | TypeScript |
| **Authentication** | Firebase Authentication (Google Sign-In) |
| **Database** | Firebase Firestore |
| **Storage** | Firebase Storage |
| **AI/ML** | Google Gemini AI + TensorFlow.js (placeholder) |
| **Navigation** | Expo Router |
| **UI Components** | Custom component library |
| **State Management** | React Context API |

---

## 📁 Project Structure

```
mediscan-ai/
├── 📄 Configuration Files
│   ├── .env                        ← Configure your credentials here
│   ├── firestore.rules            ← Firestore security rules
│   ├── storage.rules              ← Storage security rules
│   ├── package.json               ← Dependencies
│   └── tsconfig.json              ← TypeScript config
│
├── 📱 Application Routes
│   └── app/
│       ├── index.tsx              ← Welcome/Login screen
│       ├── onboarding.tsx         ← Role selection
│       ├── _layout.tsx            ← Root layout with AuthProvider
│       ├── (radiologist)/         ← Radiologist module (COMPLETE)
│       │   ├── index.tsx          ← Dashboard
│       │   ├── patients.tsx       ← Patient list
│       │   ├── register-patient.tsx
│       │   ├── upload-xray.tsx    ← X-ray upload & AI analysis
│       │   ├── reports.tsx        ← Report history
│       │   └── notifications.tsx
│       ├── (doctor)/              ← Doctor module (PLACEHOLDER)
│       │   ├── index.tsx          ← Dashboard
│       │   ├── reports.tsx        ← View reports
│       │   └── notifications.tsx
│       └── (patient)/             ← Patient module (PLACEHOLDER)
│           ├── index.tsx          ← Dashboard
│           ├── reports.tsx        ← View reports
│           └── notifications.tsx
│
├── 🎨 UI Components
│   └── components/
│       ├── Button.tsx             ← Custom button component
│       ├── Card.tsx               ← Card container
│       ├── Input.tsx              ← Text input with validation
│       └── LoadingScreen.tsx      ← Loading spinner
│
├── ⚙️ Configuration
│   ├── config/
│   │   └── firebase.ts            ← Firebase initialization
│   └── constants/
│       └── theme.ts               ← Colors, spacing, typography
│
├── 🔐 Authentication & State
│   └── contexts/
│       └── AuthContext.tsx        ← Authentication state management
│
├── 🔧 Business Logic
│   └── services/
│       ├── aiService.ts           ← AI/ML integration (Gemini + TensorFlow)
│       ├── authService.ts         ← Authentication operations
│       ├── patientService.ts      ← Patient CRUD operations
│       ├── doctorService.ts       ← Doctor operations
│       ├── reportService.ts       ← Report management
│       ├── prescriptionService.ts ← Prescription operations
│       ├── storageService.ts      ← Firebase Storage uploads
│       └── notificationService.ts ← Notification management
│
└── 📝 Type Definitions
    └── types/
        └── index.ts               ← TypeScript interfaces
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Firebase account
- Google Cloud account (for Gemini API)

### Installation

1. **Download and extract** the project

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase** (see detailed guide below)

4. **Update environment variables** in `.env`

5. **Run the application:**
   ```bash
   npm run dev
   ```

6. **Open in browser** by pressing `w` or scan QR code with Expo Go app

---

## 📚 Documentation

We've created comprehensive guides to help you get started:

| Document | Purpose | Time Required |
|----------|---------|---------------|
| **📖 POST_DOWNLOAD_SETUP.md** | Step-by-step setup after download | 15-20 min |
| **🎬 VISUAL_SETUP_GUIDE.md** | Visual walkthrough with screenshots descriptions | 20 min |
| **🔥 FIREBASE_SETUP.md** | Detailed Firebase configuration | 10 min |
| **📋 QUICK_REFERENCE.md** | Quick reference card for common tasks | Reference |
| **📘 SETUP_INSTRUCTIONS.md** | Complete technical documentation | Full guide |

### Recommended Reading Order:
1. Start with **POST_DOWNLOAD_SETUP.md** for quick setup
2. Use **VISUAL_SETUP_GUIDE.md** if you need detailed visual guidance
3. Keep **QUICK_REFERENCE.md** handy for commands and troubleshooting

---

## 🔑 Environment Configuration

Create/update `.env` file in the root directory:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Gemini AI API Key
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**Where to get these values:**
- Firebase config: Firebase Console → Project Settings → General → Your apps
- Gemini API key: https://makersuite.google.com/app/apikey

---

## 🔥 Firebase Setup Summary

### 1. Create Firebase Project
- Go to https://console.firebase.google.com/
- Create new project
- Register web app

### 2. Enable Services
- **Authentication**: Enable Google sign-in provider
- **Firestore**: Create database in production mode
- **Storage**: Initialize storage bucket

### 3. Configure Security Rules
- Copy `firestore.rules` → Firestore Database → Rules tab → Publish
- Copy `storage.rules` → Storage → Rules tab → Publish

**Detailed instructions:** See `FIREBASE_SETUP.md`

---

## 🤖 AI Integration

### Current Implementation

#### 1. MobileNet Model (Dummy - Replace This)
**Location:** `services/aiService.ts` (line 40-70)

```typescript
export const detectAnomalies = async (imageUri: string): Promise<DetectedAnomaly[]> => {
  // TODO: Replace with your trained TensorFlow model
  // Current: Returns mock anomaly data
  // Replace with actual model inference
}
```

**Returns:**
```typescript
interface DetectedAnomaly {
  type: string;           // e.g., "Opacity", "Nodule"
  location: string;       // e.g., "Upper left lung field"
  confidence: number;     // 0.0 to 1.0
  description: string;    // Detailed description
}
```

#### 2. Gemini AI Analysis (Fully Functional)
**Location:** `services/aiService.ts` (line 10-38)

```typescript
export const analyzeMedicalImage = async (
  detectedAnomalies: DetectedAnomaly[]
): Promise<string> => {
  // ✅ Working: Sends anomalies to Gemini Pro
  // ✅ Returns: Comprehensive medical text analysis
}
```

**Analysis includes:**
- Comprehensive interpretation of findings
- Possible differential diagnoses
- Recommended follow-up actions
- Important considerations for physicians

### Workflow
```
Image Upload → MobileNet Detection → Gemini Analysis → Report Creation
     ↓               ↓                      ↓                  ↓
  X-ray file    Anomalies array      Text analysis      Saved to Firestore
```

---

## 👥 User Roles & Permissions

### Radiologist
- Register patients
- Upload X-ray images
- View AI analysis
- Assign reports to doctors
- Add clinical notes

### Doctor
- View assigned reports
- Read AI analysis
- Create prescriptions
- Add treatment recommendations

### Patient
- View own reports
- Read X-ray analysis
- Access prescriptions
- Download medical records

**Access control enforced by Firebase security rules**

---

## 🔐 Security Features

- **Authentication**: Firebase Authentication with Google OAuth
- **Authorization**: Role-based access control (RBAC)
- **Database Security**: Firestore security rules
- **Storage Security**: Storage rules with file type/size validation
- **Data Encryption**: Firebase handles encryption at rest and in transit
- **HIPAA Compliance**: Architecture supports HIPAA compliance (additional configuration required for production)

---

## 🎨 UI/UX Highlights

- **Medical-grade design** with professional color scheme
- **Responsive layout** for all screen sizes
- **Smooth animations** and transitions
- **Loading states** for better UX
- **Error handling** with user-friendly messages
- **Intuitive navigation** with tab-based architecture
- **Accessibility** considerations built-in

---

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **Web** | ✅ Fully supported | Tested and working |
| **iOS** | ✅ Supported | Requires Expo build configuration |
| **Android** | ✅ Supported | Requires Expo build configuration |

---

## 🧪 Testing

### Manual Testing Checklist
```
□ Authentication
  □ Google Sign-In works
  □ Role selection
  □ Profile creation

□ Radiologist Features
  □ Patient registration
  □ Patient list display
  □ Image upload (camera/gallery)
  □ AI analysis triggers
  □ Report creation

□ Database Operations
  □ Data saved to Firestore
  □ Images saved to Storage
  □ Security rules enforced

□ Cross-Platform
  □ Works on web browser
  □ Works on iOS device
  □ Works on Android device
```

### Running Tests
```bash
# Type checking
npm run typecheck

# Build test
npm run build:web
```

---

## 🚢 Deployment

### Web Deployment
```bash
# Build for production
npm run build:web

# Output: dist/ folder
# Deploy to: Firebase Hosting, Vercel, Netlify, etc.
```

### Mobile Deployment
```bash
# Configure EAS
eas build:configure

# Build Android APK
eas build --platform android --profile preview

# Build iOS
eas build --platform ios --profile preview
```

---

## 🔄 Replacing the Dummy AI Model

To integrate your trained TensorFlow model:

1. **Install TensorFlow.js:**
   ```bash
   npm install @tensorflow/tfjs @tensorflow/tfjs-react-native
   ```

2. **Update `services/aiService.ts`:**
   ```typescript
   import * as tf from '@tensorflow/tfjs';

   export const detectAnomalies = async (imageUri: string): Promise<DetectedAnomaly[]> => {
     // Load your model
     await tf.ready();
     const model = await tf.loadLayersModel('path/to/your/model.json');

     // Preprocess image
     const image = await loadAndPreprocessImage(imageUri);

     // Run inference
     const predictions = model.predict(image) as tf.Tensor;
     const results = await predictions.array();

     // Parse results into DetectedAnomaly format
     return parseModelOutput(results);
   };
   ```

3. **Test thoroughly** with real X-ray images

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run typecheck

# Build for web
npm run build:web

# Clear cache
npm start -- --clear

# Linting
npm run lint
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "unauthorized-domain" error | Add `localhost` to Firebase Auth authorized domains |
| Permission denied in Firestore | Republish `firestore.rules` |
| Image upload fails | Republish `storage.rules` and check file size (<10MB) |
| Gemini API error | Verify API key in `.env`, restart server |
| Module not found | Delete `node_modules`, run `npm install` |
| Changes not appearing | Stop server (Ctrl+C), restart with `npm run dev` |

**More troubleshooting:** See `POST_DOWNLOAD_SETUP.md` Section 🐛

---

## 📊 Database Schema

### Collections

#### users
```typescript
{
  userId: string;
  email: string;
  displayName: string;
  role: 'radiologist' | 'doctor' | 'patient';
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}
```

#### patients
```typescript
{
  patientId: string;
  registeredBy: string;  // radiologist userId
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  medicalHistory?: string;
  bloodGroup?: string;
  allergies?: string;
  createdAt: Timestamp;
}
```

#### reports
```typescript
{
  reportId: string;
  patientId: string;
  radiologistId: string;
  assignedDoctorId: string;
  xrayImageUrl: string;
  detectedAnomalies: DetectedAnomaly[];
  geminiAnalysis: string;
  radiologistNotes?: string;
  status: 'pending' | 'completed';
  sentToDoctor: boolean;
  sentToPatient: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Full schema:** See `types/index.ts`

---

## 🎯 Roadmap

### Current Status (v1.0)
- ✅ Firebase integration
- ✅ Google authentication
- ✅ Role-based access
- ✅ Radiologist module (complete)
- ✅ Patient registration
- ✅ X-ray upload
- ✅ Gemini AI analysis
- ✅ Report generation

### Planned Features (v1.1)
- 🚧 Doctor prescription module
- 🚧 Patient PDF generation
- 🚧 Push notifications
- 🚧 Real-time chat between roles
- 🚧 Report analytics dashboard
- 🚧 Appointment scheduling

### Future Enhancements (v2.0)
- Multiple imaging modalities (CT, MRI)
- Batch processing
- Advanced analytics
- Telemedicine integration
- API for third-party integration

---

## 📄 License

This project is for educational and development purposes.

---

## 🙏 Acknowledgments

- **Firebase** for backend infrastructure
- **Google Gemini AI** for medical text analysis
- **Expo** for cross-platform framework
- **React Native** for mobile development
- **TensorFlow.js** for ML capabilities

---

## 📞 Support

For setup assistance:
1. Read `POST_DOWNLOAD_SETUP.md` for quick start
2. Check `VISUAL_SETUP_GUIDE.md` for detailed walkthrough
3. Review `QUICK_REFERENCE.md` for common commands
4. See `FIREBASE_SETUP.md` for Firebase-specific help

---

## 🎉 Getting Started

Ready to start? Follow these steps:

1. **Read**: `POST_DOWNLOAD_SETUP.md`
2. **Configure**: Firebase project and `.env` file
3. **Run**: `npm install` then `npm run dev`
4. **Test**: Sign in and try creating a patient
5. **Customize**: Replace dummy AI model with yours

**Estimated setup time: 15-20 minutes**

---

Built with ❤️ for modern healthcare
