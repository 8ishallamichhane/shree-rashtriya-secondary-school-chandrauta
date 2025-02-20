document.addEventListener('DOMContentLoaded', function() {
    const SHEET_ID = '1hZUuQ36K0XOnoWZlI8U6U216Rwtshmjx-6inuKbgp7c';
    const API_KEY = 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo';
    const SHEET_RANGE = 'Sheet1!A2:D';
    const ITEMS_PER_PAGE = 18;
    let galleryData = [];
    let currentPage = 1;
    let currentFilter = 'all';
    let currentLightboxIndex = 0;

    async function fetchGalleryData() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}?key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.values) {
                galleryData = data.values.filter(row => row[0]).map(item => ({
                    src: item[0],
                    title: item[1],
                    description: item[2],
                    category: item[3]
                }));
                loadGalleryItems();
            }
        } catch (error) {
            console.error('Error fetching gallery data:', error);
        }
    }

    function getFilteredItems() {
        return currentFilter === 'all' 
            ? galleryData 
            : galleryData.filter(item => item.category === currentFilter);
    }

    function loadGalleryItems() {
        const galleryContainer = document.querySelector('.gallery-grid');
        if (!galleryContainer) return;

        const filteredItems = getFilteredItems();
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentItems = filteredItems.slice(startIndex, endIndex);

        galleryContainer.innerHTML = currentItems.map((item, index) => `
            <div class="gallery-item" data-category="${item.category}">
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <button class="view-image" onclick="openLightbox(${startIndex + index})">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
        `).join('');

        updatePagination(filteredItems.length);
    }

    function updatePagination(totalItems) {
        const paginationContainer = document.querySelector('.gallery-pagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = `
            <button class="prev-page" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="page-numbers">
                ${generatePageNumbers(currentPage, totalPages)}
            </div>
            <button class="next-page" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        setupPaginationControls(totalPages);
    }

    function generatePageNumbers(current, total) {
        let pages = [];
        
        if (total <= 5) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            
            if (current > 3) {
                pages.push('...');
            }
            
            for (let i = Math.max(2, current - 1); i <= Math.min(current + 1, total - 1); i++) {
                pages.push(i);
            }
            
            if (current < total - 2) {
                pages.push('...');
            }
            
            pages.push(total);
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="page-dots">...</span>';
            }
            return `
                <button class="page-number ${page === current ? 'active' : ''}" 
                        data-page="${page}">
                    ${page}
                </button>
            `;
        }).join('');
    }

    function setupPaginationControls(totalPages) {
        const paginationContainer = document.querySelector('.gallery-pagination');
        
        paginationContainer.addEventListener('click', (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            if (target.classList.contains('prev-page') && currentPage > 1) {
                currentPage--;
            } else if (target.classList.contains('next-page') && currentPage < totalPages) {
                currentPage++;
            } else if (target.classList.contains('page-number')) {
                currentPage = parseInt(target.dataset.page);
            }

            loadGalleryItems();
        });
    }

    function initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                currentFilter = button.dataset.filter;
                currentPage = 1; // Reset to first page when changing filters
                
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                loadGalleryItems();
            });
        });
    }

    // Lightbox functionality
    window.openLightbox = function(index) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.querySelector('.lightbox-img');
        if (!lightbox || !lightboxImg) return;

        const filteredItems = getFilteredItems();
        currentLightboxIndex = index;
        lightboxImg.src = filteredItems[index].src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function setupLightbox() {
        const lightbox = document.getElementById('lightbox');
        const closeBtn = document.querySelector('.lightbox-close');
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        const lightboxImg = document.querySelector('.lightbox-img');

        if (!lightbox || !closeBtn || !prevBtn || !nextBtn || !lightboxImg) return;

        closeBtn.onclick = function() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        lightbox.onclick = function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }

        prevBtn.onclick = function(e) {
            e.stopPropagation();
            const filteredItems = getFilteredItems();
            currentLightboxIndex = (currentLightboxIndex - 1 + filteredItems.length) % filteredItems.length;
            lightboxImg.src = filteredItems[currentLightboxIndex].src;
        }

        nextBtn.onclick = function(e) {
            e.stopPropagation();
            const filteredItems = getFilteredItems();
            currentLightboxIndex = (currentLightboxIndex + 1) % filteredItems.length;
            lightboxImg.src = filteredItems[currentLightboxIndex].src;
        }

        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') closeBtn.click();
                if (e.key === 'ArrowLeft') prevBtn.click();
                if (e.key === 'ArrowRight') nextBtn.click();
            }
        });
    }

    // Initialize
    fetchGalleryData();
    initializeFilters();
    setupLightbox();
});