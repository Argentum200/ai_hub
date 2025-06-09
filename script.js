
// Navigation and UI functionality
let isLogin = true;
let currentUser = null;

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
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (tab === 'login') {
        buttons[0].classList.add('active');
        document.getElementById('nameField').style.display = 'none';
        isLogin = true;
    } else {
        buttons[1].classList.add('active');
        document.getElementById('nameField').style.display = 'block';
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

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('authForm');
    
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        
        if (isLogin) {
            // Mock login
            currentUser = { name: email.split('@')[0], email: email };
            showNotification('Успішний вхід', 'Ви успішно увійшли до системи.');
        } else {
            // Mock registration
            currentUser = { name: name, email: email };
            showNotification('Успішна реєстрація', 'Ваш акаунт створено успішно.');
        }
        
        closeUserDialog();
        clearForm();
    });
});

function googleAuth() {
    // Mock Google authentication
    currentUser = {
        name: "Google User",
        email: "user@gmail.com"
    };
    
    showNotification('Успішний вхід через Google', 'Ви успішно увійшли через Google акаунт.');
    closeUserDialog();
}

function clearForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
}

function showNotification(title, message) {
    // Simple notification system
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #16a34a;
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

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('userModal');
    if (e.target === modal) {
        closeUserDialog();
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});
