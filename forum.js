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
];

const categoryNames = {
    'all': 'Всі категорії', 'general': 'Загальне', 'ml': 'Машинне навчання',
    'nlp': 'NLP', 'cv': 'Комп\'ютерний зір', 'tools': 'Інструменти', 'help': 'Допомога'
};

document.addEventListener('DOMContentLoaded', function() {
    allPosts = [...forumData];
    filteredPosts = [...allPosts];
    displayPosts();
    updatePagination();
});

function displayPosts() {
    const forumPostsContainer = document.getElementById('forumPosts');
    if (!forumPostsContainer) return; // Exit if not on forum page

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
            </div>`;
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
            <div class="post-content">${post.content}</div>
            <div class="post-stats">
                <div class="post-stat"><i class="fas fa-reply"></i> <span id="reply-count-${post.id}">${post.comments.length}</span></div>
                <div class="post-stat"><i class="fas fa-eye"></i> <span>${post.views}</span></div>
                <div class="post-stat"><i class="fas fa-thumbs-up"></i> <span>${post.likes}</span></div>
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
    return new Date(dateString).toLocaleDateString('uk-UA');
}

function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let basePosts = category === 'all' ? [...allPosts] : allPosts.filter(post => post.category === category);
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredPosts = searchTerm 
        ? basePosts.filter(post => post.title.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm))
        : basePosts;
    
    displayPosts();
    updatePagination();
}

function searchPosts() {
    filterByCategory(currentCategory);
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (direction === -1 && currentPage > 1) currentPage--;
    else if (direction === 1 && currentPage < totalPages) currentPage++;
    displayPosts();
    updatePagination();
}

function updatePagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage) || 1;
    document.getElementById('pageInfo').textContent = `Сторінка ${currentPage} з ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
    pagination.style.display = totalPages > 1 ? 'flex' : 'none';
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-for-${postId}`);
    const toggleButtonText = document.getElementById(`toggle-text-${postId}`);
    
    const isVisible = commentsSection.classList.toggle('visible');
    toggleButtonText.textContent = isVisible ? 'Сховати коментарі' : 'Показати коментарі';
    
    if (isVisible && !commentsSection.dataset.rendered) {
        renderComments(postId);
        commentsSection.dataset.rendered = 'true';
    }
}

function renderComments(postId) {
    const post = allPosts.find(p => p.id === postId);
    const container = document.getElementById(`comments-for-${postId}`);
    if (!post || !container) return;

    const commentsHTML = post.comments.map(comment => `
        <div class="comment-card">
            <div class="comment-meta"><strong>${comment.author}</strong> - <span>${formatDate(comment.date)}</span></div>
            <p>${comment.text}</p>
        </div>
    `).join('');

    // --- UPDATED LOGIC ---
    let commentFormHTML;
    if (currentUser) {
        // Якщо користувач залогінений, показуємо форму
        commentFormHTML = `
            <form class="comment-form" onsubmit="addComment(event, ${postId})">
                <h4>Залишити коментар як ${currentUser.name}</h4>
                <textarea placeholder="Ваш коментар..." required></textarea>
                <button type="submit">Відправити</button>
            </form>`;
    } else {
        // Якщо гість, показуємо повідомлення
        commentFormHTML = `
            <div class="guest-comment-prompt">
                <p>Будь ласка, <a href="#" onclick="openUserDialog()">увійдіть</a>, щоб залишити коментар.</p>
            </div>`;
    }
    // --- END UPDATED LOGIC ---

    container.innerHTML = `
        <div class="comments-list">${commentsHTML || '<p>Коментарів ще немає. Будьте першим!</p>'}</div>
        ${commentFormHTML}`;
}


function addComment(event, postId) {
    event.preventDefault();

    // --- SECURITY CHECK ---
    if (!currentUser) {
        showNotification('Помилка', 'Ви повинні увійти, щоб коментувати.', 'error');
        return;
    }
    // --- END SECURITY CHECK ---

    const form = event.target;
    const textarea = form.querySelector('textarea');
    const commentText = textarea.value.trim();
    if (!commentText) return;

    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    const newComment = {
        author: currentUser.name, // Завжди беремо ім'я залогіненого користувача
        date: new Date().toISOString().split('T')[0],
        text: commentText
    };

    post.comments.push(newComment);
    
    renderComments(postId); // Перемальовуємо секцію коментарів
    document.getElementById(`reply-count-${postId}`).textContent = post.comments.length;

    showNotification('Коментар додано', 'Дякуємо за ваш внесок!');
}

function openCreateTopicModal() {
    if (!currentUser) {
        showNotification('Помилка', 'Будь ласка, увійдіть, щоб створювати теми.', 'error');
        openUserDialog();
        return;
    }
    document.getElementById('createTopicModal').style.display = 'block';
}

function closeCreateTopicModal() {
    document.getElementById('createTopicModal').style.display = 'none';
    document.getElementById('createTopicForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const createTopicForm = document.getElementById('createTopicForm');
    if(createTopicForm) {
        createTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!currentUser) return;
            
            const newPost = {
                id: allPosts.length + 1,
                title: document.getElementById('topicTitle').value,
                content: document.getElementById('topicContent').value,
                author: currentUser.name,
                category: document.getElementById('topicCategory').value,
                date: new Date().toISOString().split('T')[0],
                views: 1, likes: 0, comments: []
            };
            
            allPosts.unshift(newPost);
            filterByCategory('all'); // Показуємо всі пости, включаючи новий
            document.querySelector('.category-btn.active').classList.remove('active');
            document.querySelector('.category-btn').classList.add('active');


            closeCreateTopicModal();
            showNotification('Тему створено', 'Ваша тема успішно опублікована!');
        });
    }
    
    const createTopicModal = document.getElementById('createTopicModal');
    if (createTopicModal) {
        window.addEventListener('click', (e) => {
            if (e.target === createTopicModal) closeCreateTopicModal();
        });
    }
});