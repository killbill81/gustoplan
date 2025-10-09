import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase-config.js';

let currentUser = null;

// Cette fonction vérifie l'état de connexion et protège la page
export function protectPage() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            if (user) {
                // L'utilisateur est connecté, l'application peut continuer.
                console.log("User is logged in:", user.uid);

                // On réactive le bouton de déconnexion
                const logoutButton = document.getElementById('logout-btn');
                const profileButton = document.getElementById('profile-btn');
                if(logoutButton) logoutButton.classList.remove('hidden');
                if(profileButton) profileButton.classList.remove('hidden');

                if (logoutButton && !logoutButton.hasAttribute('data-listener-attached')) {
                    logoutButton.addEventListener('click', () => {
                        signOut(auth).catch((error) => {
                            console.error('Sign Out Error', error);
                        });
                    });
                    logoutButton.setAttribute('data-listener-attached', 'true');
                }
                resolve(user);

            } else {
                // L'utilisateur n'est pas connecté, redirection vers la page de connexion.
                console.log("User not logged in. Redirecting to login.html");
                // On s'assure que l'URL est correcte pour votre configuration XAMPP
                const loginUrl = window.location.origin + '/login.html';
                if (window.location.href !== loginUrl) {
                     window.location.href = loginUrl;
                }
                resolve(null);
            }
        });
    });
}

export function getCurrentUserId() {
    return currentUser ? currentUser.uid : null;
}

export function getCurrentUser() {
    return currentUser;
}
