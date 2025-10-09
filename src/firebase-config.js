import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAf2Fmg5SBU6zpZ9r-VP_eTF49r-e1go7Q",
    authDomain: "gustoplan-dev.firebaseapp.com",
    projectId: "gustoplan-dev",
    storageBucket: "gustoplan-dev.firebasestorage.app",
    messagingSenderId: "554162135180",
    appId: "1:554162135180:web:f5addf322a0977ffe31ba9"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { db, auth, firebaseApp };
