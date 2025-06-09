// Navigation and UI functionality
let isLogin = true;
// Тепер currentUser буде завантажуватися з localStorage
let currentUser = null; 

/**
 * Оновлює інтерфейс користувача (хедер) в залежності від того, чи залогінений користувач.
 */
function updateUserUI() {
    const userAccountLink = document.getElementById('userAccountLink');
    if (!userAccountLink) return;
    if (currentUser) {
        // Користувач залогінений
        userAccountLink.innerHTML = `<i class="fas fa-user-check"></i> Привіт, ${currentUser.name}`;
        userAccountLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Бажаєте вийти з акаунту?')) {
                logout();
            }
        };
    } else {
        // Користувач не залогінений
        userAccountLink.innerHTML = `<i class="fas fa-user"></i> Обліковий запис`;
        userAccountLink.onclick = (e) => {
            e.preventDefault();
            openUserDialog();
        };
    }
}

/**
 * Виконує вихід користувача з системи.
 */
function logout() {
    currentUser = null;
    // Очищуємо дані користувача з localStorage
    localStorage.removeItem('currentUser'); 
    updateUserUI();
    showNotification('Вихід', 'Ви успішно вийшли з системи.', 'info');
    // Оновлюємо відображення на сторінці форуму, якщо ми на ній
    if (window.location.pathname.includes('forum.html') && typeof displayPosts === 'function') {
        displayPosts(); 
    }
}

/**
 * Зберігає дані користувача у localStorage.
 * @param {object} user - Об'єкт користувача {name, email}
 */
function saveUserToStorage(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * Завантажує дані користувача з localStorage.
 */
function loadUserFromStorage() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        currentUser = JSON.parse(userJson);
    }
}

function scrollToTechnologies() {
    const techSection = document.getElementById('technologies');
    if (techSection) {
        techSection.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

function openUserDialog() {
    document.getElementById('userModal').style.display = 'block';
}

function closeUserDialog() {
    document.getElementById('userModal').style.display = 'none';
}

function switchTab(tab) {
    const buttons = document.querySelectorAll('.tab-button');
    const nameField = document.getElementById('nameField');
    const nameInput = document.getElementById('name');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        buttons[0].classList.add('active');
        nameField.style.display = 'none';
        nameInput.required = false; 
        isLogin = true;
    } else {
        buttons[1].classList.add('active');
        nameField.style.display = 'block';
        nameInput.required = true; 
        isLogin = false;
    }
    
    updateFormTexts();
}

function updateFormTexts() {
    const submitButton = document.querySelector('.submit-button');
    const googleButton = document.querySelector('.google-button');
    const switchButton = document.querySelector('.switch-mode');
    
    if (isLogin) {
        submitButton.textContent = 'Увійти';
        googleButton.innerHTML = '<i class="fab fa-google"></i> Увійти через Google';
        switchButton.textContent = 'Немає акаунту? Зареєструйтеся';
    } else {
        submitButton.textContent = 'Зареєструватися';
        googleButton.innerHTML = '<i class="fab fa-google"></i> Зареєструватися через Google';
        switchButton.textContent = 'Вже маєте акаунт? Увійдіть';
    }
}

function switchAuthMode() {
    isLogin = !isLogin;
    isLogin ? switchTab('login') : switchTab('register');
}

function handleAuthForm(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const nameInput = document.getElementById('name');
    
    let userToSave;

    if (isLogin) {
        const mockName = email.split('@')[0];
        userToSave = { name: mockName, email: email };
        showNotification('Успішний вхід', `Ласкаво просимо, ${userToSave.name}!`);
    } else {
        const name = nameInput.value.trim();
        if (!name) {
            showNotification('Помилка реєстрації', 'Будь ласка, введіть ваше ім\'я.', 'error');
            return;
        }
        userToSave = { name: name, email: email };
        showNotification('Успішна реєстрація', `Дякуємо за реєстрацію, ${userToSave.name}!`);
    }
    
    currentUser = userToSave;
    saveUserToStorage(currentUser); // Зберігаємо в localStorage
    
    closeUserDialog();
    clearForm();
    updateUserUI();
    
    if (window.location.pathname.includes('forum.html') && typeof displayPosts === 'function') {
        displayPosts();
    }
}

function googleAuth() {
    currentUser = { name: "Google User", email: "user@gmail.com" };
    saveUserToStorage(currentUser); // Зберігаємо в localStorage
    
    showNotification('Успішний вхід через Google', `Ласкаво просимо, ${currentUser.name}!`);
    closeUserDialog();
    updateUserUI();

    if (window.location.pathname.includes('forum.html') && typeof displayPosts === 'function') {
        displayPosts();
    }
}

function clearForm() {
    const authForm = document.getElementById('authForm');
    if (authForm) authForm.reset();
}

function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    let backgroundColor = type === 'error' ? '#dc2626' : (type === 'info' ? '#2563eb' : '#16a34a');

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${backgroundColor}; color: white;
        padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001; max-width: 300px;`;
    
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
        <div style="font-size: 0.875rem;">${message}</div>`;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// --- NEW DYNAMIC ACTIVE LINK LOGIC ---
function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav .nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .nav-link');
    const allLinks = [...navLinks, ...mobileNavLinks];
    
    let currentPath = window.location.pathname.split("/").pop();
    if (currentPath === '' || currentPath === 'index.html') {
        // Handle scroll-based active link on the main page
        const sections = document.querySelectorAll('section[id]');
        let activeSectionId = 'hero'; // Default to top section
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight;
            if (window.scrollY >= sectionTop) {
                activeSectionId = section.id;
            }
        });

        allLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (activeSectionId === 'hero' && (linkHref === 'index.html' || linkHref === '/')) {
                link.classList.add('active');
            } else if (linkHref.includes(`#${activeSectionId}`)) {
                link.classList.add('active');
            }
        });

    } else {
        // Handle page-based active link on other pages
        allLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
}

// --- NEW MOBILE NAVIGATION LOGIC ---
function handleMobileNav() {
    const toggleButton = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-nav-menu');
    if (toggleButton && mobileMenu) {
        toggleButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load user from storage on page load
    loadUserFromStorage();
    updateUserUI();

    // Handle authentication form submission
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthForm);
    }
    
    // Close modal on outside click
    const userModal = document.getElementById('userModal');
    if (userModal) {
        window.addEventListener('click', (e) => {
            if (e.target === userModal) closeUserDialog();
        });
    }
    
    // Smooth scroll for anchor links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link && !link.getAttribute('href').startsWith('#!')) { // Avoid interfering with other scripts
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Initialize mobile navigation
    handleMobileNav();
    
    // Initialize active nav link logic
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
});