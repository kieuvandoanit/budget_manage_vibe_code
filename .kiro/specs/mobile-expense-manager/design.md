# Design: Mobile Web Expense Manager

## 1. Architecture Overview

### 1.1 System Architecture
```
┌─────────────────────────────────────────────────┐
│              React Application                   │
│  ┌──────────────────────────────────────────┐  │
│  │         Presentation Layer               │  │
│  │  (Pages, Components, UI)                 │  │
│  └──────────────────────────────────────────┘  │
│                     ↕                            │
│  ┌──────────────────────────────────────────┐  │
│  │         State Management Layer           │  │
│  │  (AuthContext, React Context/Zustand)    │  │
│  └──────────────────────────────────────────┘  │
│                     ↕                            │
│  ┌──────────────────────────────────────────┐  │
│  │         Service Layer                    │  │
│  │  (Firestore Service, Auth Service)       │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│           Firebase Firestore                     │
│  (users, groups, group_members, transactions)   │
└─────────────────────────────────────────────────┘
```

### 1.2 Technology Stack
- **Frontend Framework**: React 18+ with Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Routing**: React Router v6
- **Database**: Firebase Firestore
- **Hosting**: Firebase Hosting
- **Build Tool**: Vite

## 2. Component Architecture

### 2.1 Component Hierarchy
```
App
├── AuthProvider (Context)
├── Router
    ├── PublicRoute
    │   └── Login
    ├── ProtectedRoute
    │   ├── GroupList
    │   ├── GroupDetail
    │   └── CreateExpense
    └── AdminRoute
        └── AdminDashboard
            ├── UserManagement
            ├── GroupManagement
            └── GroupMemberManagement
```

### 2.2 Shared Components
- **Layout**: Common layout wrapper with header/navigation
- **Button**: Reusable button component
- **Input**: Form input component
- **Card**: Container component for content sections
- **Modal**: Dialog component for confirmations
- **LoadingSpinner**: Loading state indicator
- **ErrorMessage**: Error display component

## 3. State Management

### 3.1 AuthContext
Manages authentication state across the application.

**State:**
```javascript
{
  user: {
    userId: string,
    username: string,
    role: 'admin' | 'user'
  } | null,
  loading: boolean,
  error: string | null
}
```

**Methods:**
- `login(username, password)`: Authenticate user
- `logout()`: Clear session and redirect to login
- `checkAuth()`: Verify localStorage session on mount

### 3.2 Local Component State
Each page manages its own data fetching and local state using React hooks.

## 4. Data Flow

### 4.1 Authentication Flow
```
1. User enters credentials → Login component
2. Login component calls authService.login()
3. authService queries Firestore users collection
4. If match found:
   - Store user data in localStorage
   - Update AuthContext state
   - Redirect to GroupList
5. If no match:
   - Display error message
```

### 4.2 Expense Creation Flow
```
1. User fills expense form → CreateExpense component
2. Component validates input
3. Component calls firestoreService.createExpense()
4. Service creates transaction document
5. Service updates group_member balance (atomic operation)
6. On success: redirect to GroupDetail
7. On error: display error message
```

### 4.3 Admin Operations Flow
```
1. Admin performs action → AdminDashboard component
2. Component calls appropriate service method
3. Service performs Firestore operation
4. On success: refresh data and show confirmation
5. On error: display error message
```

## 5. Service Layer Design

### 5.1 authService.js
Handles authentication operations.

**Methods:**
```javascript
// Login user with username and password
async login(username, password)
  → Returns: { userId, username, role } | throws Error

// Logout current user
logout()
  → Clears localStorage and returns void

// Get current user from localStorage
getCurrentUser()
  → Returns: { userId, username, role } | null

// Check if user is admin
isAdmin()
  → Returns: boolean
```

### 5.2 firestoreService.js
Handles all Firestore database operations.

**User Operations:**
```javascript
async createUser(userData)
async getUserById(userId)
async getAllUsers()
async updateUser(userId, updates)
async deleteUser(userId)
async getUserByCredentials(username, password)
```

**Group Operations:**
```javascript
async createGroup(groupData)
async getGroupById(groupId)
async getAllGroups()
async getGroupsByUserId(userId)
async updateGroup(groupId, updates)
async deleteGroup(groupId)
```

