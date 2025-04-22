import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCSdAeVr2et2MIuVufF7VYMzK2KoFdt_I",
  authDomain: "miniproject2-883d9.firebaseapp.com",
  projectId: "miniproject2-883d9",
  storageBucket: "miniproject2-883d9.firebasestorage.app",
  messagingSenderId: "595542635696",
  appId: "1:595542635696:web:ea48db369bab3ac0e77775",
  measurementId: "G-TZJN6S73FN",
  databaseURL: "https://miniproject2-883d9-default-rtdb.asia-southeast1.firebasedatabase.app/"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
export default app; 