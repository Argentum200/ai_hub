// Navigation and UI functionality
let isLogin = true;
let currentUser = null; // Зберігає дані поточного користувача {name, email}

// --- NEW FUNCTIONS ---

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
            // Показуємо опцію виходу або одразу виходимо
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
    updateUserUI();
    showNotification('Вихід', 'Ви успішно вийшли з системи.', 'info');
}

// --- END NEW FUNCTIONS ---

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
        nameInput.required = false; // Робимо поле імені необов'язковим для входу
        isLogin = true;
    } else {
        buttons[1].classList.add('active');
        nameField.style.display = 'block';
        nameInput.required = true; // Робимо поле імені обов'язковим для реєстрації
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
    if (isLogin) {
        switchTab('login');
    } else {
        switchTab('register');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізуємо інтерфейс при завантаженні сторінки
    updateUserUI();

    const authForm = document.getElementById('authForm');
    
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const nameInput = document.getElementById('name');
        
        if (isLogin) {
            // Mock login
            // Для простоти, ім'я беремо з email, але в реальному додатку його б тягнули з бази
            const mockName = email.split('@')[0];
            currentUser = { name: mockName, email: email };
            showNotification('Успішний вхід', `Ласкаво просимо, ${currentUser.name}!`);
        } else {
            // Registration
            const name = nameInput.value.trim();

            // --- UPDATED VALIDATION ---
            if (!name) {
                showNotification('Помилка реєстрації', 'Будь ласка, введіть ваше ім\'я.', 'error');
                return; // Зупиняємо виконання, якщо ім'я не введено
            }
            // --- END UPDATED VALIDATION ---

            currentUser = { name: name, email: email };
            showNotification('Успішна реєстрація', `Дякуємо за реєстрацію, ${currentUser.name}!`);
        }
        
        closeUserDialog();
        clearForm();
        updateUserUI(); // Оновлюємо інтерфейс після логіну/реєстрації
    });
});

function googleAuth() {
    // Mock Google authentication
    currentUser = {
        name: "Google User",
        email: "user@gmail.com"
    };
    
    showNotification('Успішний вхід через Google', `Ласкаво просимо, ${currentUser.name}!`);
    closeUserDialog();
    updateUserUI(); // Оновлюємо інтерфейс
}

function clearForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
}

// Оновлена функція для показу сповіщень різного типу (успіх, помилка, інформація)
function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    
    let backgroundColor;
    switch (type) {
        case 'error':
            backgroundColor = '#dc2626'; // red
            break;
        case 'info':
            backgroundColor = '#2563eb'; // blue
            break;
        default:
            backgroundColor = '#16a34a'; // green
            break;
    }

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
        <div style="font-size: 0.875rem;">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

window.addEventListener('click', function(e) {
    const modal = document.getElementById('userModal');
    if (e.target === modal) {
        closeUserDialog();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});