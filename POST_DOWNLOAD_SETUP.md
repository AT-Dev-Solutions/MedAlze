# Post-Download Configuration Guide

## 📋 Checklist Overview

After downloading this project, you need to configure:
- [ ] Firebase Project (5 minutes)
- [ ] Environment Variables (2 minutes)
- [ ] Gemini API Key (2 minutes)
- [ ] Install Dependencies (3 minutes)
- [ ] Test the Application (5 minutes)

**Total Time: ~15-20 minutes**

---

## Step 1: Extract and Install Dependencies

1. **Extract the downloaded project** to your desired location

2. **Open terminal** in the project directory

3. **Install dependencies:**
   ```bash
   npm install
   ```

   Wait for installation to complete (this may take 2-3 minutes)

---

## Step 2: Create Firebase Project

### 2.1 Go to Firebase Console

1. Open browser and go to: https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter project name: `mediscan-ai` (or any name you prefer)
4. Click **Continue**
5. **Disable Google Analytics** (or enable if you want tracking)
6. Click **Create project**
7. Wait ~30 seconds for project creation

### 2.2 Register Web App

1. On project homepage, click the **Web icon** `</>`
2. App nickname: `MedAlze AI`
3. ❌ **DON'T** check "Firebase Hosting" (not needed)
4. Click **Register app**
5. **IMPORTANT:** Copy the `firebaseConfig` object that appears:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXX",           // Copy this
  authDomain: "your-project.firebaseapp.com",    // Copy this
  projectId: "your-project-id",                  // Copy this
  storageBucket: "your-project.appspot.com",     // Copy this
  messagingSenderId: "123456789012",             // Copy this
  appId: "1:123456789012:web:abcdef123456"      // Copy this
};
```

6. Click **Continue to console**

---

## Step 3: Enable Google Authentication

1. In Firebase Console, click **Build** → **Authentication**
2. Click **Get started**
3. Under "Sign-in providers", click **Google**
4. Toggle **Enable** switch ON
5. **Support email**: Select your email from dropdown
6. Click **Save**

---

## Step 4: Create Firestore Database

1. Click **Build** → **Firestore Database**
2. Click **Create database**
3. Select **"Start in production mode"**
4. Click **Next**
5. Choose location: **Select closest to your users** (e.g., us-central, europe-west)
6. Click **Enable**
7. Wait for database creation (~1 minute)

### 4.1 Update Firestore Rules

1. Once created, click **Rules** tab at the top
2. **Select all text** in the editor and delete it
3. Open the file `firestore.rules` in your downloaded project
4. **Copy all content** from that file
5. **Paste** into Firebase Console rules editor
6. Click **Publish**
7. Wait for "Rules published successfully" message

---

## Step 5: Set Up Firebase Storage

1. Click **Build** → **Storage**
2. Click **Get started**
3. Click **Next** (accept default security rules)
4. Choose **same location** as Firestore
5. Click **Done**

### 5.1 Update Storage Rules

1. Click **Rules** tab at the top
2. **Select all text** and delete it
3. Open the file `storage.rules` in your downloaded project
4. **Copy all content**
5. **Paste** into Firebase Console rules editor
6. Click **Publish**

---

## Step 6: Get Gemini API Key

1. Open new tab: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select **"Create API key in new project"** (or select existing project)
5. Click **Create**
6. **Copy the API key** (starts with `AIzaSy...`)
7. ⚠️ **Save it somewhere** - you won't see it again!

---

## Step 7: Configure Environment Variables

### 7.1 Open `.env` File

In your downloaded project, find and open the `.env` file (in root directory)

### 7.2 Update ALL Values

Replace the placeholder values with your actual Firebase and Gemini credentials:

```env
# Firebase Configuration (from Step 2.2)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Gemini API Key (from Step 6)
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXX
```

### 7.3 Save the File

Press **Ctrl+S** (Windows/Linux) or **Cmd+S** (Mac)

---

## Step 8: Run the Application

1. **Open terminal** in project directory

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Wait for Metro bundler** to start (~10 seconds)

4. You'll see output like:
   ```
   › Metro waiting on exp://192.168.1.xxx:8081
   › Web is waiting on http://localhost:8081
   ```

5. **Press `w`** to open in web browser

   OR

   **Scan QR code** with Expo Go app on your phone

---

## Step 9: Test the Application

### 9.1 Test Authentication

1. You should see the **MedAlze AI welcome screen**
2. Click **"Sign In with Google"**
3. Select your Google account
4. Grant permissions

### 9.2 Complete Onboarding

1. Select **"Radiologist"** role
2. Fill in the form:
   - License Number: `RAD-12345`
   - Certification: `Board Certified Radiologist`
   - Hospital: `Test Medical Center`
3. Click **"Complete Setup"**

### 9.3 Test Main Features

**As Radiologist:**

1. You'll see the dashboard with stats
2. Click **"Register New Patient"**
3. Fill in patient details:
   - Full Name: `Test Patient`
   - Age: `45`
   - Gender: Select one
   - Contact: `123-456-7890`
   - Email: `test@example.com`
4. Click **"Register Patient"**

5. Go to **"Patients"** tab
6. Find your patient, click upload icon
7. Upload a test X-ray image (any image will work for testing)
8. Select patient and doctor
9. Click **"Analyze & Send Report"**
10. Wait for AI analysis (uses Gemini API)

---

## ✅ Success Indicators

You'll know everything is working when:

- ✅ Google Sign-In completes successfully
- ✅ You can create user profile
- ✅ Dashboard shows your name
- ✅ You can register patients
- ✅ Image upload completes
- ✅ Gemini AI generates analysis text
- ✅ Report is created in Firestore

---

## 🐛 Troubleshooting Common Issues

### Issue 1: "Firebase: Error (auth/unauthorized-domain)"

**Solution:**
1. Go to Firebase Console → Authentication → Settings
2. Click **Authorized domains**
3. Add: `localhost`
4. Try signing in again

### Issue 2: "Permission denied" when creating patient

**Solution:**
1. Go to Firebase Console → Firestore Database → Rules
2. Verify rules match content in `firestore.rules` file
3. Click **Publish** again
4. Wait 1 minute and retry

### Issue 3: Image upload fails

**Solution:**
1. Go to Firebase Console → Storage → Rules
2. Verify rules match content in `storage.rules` file
3. Click **Publish**
4. Try uploading again

### Issue 4: Gemini API error "API key not valid"

**Solution:**
1. Verify your Gemini API key in `.env` file
2. Make sure there are no spaces before/after the key
3. Check the key starts with `AIzaSy`
4. Stop server (Ctrl+C) and restart: `npm run dev`

### Issue 5: "Cannot find module '@/components/Button'"

**Solution:**
1. Delete `node_modules` folder
2. Run: `npm install`
3. Restart server: `npm run dev`

---

## 📱 Running on Mobile Device

### For Android/iOS Physical Device:

1. Install **Expo Go** app from:
   - Google Play Store (Android)
   - Apple App Store (iOS)

2. Make sure your phone is on **same Wi-Fi** as your computer

3. In terminal where server is running, scan the **QR code**

4. App will load on your device

⚠️ **Note:** Some features like camera may work better on physical device than web

---

## 🔧 File Locations Reference

After download, here's where key files are:

```
mediscan-ai/
├── .env                          ← UPDATE THIS (Step 7)
├── firestore.rules               ← Copy to Firebase Console (Step 4.1)
├── storage.rules                 ← Copy to Firebase Console (Step 5.1)
├── FIREBASE_SETUP.md            ← Detailed Firebase guide
├── SETUP_INSTRUCTIONS.md        ← Full documentation
│
├── app/
│   ├── index.tsx                ← Welcome/Login screen
│   ├── onboarding.tsx           ← Role selection
│   ├── (radiologist)/           ← Radiologist features
│   ├── (doctor)/                ← Doctor features
│   └── (patient)/               ← Patient features
│
├── config/
│   └── firebase.ts              ← Firebase initialization (uses .env)
│
├── services/
│   ├── aiService.ts             ← Gemini AI + MobileNet
│   ├── authService.ts           ← Authentication
│   ├── patientService.ts        ← Patient operations
│   └── reportService.ts         ← Report operations
│
└── package.json                 ← Dependencies
```

---

## 🎯 Next Steps After Setup

Once everything is working:

1. **Replace Dummy AI Model:**
   - Open `services/aiService.ts`
   - Replace `detectAnomalies` function (line 40-70)
   - Integrate your trained TensorFlow model

2. **Customize UI:**
   - Modify `constants/theme.ts` for colors
   - Update components in `components/` folder

3. **Add Doctor Features:**
   - Complete prescription creation in `app/(doctor)/`
   - Add report review functionality

4. **Add Patient Features:**
   - Implement PDF generation
   - Add prescription viewing

5. **Deploy to Production:**
   - Build for web: `npm run build:web`
   - Build for mobile: Configure EAS and run `eas build`

---

## 📞 Need Help?

If you encounter issues:

1. Check **Firebase Console** → Authentication/Firestore/Storage for error logs
2. Check **browser console** (F12) for error messages
3. Check **terminal** where `npm run dev` is running for errors
4. Review `FIREBASE_SETUP.md` for detailed Firebase instructions
5. Review `SETUP_INSTRUCTIONS.md` for full documentation

---

## ⏱️ Quick Setup Summary

**Minimum viable setup (to see it working):**

1. `npm install` (3 min)
2. Create Firebase project (2 min)
3. Enable Google Auth (1 min)
4. Create Firestore + publish rules (2 min)
5. Create Storage + publish rules (2 min)
6. Get Gemini API key (2 min)
7. Update `.env` file (2 min)
8. `npm run dev` (1 min)

**Total: ~15 minutes** ⚡

---

## 🎉 You're Ready!

Once you complete these steps, you'll have a fully functional medical imaging platform with:
- ✅ Google authentication
- ✅ Role-based access
- ✅ Patient management
- ✅ X-ray upload
- ✅ AI analysis with Gemini
- ✅ Report generation

Happy coding! 🚀
