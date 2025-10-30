import { navigateTo } from './router.js';
import { protectPage, getCurrentUser } from './auth.js';
import { initNotifications } from './notifications.js';

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
  initNotifications();
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

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            profileMenu.classList.toggle('hidden');
            const isExpanded = !profileMenu.classList.contains('hidden');
            profileBtn.setAttribute('aria-expanded', isExpanded);
        });

        document.addEventListener('click', (event) => {
            const isClickInside = profileMenu.contains(event.target) || profileBtn.contains(event.target);
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
            if(darkModeToggle) darkModeToggle.checked = true;
        } else {
            document.documentElement.classList.remove('dark');
            if(darkModeToggle) darkModeToggle.checked = false;
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

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavButtons = document.querySelectorAll('.nav-btn-mobile');
    const notificationsBtnMobile = document.getElementById('notifications-btn-mobile');
    const notificationsDropdown = document.getElementById('notifications-dropdown');

    if (notificationsBtnMobile && notificationsDropdown) {
        notificationsBtnMobile.addEventListener('click', (event) => {
            event.stopPropagation();
            notificationsDropdown.classList.toggle('hidden');
        });
    }


    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    const profileBtnMobile = document.getElementById('profile-btn-mobile');
    if (profileBtnMobile && settingsModal) {
        profileBtnMobile.addEventListener('click', () => {
            settingsModal.classList.remove('hidden');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    mobileNavButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const path = e.currentTarget.dataset.path;
            navigateTo(path);
            // Fermer le menu après la navigation
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
});
