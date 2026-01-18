import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';

// ============================================
// USER OPERATIONS
// ============================================

/**
 * Create a new user
 * @param {Object} userData - {username, password, name, role}
 * @returns {Promise<string>} userId
 */
export const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Get user by ID
 * @param {string} userId 
 * @returns {Promise<Object>}
 */
export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('User not found');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

/**
 * Get all users
 * @returns {Promise<Array>}
 */
export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

/**
 * Update user
 * @param {string} userId 
 * @param {Object} updates 
 * @returns {Promise<void>}
 */
export const updateUser = async (userId, updates) => {
  try {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Delete user
 * @param {string} userId 
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    // Delete user's group memberships
    const membersQuery = query(
      collection(db, 'group_members'),
      where('userId', '==', userId)
    );
    const membersSnapshot = await getDocs(membersQuery);
    
    // Delete user's transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', userId)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    
    // Batch delete
    const batch = writeBatch(db);
    membersSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    transactionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    batch.delete(doc(db, 'users', userId));
    
    await batch.commit();
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Get user by credentials (for login)
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<Object>}
 */
export const getUserByCredentials = async (username, password) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('username', '==', username),
      where('password', '==', password)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    throw new Error(`Failed to get user by credentials: ${error.message}`);
  }
};


// ============================================
// GROUP OPERATIONS
// ============================================

/**
 * Create a new group
 * @param {Object} groupData - {name, createdBy}
 * @returns {Promise<string>} groupId
 */
