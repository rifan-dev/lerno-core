// Lerno Interactivity
document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Toggle body scrolling when menu is open
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Animations using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-in, .fade-in-up');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Animate only once per load
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Form Submission (EmailJS)
    // Initialize EmailJS with your Public Key
    emailjs.init("g6To0bObi090ldIdF"); // <-- IMPORTANT: Add your EmailJS public key here

    const forms = document.querySelectorAll('.cta-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Strict email validation
            const emailField = form.querySelector('input[name="email"]');
            const errorMsg = form.querySelector('.email-error-msg');
            
            if (emailField) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    if (errorMsg) {
                        errorMsg.textContent = "Please enter a valid email address (e.g., name@gmail.com).";
                        errorMsg.style.display = "block";
                    }
                    emailField.style.borderColor = "#ff4a4a";
                    emailField.focus();
                    return; // Stop the form from submitting
                } else if (errorMsg) {
                    errorMsg.style.display = "none";
                    emailField.style.borderColor = "";
                }
            }

            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            // These IDs need to be replaced with your actual EmailJS Service ID and Template ID
            const serviceID = "service_9c1da4b";
            const templateID = "template_qkr38nc";
            const scriptURL = "https://script.google.com/macros/s/AKfycbxPs75VDI1EvvgR2CwaUyGprtp1wgFVfXJrJS4E9AzNU7bX2i3QH3JQ6bGS5zRthq-Pkw/exec";

            try {
                // Run both EmailJS and Google Sheets fetch at the same time
                const emailPromise = emailjs.sendForm(serviceID, templateID, form);
                const sheetPromise = fetch(scriptURL, { method: "POST", body: new FormData(form) });

                await Promise.all([emailPromise, sheetPromise]);

                alert("Success! Your message has been sent. Check your email for a confirmation.");
                form.reset();
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    });
});
