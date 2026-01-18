# Tasks: Mobile Web Expense Manager

## 1. Project Setup
- [ ] 1.1 Initialize React project with Vite
- [ ] 1.2 Install and configure TailwindCSS
- [ ] 1.3 Install Firebase SDK and React Router
- [ ] 1.4 Create project folder structure
- [ ] 1.5 Set up Firebase project and Firestore database
- [ ] 1.6 Configure environment variables for Firebase

## 2. Service Layer Implementation
- [ ] 2.1 Create Firebase configuration file
- [ ] 2.2 Implement authService.js
  - [ ] 2.2.1 Implement login() method
  - [ ] 2.2.2 Implement logout() method
  - [ ] 2.2.3 Implement getCurrentUser() method
  - [ ] 2.2.4 Implement isAdmin() method
- [ ] 2.3 Implement firestoreService.js - User operations
  - [ ] 2.3.1 Implement createUser()
  - [ ] 2.3.2 Implement getUserById()
  - [ ] 2.3.3 Implement getAllUsers()
  - [ ] 2.3.4 Implement updateUser()
  - [ ] 2.3.5 Implement deleteUser()
  - [ ] 2.3.6 Implement getUserByCredentials()
- [ ] 2.4 Implement firestoreService.js - Group operations
  - [ ] 2.4.1 Implement createGroup()
  - [ ] 2.4.2 Implement getGroupById()
  - [ ] 2.4.3 Implement getAllGroups()
  - [ ] 2.4.4 Implement getGroupsByUserId()
  - [ ] 2.4.5 Implement updateGroup()
  - [ ] 2.4.6 Implement deleteGroup()
- [ ] 2.5 Implement firestoreService.js - Group member operations
  - [ ] 2.5.1 Implement addMemberToGroup()
  - [ ] 2.5.2 Implement removeMemberFromGroup()
  - [ ] 2.5.3 Implement getGroupMembers()
  - [ ] 2.5.4 Implement updateMemberBalance()
  - [ ] 2.5.5 Implement getMemberByGroupAndUser()
- [ ] 2.6 Implement firestoreService.js - Transaction operations
  - [ ] 2.6.1 Implement createTransaction()
  - [ ] 2.6.2 Implement getTransactionsByGroup()
  - [ ] 2.6.3 Implement getTransactionsByUser()
  - [ ] 2.6.4 Implement createExpense() (combined operation)

## 3. State Management
- [ ] 3.1 Create AuthContext
  - [ ] 3.1.1 Define AuthContext state structure
  - [ ] 3.1.2 Implement AuthProvider component
  - [ ] 3.1.3 Implement login action
  - [ ] 3.1.4 Implement logout action
  - [ ] 3.1.5 Implement checkAuth on mount
  - [ ] 3.1.6 Create useAuth custom hook

## 4. Shared Components
- [ ] 4.1 Create Layout component
- [ ] 4.2 Create Button component
- [ ] 4.3 Create Input component
- [ ] 4.4 Create Card component
- [ ] 4.5 Create Modal component
- [ ] 4.6 Create LoadingSpinner component
- [ ] 4.7 Create ErrorMessage component

## 5. Routing Setup
- [ ] 5.1 Configure React Router
- [ ] 5.2 Implement ProtectedRoute component
- [ ] 5.3 Implement AdminRoute component
- [ ] 5.4 Define all application routes

## 6. Login Page
- [ ] 6.1 Create Login page component
- [ ] 6.2 Implement login form UI
  - [ ] 6.2.1 Username input field
  - [ ] 6.2.2 Password input field
  - [ ] 6.2.3 Login button
  - [ ] 6.2.4 Error message display
- [ ] 6.3 Implement form validation
- [ ] 6.4 Implement login submission logic
- [ ] 6.5 Implement redirect after successful login
- [ ] 6.6 Style with TailwindCSS for mobile-first

## 7. Group List Page
- [ ] 7.1 Create GroupList page component
- [ ] 7.2 Implement header with user info and logout button
- [ ] 7.3 Fetch and display user's groups
- [ ] 7.4 Create GroupCard component
- [ ] 7.5 Implement navigation to GroupDetail
- [ ] 7.6 Add admin dashboard link for admin users
- [ ] 7.7 Implement empty state when no groups
- [ ] 7.8 Style with TailwindCSS for mobile-first

## 8. Group Detail Page
- [ ] 8.1 Create GroupDetail page component
- [ ] 8.2 Fetch group information
- [ ] 8.3 Implement MemberList component
  - [ ] 8.3.1 Display all members with balances
  - [ ] 8.3.2 Sort members by balance
- [ ] 8.4 Implement "Nhập chi tiêu" button
- [ ] 8.5 Implement TransactionHistory component
  - [ ] 8.5.1 Fetch user's transactions in group
  - [ ] 8.5.2 Display transactions sorted by date
  - [ ] 8.5.3 Format currency display
- [ ] 8.6 Implement back navigation
- [ ] 8.7 Style with TailwindCSS for mobile-first

