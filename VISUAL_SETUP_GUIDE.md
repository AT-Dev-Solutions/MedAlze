# Visual Firebase Setup Walkthrough

This guide provides step-by-step visual instructions with descriptions of what you'll see at each step.

---

## 🎬 Part 1: Creating Firebase Project (5 minutes)

### Step 1: Open Firebase Console

**What to do:**
- Open browser
- Go to: `https://console.firebase.google.com/`

**What you'll see:**
- Firebase homepage with all your projects (or empty if first time)
- Big blue "Add project" or "Create a project" button

---

### Step 2: Create New Project

**What to do:**
- Click "Add project" button

**What you'll see:**
- Page with heading "Create a project"
- Text field asking for project name

**What to enter:**
- Project name: `medalze-ai` (or your preferred name)
- Click "Continue"

---

### Step 3: Google Analytics (Optional)

**What you'll see:**
- Page asking "Enable Google Analytics for this project?"

**What to do:**
- Toggle OFF (recommended for development)
- Click "Create project"

**What happens:**
- Progress bar appears
- "Your new project is ready" message appears
- Click "Continue"

---

### Step 4: Project Dashboard

**What you'll see:**
- Main Firebase project dashboard
- Left sidebar with menu options
- Center area showing "Get started by adding Firebase to your app"
- Three icons: iOS, Android, Web

---

## 🌐 Part 2: Register Web App (3 minutes)

### Step 5: Add Web App

**What to do:**
- Click the **Web icon** `</>` (third icon)

**What you'll see:**
- Modal/page titled "Add Firebase to your web app"
- Text field for "App nickname"

**What to enter:**
- App nickname: `MedAlze AI`
- Leave "Firebase Hosting" UNCHECKED
- Click "Register app"

---

### Step 6: Get Configuration

**What you'll see:**
- A code block with `firebaseConfig` object
- Example:
  ```javascript
  const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXX",
    authDomain: "medalze-xxxxx.firebaseapp.com",
    projectId: "medalze-xxxxx",
    storageBucket: "medalze-xxxxx.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
  };
  ```

**CRITICAL - What to do:**
- ⭐ **Copy these 6 values** to a text file
- You'll need them for the `.env` file
- Click "Continue to console"

---

## 🔐 Part 3: Enable Authentication (2 minutes)

### Step 7: Navigate to Authentication

**What to do:**
- In left sidebar, click **Build** → **Authentication**

**What you'll see:**
- Big "Get started" button (if first time)
- OR list of sign-in providers if already initialized

**What to do:**
- Click "Get started" (if shown)

---

### Step 8: Enable Google Sign-In

**What you'll see:**
- List of sign-in providers
- Google, Email/Password, Phone, Anonymous, etc.
- Google row shows "Disabled" status

**What to do:**
- Click on the **Google** row

**What you'll see:**
- Modal opens with "Google" sign-in method settings
- Toggle switch at top (currently OFF)
- Support email dropdown

**What to do:**
- Toggle switch to **ON** (turns blue)
- Select your email from "Support email" dropdown
- Click **Save**

**What you'll see:**
- Modal closes
- Google now shows "Enabled" status with green checkmark

---

## 📊 Part 4: Create Firestore Database (3 minutes)

### Step 9: Navigate to Firestore

**What to do:**
- In left sidebar, click **Build** → **Firestore Database**

**What you'll see:**
- Large "Create database" button
- Description of Cloud Firestore

**What to do:**
- Click "Create database"

---

### Step 10: Security Rules Mode

**What you'll see:**
- Modal asking "Secure rules for Cloud Firestore"
- Two radio options:
  - ⚪ Start in production mode (recommended)
  - ⚪ Start in test mode

**What to do:**
- Select **"Start in production mode"**
- Click **Next**

---

### Step 11: Choose Location

**What you'll see:**
- Dropdown menu titled "Cloud Firestore location"
- List of regions like:
  - nam5 (us-central)
  - eur3 (europe-west)
  - asia-northeast1, etc.

**What to do:**
- Select location **closest to your users**
  - US users: `nam5 (us-central)`
  - Europe users: `eur3 (europe-west)`
  - Asia users: `asia-northeast1`
