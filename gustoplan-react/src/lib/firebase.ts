import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDif5g62oVWT460e5q3Kpg7txgRN8VXk24",
    authDomain: "gustoplan-dev.firebaseapp.com",
    projectId: "gustoplan-dev",
    storageBucket: "gustoplan-dev.firebasestorage.app",
    messagingSenderId: "554162135180",
    appId: "1:554162135180:web:f5addf322a0977ffe31ba9",
    databaseURL: "https://gustoplan-dev-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export default app;
