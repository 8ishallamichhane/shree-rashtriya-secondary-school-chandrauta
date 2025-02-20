document.addEventListener('DOMContentLoaded', function() {
    // Sample gallery data
    const galleryItems = [
        {
            id: 1,
            image: 'https://via.placeholder.com/400x300',
            category: 'academic',
            title: 'Science Lab Session',
            description: 'Students conducting experiments in our modern science lab.'
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/400x300',
            category: 'sports',
            title: 'Annual Sports Meet',
            description: 'Students participating in track and field events.'
        },
        {
            id: 3,
            image: 'https://via.placeholder.com/400x300',
            category: 'cultural',
            title: 'Cultural Performance',
            description: 'Traditional dance performance during annual day.'
        },
        {
            id: 4,
            image: 'https://via.placeholder.com/400x300',
            category: 'events',
            title: 'Prize Distribution',
            description: 'Annual prize distribution ceremony.'
        },
        {
            id: 5,
            image: 'https://via.placeholder.com/400x300',
            category: 'academic',
            title: 'Library Session',
            description: 'Students studying in our well-equipped library.'
        },
        {
            id: 6,
            image: 'https://via.placeholder.com/400x300',
            category: 'sports',
            title: 'Basketball Match',
            description: 'Inter-house basketball tournament.'
        }
    ];


    // Gallery functionality
    function initializeGallery() {
        const galleryGrid = document.querySelector('.gallery-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');

        // Load initial gallery items
        loadGalleryItems('all');

        // Add filter functionality
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter and load items
                loadGalleryItems(filter);
            });
        });

        function loadGalleryItems(filter) {
            const filteredItems = filter === 'all' 
                ? galleryItems 
                : galleryItems.filter(item => item.category === filter);

            const galleryHTML = filteredItems.map(item => `
                <div class="gallery-item fade-in" data-category="${item.category}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="gallery-item-overlay">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `).join('');

            galleryGrid.innerHTML = galleryHTML;

            // Add click handlers for gallery items
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.addEventListener('click', () => {
                    // Add lightbox functionality here if needed
                });
            });
        }
    }

    
    // Initialize all functionality
    initializeGallery();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}); 