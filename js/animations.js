/**
 * Binti International Health App
 * Advanced Animation Functionality
 */

// Extend AnimationController with additional animation methods
Object.assign(AnimationController, {
    // Animate screen transitions with sophisticated effects
    animateScreenTransition: function(fromScreen, toScreen) {
        if (!fromScreen || !toScreen) return;
        
        // Prepare the new screen
        toScreen.style.display = 'block';
        
        // Apply exit animation to current screen
        fromScreen.classList.add('slide-out-left');
        
        // After exit animation completes, hide old screen and animate in new screen
        setTimeout(() => {
            fromScreen.style.display = 'none';
            fromScreen.classList.remove('active', 'slide-out-left');
            
            // Apply entrance animation to new screen
            toScreen.classList.add('active');
            
            // Staggered animation for cards inside the new screen
            const cards = toScreen.querySelectorAll('.card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('slide-in-right');
                    card.style.opacity = '1';
                }, 100 * index); // stagger by 100ms
            });
        }, 300); // match this with the CSS animation duration
    },
    
    // Slide in the drawer from the left with staggered menu item animations
    animateDrawerOpen: function(drawer) {
        drawer.classList.add('open');
        
        // Get all drawer menu items for staggered animation
        const menuItems = drawer.querySelectorAll('.drawer-item');
        menuItems.forEach((item, index) => {
            item.style.transitionDelay = `${0.05 * index}s`;
        });
        
        // Add overlay fade in
        document.getElementById('app-overlay').classList.add('visible');
    },
    
    // Close drawer with animation
    animateDrawerClose: function(drawer) {
        // Reset all transition delays
        const menuItems = drawer.querySelectorAll('.drawer-item');
        menuItems.forEach(item => {
            item.style.transitionDelay = '0s';
        });
        
        drawer.classList.remove('open');
        
        // Remove overlay with fade out
        document.getElementById('app-overlay').classList.remove('visible');
    },
    
    // Slide in notifications panel from the right with staggered animations
    animateNotificationsOpen: function(panel) {
        panel.classList.add('open');
        
        // Get all notifications for staggered animation
        const notifications = panel.querySelectorAll('.notification');
        notifications.forEach((notification, index) => {
            notification.style.transitionDelay = `${0.05 * index}s`;
        });
        
        document.getElementById('app-overlay').classList.add('visible');
    },
    
    // Close notifications panel with animation
    animateNotificationsClose: function(panel) {
        // Reset all transition delays
        const notifications = panel.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transitionDelay = '0s';
        });
        
        panel.classList.remove('open');
        document.getElementById('app-overlay').classList.remove('visible');
    },
    
    // Animate modal opening with zoom effect
    animateModalOpen: function(modal) {
        console.log('🎬 animateModalOpen called, modal:', modal);
        console.log('Modal classes before:', modal.className);
        
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible'); // Add the visible class that CSS expects
        modal.style.display = 'flex'; // Force display
        modal.style.visibility = 'visible'; // Force visibility
        modal.style.opacity = '1'; // Force opacity
        
        console.log('Modal classes after:', modal.className);
        console.log('Modal display style:', modal.style.display);
        console.log('Modal visibility:', modal.style.visibility);
        console.log('Modal opacity:', modal.style.opacity);
        
        // Show overlay
        const overlay = document.getElementById('app-overlay');
        if (overlay) {
            overlay.classList.add('visible');
            console.log('✓ Overlay made visible');
        }
        
        setTimeout(() => {
            const modalContent = document.getElementById('modal-content');
            if (modalContent) {
                modalContent.classList.add('zoom-in');
                console.log('✓ zoom-in class added to modal content');
            }
        }, 10);
    },
    
    // Animate modal closing
    animateModalClose: function(modal) {
        console.log('🎬 animateModalClose called');
        const modalContent = document.getElementById('modal-content');
        if (modalContent) {
            modalContent.classList.remove('zoom-in');
            modalContent.classList.add('zoom-out');
        }
        
        // Remove visible class and add hidden class
        modal.classList.remove('modal-visible');
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
        modal.style.display = 'none';
        
        // Hide overlay
        const overlay = document.getElementById('app-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            console.log('✓ Overlay hidden');
        }
        
        setTimeout(() => {
            modal.classList.add('modal-hidden');
            if (modalContent) {
                modalContent.classList.remove('zoom-out');
            }
            console.log('✓ Modal fully closed');
        }, 300); // match this with the CSS animation duration
    },
    
    // Animate FAB button with pulse effect
    animateFab: function(fab) {
        fab.classList.add('pulse');
        
        setTimeout(() => {
            fab.classList.remove('pulse');
        }, 1000);
    },
    
    // Animate toast notifications
    animateToast: function(message, type = 'info', duration = 3000) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // Set message and type
        toast.textContent = message;
        toast.className = `toast ${type}`; // reset classes
        
        // Show the toast with animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Hide after duration
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },
    
    // Create liquid wave effect for buttons
    createButtonRipple: function(event) {
        const button = event.currentTarget;
        
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;
        
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add('ripple');
        
        // Remove any existing ripples
        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }
        
        button.appendChild(circle);
        
        // Remove the ripple after animation completes
        setTimeout(() => {
            circle.remove();
        }, 600);
    },
    
    // Zoom effect for logo and images
    zoomImageEffect: function(img) {
        img.classList.add('zoom-effect');
        
        img.addEventListener('animationend', () => {
            img.classList.remove('zoom-effect');
        });
    },
    
    // Add parallax scroll effect to elements
    addParallaxEffect: function(elements, strength = 0.2) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            elements.forEach(element => {
                const offset = element.getBoundingClientRect().top;
                const elementScrollY = (offset - scrollY) * strength;
                
                element.style.transform = `translateY(${elementScrollY}px)`;
            });
        });
    },
    
    // Initialize all animation event listeners
    init: function() {
        // Add ripple effect to all buttons
        const buttons = document.querySelectorAll('.btn, .btn-icon');
        buttons.forEach(button => {
            button.addEventListener('click', this.createButtonRipple);
        });
        
        // Add hover animation to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('card-hover');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('card-hover');
            });
        });
        
        // Add smooth scrolling to anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header
                        behavior: 'smooth'
                    });
                }
            });
        });
    },
    
    // Animation for device connection process
    animateDeviceConnection: function() {
        const connectionAnim = document.querySelector('.device-connection-animation');
        if (!connectionAnim) return;
        
        connectionAnim.classList.add('scanning');
        
        // Simulate connection process with pulsing animation
        setTimeout(() => {
            connectionAnim.classList.remove('scanning');
            connectionAnim.classList.add('connected');
            
            // Show success message with animation
            const successMsg = document.createElement('div');
            successMsg.className = 'connection-success slide-in-right';
            successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Connected!';
            connectionAnim.appendChild(successMsg);
        }, 3000);
    },
    
    // Page transition effect
    pageTransition: function(callback) {
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.page-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'page-transition-overlay';
            document.body.appendChild(overlay);
        }
        
        // Show the overlay
        overlay.classList.add('show');
        
        // After transition, execute callback and hide overlay
        setTimeout(() => {
            if (callback && typeof callback === 'function') {
                callback();
            }
            
            overlay.classList.remove('show');
            overlay.classList.add('hide');
            
            setTimeout(() => {
                overlay.classList.remove('hide');
            }, 300);
        }, 300);
    }
});

// Initialize animations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    if (AnimationController.init) {
        AnimationController.init();
    }
    
    // Add zoom effect to logo
    const splashLogo = document.querySelector('.splash-logo');
    if (splashLogo) {
        // Apply initial zoom-in on page load
        splashLogo.classList.add('spin-in');
        
        // Add click handler for extra zoom effect
        splashLogo.addEventListener('click', () => {
            AnimationController.zoomImageEffect(splashLogo);
        });
    }
});
