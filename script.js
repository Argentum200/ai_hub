// Navigation and UI functionality
let isLogin = true;
// Тепер currentUser буде завантажуватися з localStorage
let currentUser = null; 

/**
 * Оновлює інтерфейс користувача (хедер) в залежності від того, чи залогінений користувач.
 */
function updateUserUI() {
    const userAccountLink = document.getElementById('userAccountLink');
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
    if (window.location.pathname.includes('forum.html')) {
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
    document.getElementById('technologies').scrollIntoView({ 
        behavior: 'smooth' 
    });
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

document.addEventListener('DOMContentLoaded', function() {
    // Завантажуємо користувача при старті сторінки
    loadUserFromStorage();
    updateUserUI();

    const authForm = document.getElementById('authForm');
    
    authForm.addEventListener('submit', function(e) {
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
        // Оновлюємо відображення на сторінці форуму, якщо ми на ній
        if (window.location.pathname.includes('forum.html')) {
            displayPosts();
        }
    });
});

function googleAuth() {
    currentUser = { name: "Google User", email: "user@gmail.com" };
    saveUserToStorage(currentUser); // Зберігаємо в localStorage
    
    showNotification('Успішний вхід через Google', `Ласкаво просимо, ${currentUser.name}!`);
    closeUserDialog();
    updateUserUI();
    // Оновлюємо відображення на сторінці форуму, якщо ми на ній
    if (window.location.pathname.includes('forum.html')) {
        displayPosts();
    }
}

function clearForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
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

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('userModal')) closeUserDialog();
});

document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
});