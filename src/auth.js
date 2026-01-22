import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase-config.js';

let currentUser = null;

// Cette fonction vérifie l'état de connexion et protège la page
export function protectPage() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            currentUser = user;
            const loginBtn = document.getElementById('login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const profileBtn = document.getElementById('profile-btn');
            const userDisplayName = document.getElementById('user-display-name');
            const menuUserName = document.getElementById('menu-user-name'); // Name inside the dropdown

            if (user) {
                // L'utilisateur est connecté, l'application peut continuer.
                console.log("User is signed in:", user.uid, user.displayName);
                if (loginBtn) loginBtn.classList.add('hidden');
                if (logoutBtn) logoutBtn.classList.remove('hidden');

                // Show Profile Button (The dropdown trigger)
                if (profileBtn) {
                    profileBtn.classList.remove('hidden');
                    // Ensure flex display if it was hidden
                    profileBtn.classList.add('flex');
                }

                // Update Name in Header (The pill)
                if (userDisplayName) {
                    userDisplayName.textContent = user.displayName || user.email || "Utilisateur";
                    // Ensure it's visible (remove hidden if it has it, though normally parent controls visibility)
                    userDisplayName.classList.remove('hidden');
                }

                // Update Name in Dropdown Menu
                if (menuUserName) {
                    menuUserName.textContent = user.displayName || user.email || "Utilisateur";
                }

                // On réactive le bouton de déconnexion
                const logoutButton = document.getElementById('logout-btn');
                const profileButton = document.getElementById('profile-btn');
                if (logoutButton) logoutButton.classList.remove('hidden');
                if (profileButton) profileButton.classList.remove('hidden');

                const handleLogout = async () => {
                    try {
                        await signOut(auth);
                        console.log("User signed out");
                        window.location.href = 'index.html';
                    } catch (error) {
                        console.error("Error signing out: ", error);
                    }
                };

                if (logoutBtn && !logoutBtn.hasAttribute('data-listener-attached')) {
                    logoutBtn.addEventListener('click', handleLogout);
                    logoutBtn.setAttribute('data-listener-attached', 'true');
                }

                const dropdownLogoutBtn = document.getElementById('btn-logout');
                if (dropdownLogoutBtn && !dropdownLogoutBtn.hasAttribute('data-listener-attached')) {
                    dropdownLogoutBtn.addEventListener('click', handleLogout);
                    dropdownLogoutBtn.setAttribute('data-listener-attached', 'true');
                }

                const logoutButtonMobile = document.getElementById('logout-btn-mobile');
                if (logoutButtonMobile && !logoutButtonMobile.hasAttribute('data-listener-attached')) {
                    logoutButtonMobile.addEventListener('click', () => {
                        signOut(auth).catch((error) => {
                            console.error('Sign Out Error', error);
                        });
                    });
                    logoutButtonMobile.setAttribute('data-listener-attached', 'true');
                }
                resolve(user);

            } else {
                // L'utilisateur n'est pas connecté, redirection vers la page de connexion.
                console.log("User is signed out");
                if (loginBtn) loginBtn.classList.remove('hidden');
                if (logoutBtn) logoutBtn.classList.add('hidden');
                if (profileBtn) {
                    profileBtn.classList.add('hidden');
                    profileBtn.classList.remove('flex');
                }
                if (userDisplayName) userDisplayName.textContent = "";
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
