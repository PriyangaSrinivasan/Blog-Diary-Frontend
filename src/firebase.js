// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blooger-platform.firebaseapp.com",
  projectId: "blooger-platform",
  storageBucket: "blooger-platform.appspot.com",
  messagingSenderId: "3479051780",
  appId: "1:3479051780:web:6bbc701858cd58c9951f51"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);