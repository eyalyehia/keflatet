// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_RHQVrUlnnp1HhTGlr4j_h1gZw59vyxA",
  authDomain: "kef-latet.firebaseapp.com",
  projectId: "kef-latet",
  storageBucket: "kef-latet.firebasestorage.app",
  messagingSenderId: "1087181865922",
  appId: "1:1087181865922:web:09d46b6cbbe9459c758c5b",
  measurementId: "G-0F58J4KMXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage and get a reference to the service
export const storage = getStorage(app);

export default app;