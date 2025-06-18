import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: 'zerocode-chat-app.firebaseapp.com',
  projectId: 'zerocode-chat-app',
  storageBucket: 'zerocode-chat-app.firebasestorage.app',
  messagingSenderId: '305585507711',
  appId: '1:305585507711:web:71d3ca1a2a667e9ddade4a',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
