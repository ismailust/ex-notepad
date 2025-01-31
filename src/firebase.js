// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDudw2StPQQLGPeYQH59jgHGx8J3Wd4Fxw",
  authDomain: "ex-notepad.firebaseapp.com",
  projectId: "ex-notepad",
  storageBucket: "ex-notepad.firebasestorage.app",
  messagingSenderId: "358731915208",
  appId: "1:358731915208:web:26023a9f29b4141721aafd",
  measurementId: "G-F0KGD3XCY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);