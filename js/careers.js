const API_KEY = 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo';
const SPREADSHEET_ID = '17LLQGRUWcfV-AlvNkfckPFZjoGIbFYuT9k1bL7R0P-4';
const RANGE = 'Sheet1!A2:H';
const ITEMS_PER_PAGE = 3; // Number of jobs to show per load

let currentPage = 1;
let allJobs = [];
let filteredJobs = [];

// Function to fetch the data from Google Sheets API
async function fetchJobs() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.values) {
            allJobs = data.values;
            filterAndDisplayJobs();
        }
    } catch (error) {
        console.error('Error fetching job data:', error);
    }
}

function filterAndDisplayJobs() {
    const departmentFilter = document.getElementById('departmentFilter').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value.toLowerCase();

    // Filter jobs based on selected filters
    filteredJobs = allJobs.filter(job => {
        const isDepartmentMatch = departmentFilter === 'all' || job[1].toLowerCase() === departmentFilter;
        const isTypeMatch = typeFilter === 'all' || job[2].toLowerCase().trim() === typeFilter.trim();
        return isDepartmentMatch && isTypeMatch;
    });

    displayJobs();
    updateLoadMoreButton();
}

function displayJobs() {
    const jobGrid = document.getElementById('jobGrid');
    const startIndex = 0;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    const jobsToShow = filteredJobs.slice(startIndex, endIndex);

    // Clear existing job cards if it's the first page
    if (currentPage === 1) {
        jobGrid.innerHTML = '';
    }

    // Create job cards for filtered data
    jobsToShow.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.classList.add('job-card');
        jobCard.setAttribute('data-department', job[1].toLowerCase());
        jobCard.setAttribute('data-type', job[2].toLowerCase());

        jobCard.innerHTML = `
            <div class="job-header">
                <h3>${job[0]}</h3>
                <span class="job-type">${job[2]}</span>
            </div>
            <div class="job-details">
                <p><i class="fas fa-building"></i> ${job[1]} : ${job[7]}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${job[3]}</p>
                <p><i class="fas fa-clock"></i> Posted: ${job[4]}</p>
                <p><i class="fas fa-book"></i> Education: ${job[5]}</p>
            </div>
            <p class="job-description">${job[6]}</p>
        `;

        jobGrid.appendChild(jobCard);
    });
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreJobs');
    const hasMoreJobs = currentPage * ITEMS_PER_PAGE < filteredJobs.length;
    
    loadMoreBtn.style.display = hasMoreJobs ? 'inline-block' : 'none';
}

// Event listener for filters
document.getElementById('departmentFilter').addEventListener('change', () => {
    currentPage = 1;
    filterAndDisplayJobs();
});

document.getElementById('typeFilter').addEventListener('change', () => {
    currentPage = 1;
    filterAndDisplayJobs();
});

// Load More functionality
document.getElementById('loadMoreJobs').addEventListener('click', () => {
    currentPage++;
    displayJobs();
    updateLoadMoreButton();
});

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchJobs();
});