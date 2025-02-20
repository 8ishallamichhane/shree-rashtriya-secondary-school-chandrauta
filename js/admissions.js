document.addEventListener('DOMContentLoaded', function () {
    const admissionForm = document.getElementById('admissionForm');

    // Initialize EmailJS
    emailjs.init({
        publicKey: 'ajQsIwLrJNPFNdBJu',
      }); // Replace with your EmailJS user ID

    admissionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get form values
        const formData = {
            name: document.getElementById('studentName').value,
            dob: document.getElementById('dob').value,
            grade: document.getElementById('grade').value,
            parentName: document.getElementById('parentName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
        };

        // Send email using EmailJS
        emailjs
            .send("service_8m2yyzf", "template_qk6al9z", {
                to_name: "Narayan Poudel",
                from_name: formData.name,
                phone: formData.phone,
                from_email: formData.email,
                grade: formData.grade,
                dob: formData.dob,
                parentName: formData.parentName,
                message: formData.message,
               
            })
            .then(
                () => {
                    // Show success message
                    alert("Email sent successfully!");
                    showMessage("success", "Thank you! Your message has been sent successfully.");

                    // Reset form
                    admissionForm.reset();
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
        admissionForm.insertBefore(messageDiv, admissionForm.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
});
