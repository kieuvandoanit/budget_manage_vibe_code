# Requirements: Mobile Web Expense Manager

## 1. Overview

Build a mobile-first web application for managing group expenses (quỹ thu chi) using React + Firebase Firestore with custom username/password authentication.

## 2. User Roles

### 2.1 USER Role
Users with basic permissions to manage their own expenses within groups.

**Acceptance Criteria:**
- User can login with username and password
- User can view list of groups they belong to
- User can create expenses within their groups
- User can view their own expense history in each group
- User can view remaining balance of all members in their groups

### 2.2 ADMIN Role
Administrators with full system management permissions.

**Acceptance Criteria:**
- Admin has all USER permissions
- Admin can create, edit, and delete users
- Admin can create, edit, and delete groups
- Admin can add/remove users from groups
- Admin can set initial balance for users in groups
- Admin can manually adjust current balance of users in groups

## 3. Authentication System

### 3.1 Custom Login (No Firebase Auth)
Simple username/password authentication using Firestore.

**Acceptance Criteria:**
- Login page displays username and password input fields
- System queries Firestore `users` collection for matching credentials
- On successful login, user data (userId, username, role) is stored in localStorage
- On successful login, user is redirected to Group List page
- On failed login, error message "Sai username hoặc password" is displayed
- No Firebase Authentication, JWT, OTP, Email, or OAuth is used

### 3.2 Session Management
Maintain user session across page refreshes.

**Acceptance Criteria:**
- User session persists in localStorage
- User remains logged in after page refresh
- User can logout and clear session data

## 4. Data Model

### 4.1 Users Collection
Store user account information.

**Schema:**
```json
{
  "userId": "string (unique)",
  "username": "string (unique)",
  "password": "string (plain text)",
  "name": "string",
  "role": "admin | user",
  "createdAt": "timestamp"
}
```

**Acceptance Criteria:**
- Each user has a unique userId
- Username must be unique
- Password is stored as plain text (not hashed for simplicity)
- Role is either "admin" or "user"

### 4.2 Groups Collection
Store group information.

**Schema:**
```json
{
  "groupId": "string (unique)",
  "name": "string",
  "createdAt": "timestamp",
  "createdBy": "userId"
}
```

**Acceptance Criteria:**
- Each group has a unique groupId
- Group name can be edited
- System tracks who created the group

### 4.3 Group Members Collection
Store membership and balance information.

**Schema:**
```json
{
  "groupMemberId": "string (unique)",
  "groupId": "string (foreign key)",
  "userId": "string (foreign key)",
  "balance": "number",
  "joinedAt": "timestamp"
}
```

**Acceptance Criteria:**
- Links users to groups
- Tracks individual balance per user per group
- Balance can be positive or negative
- Balance is updated when expenses are created

### 4.4 Transactions Collection
Store expense records.

**Schema:**
```json
{
  "transactionId": "string (unique)",
  "groupId": "string (foreign key)",
  "userId": "string (foreign key)",
  "amount": "number (positive)",
  "description": "string",
  "createdAt": "timestamp"
}
```

**Acceptance Criteria:**
- Each transaction records an expense
- Amount must be positive
- Transaction is linked to both user and group
- Transactions are ordered by createdAt

## 5. Core Features

### 5.1 Expense Creation
Users can create expenses within their groups.

**Acceptance Criteria:**
- User can input amount (number) and description (text)
- On submit, a new transaction document is created in Firestore
- User's balance in group_members is decreased by the expense amount
- Transaction appears in user's expense history
- Form validates that amount is a positive number
- Form validates that description is not empty

**Example:**
- Initial balance: 1,000,000 VND
- New expense: 200,000 VND
- Updated balance: 800,000 VND

### 5.2 Group Management (Admin)
Admins can manage groups.

**Acceptance Criteria:**
- Admin can create new groups with a name
- Admin can edit group names
- Admin can delete groups
- Deleting a group removes all associated group_members and transactions

### 5.3 User Management (Admin)
Admins can manage user accounts.

