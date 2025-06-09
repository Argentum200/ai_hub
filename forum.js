// Forum functionality
let currentPage = 1;
let postsPerPage = 10;
let allPosts = [];
let filteredPosts = [];
let currentCategory = 'all';

// Sample forum data with comments
const forumData = [
    {
        id: 1,
        title: "Як почати з машинного навчання?",
        content: "Привіт всім! Я новачок у сфері ШІ і хотів би дізнатися, з чого краще почати вивчення машинного навчання...",
        author: "AINewbie",
        category: "ml",
        date: "2024-03-15",
        views: 156,
        likes: 12,
        comments: [
            { author: 'ExpertAI', date: '2024-03-15', text: 'Чудове питання! Почніть з курсу Andrew Ng на Coursera.' },
            { author: 'DataGeek', date: '2024-03-16', text: 'Я б також порекомендував книгу "The Hundred-Page Machine Learning Book".' }
        ]
    },
    {
        id: 2,
        title: "Порівняння ChatGPT та Claude",
        content: "Хто може поділитися досвідом використання обох платформ? Цікавлять переваги та недоліки кожної...",
        author: "TechExplorer",
        category: "general",
        date: "2024-03-14",
        views: 203,
        likes: 8,
        comments: [
             { author: 'User123', date: '2024-03-14', text: 'Claude краще справляється з великими документами, а ChatGPT, на мою думку, більш креативний.' }
        ]
    },
    {
        id: 3,
        title: "Проблеми з розпізнаванням зображень",
        content: "Працюю над проектом комп'ютерного зору і зіткнувся з проблемою низької точності розпізнавання...",
        author: "VisionDev",
        category: "cv",
        date: "2024-03-13",
        views: 89,
        likes: 6,
        comments: []
    },
    {
        id: 4,
        title: "Найкращі інструменти для NLP",
        content: "Які бібліотеки та інструменти ви рекомендуєте для роботи з обробкою природної мови?",
        author: "NLPMaster",
        category: "nlp",
        date: "2024-03-12",
        views: 267,
        likes: 19,
        comments: [
            { author: 'LingoFan', date: '2024-03-12', text: 'Hugging Face Transformers - це стандарт де-факто зараз.' },
            { author: 'NLPMaster', date: '2024-03-12', text: 'Дякую, подивлюся!' }
        ]
    },
    {
        id: 5,
        title: "Допомога з налаштуванням середовища",
        content: "Не можу налаштувати Python середовище для роботи з TensorFlow. Хтось може допомогти?",
        author: "DevBeginner",
        category: "help",
        date: "2024-03-11",
        views: 45,
        likes: 3,
        comments: []
    }
];

const categoryNames = {
    'all': 'Всі категорії',
    'general': 'Загальне',
    'ml': 'Машинне навчання',
    'nlp': 'NLP',
    'cv': 'Комп\'ютерний зір',
    'tools': 'Інструменти',
    'help': 'Допомога'
};

// Initialize forum
document.addEventListener('DOMContentLoaded', function() {
    allPosts = [...forumData];
    filteredPosts = [...allPosts];
    displayPosts();
    updatePagination();
});

