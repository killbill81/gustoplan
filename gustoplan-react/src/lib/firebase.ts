import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAePhgAi8e5vUjrWsS_36dBLj-3Mw_rO24",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gustoplan-dev.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://gustoplan-dev-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gustoplan-dev",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gustoplan-dev.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "554162135180",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:554162135180:web:f5addf322a0977ffe31ba9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const functions = getFunctions(app, 'europe-west1');
export default app;