**Acceptance Criteria:**
- Admin can create users with username, password, name, and role
- Admin can edit user information
- Admin can delete users
- Username must be unique when creating/editing users
- Deleting a user removes all associated group_members and transactions

### 5.4 Group Member Management (Admin)
Admins can manage group memberships.

**Acceptance Criteria:**
- Admin can add users to groups
- Admin can remove users from groups
- Admin can set initial balance when adding user to group
- Admin can manually adjust user balance in a group
- Removing a user from a group deletes their group_member record

## 6. User Interface

### 6.1 Mobile-First Design
All pages must be responsive and optimized for mobile devices.

**Acceptance Criteria:**
- UI is fully functional on mobile screens (320px - 480px width)
- UI scales appropriately for tablet and desktop
- Touch-friendly buttons and inputs (minimum 44px touch targets)
- Readable text sizes on mobile devices

### 6.2 Page Structure

**Page 1 - Login:**
- Username input field
- Password input field
- Login button
- Error message display area

**Page 2 - Group List:**
- List of groups user belongs to
- Each group shows group name
- Clicking a group navigates to Group Detail page
- Logout button

**Page 3 - Group Detail (User View):**
- Group name header
- List of all members with their current balances
- "Nhập chi tiêu" button to create expense
- Tab showing "Lịch sử chi tiêu của tôi" (user's expense history)
- Back button to Group List

**Page 4 - Create Expense:**
- Amount input (number)
- Description input (text)
- Submit button
- Cancel button
- Form validation messages

**Page 5 - Admin Dashboard:**
- User Management section:
  - List all users
  - Add user button
  - Edit/Delete buttons per user
- Group Management section:
  - List all groups
  - Create group button
  - Edit/Delete buttons per group
- Group Member Management section:
  - Group selector dropdown
  - List members in selected group
  - Add member button
  - Remove member button
  - Adjust balance button per member

## 7. Security & Permissions

### 7.1 Firestore Security Rules
Implement security rules to protect data.

**Acceptance Criteria:**
- Users can only read their own user document
- Users can only read groups they belong to
- Users can only create transactions for themselves
- Users can only read transactions in their groups
- Admins can read and write all collections
- Anonymous users can only access login functionality

### 7.2 Client-Side Route Protection
Protect routes based on authentication and role.

**Acceptance Criteria:**
- Unauthenticated users are redirected to Login page
- Admin-only pages are protected from regular users
- Users cannot access other users' data through URL manipulation

## 8. Technical Requirements

### 8.1 Tech Stack
- Frontend: React 18+ with Vite
- UI Framework: TailwindCSS
- Database: Firebase Firestore
- Hosting: Firebase Hosting
- State Management: React Context or Zustand
- Routing: React Router v6+

### 8.2 Project Structure
```
/src
  /components
  /pages
    Login.jsx
    GroupList.jsx
    GroupDetail.jsx
    CreateExpense.jsx
    AdminDashboard.jsx
  /services
    firestore.js
  /context
    AuthContext.jsx
  App.jsx
  main.jsx
```

### 8.3 Firebase Configuration
- Firebase project must be created
- Firestore database must be initialized
- Firebase Hosting must be configured
- Environment variables for Firebase config

## 9. Non-Functional Requirements

### 9.1 Performance
- Initial page load under 3 seconds on 3G connection
- Firestore queries optimized with proper indexing
- Lazy loading for admin dashboard sections

### 9.2 Usability
- Intuitive navigation
- Clear error messages in Vietnamese
- Loading states for async operations
- Confirmation dialogs for destructive actions (delete)

### 9.3 Data Integrity
- Balance calculations must be accurate
- Transactions cannot be edited or deleted (audit trail)
- Concurrent updates handled properly

## 10. Out of Scope

The following features are explicitly NOT included in this version:
- Password hashing/encryption
- Email notifications
- File attachments for expenses
- Expense categories or tags
- Reports and analytics
- Multi-currency support
- Expense approval workflow
- Mobile native apps (iOS/Android)
