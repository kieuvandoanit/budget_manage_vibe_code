import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

const AUTH_STORAGE_KEY = 'expense_manager_user';

/**
 * Login user with username and password
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{userId: string, username: string, role: string}>}
 */
export const login = async (username, password) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('username', '==', username),
      where('password', '==', password)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Sai username hoặc password');
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = {
      userId: userDoc.id,
      username: userDoc.data().username,
      role: userDoc.data().role
    };
    
    // Store in localStorage
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout current user
 */
export const logout = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

/**
 * Get current user from localStorage
 * @returns {{userId: string, username: string, role: string} | null}
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    return null;
  }
};

/**
 * Check if current user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
