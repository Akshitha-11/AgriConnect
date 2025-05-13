import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyA2...",
  authDomain: "miniproject2-883d9.firebaseapp.com",
  projectId: "miniproject2-883d9",
  storageBucket: "miniproject2-883d9.appspot.com",
  messagingSenderId: "...",
  appId: "1:...:web:...",
  measurementId: "G-...",
  databaseURL: "https://miniproject2-883d9-default-rtdb.asia-southeast1.firebasedatabase.app/"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);

export default app; 