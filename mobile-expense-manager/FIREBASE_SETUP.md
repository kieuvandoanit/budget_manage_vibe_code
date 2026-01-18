# Firebase Setup Instructions

## Steps to set up Firebase:

1. Go to https://console.firebase.google.com/
2. Create a new project named "mobile-expense-manager"
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (we'll add security rules later)
   - Choose a location close to your users
4. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register your app
   - Copy the firebaseConfig object
5. Create a `.env` file in the project root with your Firebase config (see .env.example)

## Collections to create:
- users
- groups
- group_members
- transactions

These will be created automatically when you first add data.
