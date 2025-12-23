/**
 * Binti Health App
 * Animation Controller for Enhanced UI Effects
 */

const AnimationController = {
    // Apply ripple effect on button click
    applyRippleEffect: function(element) {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            element.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    },
    
    // Apply pulsing animation to elements with specified class
    applyPulseAnimation: function(elements) {
        if (!Array.isArray(elements)) {
            elements = [elements];
        }
        
        elements.forEach(element => {
            element.classList.add('pulse');
        });
    },
    
    // Apply staggered entrance animation to a collection of elements
    applyStaggeredEntrance: function(elements, baseDelay = 0.1, className = 'fade-in') {
        if (!Array.isArray(elements)) {
            elements = Array.from(elements);
        }
        
        elements.forEach((element, index) => {
            element.style.animationDelay = `${baseDelay * index}s`;
            element.classList.add(className);
        });
    },
    
    // Apply 3D hover effect to cards
    apply3DHoverEffect: function(element) {
        element.addEventListener('mousemove', function(e) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 20;
            const rotateX = (centerY - y) / 20;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.transform = '';
        });
    },
    
    // Apply screen transition animation
    applyScreenTransition: function(screen) {
        // Add a visual effect to the screen entrance
        const cards = screen.querySelectorAll('.card');
        this.applyStaggeredEntrance(cards, 0.1, 'zoom-in');
        
        // Add ripple effects to all buttons in the screen
        const buttons = screen.querySelectorAll('button, .btn, .filter-pill');
        buttons.forEach(button => {
            this.applyRippleEffect(button);
        });
        
        // Add 3D effects to cards
        cards.forEach(card => {
            this.apply3DHoverEffect(card);
        });
    },
    
    // Apply animated progress bars filling
    animateProgressBar: function(progressBar, finalValue) {
        progressBar.style.width = '0%';
        setTimeout(() => {
            progressBar.style.width = `${finalValue}%`;
        }, 100);
    },
    
    // Animate number counting
    animateCounter: function(element, finalValue, duration = 1000) {
        let startValue = 0;
        const increment = finalValue > 100 ? 1 : 0.1;
        const stepTime = Math.abs(Math.floor(duration / (finalValue / increment)));
        
        const timer = setInterval(() => {
            startValue += increment;
            element.textContent = startValue.toFixed(finalValue > 100 ? 0 : 1);
            
            if (startValue >= finalValue) {
                element.textContent = finalValue;
                clearInterval(timer);
            }
        }, stepTime);
    },
    
    // Apply confetti effect on achievement/milestone
    showConfettiEffect: function(container) {
        const confettiCount = 100;
        const colors = ['#8A2BE2', '#FF6B6B', '#4CAF50', '#2196F3', '#FFC107'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            const size = Math.random() * 10 + 5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}%`;
            confetti.style.animationDuration = `${animationDuration}s`;
            
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), animationDuration * 1000);
        }
    },
    
    // Apply shake animation to draw attention
    applyShakeAnimation: function(element, duration = 500) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, duration);
    },
    
    // Apply emoji reaction animation
    showEmojiReaction: function(container, emoji) {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('floating-emoji');
        emojiElement.textContent = emoji;
        
        container.appendChild(emojiElement);
        
        setTimeout(() => emojiElement.remove(), 2000);
    }
};
