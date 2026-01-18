## 🚀 **PROJECT PROMPT FOR KIRO — MOBILE WEB EXPENSE MANAGER**

### 🎯 **Project Goal**

Build a simple mobile-first web application for managing group expenses (quỹ thu chi), using **React + Firebase Firestore**, with a **custom simple username/password login (NO Firebase Authentication)**.

---

## 🏗️ **Tech Stack (MUST FOLLOW)**

* Frontend: **React (Vite)**
* UI: **Mobile-first responsive design (TailwindCSS preferred)**
* Database: **Firebase Firestore**
* Hosting: **Firebase Hosting**
* Authentication: **Custom simple login (username + password stored in Firestore)**
* State management: React Context or Zustand (your choice)
* Routing: React Router

---

## 👥 **Roles & Permissions**

### Role: USER

A user can:

* Login using:

  * `username`
  * `password`
* View list of groups they belong to
* Inside each group:

  * Create an expense (amount + description)
  * View their own expense history in that group
  * View remaining balance of all members in that group

---

### Role: ADMIN

An admin can:

* Manage Users:

  * Create user (username, password, name, role)
  * Edit user
  * Delete user

* Manage Groups:

  * Create group
  * Edit group name
  * Delete group

* Manage Group Members:

  * Add user to group
  * Remove user from group
  * Set initial balance for each user in group
  * Manually adjust current balance of a user in group

---

## 🔐 **Authentication Flow (VERY IMPORTANT) — CUSTOM SIMPLE LOGIN**

### Login Page UI:

Fields:

* Username (text input)
* Password (password input)
* Login button

### Login Logic:

1. On clicking Login:

   * Query Firestore collection **`users`**
   * Find document where:

     * `username == input_username`
     * `password == input_password`

2. If match found:

   * Store in localStorage:

     ```json
     {
       "userId": "...",
       "username": "...",
       "role": "admin | user"
     }
     ```
   * Redirect to Group List page

3. If not found:

   * Show error: “Sai username hoặc password”

**Constraints:**

* DO NOT use Firebase Authentication
* NO JWT required
* NO OTP, NO Email, NO OAuth

---

## 📦 **Firestore Data Model (REQUIRED)**

### Collection: `users`

```json
{
  "userId": "string",
  "username": "string",
  "password": "string",
  "name": "string",
  "role": "admin | user",
  "createdAt": "timestamp"
}
```

---

### Collection: `groups`

```json
{
  "groupId": "string",
  "name": "string",
  "createdAt": "timestamp",
  "createdBy": "userId"
}
```

---

### Collection: `group_members`

```json
{
  "groupMemberId": "string",
  "groupId": "string",
  "userId": "string",
  "balance": "number",
  "joinedAt": "timestamp"
}
```

---

### Collection: `transactions`

```json
{
  "transactionId": "string",
  "groupId": "string",
  "userId": "string",
  "groupId": "string",
  "amount": "number",
  "description": "string",
  "createdAt": "timestamp"
}
```

---

## 🔄 **Business Logic**

### Create Expense (User Action)

When a user submits an expense:

1. Create a document in `transactions`
2. Decrease the user’s balance in `group_members.balance`

Example:

* Before: 1,000,000
* Expense: 200,000
* After: 800,000

---

## 📱 **UI / Pages (Mobile-first)**

### Page 1 — Login

* Username input
* Password input
* Login button

---

### Page 2 — Group List

Show list of groups the logged-in user belongs to:

* Group A
* Group B
* Group C

Clicking a group opens Group Detail page.

---

### Page 3 — Group Detail (User)

Show:

* List of members + remaining balance
* Button: “Nhập chi tiêu”
* Tab:

  * “Lịch sử chi tiêu của tôi”

---

### Page 4 — Create Expense

Form:

* Amount (number)
* Description (text)
* Submit button

---

### Page 5 — Admin Dashboard

Sections:

1. User Management

   * List users
   * Add / Edit / Delete user

2. Group Management

   * List groups
   * Create / Edit / Delete group

3. Group Member Management

   * Select group
   * View members
   * Add/remove members
   * Set or adjust balance per member

---

## 📁 **Project Structure (EXPECTED)**

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

---

## 🔒 **Firestore Security Rules (HIGH LEVEL EXPECTATION)**

* Users can only:

  * Read their own user document
  * Read groups they belong to
  * Create transactions for themselves only
* Admin can manage all users, groups, and group members

(You can propose exact rules in your implementation.)

---

## ✅ **Deliverables Kiro should provide**

1. Full React project structure
2. Firebase Firestore setup instructions
3. UI components for all pages
4. Login logic using Firestore (NO Firebase Auth)
5. CRUD logic for:

   * Users
   * Groups
   * Group Members
   * Transactions
6. Basic mobile-friendly UI