export const createGroup = async (groupData) => {
  try {
    const docRef = await addDoc(collection(db, 'groups'), {
      ...groupData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create group: ${error.message}`);
  }
};

/**
 * Get group by ID
 * @param {string} groupId 
 * @returns {Promise<Object>}
 */
export const getGroupById = async (groupId) => {
  try {
    const docRef = doc(db, 'groups', groupId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Group not found');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error(`Failed to get group: ${error.message}`);
  }
};

/**
 * Get all groups
 * @returns {Promise<Array>}
 */
export const getAllGroups = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'groups'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get groups: ${error.message}`);
  }
};

/**
 * Get groups by user ID
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export const getGroupsByUserId = async (userId) => {
  try {
    // First get all group memberships for this user
    const membersQuery = query(
      collection(db, 'group_members'),
      where('userId', '==', userId)
    );
    const membersSnapshot = await getDocs(membersQuery);
    
    if (membersSnapshot.empty) {
      return [];
    }
    
    // Get unique group IDs
    const groupIds = [...new Set(membersSnapshot.docs.map(doc => doc.data().groupId))];
    
    // Fetch all groups
    const groups = await Promise.all(
      groupIds.map(groupId => getGroupById(groupId))
    );
    
    return groups;
  } catch (error) {
    throw new Error(`Failed to get groups by user: ${error.message}`);
  }
};

/**
 * Update group
 * @param {string} groupId 
 * @param {Object} updates 
 * @returns {Promise<void>}
 */
export const updateGroup = async (groupId, updates) => {
  try {
    const docRef = doc(db, 'groups', groupId);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw new Error(`Failed to update group: ${error.message}`);
  }
};

/**
 * Delete group (cascade delete members and transactions)
 * @param {string} groupId 
 * @returns {Promise<void>}
 */
export const deleteGroup = async (groupId) => {
  try {
    // Delete group members
    const membersQuery = query(
      collection(db, 'group_members'),
      where('groupId', '==', groupId)
    );
    const membersSnapshot = await getDocs(membersQuery);
    
    // Delete group transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('groupId', '==', groupId)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    
    // Batch delete
    const batch = writeBatch(db);
    membersSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    transactionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    batch.delete(doc(db, 'groups', groupId));
    
    await batch.commit();
  } catch (error) {
    throw new Error(`Failed to delete group: ${error.message}`);
  }
};


// ============================================
// GROUP MEMBER OPERATIONS
// ============================================

/**
 * Add member to group
 * @param {string} groupId 
 * @param {string} userId 
 * @param {number} initialBalance 
 * @returns {Promise<string>} groupMemberId
 */
export const addMemberToGroup = async (groupId, userId, initialBalance = 0) => {
  try {
    const docRef = await addDoc(collection(db, 'group_members'), {
      groupId,
      userId,
      balance: initialBalance,
      joinedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to add member to group: ${error.message}`);
  }
};

/**
 * Remove member from group
 * @param {string} groupMemberId 
 * @returns {Promise<void>}
 */
export const removeMemberFromGroup = async (groupMemberId) => {
  try {
    await deleteDoc(doc(db, 'group_members', groupMemberId));
  } catch (error) {
    throw new Error(`Failed to remove member from group: ${error.message}`);
  }
};

/**
 * Get all members of a group
 * @param {string} groupId 
 * @returns {Promise<Array>}
 */
export const getGroupMembers = async (groupId) => {
  try {
    const q = query(
      collection(db, 'group_members'),
      where('groupId', '==', groupId)
    );
    const querySnapshot = await getDocs(q);
    
    // Get member details with user information
    const members = await Promise.all(
      querySnapshot.docs.map(async (memberDoc) => {
        const memberData = memberDoc.data();
        const user = await getUserById(memberData.userId);
        
        return {
          id: memberDoc.id,
          ...memberData,
          userName: user.name,
          username: user.username
        };
      })
    );
    
    return members;
  } catch (error) {
    throw new Error(`Failed to get group members: ${error.message}`);
  }
};

/**
 * Update member balance
 * @param {string} groupMemberId 
 * @param {number} newBalance 
 * @returns {Promise<void>}
 */
export const updateMemberBalance = async (groupMemberId, newBalance) => {
  try {
    const docRef = doc(db, 'group_members', groupMemberId);
    await updateDoc(docRef, { balance: newBalance });
  } catch (error) {
    throw new Error(`Failed to update member balance: ${error.message}`);
  }
};

/**
 * Get member by group and user
 * @param {string} groupId 
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
export const getMemberByGroupAndUser = async (groupId, userId) => {
  try {
    const q = query(
      collection(db, 'group_members'),
      where('groupId', '==', groupId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const memberDoc = querySnapshot.docs[0];
    return { id: memberDoc.id, ...memberDoc.data() };
  } catch (error) {
    throw new Error(`Failed to get member: ${error.message}`);
  }
};


// ============================================
// TRANSACTION OPERATIONS
// ============================================

/**
 * Create a transaction
 * @param {Object} transactionData - {groupId, userId, amount, description}
 * @returns {Promise<string>} transactionId
 */
export const createTransaction = async (transactionData) => {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    throw new Error(`Failed to create transaction: ${error.message}`);
  }
};

/**
 * Get transactions by group
 * @param {string} groupId 
 * @returns {Promise<Array>}
 */
export const getTransactionsByGroup = async (groupId) => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new Error(`Failed to get transactions by group: ${error.message}`);
  }
};

/**
 * Get transactions by user in a specific group
 * @param {string} userId 
 * @param {string} groupId 
 * @returns {Promise<Array>}
 */
export const getTransactionsByUser = async (userId, groupId) => {
  try {
    // Query by groupId only to avoid complex index requirement
    const q = query(
      collection(db, 'transactions'),
      where('groupId', '==', groupId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    // Filter by userId on client side
    const transactions = querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(transaction => transaction.userId === userId);
    
    return transactions;
  } catch (error) {
    throw new Error(`Failed to get transactions by user: ${error.message}`);
  }
};

/**
 * Create expense (combined operation: create transaction + update balance)
 * @param {string} userId 
 * @param {string} groupId 
 * @param {number} amount 
 * @param {string} description 
 * @returns {Promise<string>} transactionId
 */
export const createExpense = async (userId, groupId, amount, description) => {
  try {
    // Get the member record
    const member = await getMemberByGroupAndUser(groupId, userId);
    
    if (!member) {
      throw new Error('User is not a member of this group');
    }
    
    // Create transaction
    const transactionId = await createTransaction({
      groupId,
      userId,
      amount,
      description
    });
    
    // Update member balance (decrease by expense amount)
    const newBalance = member.balance - amount;
    await updateMemberBalance(member.id, newBalance);
    
    return transactionId;
  } catch (error) {
    throw new Error(`Failed to create expense: ${error.message}`);
  }
};


/**
 * Update transaction
 * @param {string} transactionId 
 * @param {Object} updates - {amount, description}
 * @returns {Promise<void>}
 */
export const updateTransaction = async (transactionId, updates) => {
  try {
    const docRef = doc(db, 'transactions', transactionId);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw new Error(`Failed to update transaction: ${error.message}`);
  }
};

/**
 * Delete transaction
 * @param {string} transactionId 
 * @returns {Promise<void>}
 */
export const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId));
  } catch (error) {
    throw new Error(`Failed to delete transaction: ${error.message}`);
  }
};

/**
 * Get transaction by ID
 * @param {string} transactionId 
 * @returns {Promise<Object>}
 */
export const getTransactionById = async (transactionId) => {
  try {
    const docRef = doc(db, 'transactions', transactionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Transaction not found');
    }
    
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error(`Failed to get transaction: ${error.message}`);
  }
};

/**
 * Update expense (update transaction + adjust balance)
 * @param {string} transactionId 
 * @param {string} userId 
 * @param {string} groupId 
 * @param {number} newAmount 
 * @param {string} newDescription 
 * @returns {Promise<void>}
 */
export const updateExpense = async (transactionId, userId, groupId, newAmount, newDescription) => {
  try {
    // Get the original transaction
    const originalTransaction = await getTransactionById(transactionId);
    const oldAmount = originalTransaction.amount;
    
    // Get the member record
    const member = await getMemberByGroupAndUser(groupId, userId);
    
    if (!member) {
      throw new Error('User is not a member of this group');
    }
    
    // Calculate balance adjustment
    // If old amount was 100 and new amount is 150, balance should decrease by 50
    // If old amount was 100 and new amount is 50, balance should increase by 50
    const balanceAdjustment = oldAmount - newAmount;
    const newBalance = member.balance + balanceAdjustment;
    
    // Update transaction
    await updateTransaction(transactionId, {
      amount: newAmount,
      description: newDescription
    });
    
    // Update member balance
    await updateMemberBalance(member.id, newBalance);
  } catch (error) {
    throw new Error(`Failed to update expense: ${error.message}`);
  }
};

/**
 * Delete expense (delete transaction + restore balance)
 * @param {string} transactionId 
 * @param {string} userId 
 * @param {string} groupId 
 * @returns {Promise<void>}
 */
export const deleteExpense = async (transactionId, userId, groupId) => {
  try {
    // Get the transaction to get the amount
    const transaction = await getTransactionById(transactionId);
    
    // Get the member record
    const member = await getMemberByGroupAndUser(groupId, userId);
    
    if (!member) {
      throw new Error('User is not a member of this group');
    }
    
    // Restore balance (add back the expense amount)
    const newBalance = member.balance + transaction.amount;
    
    // Delete transaction
    await deleteTransaction(transactionId);
    
    // Update member balance
    await updateMemberBalance(member.id, newBalance);
  } catch (error) {
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
};
