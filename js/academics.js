document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('programModal');
    const viewButtons = document.querySelectorAll('.view-details');
    const closeModal = document.querySelector('.close-modal');

    // Program details content
    const programDetails = {
        playgroup: {
            title: 'Playgroup',
            content: `<h3>Program Overview</h3>
                <p>Our playgroup program focuses on early childhood development through play-based learning.</p>
                <ul><h4>Core Activities</h4>
                    <li>Alphabets and Numbers</li>
                    <li>Shapes and Colors</li>
                    <li>Art and Craft</li>
                    <li>Speaking and Listening</li>
                    <li>Sorting and Grouping</li>
                    <li>Coloring and Drawing</li>
                </ul>
                <ul><h4>Additional Activities</h4>
                    <li>Music and Movement</li>
                    <li>Songs and Rhymes</li>
                    <li>Games and Exercises</li>
                </ul>`
        },
        primary: {
            title: 'Primary Level (Grades 1-5)',
            content: `<h3>Program Overview</h3>
                <p>Our primary level program provides a balanced curriculum that includes academic subjects, physical activities, arts, and social development.</p>
                <ul><h4>Core Subjects</h4>
                    <li>English</li>
                    <li>Nepali</li>
                    <li>Social Studies</li>
                    <li>Mathematics</li>
                    <li>Science</li>
                    <li>Health, Population and Environment Education</li>
                </ul>
                <ul><h4>Additional Activities</h4>
                <ul>
                    <li>Public Speaking and Debate</li>
                    <li>Sports and Games</li>
                    <li>Art and Music</li>
                    <li>Library Sessions</li>
                </ul>`
        },
        lower: {
            title: 'Lower Secondary Level (Grades 6-8)',
            content: `<h3>Program Overview</h3>
                <p>Our lower secondary level program provides a balanced curriculum that includes academic subjects, physical activities, arts, and social development. Students in Grades 6-8 begin to form a deeper understanding of the world around them, while also developing critical thinking, creativity, and social skills. The goal is to lay a strong foundation for lifelong learning and well-rounded personal development</p>
                <ul><h4>Core Subjects</h4>
                    <li>English</li>
                    <li>Nepali</li>
                    <li>Mathematics</li>
                    <li>Science</li>
                    <li>Social Studies</li>
                    <li>Health, Population and Environment Education</li>
                </ul>
                <ul><h4>Additional Features</h4>
                    <li>Public Speaking and Debate</li>
                    <li>Sports and Games</li>
                    <li>Art and Music</li>
                    <li>Library Sessions</li>
                    <li>Life Skills</li>
                    <li>Community Service</li>
                </ul>`
        },
        secondary: {
            title: 'Secondary Level (Grades 9-12)',
            content: `
                <h3>Program Overview</h3>
                <p>Our secondary level program provides a balanced curriculum that includes academic subjects, physical activities, arts, and social development. Students in Grades 9-12 begin to form a deeper understanding of the world around them, while also developing critical thinking, creativity, and social skills. The goal is to lay a strong foundation for lifelong learning and well-rounded personal development</p>
                <ul><h4>Core Subjects</h4>
                    <li>English</li>
                    <li>Nepali</li>
                    <li>Mathematics</li>
                    <li>Science</li>
                    <li>Social Studies</li>
                    <li>Health, Population and Environment Education</li>
                </ul>
                <h4>Additional Subjects</h4>
                        <ul><h3>Commerce Stream</h3>
                            <li>Accountancy</li>
                            <li>Business Studies</li>
                            <li>Economics</li>
                        </ul>                    
                        <ul><h3>Education Stream</h3>
                            <li>Child Development</li>
                            <li>Health Education</li>
                            <li>Psychology</li>
                        </ul>`
        },
        diploma: {
            title: 'Diploma in Computer Engineering',
            content: `<h3>Program Overview</h3>
                <p>Our Diploma in Computer Engineering program is designed to provide students with a strong foundation in computer systems, programming, and hardware technologies. It focuses on equipping students with the technical skills and knowledge required for careers in the IT and engineering industries or for further academic pursuits.</p>
                <ul><h4>Core Subjects</h4>
                    <li>Programming in C</li>
                    <li>Programming in C++</li>
                    <li>Programming in Java</li>
                    <li>Web Development</li>
                    <li>Database Management</li>
                    <li>Cyber Security</li>
                    <li>Computer Architecture</li>
                    <li>Operating Systems</li>
                    <li>Software Engineering</li>
                    <li>Ecommerce</li>
                    <li>Computer Graphics</li>
                    <li>Computer Hardware</li>
                    <li>Computer Networking</li>
                    <li>Computer Security</li>
                    <li>Computer Repair and Maintenance</li>
                    <li>Minor and Major Projects</li>
                </ul>
                <ul><h4>Special Features</h4>
                    <li>Practical Training</li>
                    <li>Internship Opportunities</li>
                    <li>Career Counseling</li>
                </ul>`
        }
    };

    // View Details button click handler
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const program = button.dataset.program;
            const details = programDetails[program];
            if (details) {
                const modalBody = modal.querySelector('.modal-body');
                modalBody.innerHTML = `
                    <h2>${details.title}</h2>
                    ${details.content}
                `;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal handlers
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });