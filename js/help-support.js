/**
 * Binti International Health App
 * Help & Support Functionality
 */

// Create FAQ section
function createFAQSection(container) {
    const faqEl = document.createElement('div');
    faqEl.className = 'help-section';
    
    faqEl.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-question-circle"></i> Frequently Asked Questions
                </div>
            </div>
            <div class="card-content">
                <div class="faq-list">
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(this)">
                            <i class="fas fa-chevron-right"></i>
                            <span>How do I track my period?</span>
                        </div>
                        <div class="faq-answer">
                            <p>To track your period, go to the Period Tracking screen and click the + button. Enter your period start date and any relevant information like flow intensity and symptoms.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(this)">
                            <i class="fas fa-chevron-right"></i>
                            <span>How do I log pain?</span>
                        </div>
                        <div class="faq-answer">
                            <p>Navigate to Pain Management and click the + button to add a new pain entry. You can record pain level, location, triggers, and remedies used.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(this)">
                            <i class="fas fa-chevron-right"></i>
                            <span>How do I change my profile photo?</span>
                        </div>
                        <div class="faq-answer">
                            <p>Go to Settings, click "Change Photo", then choose to take a photo or select from your gallery. Your photo will be saved to your account.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(this)">
                            <i class="fas fa-chevron-right"></i>
                            <span>Is my data secure?</span>
                        </div>
                        <div class="faq-answer">
                            <p>Yes! All your data is encrypted and stored securely. We never share your personal health information without your explicit consent.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(this)">
                            <i class="fas fa-chevron-right"></i>
                            <span>How do I enable dark mode?</span>
                        </div>
                        <div class="faq-answer">
                            <p>Go to Settings and toggle the "Dark Mode" switch. Your preference will be saved automatically.</p>
                        </div>
                    </div>
                    
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(this)">
                            <i class="fas fa-chevron-right"></i>
                            <span>Can I export my data?</span>
                        </div>
                        <div class="faq-answer">
                            <p>Data export functionality is coming soon. You'll be able to download your health data in CSV or PDF format.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(faqEl);
}

// Toggle FAQ answer visibility
function toggleFAQ(questionEl) {
    const faqItem = questionEl.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = questionEl.querySelector('i');
    
    faqItem.classList.toggle('active');
    
    if (faqItem.classList.contains('active')) {
        icon.style.transform = 'rotate(90deg)';
        answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
        icon.style.transform = 'rotate(0deg)';
        answer.style.maxHeight = '0';
    }
}

// Create contact form
function createContactForm(container) {
    const contactEl = document.createElement('div');
    contactEl.className = 'help-section';
    
    contactEl.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-envelope"></i> Contact Support
                </div>
            </div>
            <div class="card-content">
                <p style="margin-bottom: 20px;">Need help? Send us a message and we'll get back to you within 24 hours.</p>
                
                <form id="contact-form" onsubmit="handleContactSubmit(event)">
                    <div class="form-group">
                        <label>Subject</label>
                        <select id="contact-subject" class="form-control" required>
                            <option value="">Select a topic...</option>
                            <option value="technical">Technical Issue</option>
                            <option value="account">Account Help</option>
                            <option value="feature">Feature Request</option>
                            <option value="feedback">General Feedback</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Message</label>
                        <textarea id="contact-message" class="form-control" rows="5" placeholder="Describe your issue or question..." required></textarea>
                    </div>
                    
                    <div id="contact-error" class="error-message" style="display: none;"></div>
                    <div id="contact-success" class="success-message" style="display: none;"></div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i> Send Message
                    </button>
                </form>
            </div>
        </div>
    `;
    
    container.appendChild(contactEl);
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    const errorEl = document.getElementById('contact-error');
    const successEl = document.getElementById('contact-success');
    
    errorEl.style.display = 'none';
    successEl.style.display = 'none';
    
    if (!subject || !message) {
        errorEl.textContent = 'Please fill in all fields';
        errorEl.style.display = 'block';
        return;
    }
    
    // In a real app, this would send to the backend
    // For now, just show success message
    successEl.textContent = 'Message sent successfully! We\'ll get back to you soon.';
    successEl.style.display = 'block';
    
    // Clear form
    document.getElementById('contact-form').reset();
    
    showToast('Support message sent successfully');
}

// Create help resources
function createHelpResources(container) {
    const resourcesEl = document.createElement('div');
    resourcesEl.className = 'help-section';
    
    resourcesEl.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-book"></i> Help Resources
                </div>
            </div>
            <div class="card-content">
                <div class="help-resources-grid">
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <h4>Video Tutorials</h4>
                        <p>Watch step-by-step guides on how to use Binti Health</p>
                        <button class="btn btn-outline" onclick="showToast('Video tutorials coming soon!')">
                            <i class="fas fa-play"></i> Watch Videos
                        </button>
                    </div>
                    
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <h4>User Guide</h4>
                        <p>Comprehensive documentation for all features</p>
                        <button class="btn btn-outline" onclick="showToast('User guide coming soon!')">
                            <i class="fas fa-book-open"></i> Read Guide
                        </button>
                    </div>
                    
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>Community Forum</h4>
                        <p>Connect with other users and share experiences</p>
                        <button class="btn btn-outline" onclick="app.navigateToScreen('community')">
                            <i class="fas fa-comments"></i> Visit Forum
                        </button>
                    </div>
                    
                    <div class="resource-card">
                        <div class="resource-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <h4>Emergency Support</h4>
                        <p>24/7 helpline for urgent health concerns</p>
                        <button class="btn btn-outline" onclick="showToast('Emergency: Call your local health services')">
                            <i class="fas fa-phone-alt"></i> Get Help
                        </button>
                    </div>
                </div>
                
                <div class="app-info" style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
                    <h4><i class="fas fa-info-circle"></i> App Information</h4>
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Last Updated:</strong> December 2025</p>
                    <p><strong>Developer:</strong> Binti International Health</p>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(resourcesEl);
}

// Export functions
window.createFAQSection = createFAQSection;
window.createContactForm = createContactForm;
window.createHelpResources = createHelpResources;
window.toggleFAQ = toggleFAQ;
window.handleContactSubmit = handleContactSubmit;
