# Quick Reference Card

## 📋 Essential Links

| Resource | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com/ |
| Gemini API Keys | https://makersuite.google.com/app/apikey |
| Expo Documentation | https://docs.expo.dev/ |
| Firebase Docs | https://firebase.google.com/docs |

---

## 🔑 Files to Configure

### 1. `.env` (Root directory)
```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_GEMINI_API_KEY=
```

### 2. `firestore.rules` → Copy to Firebase Console
- Location: Firestore Database → Rules tab
- Action: Select all, paste, click Publish

### 3. `storage.rules` → Copy to Firebase Console
- Location: Storage → Rules tab
- Action: Select all, paste, click Publish

---

## ⚡ Command Quick Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Then press:
# w - Open web browser
# a - Open Android emulator
# i - Open iOS simulator

# Stop server
Ctrl + C

# Clear cache and restart
npm start -- --clear

# Type checking
npm run typecheck

# Build for web
npm run build:web
```

---

## 🎯 Setup Checklist (20 min)

```
□ Create Firebase project
□ Enable Google Authentication
□ Create Firestore Database
  □ Publish firestore.rules
□ Create Firebase Storage
  □ Publish storage.rules
□ Get Gemini API key
□ Update .env file (7 values)
□ Run: npm install
□ Run: npm run dev
□ Test: Sign in with Google
```

---

## 🗂️ Project Structure

```
mediscan-ai/
├── .env                    ← UPDATE THIS
├── firestore.rules         ← Copy to Firebase
├── storage.rules           ← Copy to Firebase
│
├── app/
│   ├── (radiologist)/     ← Fully functional
│   ├── (doctor)/          ← Placeholder
│   └── (patient)/         ← Placeholder
│
├── config/
│   └── firebase.ts        ← Firebase config
│
├── services/
│   ├── aiService.ts       ← Gemini + AI model
│   ├── authService.ts
│   ├── patientService.ts
│   ├── reportService.ts
│   └── ...
│
└── components/
    ├── Button.tsx
    ├── Card.tsx
    └── Input.tsx
```

---

## 🔧 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "unauthorized-domain" | Add `localhost` to Firebase Auth domains |
| "Permission denied" | Republish Firestore rules |
| Image upload fails | Republish Storage rules |
| Gemini API error | Check API key in .env, restart server |
| Module not found | Delete node_modules, run npm install |
| Changes not appearing | Stop server (Ctrl+C), restart |

---

## 🚀 Test Workflow

1. **Sign In** → Google account
2. **Select Role** → Radiologist
3. **Fill Form** → License, Certification, Hospital
4. **Dashboard** → See welcome message
5. **Register Patient** → Fill form, submit
6. **Upload X-Ray** → Select image
7. **Assign Doctor** → Select from list
8. **Analyze** → Wait for AI
9. **Verify** → Check Firestore & Storage

---

## 📊 Firebase Console Navigation

```
Firebase Console
├── Authentication
│   └── Sign-in method → Enable Google
├── Firestore Database
│   ├── Data → View collections
│   └── Rules → Paste firestore.rules
└── Storage
    ├── Files → View uploaded images
    └── Rules → Paste storage.rules
