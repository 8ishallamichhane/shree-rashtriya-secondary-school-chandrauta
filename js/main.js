document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const bars = document.querySelectorAll('.bar');
    const header = document.querySelector('header');
    const heroContent = document.querySelector('.hero-content');
    const bannerContent = document.querySelectorAll('.banner-content');
    let lastScroll = 0;
    
    // Check if this is the landing page (index.html)
    const isLandingPage = document.location.pathname.endsWith('index.html') || 
                         document.location.pathname.endsWith('/');
    
    // Add landing-page class to body if on landing page
    if (isLandingPage) {
        document.body.classList.add('landing-page');
    }

    // Hamburger menu toggle
    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
            hamburger?.classList.remove('active');
            navLinks?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking a link
    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Intersection Observer for fade-in effect
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (heroContent) {
        observer.observe(heroContent);
    }

    bannerContent.forEach(content => {
        observer.observe(content);
    });

    // Existing scroll event for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 620) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    // const tauko = document.querySelector('indexheader')
    // window.addEventListener('scroll', () => {
    //     if (window.scrollY > 620) {
    //         tauko.classList.add('scrolled');
    //     } else {
    //         tauko.classList.remove('scrolled');
    //     }
    // });

    // Scroll effect for hero and banner sections
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const banner = document.querySelector('.page-banner');
        const heroContent = document.querySelector('.hero-content');
        const bannerContent = document.querySelector('.banner-content');

        if (hero) {
            hero.style.backgroundPosition = `50% ${50 + (scrolled * 0.1)}%`;
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroContent.style.opacity = 1 - (scrolled / 700);
        }

        if (banner) {
            banner.style.backgroundPosition = `50% ${50 + (scrolled * 0.1)}%`;
            bannerContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            bannerContent.style.opacity = 1 - (scrolled / 700);
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Message data (replace with your actual messages)
    const messages = {
        1: {
            title: "Chairperson's Message",
            author: "Mr. Humakanta Khanal",
            image: "assets/images/chairperson.jpg",
            content: `As the chairperson of our school board, I am proud to lead an institution that 
            has consistently demonstrated excellence in education and character building. Our school's 
            foundation rests on the pillars of academic excellence, moral values, and community service.

            We have assembled an outstanding team of educators who share our vision of providing 
            holistic education that prepares students not just for academic success, but for life 
            itself. Our infrastructure and facilities are continuously upgraded to meet the evolving 
            needs of modern education.

            The board is committed to maintaining transparency and fostering strong relationships 
            with parents, teachers, and the community. We believe that education is a collaborative 
            effort, and your support is crucial in achieving our goals.

            Together, we will continue to build on our legacy of excellence and prepare our students 
            for the challenges and opportunities of tomorrow.`
        },
        2: {
            title: "Principal's Message",
            author: "Mr. Baldev Lamichhane",
            email: "principal@rashtriyamavi.edu.np",
            image: "assets/images/principal.jpeg",
            content: `Welcome to our vibrant learning community. As Principal, I am honored to lead 
            a team of dedicated educators who are passionate about nurturing young minds and helping 
            students discover their full potential.

            Our school's approach to education goes beyond traditional academics. We emphasize critical 
            thinking, creativity, and character development. Our diverse programs in academics, sports, 
            arts, and community service provide students with opportunities to explore their interests 
            and develop their talents.

            We understand that each student is unique, with different abilities and learning styles. 
            Our teachers are trained to provide personalized attention and create an inclusive learning 
            environment where every student can thrive.

            Parents are our valued partners in education, and we encourage your active participation 
            in your child's learning journey. Together, we can help our students grow into confident, 
            responsible, and successful individuals.`
        },
        3: {
            title: "Student Representative's Message",
            author: "Bishal Lamichhane",
            image: "assets/images/photo.jpg",
            content: `On behalf of the student body, I am excited to share our perspective on what 
            makes our school special. Our school is more than just a place of learning; it's a 
            community where students from diverse backgrounds come together to learn, grow, and 
            support each other.

            The opportunities provided here are endless - from academic clubs to sports teams, 
            from cultural events to community service projects. Our teachers and staff are always 
            ready to support our initiatives and help us develop our leadership skills.

            What I appreciate most about our school is how student voices are heard and valued. 
            Through the Student Council, we actively participate in school decisions and organize 
            events that make our school life memorable.

            To all current and prospective students: embrace the opportunities here, get involved, 
            and make the most of your school experience. Together, we can make our school even better!`
        }
    };

    // Open modal when clicking read more
    const messageCards = document.querySelectorAll('.message-card');
    const modal = document.getElementById('communityMessageModal');
    const closeModal = modal.querySelector('.close-modal');

    messageCards.forEach(card => {
        card.addEventListener('click', function() {
            const messageId = this.dataset.messageId;
            const message = messages[messageId];
            
            // Populate modal content
            document.getElementById('modalMessageTitle').textContent = message.title;
            document.getElementById('modalAuthorName').textContent = message.author;
            document.getElementById('modalAuthorEmail').textContent = message.email;
            document.getElementById('modalAuthorImg').src = message.image;
            document.getElementById('modalFullMessage').textContent = message.content;
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close modal functionality
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Scroll handling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when page is scrolled
        if (currentScroll > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Hide/show navbar based on scroll direction
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scrolling down & past navbar
            navbar?.classList.add('nav-up');
        } else {
            // Scrolling up
            navbar?.classList.remove('nav-up');
        }

        lastScroll = currentScroll;

        // Clear the timeout if it exists
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Show navbar after user stops scrolling
        scrollTimeout = setTimeout(() => {
            navbar?.classList.remove('nav-up');
        }, 1000);
    });

    // Active link handling
    const currentPath = window.location.pathname;
    navLinks?.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});