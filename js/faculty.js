const SHEET_ID = '1S6VXbml9i5gjRqfhdYhODI5col99V3LoQ0EmGnVWsks';
const API_KEY = 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo';
const SHEET_NAME = 'Sheet2';
const ITEMS_PER_PAGE = 27; // Increased items per page
let currentPage = 1;
let facultyData = [];

async function fetchFacultyData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}!A2:F?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.values && data.values.length > 0) {
            facultyData = data.values;
            displayFaculty();
            setupSearch();
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        showErrorMessage();
    }
}

function displayFaculty(filteredData = null) {
    const container = document.getElementById('faculty-container');
    container.innerHTML = '';

    const dataToUse = filteredData || facultyData;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = dataToUse.slice(startIndex, endIndex);

    paginatedData.forEach(row => {
        const [name, position,department,qualifications, photoUrl, contact, bio] = row;

        const card = document.createElement('div');
        card.className = 'faculty-card';

        card.innerHTML = `
            <div class="faculty-image-container">
                <img src="${photoUrl || '../assets/images/default-avatar.png'}" alt="${name}" 
                     onerror="this.src='../assets/images/default-avatar.png'">
            </div>
            <div class="faculty-info">
                <h3>${name}</h3>
                <div class="faculty-position">${position}</div>
                <div style="font-size: 1rem; color: var(--theme-main);" class="faculty-department">${department}</div>
                <div class="faculty-contact">${contact}</div>
                <div class="faculty-qualifications">${qualifications}</div>
                <button class="view-bio-btn">View Profile</button>
            </div>
        `;

        card.querySelector('.view-bio-btn').addEventListener('click', () => {
            showModal({ name, position, qualifications, photoUrl, contact, bio });
        });

        container.appendChild(card);
    });

    renderPagination(dataToUse.length);
}

function renderPagination(totalItems) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Add previous button
    if (totalPages > 1) {
        addPaginationButton('«', () => {
            if (currentPage > 1) {
                currentPage--;
                displayFaculty();
            }
        }, currentPage > 1);
    }

    // Add page numbers
    for (let i = 1; i <= totalPages; i++) {
        addPaginationButton(i, () => {
            currentPage = i;
            displayFaculty();
        }, true, i === currentPage);
    }

    // Add next button
    if (totalPages > 1) {
        addPaginationButton('»', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayFaculty();
            }
        }, currentPage < totalPages);
    }
}

function addPaginationButton(text, onClick, enabled = true, isActive = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = `pagination-btn ${isActive ? 'active' : ''}`;
    if (!enabled) button.disabled = true;
    button.addEventListener('click', onClick);
    document.getElementById('pagination-container').appendChild(button);
}

function showModal(faculty) {
    const modal = document.getElementById('faculty-modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="close-btn">&times;</span>
        <div class="modal-header">
            <div class="faculty-image-container">
                <img src="${faculty.photoUrl || '../assets/images/default-avatar.png'}" 
                     onerror="this.src='../assets/images/default-avatar.png'">
            </div>
            <h2>${faculty.name}</h2>
            <div class="faculty-position">${faculty.position}</div>
            <div class="faculty-department" style="font-size: 1.2rem; font-weight: bold; color: var(--theme-main);">${faculty.department}</div>
            <p><strong>Email:</strong> <a style="color: var(--theme-main); text-decoration: none;" href="mailto:${faculty.contact}">${faculty.contact}</a></p>
            <p><strong>Qualifications:</strong> ${faculty.qualifications}</p>
            <p><strong>Bio:</strong> ${faculty.bio || 'No bio available.'}</p>
            </div>
       
    `;

    modal.style.display = 'block';

    const closeModal = () => modal.style.display = 'none';
    modalContent.querySelector('.close-btn').addEventListener('click', closeModal);
    window.addEventListener('click', e => {
        if (e.target === modal) closeModal();
    });
}

function setupSearch() {
    const searchInput = document.getElementById('facultySearch');
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                displayFaculty(); // Show all faculty
                return;
            }

            const filteredData = facultyData.filter(faculty => {
                const name = faculty[0].toLowerCase();
                const position = faculty[1].toLowerCase();
                const qualifications = faculty[2].toLowerCase();
                
                return name.includes(searchTerm) || 
                       position.includes(searchTerm) || 
                       qualifications.includes(searchTerm);
            });

            if (filteredData.length === 0) {
                showNoResults();
            } else {
                currentPage = 1; // Reset to first page for new search
                displayFaculty(filteredData);
            }
        }, 300); // Debounce delay
    });
}

function showNoResults() {
    const container = document.getElementById('faculty-container');
    container.innerHTML = `
        <div class="no-results">
            <i class="fas fa-search" style="font-size: 2rem; color: #e74c3c; margin-bottom: 1rem;"></i>
            <p>No faculty members found matching your search.</p>
            <p>Try different keywords or check the spelling.</p>
        </div>
    `;
    
    // Hide pagination when no results
    document.getElementById('pagination-container').innerHTML = '';
}

function showErrorMessage() {
    const container = document.getElementById('faculty-container');
    container.innerHTML = `
        <div class="error-message">
            <p>Unable to load faculty data. Please try again later.</p>
        </div>
    `;
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchFacultyData);
