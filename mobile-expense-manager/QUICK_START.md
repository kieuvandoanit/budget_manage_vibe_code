# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd mobile-expense-manager
npm install
```

### Step 2: Set Up Firebase

1. Go to https://console.firebase.google.com/
2. Click "Add project" → Enter name → Continue
3. Disable Google Analytics (optional) → Create project
4. Click "Firestore Database" → Create database → Start in test mode → Choose location → Enable
5. Click ⚙️ (Settings) → Project settings → Scroll to "Your apps" → Click web icon (</>)
6. Register app → Copy the config values

### Step 3: Configure Environment

Edit `.env` file with your Firebase config:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Create Admin User

In Firebase Console:
1. Go to Firestore Database
2. Click "Start collection" → Collection ID: `users` → Next
3. Add document with these fields:
   - **username**: `admin` (string)
   - **password**: `admin123` (string)
   - **name**: `Administrator` (string)
   - **role**: `admin` (string)
   - **createdAt**: Click "timestamp" → Use current time
4. Click Save

### Step 5: Run the App
```bash
npm run dev
```

Open http://localhost:5173/

### Step 6: Login
- Username: `admin`
- Password: `admin123`

## 🎯 First Steps After Login

### As Admin:
1. Click "Quản lý hệ thống"
2. **Users Tab**: Create a regular user
3. **Groups Tab**: Create a group
4. **Members Tab**: Add users to the group with initial balance
5. Click "← Quay lại trang chủ"

### As User:
1. You'll see your groups
2. Click a group to view details
3. Click "Nhập chi tiêu" to add an expense
4. View your transaction history

## 📱 Test Scenarios

### Scenario 1: Create User and Group
1. Login as admin
2. Go to admin dashboard
3. Create user: `john` / `password123` / `John Doe` / `user`
4. Create group: `Family Budget`
5. Add John to group with balance: 1,000,000 VND

### Scenario 2: Add Expense
1. Logout and login as `john`
2. Click "Family Budget" group
3. Click "Nhập chi tiêu"
4. Amount: 50,000
5. Description: "Lunch"
6. Submit → Balance updates to 950,000

### Scenario 3: Adjust Balance (Admin)
1. Login as admin
2. Go to admin dashboard → Members tab
3. Select "Family Budget" group
4. Click "Điều chỉnh" on John
5. Change balance to 2,000,000
6. Save

## 🔧 Troubleshooting

### "Permission denied" errors
- Make sure Firestore is in test mode
- Check your Firebase config in `.env`

### "User not found" on login
- Verify you created the admin user in Firestore
- Check username and password match exactly

### Blank page
- Check browser console for errors
- Verify all npm packages installed
- Check Firebase config is correct

### Balance not updating
- Check Firestore rules allow writes
- Verify user is a member of the group
- Check browser console for errors

## 📚 Next Steps

- Read `IMPLEMENTATION_COMPLETE.md` for full feature list
- Read `FIREBASE_SETUP.md` for detailed Firebase setup
- Read `PROGRESS.md` for implementation status
- Explore the code in `src/` directory

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#YOUR_COLOR',
      // ...
    }
  }
}
```

### Change Language
Edit text in components (currently Vietnamese)

### Add Features
- Check remaining tasks in `tasks.md`
- Follow existing component patterns
- Use the service layer for data operations

## 🚀 Production Deployment

When ready for production:
1. Implement Firestore security rules (Section 13)
2. Run tests (Section 14)
3. Build: `npm run build`
4. Deploy to Firebase Hosting (Section 15)

---

**Need Help?** Check the detailed documentation in other .md files!
