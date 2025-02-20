document.addEventListener('DOMContentLoaded', function() {
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically make an API call to subscribe the email
            // For demo purposes, we'll just show an alert
            alert(`Thank you for subscribing with: ${email}`);
            this.reset();
        });
    }

    // FAQ Accordion Animation
    const faqDetails = document.querySelectorAll('.faq-list details');
    faqDetails.forEach(detail => {
        detail.addEventListener('toggle', function() {
            if (this.open) {
                // Close other open details
                faqDetails.forEach(otherDetail => {
                    if (otherDetail !== this && otherDetail.open) {
                        otherDetail.open = false;
                    }
                });
            }
        });
    });

    // Document Download Tracking
    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // For demo purposes, we'll just log the download
            const documentTitle = this.closest('.document-card')
                                    .querySelector('h4').textContent;
            console.log(`Downloading: ${documentTitle}`);
        });
    });
}); 