// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Colle ici ta configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAOriUNSvP7k4o85NUNFbk3Xa7Jdk3YCak",
  authDomain: "gustoplan-app.firebaseapp.com",
  projectId: "gustoplan-app",
  storageBucket: "gustoplan-app.firebasestorage.app",
  messagingSenderId: "303657804036",
  appId: "1:303657804036:web:57f14add50f0c827953051"
};

// Initialise Firebase
import { getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

let firebaseApp;
// Vérifie si Firebase a déjà été initialisé
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp(); // Si oui, récupère l'instance existante
}

const db = getFirestore(firebaseApp);

export { db, firebaseApp };
