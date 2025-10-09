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
});