**Group Member Operations:**
```javascript
async addMemberToGroup(groupId, userId, initialBalance)
async removeMemberFromGroup(groupMemberId)
async getGroupMembers(groupId)
async updateMemberBalance(groupMemberId, newBalance)
async getMemberByGroupAndUser(groupId, userId)
```

**Transaction Operations:**
```javascript
async createTransaction(transactionData)
async getTransactionsByGroup(groupId)
async getTransactionsByUser(userId, groupId)
async createExpense(userId, groupId, amount, description)
  // This method combines:
  // 1. Create transaction
  // 2. Update member balance
```

## 6. Page Designs

### 6.1 Login Page
**Route**: `/login`

**Components:**
- LoginForm
  - Username input
  - Password input
  - Submit button
  - Error message display

**State:**
```javascript
{
  username: string,
  password: string,
  error: string | null,
  loading: boolean
}
```

**Behavior:**
- On mount: redirect if already authenticated
- On submit: call authService.login()
- On success: redirect to /groups
- On error: display error message

### 6.2 Group List Page
**Route**: `/groups`

**Components:**
- GroupList
  - Header with user name and logout button
  - List of GroupCard components
  - Empty state message

**State:**
```javascript
{
  groups: Array<Group>,
  loading: boolean,
  error: string | null
}
```

**Behavior:**
- On mount: fetch groups for current user
- On group click: navigate to /groups/:groupId
- Show admin dashboard link if user is admin

### 6.3 Group Detail Page
**Route**: `/groups/:groupId`

