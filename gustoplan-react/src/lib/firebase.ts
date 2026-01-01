import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBHhs6Vq2UFGXDRjEBIuihx9KWFswvMI18",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gustoplan-fb.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://gustoplan-fb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gustoplan-fb",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gustoplan-fb.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "28499252479",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:28499252479:web:9f8e8749e49a83416b2d24"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const functions = getFunctions(app, 'europe-west1');
export default app;
