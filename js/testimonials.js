document.addEventListener('DOMContentLoaded', function() {
    const SHEET_ID = '15YJJLO_iFpNpTdHKbZP8kVSqngdXaJlYui-oTPavW7o';
    const API_KEY = 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo';
    const SHEET_NAME = 'Sheet1';
    const TESTIMONIALS_PER_PAGE = 9;
    let currentPage = 1;
    let allTestimonials = [];

    async function fetchTestimonials() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.values && data.values.length > 0) {
                // Filter out empty rows and header row
                allTestimonials = data.values.filter(row => 
                    row[0] && row[0] !== 'Name' && row[0] !== ''
                );
                displayTestimonials();
            } else {
                throw new Error('No data found');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showErrorMessage();
        }
    }

    function displayTestimonials() {
        const container = document.getElementById('testimonialsSlider');
        if (!container) return;

        const startIndex = (currentPage - 1) * TESTIMONIALS_PER_PAGE;
        const endIndex = startIndex + TESTIMONIALS_PER_PAGE;
        const currentTestimonials = allTestimonials.slice(startIndex, endIndex);

        container.innerHTML = currentTestimonials.map(testimonial => `
            <div class="testimonial-card animate__animated animate__fadeIn">
                <div class="testimonial-image">
                    <img src="${testimonial[3] || '../assets/images/default-avatar.png'}" 
                         alt="${testimonial[0]}"
                         onerror="this.src='../assets/images/default-avatar.png'">
                </div>
                <div class="testimonial-content">
                    <div class="quote-icon">
                        <i class="fas fa-quote-left"></i>
                    </div>
                    <p class="testimonial-text">${testimonial[2]}</p>
                    <div class="testimonial-author">
                        <h4>${testimonial[0]}</h4>
                        <p class="author-details">${testimonial[1]}</p>
                    </div>
                </div>
            </div>
        `).join('');

        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(allTestimonials.length / TESTIMONIALS_PER_PAGE);
        const paginationContainer = document.querySelector('.slider-controls');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';
        paginationContainer.innerHTML = `
            <button class="prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
            <div class="pagination-numbers">
                ${generatePaginationNumbers(currentPage, totalPages)}
            </div>
            <button class="next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        setupPaginationControls(totalPages);
    }

    function generatePaginationNumbers(current, total) {
        let pages = [];
        
        if (total <= 5) {
            // Show all pages if total is 5 or less
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (current > 3) {
                pages.push('...');
            }
            
            // Show current page and surrounding pages
            for (let i = Math.max(2, current - 1); i <= Math.min(current + 1, total - 1); i++) {
                pages.push(i);
            }
            
            if (current < total - 2) {
                pages.push('...');
            }
            
            // Always show last page
            pages.push(total);
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-dots">...</span>';
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
        const paginationContainer = document.querySelector('.slider-controls');
        
        // Remove existing event listeners
        const newPaginationContainer = paginationContainer.cloneNode(true);
        paginationContainer.parentNode.replaceChild(newPaginationContainer, paginationContainer);

        // Add new event listeners
        const prevBtn = newPaginationContainer.querySelector('.prev-btn');
        const nextBtn = newPaginationContainer.querySelector('.next-btn');
        const pageNumbers = newPaginationContainer.querySelectorAll('.page-number');

        prevBtn?.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayTestimonials();
            }
        });

        nextBtn?.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayTestimonials();
            }
        });

        pageNumbers.forEach(btn => {
            btn.addEventListener('click', () => {
                const newPage = parseInt(btn.dataset.page);
                if (currentPage !== newPage) {
                    currentPage = newPage;
                    displayTestimonials();
                }
            });
        });
    }

    function showErrorMessage() {
        const container = document.getElementById('testimonialsSlider');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Unable to load testimonials. Please try again later.</p>
                    <button onclick="location.reload()" class="retry-btn">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }

    // Initialize
    fetchTestimonials();
});