function displayPosts() {
    const forumPostsContainer = document.getElementById('forumPosts');
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    if (postsToShow.length === 0) {
        forumPostsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-comments"></i>
                <h3>Повідомлень не знайдено</h3>
                <p>Спробуйте змінити критерії пошуку або створіть нову тему</p>
                <button class="create-topic-btn" onclick="openCreateTopicModal()">
                    <i class="fas fa-plus"></i>
                    Створити тему
                </button>
            </div>
        `;
        return;
    }

    forumPostsContainer.innerHTML = postsToShow.map(post => `
        <div class="forum-post" id="post-card-${post.id}">
            <div class="post-header">
                <div>
                    <h3 class="post-title">${post.title}</h3>
                    <div class="post-meta">
                        <span class="post-category">${categoryNames[post.category]}</span>
                        <span><i class="fas fa-user"></i> ${post.author}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    </div>
                </div>
            </div>
            <div class="post-content">
                ${post.content}
            </div>
            <div class="post-stats">
                <div class="post-stat">
                    <i class="fas fa-reply"></i>
                    <span id="reply-count-${post.id}">${post.comments.length}</span>
                </div>
                <div class="post-stat">
                    <i class="fas fa-eye"></i>
                    <span>${post.views}</span>
                </div>
                <div class="post-stat">
                    <i class="fas fa-thumbs-up"></i>
                    <span>${post.likes}</span>
                </div>
            </div>
            <div class="post-actions">
                <button class="view-comments-btn" onclick="toggleComments(${post.id})">
                    <i class="fas fa-comment-dots"></i>
                    <span id="toggle-text-${post.id}">Показати коментарі</span>
                </button>
            </div>
            <div class="comments-section" id="comments-for-${post.id}"></div>
        </div>
    `).join('');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA');
}

function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (category === 'all') {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post => post.category === category);
    }
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.content.toLowerCase().includes(searchTerm)
        );
    }
    
    displayPosts();
    updatePagination();
}

function searchPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentPage = 1;
    
    if (currentCategory === 'all') {
        filteredPosts = [...allPosts];
    } else {
        filteredPosts = allPosts.filter(post => post.category === currentCategory);
    }
    
    if (searchTerm) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) || 
            post.content.toLowerCase().includes(searchTerm)
        );
    }
    
    displayPosts();
    updatePagination();
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (direction === -1 && currentPage > 1) currentPage--;
    else if (direction === 1 && currentPage < totalPages) currentPage++;
    displayPosts();
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
    document.getElementById('pageInfo').textContent = `Сторінка ${currentPage} з ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// Comments functionality
function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-for-${postId}`);
    const toggleButtonText = document.getElementById(`toggle-text-${postId}`);
    
    const isVisible = commentsSection.classList.toggle('visible');

    if (isVisible) {
        toggleButtonText.textContent = 'Сховати коментарі';
        if (!commentsSection.dataset.rendered) {
            renderComments(postId);
            commentsSection.dataset.rendered = 'true';
        }
    } else {
        toggleButtonText.textContent = 'Показати коментарі';
    }
}

function renderComments(postId) {
    const post = allPosts.find(p => p.id === postId);
    const container = document.getElementById(`comments-for-${postId}`);
    if (!post) return;

    const commentsHTML = post.comments.map(comment => `
        <div class="comment-card">
            <div class="comment-meta">
                <strong>${comment.author}</strong> - <span>${formatDate(comment.date)}</span>
            </div>
            <p>${comment.text}</p>
        </div>
    `).join('');

    const commentFormHTML = `
        <form class="comment-form" onsubmit="addComment(event, ${postId})">
            <h4>Залишити коментар</h4>
            <textarea placeholder="Ваш коментар..." required></textarea>
            <button type="submit">Відправити</button>
        </form>
    `;

    container.innerHTML = `
        <div class="comments-list">
            ${commentsHTML || '<p>Коментарів ще немає. Будьте першим!</p>'}
        </div>
        ${commentFormHTML}
    `;
}

function addComment(event, postId) {
    event.preventDefault();
    const form = event.target;
    const textarea = form.querySelector('textarea');
    const commentText = textarea.value.trim();

    if (!commentText) return;

    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    const newComment = {
        author: currentUser ? currentUser.name : 'Гість',
        date: new Date().toISOString().split('T')[0],
        text: commentText
    };

    post.comments.push(newComment);
    
    renderComments(postId);
    document.getElementById(`reply-count-${postId}`).textContent = post.comments.length;

    showNotification('Коментар додано', 'Дякуємо за ваш внесок!');
}


// Create topic modal functions
function openCreateTopicModal() {
    document.getElementById('createTopicModal').style.display = 'block';
}

function closeCreateTopicModal() {
    document.getElementById('createTopicModal').style.display = 'none';
    document.getElementById('createTopicForm').reset();
}

document.addEventListener('DOMContentLoaded', function() {
    const createTopicForm = document.getElementById('createTopicForm');
    
    createTopicForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newPost = {
            id: allPosts.length + 1,
            title: document.getElementById('topicTitle').value,
            content: document.getElementById('topicContent').value,
            author: currentUser ? currentUser.name : 'Гість',
            category: document.getElementById('topicCategory').value,
            date: new Date().toISOString().split('T')[0],
            views: 1,
            likes: 0,
            comments: []
        };
        
        allPosts.unshift(newPost);
        filterByCategory(currentCategory); // Refresh the view
        
        closeCreateTopicModal();
        showNotification('Тему створено', 'Ваша тема успішно опублікована!');
    });
});

window.addEventListener('click', function(e) {
    const createTopicModal = document.getElementById('createTopicModal');
    if (e.target === createTopicModal) closeCreateTopicModal();
});