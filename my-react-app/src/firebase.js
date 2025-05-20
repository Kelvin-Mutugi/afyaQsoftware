// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAfveVJ-RcQsGHkztMG25XwCxIx5VpJ4m8",
  authDomain: "afyaq-27042.firebaseapp.com",
  projectId: "afyaq-27042",
  storageBucket: "afyaq-27042.firebasestorage.app",
  messagingSenderId: "281008215391",
  appId: "1:281008215391:web:9f5e08b19b7416306192ea",
  measurementId: "G-RCKBY80BBP"
};      

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);