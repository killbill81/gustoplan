import { navigateTo } from './router.js';
import { protectPage, getCurrentUser } from './auth.js';
import { initNotifications } from './notifications.js';
import { initSettingsUI } from './settings-ui.js';

function startApp() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        const displayNameElement = document.getElementById('user-display-name');
        if (displayNameElement) {
            displayNameElement.textContent = currentUser.displayName || currentUser.email;
        }
    }

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const path = e.currentTarget.dataset.path;
            navigateTo(path);

            // Update active button style
            navButtons.forEach(btn => {
                btn.classList.remove('bg-tomato', 'text-white');
                btn.classList.add('bg-white', 'text-tomato');
            });
            e.currentTarget.classList.add('bg-tomato', 'text-white');
            e.currentTarget.classList.remove('bg-white', 'text-tomato');
        });
    });

    // Load default page
    navigateTo('menu');
    console.log("DEBUG: Calling initNotifications...");
    initNotifications();
    initSettingsUI();
}

document.addEventListener('DOMContentLoaded', () => {
    protectPage().then(user => {
        if (user) {
            startApp();
        }
    });

    // Profile dropdown
    const profileBtn = document.getElementById('profile-btn');
    const profileMenu = document.getElementById('profile-menu');
    const userDisplayName = document.getElementById('user-display-name');

    if (profileBtn && profileMenu) {
        const toggleMenu = (event) => {
            event.stopPropagation();
            profileMenu.classList.toggle('hidden');
            const isExpanded = !profileMenu.classList.contains('hidden');
            profileBtn.setAttribute('aria-expanded', isExpanded);
        };

        profileBtn.addEventListener('click', toggleMenu);

        if (userDisplayName) {
            userDisplayName.addEventListener('click', toggleMenu);
            // Make it look clickable via JS if we can't edit HTML CSS easily right now, 
            // but we will edit HTML next.
            userDisplayName.style.cursor = 'pointer';
        }

        document.addEventListener('click', (event) => {
            const isClickInside = profileMenu.contains(event.target) ||
                profileBtn.contains(event.target) ||
                (userDisplayName && userDisplayName.contains(event.target));

            if (!isClickInside && !profileMenu.classList.contains('hidden')) {
                profileMenu.classList.add('hidden');
                profileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Settings Modal & Dark Mode
    const settingsLink = document.getElementById('settings-link');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsModalBtn = document.getElementById('close-settings-modal');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Function to apply theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if (darkModeToggle) darkModeToggle.checked = true;
        } else {
            document.documentElement.classList.remove('dark');
            if (darkModeToggle) darkModeToggle.checked = false;
        }
    };

    // Check for saved theme on load and apply it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Optional: Check for user's system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    if (settingsLink && settingsModal) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            settingsModal.classList.remove('hidden');
        });
    }

    if (closeSettingsModalBtn && settingsModal) {
        closeSettingsModalBtn.addEventListener('click', () => {
            settingsModal.classList.add('hidden');
        });
    }

    // Also close modal on outside click
    if (settingsModal) {
        settingsModal.addEventListener('click', (event) => {
            if (event.target === settingsModal) {
                settingsModal.classList.add('hidden');
            }
        });
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            const theme = darkModeToggle.checked ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });
    }

    // Mobile Menu Logic - Dynamic Overlay Strategy
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuSource = document.getElementById('mobile-menu'); // The hidden source
    let mobileMenuOverlay = null;

    if (mobileMenuBtn && mobileMenuSource) {
        console.log("Mobile menu initialized (Overlay Mode)");

        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (mobileMenuOverlay) {
                // Close
                mobileMenuOverlay.remove();
                mobileMenuOverlay = null;
            } else {
                // Open - Create Overlay
                mobileMenuOverlay = document.createElement('div');
                mobileMenuOverlay.id = 'mobile-menu-overlay-container'; // Unique ID

                // Copy content
                mobileMenuOverlay.innerHTML = mobileMenuSource.innerHTML;

                // Style Overlay
                Object.assign(mobileMenuOverlay.style, {
                    position: 'fixed',
                    top: '60px', // Matches header height approx
                    left: '0',
                    width: '100%',
                    backgroundColor: '#3D405B', // Eggplant
                    zIndex: '10000',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    display: 'block'
                });

                // Handle clicks directly for known actions
                mobileMenuOverlay.addEventListener('click', (ev) => {
                    const target = ev.target.closest('button');
                    if (!target) return;

                    const path = target.dataset.path;

                    if (path) {
                        console.log("Overlay: Navigating directly to", path);
                        navigateTo(path);
                    } else if (target.id === 'profile-btn-mobile') {
                        console.log("Overlay: Opening settings");
                        if (settingsModal) settingsModal.classList.remove('hidden');
                    } else {
                        // Fallback: Delegate to original element (e.g. Logout button handled elsewhere)
                        let original = null;
                        if (target.id) {
                            original = document.getElementById(target.id);
                        }

                        if (original) {
                            console.log("Overlay: Delegating click to original:", original);
                            original.click();
                        } else {
                            console.warn("Overlay: No action found for", target);
                        }
                    }

                    // Close menu safely
                    if (mobileMenuOverlay) {
                        mobileMenuOverlay.remove();
                        mobileMenuOverlay = null;
                    }
                });

                document.body.appendChild(mobileMenuOverlay);
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenuOverlay && !mobileMenuOverlay.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuOverlay.remove();
                mobileMenuOverlay = null;
            }
        });

    } else {
        console.warn("Mobile menu elements missing");
    }

    // Keep existing listeners for ORIGINAL elements (they will be triggered by the clone)
    const profileBtnMobile = document.getElementById('profile-btn-mobile');
    if (profileBtnMobile && settingsModal) {
        profileBtnMobile.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
        });
    }

    const mobileNavButtons = document.querySelectorAll('.nav-btn-mobile');
    mobileNavButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const path = e.currentTarget.dataset.path;
            navigateTo(path);
        });
    });
});
