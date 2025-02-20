document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const SHEET_ID = '1-HaBkv1A-kyY5ND2K3_FhpWhkyZTUAyBvpUh2FrM_5o';
    const API_KEY = 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo';
    const sheetRange = 'Sheet1!A2:D';
    const ITEMS_PER_PAGE = 3;
    let currentPage = 1;
    let allNotices = [];

    async function fetchNoticeList() {
        const noticeList = document.getElementById('noticeList');
        if (!noticeList) return;

        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetRange}?key=${API_KEY}`);
            if (!response.ok) throw new Error('Failed to fetch notices');
            
            const data = await response.json();
            if (data.values && data.values.length > 0) {
                allNotices = data.values.map(notice => ({
                    title: notice[0],
                    date: new Date(notice[1]),
                    content: notice[2],
                    details: notice[3]
                })).sort((a, b) => b.date - a.date);

                displayNotices();
                setupPagination();
            }
        } catch (error) {
            console.error('Error fetching notices:', error);
            noticeList.innerHTML = '<p class="error">Failed to load notices. Please try again later.</p>';
        }
    }

    function displayNotices() {
        const noticeList = document.getElementById('noticeList');
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageNotices = allNotices.slice(startIndex, endIndex);

        const noticesHTML = pageNotices.map(notice => `
            <div class="notice-item">
                <div class="notice-content">
                    <div class="notice-header">
                        <h3>${notice.title}</h3>
                        <span class="notice-date">${notice.date.toLocaleDateString()}</span>
                    </div>
                    <p>${notice.content}</p>
                    ${notice.details ? `
                        <div class="notice-details">
                            <ul>
                                ${notice.details.split('\n').map(detail => `<li>${detail}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');

        noticeList.innerHTML = noticesHTML;
    }

    function setupPagination() {
        const totalPages = Math.ceil(allNotices.length / ITEMS_PER_PAGE);
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination';

        let paginationHTML = '';

        if (totalPages > 1) {
            paginationHTML += `
                <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                paginationHTML += `
                    <button class="page-btn number-btn ${i === currentPage ? 'active' : ''}" 
                            data-page="${i}">
                        ${i}
                    </button>
                `;
            }

            paginationHTML += `
                <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }

        paginationContainer.innerHTML = paginationHTML;

        paginationContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.page-btn');
            if (!button || button.disabled) return;

            if (button.classList.contains('prev-btn') && currentPage > 1) {
                currentPage--;
            } else if (button.classList.contains('next-btn') && currentPage < totalPages) {
                currentPage++;
            } else if (button.classList.contains('number-btn')) {
                currentPage = parseInt(button.dataset.page);
            }

            displayNotices();
            setupPagination();
        });

        const existingPagination = document.querySelector('.pagination');
        if (existingPagination) {
            existingPagination.replaceWith(paginationContainer);
        } else {
            document.querySelector('.notice-list-section .container').appendChild(paginationContainer);
        }
    }

    // Initialize notice list if the element exists
    if (document.getElementById('noticeList')) {
        fetchNoticeList();
    }
});
