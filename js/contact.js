document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    // Initialize EmailJS
    emailjs.init({
        publicKey: 'ajQsIwLrJNPFNdBJu',
      }); // Replace with your EmailJS user ID

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
        };

        // Send email using EmailJS
        emailjs
            .send("service_8m2yyzf", "template_y9gwc6r", {
                to_name: "Narayan Poudel",
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                phone: formData.phone,
            })
            .then(
                () => {
                    // Show success message
                    alert("Email sent successfully!");
                    showMessage("success", "Thank you! Your message has been sent successfully.");

                    // Reset form
                    contactForm.reset();
                },
                (error) => {
                    // Show error message
                    showMessage("error", "Oops! Something went wrong. Please try again later.");
                    alert("EmailJS Error:", error);
                }
            );
    });

    function showMessage(type, text) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach((msg) => msg.remove());

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = text;

        // Insert message before the form
        contactForm.insertBefore(messageDiv, contactForm.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});
