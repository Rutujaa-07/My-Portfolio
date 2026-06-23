document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------------------
    // NAVBAR SCROLL STYLING
    // ----------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // MOBILE NAVIGATION MENU
    // ----------------------------------------------------
    const hamburger = document.getElementById('mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
        });
    });

    // ----------------------------------------------------
    // TYPING ANIMATION (HERO)
    // ----------------------------------------------------
    const typingText = document.getElementById('typing-text');
    const professions = [
        'Cloud Computing Intern',
        'Aspiring Computer Science Graduate',
        'Aspiring Software Engineer'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentWord = professions[wordIndex];
        
        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeDelay = 50; // Deletes faster
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeDelay = 150; // Types slower
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Wait at the end of the word
            typeDelay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % professions.length;
            typeDelay = 500; // Pause before typing next word
        }

        setTimeout(type, typeDelay);
    }

    // Start Typing Effect
    if (typingText) {
        setTimeout(type, 1000);
    }

    // ----------------------------------------------------
    // SCROLL REVEAL & SKILLS PROGRESS ANIMATION
    // ----------------------------------------------------
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    
    // Store original widths in custom dataset and set width to 0% initially
    skillBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.dataset.width = targetWidth;
        bar.style.width = '0%';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills card, animate progress bars
                if (entry.target.classList.contains('skills-grid')) {
                    skillBars.forEach(bar => {
                        bar.style.width = bar.dataset.width;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });
    
    // Also observe skills card explicitly to trigger progress bars
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
        revealObserver.observe(skillsGrid);
    }

    // ----------------------------------------------------
    // ACTIVE NAV LINKS ON SCROLL
    // ----------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -60% 0px' // Focus on the middle section of the viewport
    });

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

    // ----------------------------------------------------
    // CERTIFICATE VIEWER MODAL
    // ----------------------------------------------------
    const certCards = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');
    const modalOverlay = document.getElementById('modal-overlay');

    function openModal(imgSrc) {
        modalImg.src = imgSrc;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Resume page scrolling
        // Delay resetting image source to avoid layout pop during fade-out
        setTimeout(() => {
            modalImg.src = '';
        }, 400);
    }

    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-cert-img');
            if (imgSrc) {
                openModal(imgSrc);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

    // Escape Key to Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // ----------------------------------------------------
    // CONTACT FORM SUBMISSION (SIMULATED)
    // ----------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Disable submit button during "sending"
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin btn-icon"></i>';
            formStatus.className = 'form-status';
            formStatus.textContent = '';

            // Simulate server network request delay
            setTimeout(() => {
                // Success message
                formStatus.className = 'form-status success';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. I will get back to you shortly.';
                
                // Clear fields
                contactForm.reset();
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Move floating labels back down
                const inputs = contactForm.querySelectorAll('.form-input');
                inputs.forEach(input => {
                    input.blur();
                });
            }, 1500);
        });
    }
});