## 9. Create Expense Page
- [ ] 9.1 Create CreateExpense page component
- [ ] 9.2 Implement expense form UI
  - [ ] 9.2.1 Amount input field
  - [ ] 9.2.2 Description textarea
  - [ ] 9.2.3 Submit button
  - [ ] 9.2.4 Cancel button
- [ ] 9.3 Implement form validation
  - [ ] 9.3.1 Validate amount is positive number
  - [ ] 9.3.2 Validate description is not empty
- [ ] 9.4 Implement expense submission logic
- [ ] 9.5 Handle success and error states
- [ ] 9.6 Implement navigation after submission
- [ ] 9.7 Style with TailwindCSS for mobile-first

## 10. Admin Dashboard - User Management
- [ ] 10.1 Create AdminDashboard page component
- [ ] 10.2 Implement tab navigation
- [ ] 10.3 Create UserManagement component
- [ ] 10.4 Implement UserList display
- [ ] 10.5 Create AddUserModal component
  - [ ] 10.5.1 Form fields (username, password, name, role)
  - [ ] 10.5.2 Form validation
  - [ ] 10.5.3 Submit logic
- [ ] 10.6 Create EditUserModal component
  - [ ] 10.6.1 Pre-fill form with user data
  - [ ] 10.6.2 Form validation
  - [ ] 10.6.3 Update logic
- [ ] 10.7 Implement delete user functionality
  - [ ] 10.7.1 Confirmation dialog
  - [ ] 10.7.2 Delete logic
- [ ] 10.8 Style with TailwindCSS

## 11. Admin Dashboard - Group Management
- [ ] 11.1 Create GroupManagement component
- [ ] 11.2 Implement GroupList display
- [ ] 11.3 Create AddGroupModal component
  - [ ] 11.3.1 Group name input
  - [ ] 11.3.2 Form validation
  - [ ] 11.3.3 Submit logic
- [ ] 11.4 Create EditGroupModal component
  - [ ] 11.4.1 Pre-fill form with group data
  - [ ] 11.4.2 Form validation
  - [ ] 11.4.3 Update logic
- [ ] 11.5 Implement delete group functionality
  - [ ] 11.5.1 Confirmation dialog
  - [ ] 11.5.2 Delete logic (cascade delete members and transactions)
- [ ] 11.6 Style with TailwindCSS

## 12. Admin Dashboard - Group Member Management
- [ ] 12.1 Create GroupMemberManagement component
- [ ] 12.2 Implement group selector dropdown
- [ ] 12.3 Fetch and display members for selected group
- [ ] 12.4 Create AddMemberModal component
  - [ ] 12.4.1 User selector dropdown
  - [ ] 12.4.2 Initial balance input
  - [ ] 12.4.3 Form validation
  - [ ] 12.4.4 Submit logic
- [ ] 12.5 Implement remove member functionality
  - [ ] 12.5.1 Confirmation dialog
  - [ ] 12.5.2 Remove logic
- [ ] 12.6 Create AdjustBalanceModal component
  - [ ] 12.6.1 Current balance display
  - [ ] 12.6.2 New balance input
  - [ ] 12.6.3 Form validation
  - [ ] 12.6.4 Update logic
- [ ] 12.7 Style with TailwindCSS

## 13. Firestore Security Rules
- [ ] 13.1 Write security rules for users collection
- [ ] 13.2 Write security rules for groups collection
- [ ] 13.3 Write security rules for group_members collection
- [ ] 13.4 Write security rules for transactions collection
- [ ] 13.5 Deploy security rules to Firebase

## 14. Testing & Bug Fixes
- [ ] 14.1 Test login flow with valid credentials
- [ ] 14.2 Test login flow with invalid credentials
- [ ] 14.3 Test user can view their groups
- [ ] 14.4 Test user can create expense
- [ ] 14.5 Test balance updates correctly after expense
- [ ] 14.6 Test admin can create users
- [ ] 14.7 Test admin can edit users
- [ ] 14.8 Test admin can delete users
- [ ] 14.9 Test admin can create groups
- [ ] 14.10 Test admin can edit groups
- [ ] 14.11 Test admin can delete groups
- [ ] 14.12 Test admin can add members to groups
- [ ] 14.13 Test admin can remove members from groups
- [ ] 14.14 Test admin can adjust member balances
- [ ] 14.15 Test route protection for unauthenticated users
- [ ] 14.16 Test route protection for non-admin users
- [ ] 14.17 Test mobile responsiveness on various screen sizes
- [ ] 14.18 Fix any identified bugs

## 15. Deployment
- [ ] 15.1 Create production build
- [ ] 15.2 Test production build locally
- [ ] 15.3 Configure Firebase Hosting
- [ ] 15.4 Deploy to Firebase Hosting
- [ ] 15.5 Verify deployment in production
- [ ] 15.6 Create initial admin user in Firestore console

## 16. Documentation
- [ ] 16.1 Create README.md with setup instructions
- [ ] 16.2 Document Firebase configuration steps
- [ ] 16.3 Document how to create initial admin user
- [ ] 16.4 Document deployment process
- [ ] 16.5 Create user guide (optional)