- Click **Enable**

**What happens:**
- Progress indicator appears
- Takes ~30-60 seconds
- Database is created

---

### Step 12: Firestore Dashboard

**What you'll see:**
- Firestore console with tabs: Data, Rules, Indexes, Usage
- "Start collection" button (we'll ignore this)
- Empty database

---

### Step 13: Update Firestore Rules

**What to do:**
- Click **Rules** tab at the top

**What you'll see:**
- Code editor with default rules:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if false;
      }
    }
  }
  ```

**What to do:**
1. **Select all text** (Ctrl+A / Cmd+A)
2. **Delete** it
3. **Open** the file `firestore.rules` from your downloaded project
4. **Copy all content**
5. **Paste** into Firebase Console editor
6. Click **Publish** button (top right)

**What you'll see:**
- Green success message: "Rules published successfully"
- Timestamp showing when rules were published

---

## 💾 Part 5: Set Up Storage (3 minutes)

### Step 14: Navigate to Storage

**What to do:**
- In left sidebar, click **Build** → **Storage**

**What you'll see:**
- "Get started" button
- Description of Cloud Storage

**What to do:**
- Click "Get started"

---

### Step 15: Security Rules

**What you'll see:**
- Modal titled "Set up Cloud Storage"
- Default security rules shown
- "Next" button

**What to do:**
- Click **Next** (accept default for now, we'll change it)

---

### Step 16: Choose Location

**What you'll see:**
- Dropdown for "Cloud Storage location"
- Same regions as Firestore

**What to do:**
- Select **same location** as your Firestore database
- Click **Done**

**What happens:**
- Storage bucket is created
- Takes ~10 seconds

---

### Step 17: Storage Dashboard

**What you'll see:**
- Storage console with tabs: Files, Rules, Usage
- Empty files area
- Your storage bucket name: `medalze-xxxxx.appspot.com`

---

### Step 18: Update Storage Rules

**What to do:**
- Click **Rules** tab

**What you'll see:**
- Code editor with default rules:
  ```javascript
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /{allPaths=**} {
        allow read, write: if false;
      }
    }
  }
  ```

**What to do:**
1. **Select all text** (Ctrl+A / Cmd+A)
2. **Delete** it
3. **Open** the file `storage.rules` from your downloaded project
4. **Copy all content**
5. **Paste** into Firebase Console editor
6. Click **Publish** button

**What you'll see:**
- Green success message: "Rules published successfully"

---

## 🤖 Part 6: Get Gemini API Key (2 minutes)

### Step 19: Open Google AI Studio

**What to do:**
- Open new browser tab
- Go to: `https://makersuite.google.com/app/apikey`

**What you'll see:**
- Google AI Studio page
- "Get API key" or "Create API key" button

---

### Step 20: Create API Key

**What to do:**
- Click **"Create API Key"**

**What you'll see:**
- Modal asking "Create API key in which project?"
- Options:
  - ⚪ Create API key in new project
  - ⚪ Create API key in existing project (shows your Firebase project)

**What to do:**
- Select **"Create API key in new project"** (recommended)
- OR select your Firebase project if you prefer
- Click **Create**

---

### Step 21: Copy API Key

**What you'll see:**
- Your API key displayed (starts with `AIzaSy...`)
- Copy button next to it