**Components:**
- GroupDetail
  - Group name header
  - MemberList (shows all members with balances)
  - "Nhập chi tiêu" button
  - TransactionHistory (user's transactions in this group)

**State:**
```javascript
{
  group: Group | null,
  members: Array<GroupMember>,
  transactions: Array<Transaction>,
  loading: boolean,
  error: string | null
}
```

**Behavior:**
- On mount: fetch group, members, and user's transactions
- On "Nhập chi tiêu" click: navigate to /groups/:groupId/expense
- Display members sorted by balance (descending)
- Display transactions sorted by date (newest first)

### 6.4 Create Expense Page
**Route**: `/groups/:groupId/expense`

**Components:**
- ExpenseForm
  - Amount input (number)
  - Description textarea
  - Submit button
  - Cancel button

**State:**
```javascript
{
  amount: number,
  description: string,
  errors: { amount?: string, description?: string },
  loading: boolean
}
```

**Validation:**
- Amount must be positive number
- Description must not be empty
- Amount must not exceed available balance (warning only)

**Behavior:**
- On submit: call firestoreService.createExpense()
- On success: navigate back to /groups/:groupId
- On cancel: navigate back to /groups/:groupId

### 6.5 Admin Dashboard Page
**Route**: `/admin`

**Components:**
- AdminDashboard
  - TabNavigation (Users, Groups, Members)
  - UserManagement
    - UserList with edit/delete actions
    - AddUserModal
    - EditUserModal
  - GroupManagement
    - GroupList with edit/delete actions
    - AddGroupModal
    - EditGroupModal
  - GroupMemberManagement
    - GroupSelector dropdown
    - MemberList with remove/adjust balance actions
    - AddMemberModal
    - AdjustBalanceModal

**State:**
```javascript
{
  activeTab: 'users' | 'groups' | 'members',
  users: Array<User>,
  groups: Array<Group>,
  selectedGroup: Group | null,
  members: Array<GroupMember>,
  loading: boolean,
  error: string | null
}
```

**Behavior:**
- On mount: fetch all users and groups
- Tab switching updates activeTab
- CRUD operations refresh relevant data
- Confirmation dialogs for delete operations

## 7. Routing Design

### 7.1 Route Configuration
```javascript
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedRoute />}>
    <Route path="/groups" element={<GroupList />} />
    <Route path="/groups/:groupId" element={<GroupDetail />} />
    <Route path="/groups/:groupId/expense" element={<CreateExpense />} />
  </Route>
  
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminDashboard />} />
  </Route>
  
  <Route path="/" element={<Navigate to="/groups" />} />
  <Route path="*" element={<Navigate to="/groups" />} />
</Routes>
```

### 7.2 Route Guards

**ProtectedRoute:**
- Checks if user is authenticated
- If not: redirect to /login
- If yes: render children

**AdminRoute:**
- Checks if user is authenticated AND is admin
- If not authenticated: redirect to /login
- If not admin: redirect to /groups
- If admin: render children

## 8. Database Design

### 8.1 Firestore Collections

**users**
- Document ID: auto-generated
- Indexes: username (for login queries)

**groups**
- Document ID: auto-generated
- Indexes: createdBy (for admin queries)

**group_members**
- Document ID: auto-generated
- Indexes: 
  - groupId (for member queries)
  - userId (for user's groups queries)
  - Composite: groupId + userId (for membership checks)

**transactions**
- Document ID: auto-generated
- Indexes:
  - groupId + createdAt (for group transaction history)
  - userId + groupId + createdAt (for user transaction history)

### 8.2 Data Relationships
```
users (1) ──< group_members >── (N) groups
users (1) ──< transactions
groups (1) ──< transactions
groups (1) ──< group_members
```

### 8.3 Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    
    // Groups collection
    match /groups/{groupId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Group members collection
    match /group_members/{memberId} {
      allow read: if isAuthenticated();
      allow create, update, delete: if isAdmin();
    }
    
    // Transactions collection
    match /transactions/{transactionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAdmin();
    }
  }
}
```

## 9. UI/UX Design Principles

### 9.1 Mobile-First Approach
- Design for 375px width (iPhone SE) as baseline
- Use responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### 9.2 TailwindCSS Utility Classes
**Common patterns:**
- Container: `max-w-md mx-auto px-4`
- Card: `bg-white rounded-lg shadow-md p-4`
- Button: `bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600`
- Input: `w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`

### 9.3 Color Scheme
- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Danger: Red (#EF4444)
- Warning: Yellow (#F59E0B)
- Neutral: Gray (#6B7280)

### 9.4 Typography
- Headings: font-bold text-xl/2xl/3xl
- Body: text-base text-gray-700
- Small text: text-sm text-gray-500

## 10. Error Handling

### 10.1 Error Types
- **Authentication Errors**: Invalid credentials, session expired
- **Validation Errors**: Invalid input, missing required fields
- **Permission Errors**: Unauthorized access
- **Network Errors**: Firestore connection issues
- **Data Errors**: Document not found, constraint violations

### 10.2 Error Display
- Form validation: inline error messages below inputs
- API errors: toast notifications or alert banners
- Critical errors: full-page error component with retry option

### 10.3 Error Messages (Vietnamese)
```javascript
const ERROR_MESSAGES = {
  LOGIN_FAILED: 'Sai username hoặc password',
  NETWORK_ERROR: 'Lỗi kết nối. Vui lòng thử lại',
  PERMISSION_DENIED: 'Bạn không có quyền thực hiện thao tác này',
  REQUIRED_FIELD: 'Trường này là bắt buộc',
  INVALID_AMOUNT: 'Số tiền phải lớn hơn 0',
  INSUFFICIENT_BALANCE: 'Số dư không đủ',
  USER_EXISTS: 'Username đã tồn tại',
  DELETE_CONFIRM: 'Bạn có chắc muốn xóa?'
}
```

## 11. Performance Optimization

### 11.1 Firestore Query Optimization
- Use `where()` clauses to filter data server-side
- Limit query results with `.limit()`
- Use pagination for large lists
- Cache frequently accessed data in component state

### 11.2 Code Splitting
- Lazy load admin dashboard: `const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))`
- Lazy load modals and dialogs

### 11.3 Asset Optimization
- Optimize images and icons
- Use SVG for icons when possible
- Minimize bundle size with tree-shaking

## 12. Testing Strategy

### 12.1 Unit Tests
- Test service layer functions
- Test utility functions
- Test form validation logic

### 12.2 Integration Tests
- Test authentication flow
- Test expense creation flow
- Test admin CRUD operations

### 12.3 Manual Testing Checklist
- [ ] Login with valid/invalid credentials
- [ ] Create expense and verify balance update
- [ ] Admin user management
- [ ] Admin group management
- [ ] Admin member management
- [ ] Mobile responsiveness
- [ ] Route protection

## 13. Deployment

### 13.1 Firebase Setup
1. Create Firebase project
2. Enable Firestore database
3. Configure Firebase Hosting
4. Set up environment variables

### 13.2 Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### 13.3 Environment Variables
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## 14. Future Enhancements (Out of Scope)
- Password hashing with bcrypt
- Email notifications
- Expense categories
- Reports and charts
- Export data to CSV/PDF
- Multi-language support
- Dark mode
- Offline support with PWA
