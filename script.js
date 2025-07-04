document.addEventListener('DOMContentLoaded', function() {
    // --- Tab Switching Logic ---
    window.openTab = function(evt, tabName) {
        let i, tabcontent, tablinks;

        // Hide all tab content
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove("active");
        }

        // Deactivate all tab links
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].classList.remove("active");
        }

        // Show the specific tab content and activate the tab link
        document.getElementById(tabName).classList.add("active");
        evt.currentTarget.classList.add("active");

        // Close the mobile navigation if it's open
        const mainNav = document.getElementById('mainNav');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (mainNav.classList.contains('nav-open')) {
            mainNav.classList.remove('nav-open');
            hamburgerMenu.classList.remove('active');
        }

        // Trigger animations when Home or Program tab is opened
        if (tabName === 'Home') {
            // Reset slider to first slide when Home tab is opened
            currentSlide(1);
            animateNumbers();
        } else {
            // Pause slider when not on Home tab
            pauseSlider();
        }

        if (tabName === 'Program') {
            animateProgramItems();
        }
    };

    // Set the default open tab (Home) on page load
    document.querySelector('.tablinks').click();

    // --- Number Animation for Home Section ---
    function animateNumbers() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 // Trigger when 50% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target').replace(/\D/g, '')); // Remove non-digits
                    const duration = 2000; // milliseconds
                    let start = 0;
                    let startTime = null;

                    function animate(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const progress = (currentTime - startTime) / duration;
                        const value = Math.min(progress, 1) * target;
                        entry.target.textContent = '+' + Math.floor(value).toLocaleString(); // Add + and commas
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            entry.target.textContent = '+' + target.toLocaleString();
                        }
                    }
                    requestAnimationFrame(animate);
                    observer.unobserve(entry.target); // Stop observing after animation
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animated-number').forEach(number => {
            observer.observe(number);
        });
    }

    // --- Program Items Animation (Text Slide-in) ---
    function animateProgramItems() {
        const programItems = document.querySelectorAll('.program-item span');
        programItems.forEach(item => {
            item.setAttribute('data-text', item.textContent); // Store original text
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateX(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.program-item').forEach(item => {
            // Apply initial hidden state for animation
            item.style.opacity = 0;
            item.style.transform = 'translateX(-20px)';
            item.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(item);
        });
    }

    // --- Image Slider Logic ---
    let slideIndex = 1;
    let slideTimer; // To control auto-play

    // Function to display slides
    function showSlides(n) {
        let i;
        const slides = document.getElementsByClassName("slide");
        const dots = document.getElementsByClassName("dot");

        // Loop around if n is out of bounds
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }

        // Hide all slides and deactivate all dots
        for (i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
            slides[i].style.display = 'none'; // Ensure display none for fade effect
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }

        // Show the current slide and activate the current dot
        slides[slideIndex - 1].classList.add('active');
        slides[slideIndex - 1].style.display = 'block'; // Show the active slide
        dots[slideIndex - 1].classList.add("active");

        // Restart auto-play timer
        resetSliderTimer();
    }

    // Next/previous controls
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }

    // Auto-play functionality
    function startSlider() {
        slideTimer = setInterval(() => {
            plusSlides(1);
        }, 5000); // Change image every 5 seconds
    }

    function pauseSlider() {
        clearInterval(slideTimer);
    }

    function resetSliderTimer() {
        pauseSlider();
        startSlider();
    }

    // Initialize slider when Home tab is active
    if (document.getElementById('Home').classList.contains('active')) {
        showSlides(slideIndex);
        startSlider();
    }

    // --- Login/Signup Modal Logic ---
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');

    // Function to show a modal
    function showModal(modalElement) {
        modalElement.style.display = 'flex'; // Use flex to center content
    }

    // Function to hide a modal
    function hideModal(modalElement) {
        modalElement.style.display = 'none';
        // Clear previous messages when closing
        const messageBox = modalElement.querySelector('.message-box');
        if (messageBox) {
            messageBox.textContent = '';
            messageBox.classList.remove('success', 'error');
            messageBox.style.display = 'none';
        }
    }

    // Event listeners for opening modals
    loginBtn.addEventListener('click', () => showModal(loginModal));
    signupBtn.addEventListener('click', () => showModal(signupModal));

    // Event listeners for closing modals
    closeLoginModal.addEventListener('click', () => hideModal(loginModal));
    closeSignupModal.addEventListener('click', () => hideModal(signupModal));

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            hideModal(loginModal);
        }
        if (event.target === signupModal) {
            hideModal(signupModal);
        }
    });

    // --- Form Submission Handlers (Placeholder) ---
    const feedbackForm = document.getElementById('feedbackForm');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const feedbackMessageContainer = document.getElementById('feedbackMessageContainer');
    const loginMessageContainer = document.getElementById('loginMessageContainer');
    const signupMessageContainer = document.getElementById('signupMessageContainer');

    // Generic function to display messages
    function displayMessage(container, message, type) {
        container.textContent = message;
        container.classList.remove('success', 'error'); // Clear previous types
        container.classList.add(type);
        container.style.display = 'block';
    }

    // Feedback Form Submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            const name = document.getElementById('feedbackName').value;
            const email = document.getElementById('feedbackEmail').value;
            const message = document.getElementById('feedbackMessage').value;

            // Basic validation
            if (!name || !email || !message) {
                displayMessage(feedbackMessageContainer, 'Please fill in all fields.', 'error');
                return;
            }

            // Simulate form submission (e.g., send to server)
            console.log('Feedback Submitted:', { name, email, message });
            displayMessage(feedbackMessageContainer, 'Thank you for your feedback! We will get back to you soon.', 'success');

            feedbackForm.reset(); // Clear the form
            // Hide message after a few seconds
            setTimeout(() => {
                feedbackMessageContainer.style.display = 'none';
            }, 5000);
        });
    }

    // Login Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log('Login Attempt:', { email, password });

            // Simulate login success/failure
            {
                displayMessage(loginMessageContainer, 'Login successful!', 'success');
                setTimeout(() => {
                    hideModal(loginModal);
                }, 1500);
            } 
        });
    }

    // Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            console.log('Signup Attempt:', { name, email, password, confirmPassword });

            if (password !== confirmPassword) {
                displayMessage(signupMessageContainer, 'Passwords do not match.', 'error');
                return;
            }

            // Simulate signup success/failure
            if (password.length < 6) {
                displayMessage(signupMessageContainer, 'Password must be at least 6 characters long.', 'error');
            } else {
                displayMessage(signupMessageContainer, 'Account created successfully!', 'success');
                setTimeout(() => {
                    hideModal(signupModal);
                }, 1500);
            }
        });
    }

    // --- Mobile Hamburger Menu Logic ---
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mainNav = document.getElementById('mainNav');

    if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', function() {
            mainNav.classList.toggle('nav-open');
            hamburgerMenu.classList.toggle('active'); // For hamburger animation
        });
    }

    // Initialize animations for the default active tab if it's Home or Program
    if (document.getElementById('Home').classList.contains('active')) {
        animateNumbers();
    }
    if (document.getElementById('Program').classList.contains('active')) {
        animateProgramItems();
    }
});