**CRITICAL - What to do:**
- Click **copy button** or select and copy the key
- ⭐ **Save it somewhere safe** (you won't see it again!)
- Example: `AIzaSyBoDXXXXXXXXXXXXXXXXXXXXXXX`

---

## 📝 Part 7: Configure .env File (2 minutes)

### Step 22: Open Project in Code Editor

**What to do:**
- Open your downloaded project in VS Code / Cursor / any editor
- Find the `.env` file in the root directory

**What you'll see:**
- File with placeholder values:
  ```env
  EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  ...
  ```

---

### Step 23: Replace Placeholder Values

**What to do:**
- Replace each placeholder with values from Step 6 and Step 21:

**BEFORE:**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

**AFTER (example with your actual values):**
```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=medalze-xxxxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=medalze-xxxxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=medalze-xxxxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyBoDXXXXXXXXXXXXXXXXX
```

**What to do:**
- Save the file (Ctrl+S / Cmd+S)

---

## 🚀 Part 8: Run the Application (2 minutes)

### Step 24: Install Dependencies

**What to do:**
- Open terminal in project directory
- Run:
  ```bash
  npm install
  ```

**What you'll see:**
- npm downloading packages
- Progress bars
- Takes 2-3 minutes

---

### Step 25: Start Development Server

**What to do:**
- Run:
  ```bash
  npm run dev
  ```

**What you'll see:**
- Metro bundler starting
- Output like:
  ```
  › Metro waiting on exp://192.168.1.100:8081
  › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

  › Web is waiting on http://localhost:8081

  › Press w │ open web browser
  › Press a │ open Android
  › Press i │ open iOS simulator
  ```

---

### Step 26: Open in Browser

**What to do:**
- Press `w` key

**What you'll see:**
- Browser opens automatically
- App loads (may take 10-20 seconds first time)
- **Welcome screen** with "MedAlze AI" title
- Blue "Sign In with Google" button

---

## ✅ Part 9: Test Authentication (2 minutes)

### Step 27: Sign In

**What you'll see:**
- Welcome screen with app branding

**What to do:**
- Click **"Sign In with Google"**

**What you'll see:**
- Google sign-in popup
- List of your Google accounts

**What to do:**
- Select your account
- Grant permissions if asked

---

### Step 28: Onboarding Screen

**What you'll see:**
- "Complete Your Profile" screen
- Three role cards:
  - 📡 Radiologist
  - 🩺 Doctor
  - 👤 Patient

**What to do:**
- Click **"Radiologist"** card

**What you'll see:**
- Card gets blue border (selected)
- Form appears below with fields:
  - License Number *
  - Certification *
  - Hospital/Institution *

**What to enter:**
- License Number: `RAD-12345`
- Certification: `Board Certified Radiologist`
- Hospital: `Test Medical Center`

**What to do:**
- Click **"Complete Setup"** button

---

### Step 29: Radiologist Dashboard

**What you'll see:**
- Welcome message with your name
- Three stat cards showing:
  - 0 Total Patients
  - 0 Reports Generated
  - 0 Pending
- Quick Actions section with buttons:
  - "Register New Patient"
  - "Upload X-Ray for Analysis"
  - "View All Patients"
- Bottom tab bar with 4 tabs

**SUCCESS!** 🎉 Your app is now fully functional!

---

## 🧪 Part 10: Test Core Features (5 minutes)

### Step 30: Register a Patient

**What to do:**
- Click **"Register New Patient"**

**What you'll see:**
- New screen with form sections:
  - Personal Information
  - Contact Information
  - Medical Information

**What to enter:**
- Full Name: `John Doe`
- Age: `45`
- Gender: Select **Male**
- Contact Number: `123-456-7890`
- Email: `john.doe@example.com`
- Blood Group: `O+` (optional)

**What to do:**
- Click **"Register Patient"** button

**What you'll see:**
- Alert: "Patient registered successfully!"
- Redirected back to dashboard
- Stats update: "1 Total Patients"

---

### Step 31: View Patients List

**What to do:**
- Tap **"Patients"** tab at bottom

**What you'll see:**
- Header: "Patients - 1 registered"
- Search bar
- Patient card showing:
  - 👤 Avatar icon
  - Name: John Doe
  - Age: 45 years • male
  - Email: john.doe@example.com
  - Upload icon (📤) on right

---

### Step 32: Upload X-Ray

**What to do:**
- Click the **upload icon** (📤) on patient card

**What you'll see:**
- "Upload X-Ray" screen
- Two options:
  - 📷 Take Photo
  - 🖼️ Choose from Gallery

**What to do:**
- Click **"Choose from Gallery"**
- Select any image (test X-ray or any photo)

**What you'll see:**
- Image preview appears
- X button to remove image
- "Select Patient" section (John Doe pre-selected)
- "Assign to Doctor" section

---

### Step 33: Create Test Doctor (If Needed)

**Note:** You'll need at least one doctor in the system

**What to do:**
1. Open new browser tab/incognito window
2. Go to `http://localhost:8081`
3. Sign in with different Google account
4. Select **"Doctor"** role
5. Fill doctor information
6. Complete setup

**Return to radiologist tab**

---

### Step 34: Analyze X-Ray

**What to do:**
- Select patient (already selected)
- Click "Assign to Doctor" dropdown
- Select a doctor
- (Optional) Add notes in "Radiologist Notes"
- Click **"Analyze & Send Report"**

**What you'll see:**
- Button changes to "Analyzing..."
- AI detects anomalies (2 seconds)
- Gemini generates analysis
- Button shows "Uploading X%"
- Alert: "X-ray analyzed and report sent successfully!"

---

### Step 35: Verify in Firebase

**What to do:**
- Go back to Firebase Console
- Click Firestore Database
- Click "Data" tab

**What you'll see:**
- Collections created:
  - ✅ users
  - ✅ radiologists
  - ✅ doctors (if you created doctor)
  - ✅ patients
  - ✅ reports
  - ✅ notifications

**What to do:**
- Click on **reports** collection
- Click on the document ID

**What you'll see:**
- Report data including:
  - `patientId`
  - `radiologistId`
  - `assignedDoctorId`
  - `xrayImageUrl` (Firebase Storage URL)
  - `detectedAnomalies` (array)
  - `geminiAnalysis` (text from AI)
  - `status: "pending"`
  - Timestamps

---

### Step 36: Verify Image in Storage

**What to do:**
- In Firebase Console, click **Storage**
- Click "Files" tab

**What you'll see:**
- Folder: `xrays/`
- Inside: Your uploaded image
- Format: `patientId_timestamp.jpg`

**What to do:**
- Click on the image

**What you'll see:**
- Image preview
- File details (size, type, URL)
- Your uploaded X-ray/test image

---

## 🎉 Success Checklist

If you can see all of these, you're 100% set up:

- ✅ Google Sign-In works
- ✅ User profile created in Firestore
- ✅ Dashboard shows your name
- ✅ Patient registration works
- ✅ Patient appears in Firestore `patients` collection
- ✅ Image upload works
- ✅ Image appears in Firebase Storage
- ✅ AI analysis runs (Gemini API called)
- ✅ Report created with analysis
- ✅ Report appears in Firestore `reports` collection

---

## 🎥 Video Tutorial Equivalent

This visual guide is equivalent to a video tutorial. Follow each step in order, and you'll have a working application in ~20 minutes.

**Timestamps equivalent:**
- 00:00-05:00 - Creating Firebase Project
- 05:00-07:00 - Enabling Authentication
- 07:00-10:00 - Setting up Firestore
- 10:00-13:00 - Setting up Storage
- 13:00-15:00 - Getting Gemini API
- 15:00-17:00 - Configuring .env
- 17:00-19:00 - Running the app
- 19:00-25:00 - Testing all features

---

## 📸 Screenshots to Take (Optional)

If you want to create your own documentation:

1. Firebase Console - Project dashboard
2. Authentication - Google enabled
3. Firestore - Rules published
4. Storage - Rules published
5. .env file - Before and after
6. Terminal - npm run dev output
7. Browser - Welcome screen
8. Browser - Dashboard
9. Browser - Patient registration
10. Firestore - Data showing collections
11. Storage - Uploaded X-ray image

---

## 🆘 Visual Troubleshooting

### Can't see "Add project" button?
- You're signed in to wrong Google account
- Sign out and sign in with correct account

### Don't see Web icon `</>`?
- You're on wrong page
- Go back to project overview (home icon in breadcrumb)

### Can't enable Google Auth?
- You selected wrong sign-in method
- Look for the row with Google logo (colorful G)

### Rules won't publish?
- Syntax error in rules
- Copy exactly from provided files
- Make sure no extra characters

### .env changes not working?
- Server needs restart
- Press Ctrl+C in terminal
- Run `npm run dev` again

---

You're all set! 🚀 Enjoy building with MedAlze AI!
