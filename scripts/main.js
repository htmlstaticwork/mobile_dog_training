document.addEventListener('DOMContentLoaded', () => {
    // 🎨 Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 🌗 Theme Toggle Logic
    const themeToggle = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcons();
    };

    const updateIcons = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const btns = ['theme-toggle', 'theme-toggle-mob'];
        btns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', currentTheme === 'light' ? 'moon' : 'sun');
                }
            }
        });
        if (window.lucide) {
            lucide.createIcons();
        }
    };

    // Initialize Theme
    document.body.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
    updateIcons();

    // Initialize RTL
    document.documentElement.setAttribute('dir', localStorage.getItem('dir') || 'ltr');

    // 🎯 Active Navigation Detection
    const setActiveNavLink = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .nav-items .nav-item');

        navLinks.forEach(link => {
            const href = link.getAttribute('href') || link.getAttribute('data-target') + '.html';
            if (href === currentPath) {
                link.classList.add('active');

                // If it's a dropdown child, also highlight the parent
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    const trigger = parentDropdown.querySelector('.dropdown-trigger');
                    if (trigger) trigger.classList.add('active');
                }
            } else {
                link.classList.remove('active');
            }
        });
    };
    setActiveNavLink();

    // 📱 Global Click Handlers
    window.addEventListener('click', (e) => {
        // Theme Toggle (Desktop and Mobile)
        if (e.target.closest('#theme-toggle') || e.target.closest('#theme-toggle-mob')) {
            themeToggle();
        }

        // RTL Toggle (Desktop and Mobile)
        if (e.target.closest('#rtl-toggle') || e.target.closest('#rtl-toggle-mob')) {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        }

        // 👁️ Password Visibility
        const toggleBtn = e.target.closest('.password-toggle');
        if (toggleBtn) {
            const input = toggleBtn.parentElement.querySelector('input');
            const icon = toggleBtn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        }

        // 🗓️ Booking Popup Logic
        const popupOverlay = document.getElementById('booking-popup');
        const trigger = e.target.closest('.btn-primary') || e.target.closest('.book-trigger');
        if (trigger && !trigger.closest('header') && !trigger.closest('footer') && !trigger.closest('.auth-card') && !trigger.closest('form')) {
            if (trigger.textContent.includes('Book') || trigger.classList.contains('reveal-zoom')) {
                if (popupOverlay) popupOverlay.style.display = 'flex';
            }
        }
        if (e.target === popupOverlay || e.target.closest('.close-popup')) {
            if (popupOverlay) popupOverlay.style.display = 'none';
        }
    });

    // 📱 Main Mobile Menu Toggle
    const toggleMenu = (isActive) => {
        const navLinks = document.querySelector('.nav-links');
        const trigger = document.getElementById('mobile-menu-trigger');
        if (!navLinks || !trigger) return;

        navLinks.classList.toggle('active', isActive);
        const icon = trigger.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isActive ? 'x' : 'menu');
            lucide.createIcons();
        }
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    // Set stagger delay
    const menuLinks = document.querySelectorAll('.nav-links a');
    menuLinks.forEach((link, i) => link.style.setProperty('--i', i));

    window.addEventListener('click', (e) => {
        const trigger = e.target.closest('#mobile-menu-trigger');
        const navLinks = document.querySelector('.nav-links');

        if (trigger) {
            e.stopPropagation();
            const isActive = !navLinks.classList.contains('active');
            toggleMenu(isActive);
        } else if (navLinks && navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
            toggleMenu(false);
        }

        // Close on link click
        if (e.target.closest('.nav-links a') && !e.target.closest('.dropdown-trigger')) {
            toggleMenu(false);
        }
    });

    // 📂 Dropdown Management
    window.addEventListener('click', (e) => {
        const dropdownTrigger = e.target.closest('.dropdown-trigger');
        if (dropdownTrigger && window.innerWidth <= 1100) {
            e.preventDefault();
            e.stopPropagation();
            const dropdown = dropdownTrigger.closest('.dropdown');
            const isActive = dropdown.classList.contains('active');

            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            if (!isActive) dropdown.classList.add('active');
        } else if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // ✨ Scroll Animations
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-zoom');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(el => revealObserver.observe(el));

    // 📱 Dashboard Sidebar Mobile Toggle
    const dashHamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    if (dashHamburger && sidebar) {
        dashHamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // ❓ FAQ Accordion Logic
    const faqTriggers = document.querySelectorAll('.faq-trigger');
    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const content = item.querySelector('.faq-content');
            const icon = trigger.querySelector('.faq-icon');

            // Check if active
            const isActive = item.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item').forEach(other => {
                other.classList.remove('active');
                other.querySelector('.faq-content').style.maxHeight = '0';
                other.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // ⬆️ Back to Top Logic
    const backToTopBtn = document.getElementById('back-to-top');
    const header = document.querySelector('header');

    if (backToTopBtn || header) {
        window.addEventListener('scroll', () => {
            if (backToTopBtn) {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });

        // Trigger once on load
        if (header && window.scrollY > 50) {
            header.classList.add('scrolled');
        }

        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
});
