import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

/* Sign up a new user*/

export const signup = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

/*Log in existing user*/

export const login = async (email: string, password: string): Promise<User> => {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getFriendlyErrorMessage(error));
  }
};

/*Log out current user*/
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Failed to log out. Please try again.');
  }
};

/*Map Firebase error codes to user-friendly messages*/
const getFriendlyErrorMessage = (error: any): string => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-email':
      return 'Invalid email format.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return 'An error occurred. Please try again.';
  }
};
