document.addEventListener('DOMContentLoaded', function() {
    // Constants
    const SHEET_ID = '1wugq1_d6QZ7VGiwFbQE7M37RcHhk0qUFMn4bsiGHBoo';
    const API_KEY = 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo';
    const SHEET_RANGE = 'Sheet1!A2:H'; // Matches your column structure
    const ITEMS_PER_PAGE = 12;

    // DOM Elements
    const newsGrid = document.querySelector('.news-grid');
    const filterButtons = document.querySelector('.filter-buttons');
    const paginationContainer = document.querySelector('.pagination');
    const modal = document.getElementById('newsModal');
    const searchInput = document.getElementById('searchInput');
    const noResults = document.getElementById('noResults');

    let newsData = [];
    let currentPage = 1;
    let currentFilter = 'all';

    function showLoading() {
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>Loading latest updates...</p>
                </div>`;
        }
    }

    function showError(error) {
        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Unable to load content</h3>
                    <p>${error.message}</p>
                    <button onclick="location.reload()" class="retry-btn">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                </div>`;
        }
    }

    async function fetchNewsData() {
        try {
            showLoading();
            const response = await fetch(
                `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            if (!data.values || data.values.length === 0) {
                throw new Error('No data found');
            }

            // Map data according to your sheet structure
            newsData = data.values.map(item => ({
                title: item[0] || '',
                type: item[1]?.toLowerCase() || 'news',
                date: item[2] || '',
                image: item[3] || '../assets/images/default.jpg',
                description: item[4] || '',
                link: item[7] || ''
            }));

            // Sort by date (newest first)
            newsData.sort((a, b) => new Date(b.date) - new Date(a.date));
            setupFilters();
            displayNews();

        } catch (error) {
            console.error('Error:', error);
            showError(error);
        }
    }

    function setupFilters() {
        const types = ['all', ...new Set(newsData.map(item => item.type))];
        
        if (filterButtons) {
            filterButtons.innerHTML = types.map(type => `
                <button class="filter-btn ${type === currentFilter ? 'active' : ''}" 
                        data-filter="${type}">
                    ${type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
            `).join('');

            filterButtons.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    currentFilter = btn.dataset.filter;
                    currentPage = 1;
                    filterButtons.querySelectorAll('.filter-btn').forEach(b => 
                        b.classList.remove('active'));
                    btn.classList.add('active');
                    displayNews();
                });
            });
        }
    }

    function displayNews() {
        const filteredItems = newsData.filter(item => 
            currentFilter === 'all' || item.type.toLowerCase() === currentFilter);
        const paginatedItems = filteredItems.slice(
            (currentPage - 1) * ITEMS_PER_PAGE, 
            currentPage * ITEMS_PER_PAGE
        );

        if (newsGrid) {
            newsGrid.innerHTML = '';
            
            if (paginatedItems.length === 0) {
                newsGrid.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No items found</p>
                    </div>`;
                return;
            }

            paginatedItems.forEach((item, index) => {
                const card = createCard(item);
                card.style.animationDelay = `${index * 0.1}s`;
                newsGrid.appendChild(card);
            });

            updatePagination(filteredItems.length);
        }
    }

    function createCard(item) {
        const article = document.createElement('article');
        article.className = `${item.type.toLowerCase()}-card fade-up`;

        const formattedDate = formatDate(item.date);
        
        if (item.type.toLowerCase() === 'news') {
            article.innerHTML = `
                <div class="news-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="news-date">${formattedDate}</div>
                </div>
                <div class="news-content">
                    <span class="news-category">${item.type}</span>
                    <h3 class="news-title">${item.title}</h3>
                    <p class="news-excerpt">${truncateText(item.description, 100)}</p>
                    <button class="read-more" onclick="event.stopPropagation();">
                        Read More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>`;
        } else {
            article.innerHTML = `
                <div class="event-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <div class="event-date-box">
                        <div class="day">${getDay(item.date)}</div>
                        <div class="month">${getMonth(item.date)}</div>
                    </div>
                </div>
                <div class="event-content">
                    <span class="event-category">${item.type}</span>
                    <h3 class="event-title">${item.title}</h3>
                    <p class="event-excerpt">${truncateText(item.description, 100)}</p>
                    <div class="event-details">
                        ${item.time ? `<span><i class="fas fa-clock"></i> ${item.time}</span>` : ''}
                        ${item.venue ? `<span><i class="fas fa-map-marker-alt"></i> ${item.venue}</span>` : ''}
                    </div>
                    <button class="read-more" onclick="event.stopPropagation();">
                        Learn More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>`;
        }

        // Add click events
        article.addEventListener('click', () => openModal(item));
        
        const readMoreBtn = article.querySelector('.read-more');
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openModal(item);
        });

        return article;
    }

    function openModal(item) {
        if (!modal) return;

        document.body.style.overflow = 'hidden';

        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal" aria-label="Close modal">
                    <i class="fas fa-times"></i>
                </button>
                
                <div class="modal-inner">
                    <div class="modal-header">
                        <span class="modal-category">${item.type}</span>
                        <h2>${item.title}</h2>
                    </div>

                    <div class="modal-image">
                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                    </div>

                    <div class="modal-info">
                        <div class="modal-meta">
                            <span><i class="far fa-calendar"></i> ${formatDate(item.date)}</span>
                            ${item.time ? `<span><i class="fas fa-clock"></i> ${item.time}</span>` : ''}
                            ${item.venue ? `<span><i class="fas fa-map-marker-alt"></i> ${item.venue}</span>` : ''}
                        </div>
                        
                        <div class="modal-description">
                            <p>${item.description}</p>
                        </div>
                    </div>
                </div>
            </div>`;

        // Show modal with animation
        modal.style.display = 'block';
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });

        // Event Listeners
        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (!modal) return;
        
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        if (paginationContainer) {
            if (totalPages <= 1) {
                paginationContainer.style.display = 'none';
                return;
            }

            paginationContainer.style.display = 'flex';
            paginationContainer.innerHTML = `
                <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                ${generatePageNumbers(currentPage, totalPages)}
                <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>`;

            paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.classList.contains('prev-btn') && currentPage > 1) {
                        currentPage--;
                    } else if (btn.classList.contains('next-btn') && currentPage < totalPages) {
                        currentPage++;
                    } else if (btn.dataset.page) {
                        currentPage = parseInt(btn.dataset.page);
                    }
                    displayNews();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            });
        }
    }

    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function getDay(dateString) {
        return new Date(dateString).getDate();
    }

    function getMonth(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
    }

    function truncateText(text, length) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    function generatePageNumbers(current, total) {
        const pages = [];
        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
                pages.push(i);
            } else if (i === current - 2 || i === current + 2) {
                pages.push('...');
            }
        }
        return pages.map(page => {
            if (page === '...') {
                return `<span class="page-dots">...</span>`;
            }
            return `
                <button class="page-btn ${page === current ? 'active' : ''}" 
                        data-page="${page}">
                    ${page}
                </button>`;
        }).join('');
    }

    // Initialize
    if (newsGrid) {
        fetchNewsData();

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
                closeModal();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const filteredItems = newsData.filter(item => {
                return item.title.toLowerCase().includes(searchTerm) ||
                       item.description.toLowerCase().includes(searchTerm) ||
                       item.type.toLowerCase().includes(searchTerm);
            });

            if (filteredItems.length === 0) {
                noResults.style.display = 'block';
                newsGrid.innerHTML = '';
            } else {
                noResults.style.display = 'none';
                displayFilteredNews(filteredItems);
            }
        });

        // Add clear search on 'x' click
        searchInput.addEventListener('search', function() {
            if (this.value === '') {
                displayNews();
                noResults.style.display = 'none';
            }
        });
    }
});

// Debounce function for search optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Update displayFilteredNews function
function displayFilteredNews(items) {
    if (!newsGrid) return;
    
    newsGrid.innerHTML = '';
    items.forEach(item => {
        const card = createCard(item);
        newsGrid.appendChild(card);
    });
}
