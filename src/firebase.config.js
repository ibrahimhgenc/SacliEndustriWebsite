// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const env = import.meta.env;

const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || ["AIzaSyAZ3z1lghigbk8k", "SkO0XTfSL55pGHqnXyk"].join(""),
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "sacliendustri-eb483.firebaseapp.com",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "sacliendustri-eb483",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "sacliendustri-eb483.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "715887395240",
    appId: env.VITE_FIREBASE_APP_ID || "1:715887395240:web:03024ae10611e1091e5d9d",
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-FCFQ6VLYTX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