```

---

## 🤖 AI Integration Points

### 1. MobileNet (Replace This)
- **File:** `services/aiService.ts`
- **Function:** `detectAnomalies()`
- **Line:** 40-70
- **Returns:** Array of DetectedAnomaly objects

### 2. Gemini AI (Working)
- **File:** `services/aiService.ts`
- **Function:** `analyzeMedicalImage()`
- **Line:** 10-38
- **Input:** DetectedAnomaly[]
- **Output:** Comprehensive medical text analysis

---

## 📱 User Roles & Access

| Role | Can Do |
|------|--------|
| **Radiologist** | Register patients, Upload X-rays, Assign to doctors |
| **Doctor** | View reports, Create prescriptions (placeholder) |
| **Patient** | View own reports, Download PDFs (placeholder) |

---

## 🔐 Security Rules Summary

### Firestore
- Users: Read all, Write own
- Patients: Read all, Write (radiologist only)
- Reports: Read all, Create (radiologist only)
- Prescriptions: Read all, Create (doctor only)

### Storage
- X-rays: Read (authenticated), Write (authenticated, <10MB)
- Profiles: Read (authenticated), Write (own only)

---

## 📞 Get Help

| Documentation | When to Use |
|---------------|-------------|
| POST_DOWNLOAD_SETUP.md | First time setup |
| VISUAL_SETUP_GUIDE.md | Step-by-step with descriptions |
| FIREBASE_SETUP.md | Detailed Firebase instructions |
| SETUP_INSTRUCTIONS.md | Complete technical documentation |

---

## ⚙️ Environment Variables Explained

```env
# From Firebase Console → Project Settings → General
EXPO_PUBLIC_FIREBASE_API_KEY          # Web API key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN      # your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID       # your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET   # your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  # Number
EXPO_PUBLIC_FIREBASE_APP_ID           # 1:number:web:hash

# From Google AI Studio
EXPO_PUBLIC_GEMINI_API_KEY            # Starts with AIzaSy
```

---

## 🎨 Customization Quick Guide

### Change Colors
**File:** `constants/theme.ts`
```typescript
export const colors = {
  primary: {
    main: '#2E86DE',  // Change this
    // ...
  }
}
```

### Replace AI Model
**File:** `services/aiService.ts` (line 40)
```typescript
export const detectAnomalies = async (imageUri: string) => {
  // Replace mock data with your TensorFlow model
  const model = await tf.loadLayersModel('path/to/model');
  // Process image and return DetectedAnomaly[]
}
```

### Modify UI Components
**Files:** `components/*.tsx`
- `Button.tsx` - Button styles
- `Card.tsx` - Card container
- `Input.tsx` - Text input fields

---

## 📈 Next Steps After Setup

1. ✅ Verify all features work
2. 🤖 Replace dummy AI model
3. 👨‍⚕️ Complete doctor prescription module
4. 👤 Complete patient PDF generation
5. 🔔 Implement push notifications
6. 🎨 Customize branding/colors
7. 🚀 Deploy to production

---

## 💡 Pro Tips

- **Use incognito windows** to test multiple roles simultaneously
- **Keep Firebase Console open** to monitor data in real-time
- **Check browser console** (F12) for client-side errors
- **Check terminal output** for server-side errors
- **Use Firestore emulator** for development (optional)
- **Test on mobile device** for full camera functionality

---

## 🎯 Success Indicators

✅ Google Sign-In works
✅ Dashboard shows your name
✅ Can register patients
✅ Can upload images
✅ Gemini generates analysis
✅ Data appears in Firestore
✅ Images appear in Storage

---

## ⏱️ Time Estimates

- Firebase setup: 10 min
- Gemini API: 2 min
- .env configuration: 2 min
- First npm install: 3 min
- Testing: 5 min
- **Total: ~20 minutes**

---

## 🔄 Common Commands

```bash
# Fresh start
rm -rf node_modules
npm install
npm run dev

# Check for issues
npm run typecheck

# Clear Expo cache
expo start -c

# View logs
npm run dev -- --verbose
```

---

## 📦 What's Included

✅ Firebase Authentication (Google)
✅ Firestore Database with security rules
✅ Firebase Storage with security rules
✅ Gemini AI text analysis (working)
✅ Dummy MobileNet (replace with yours)
✅ Role-based access control
✅ Radiologist dashboard (complete)
✅ Patient registration (complete)
✅ X-ray upload & analysis (complete)
✅ Professional medical UI
✅ Cross-platform (Web, iOS, Android)

🚧 Doctor prescription (placeholder)
🚧 Patient PDF generation (placeholder)
🚧 Push notifications (basic structure)

---

## 🎓 Learning Resources

- React Native: https://reactnative.dev/docs/getting-started
- Expo: https://docs.expo.dev/
- Firebase: https://firebase.google.com/docs
- Gemini API: https://ai.google.dev/docs
- TensorFlow.js: https://www.tensorflow.org/js

---

Print this page for quick reference while setting up! 🖨️
