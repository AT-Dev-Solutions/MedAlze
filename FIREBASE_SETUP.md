# Firebase Quick Setup Guide

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name: `medalze` (or your preferred name)
4. Disable Google Analytics (optional for development)
5. Click "Create project"

## Step 2: Register Web App

1. In project overview, click the Web icon `</>`
2. Enter app nickname: `MedAlze AI Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. Copy the Firebase configuration object
6. Update `.env` file with these values

## Step 3: Enable Google Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Click on "Google" in Sign-in providers
4. Toggle "Enable"
5. Enter support email
6. Click "Save"

## Step 4: Create Firestore Database

1. Go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location closest to your users
5. Click "Enable"

## Step 5: Update Firestore Security Rules

1. In Firestore, go to "Rules" tab
2. Copy content from `firestore.rules` file
3. Paste into the rules editor
4. Click "Publish"

## Step 6: Set Up Firebase Storage

1. Go to **Build > Storage**
2. Click "Get started"
3. Select "Start in production mode"
4. Choose location (same as Firestore)
5. Click "Done"

## Step 7: Update Storage Security Rules

1. In Storage, go to "Rules" tab
2. Copy content from `storage.rules` file
3. Paste into the rules editor
4. Click "Publish"

## Step 8: Get Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Select existing Google Cloud project or create new one
5. Copy the API key
6. Add to `.env` as `EXPO_PUBLIC_GEMINI_API_KEY`

## Step 9: Configure Environment Variables

Update your `.env` file with all the values:

```env
# From Firebase Console > Project Settings > General > Your apps > Web app
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# From Google AI Studio
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...
```

## Step 10: Test the Setup

1. Run `npm run dev`
2. Open in browser
3. Try Google Sign-In
4. Complete onboarding as a radiologist
5. Register a test patient
6. Upload a sample X-ray image

## Common Issues

### "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add your development domain to authorized domains
1. Go to Authentication > Settings > Authorized domains
2. Add `localhost` and your development URL

### "Permission denied" when writing to Firestore
**Solution**: Verify security rules are published correctly
1. Check Firestore Rules tab
2. Ensure rules match `firestore.rules` file
3. Republish if needed

### "Storage bucket not found"
**Solution**: Ensure storage bucket is created and rules are set
1. Go to Storage section
2. Click "Get started" if not initialized
3. Publish storage rules

### Image upload fails
**Solution**: Check file size and type
1. Max size is 10MB (configurable in storage.rules)
2. Only image types allowed (jpg, png, etc.)
3. Verify camera/gallery permissions granted

## Firebase Console Quick Links

Once your project is created, bookmark these:

- **Project Overview**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID`
- **Authentication**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/authentication/users`
- **Firestore**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore`
- **Storage**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/storage`
- **Project Settings**: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/general`

## Development Tips

1. **Use Emulators** (Optional):
   ```bash
   npm install -D firebase-tools
   firebase init emulators
   firebase emulators:start
   ```

2. **Monitor Real-time Data**:
   - Keep Firestore console open while testing
   - Watch for document creation/updates
   - Check error logs in Authentication section

3. **Test Different Roles**:
   - Create test accounts for each role
   - Use incognito/private browsing for multiple sign-ins
   - Test role-based access control

4. **Storage Monitoring**:
   - Check Storage usage in console
   - View uploaded images
   - Monitor bandwidth usage

## Production Checklist

Before deploying to production:

- [ ] Update Firestore rules for stricter access control
- [ ] Set up proper billing alerts
- [ ] Enable Firebase App Check
- [ ] Configure proper CORS for Storage
- [ ] Set up monitoring and alerting
- [ ] Review and optimize security rules
- [ ] Enable audit logging
- [ ] Set up automated backups
- [ ] Configure proper authentication policies
- [ ] Test thoroughly with production data

## Support Resources

- Firebase Documentation: https://firebase.google.com/docs
- Firebase Authentication: https://firebase.google.com/docs/auth
- Cloud Firestore: https://firebase.google.com/docs/firestore
- Cloud Storage: https://firebase.google.com/docs/storage
- Gemini API: https://ai.google.dev/docs

## Next Steps

After setup is complete:
1. Run the application: `npm run dev`
2. Test all three user roles
3. Upload test X-ray images
4. Verify AI analysis works
5. Check notifications flow
6. Test report assignment workflow
7. Replace dummy AI model with your trained model
