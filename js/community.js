/**
 * Binti International Health App
 * Community Platform Functionality
 */

// Create the community hub interface
function createCommunityHub(container) {
    const communityEl = document.createElement('div');
    communityEl.className = 'community-container';
    
    communityEl.innerHTML = `
        <div class="card community-card card-3d">
            <div class="card-header">
                <div class="card-title"><i class="fas fa-users"></i> Binti Community Platform</div>
                <div class="card-actions">
                    <button class="btn-icon tooltip" onclick="AnimationController.createButtonRipple(event)">
                        <i class="fas fa-bell"></i>
                        <span class="tooltiptext">Community notifications</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="community-welcome">
                    <div class="platform-logo">
                        <img src="images/binti-logo.png" alt="Binti Community" class="community-logo pulse-animation">
                    </div>
                    <div class="platform-info">
                        <h3>Welcome to the Binti Community!</h3>
                        <p>Connect with others, share experiences, and learn from our community of 150,000+ members worldwide.</p>
                    </div>
                </div>
                
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-users" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>Community features coming soon</p>
                    <p style="font-size: 14px; color: #666;">Connect with others in our upcoming community platform</p>
                </div>
                
            </div>
        </div>
        
        
    `;
    
    container.appendChild(communityEl);
}

// Join Binti Community platform
function joinCommunity() {
    // This would open the full community platform in a real app
    showToast("Connecting to Binti Community Platform...");
    
    // Simulate loading
    setTimeout(() => {
        // Navigate to a hypothetical community platform URL
        // In a real app, this might open an embedded web view or native community features
        window.app.showModal(`
            <div class="community-modal">
                <h2>Binti Community Platform</h2>
                <div class="loading-spinner"></div>
                <p>Loading community platform...</p>
                <p class="small-text">This would connect to our full community platform in the production app.</p>
                <button class="btn btn-outline" onclick="window.app.closeModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `);
    }, 1000);
}

// Connect social networks
function connectSocial(network) {
    const networkMap = {
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'tiktok': 'TikTok',
        'twitter': 'Twitter'
    };
    
    const networkName = networkMap[network] || network;
    showToast(`Connecting to ${networkName}...`);
    
    // Show authentication modal
    setTimeout(() => {
        window.app.showModal(`
            <div class="social-auth-modal">
                <h2>Connect ${networkName}</h2>
                <div class="social-auth-content">
                    <div class="social-icon ${network}">
                        <i class="fab fa-${network}"></i>
                    </div>
                    <p>Allow Binti Health to:</p>
                    <ul>
                        <li><i class="fas fa-check"></i> Access your basic profile</li>
                        <li><i class="fas fa-check"></i> Find friends using the app</li>
                        <li><i class="fas fa-check"></i> Share content (only with your permission)</li>
                    </ul>
                    <div class="auth-privacy">
                        <i class="fas fa-lock"></i>
                        <p>We will never post without asking you first</p>
                    </div>
                    <div class="auth-actions">
                        <button class="btn btn-primary" onclick="simulateSocialAuth('${network}')">
                            <i class="fas fa-check"></i> Authorize
                        </button>
                        <button class="btn btn-outline" onclick="window.app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        `);
    }, 500);
}

// Simulate social auth flow
function simulateSocialAuth(network) {
    // Close the modal
    window.app.closeModal();
    
    // Show loading state
    const networkName = network.charAt(0).toUpperCase() + network.slice(1);
    showToast(`Authenticating with ${networkName}...`);
    
    // Simulate successful connection
    setTimeout(() => {
        showToast(`Successfully connected to ${networkName}!`, 'success');
        
        // Update UI to show connected state
        const connectButton = document.querySelector(`.social-connection-item .social-icon.${network}`).closest('.social-connection-item').querySelector('button');
        connectButton.innerHTML = '<i class="fas fa-check"></i> Connected';
        connectButton.classList.add('btn-success');
        
        // Apply animation to indicate success
        const socialIcon = document.querySelector(`.social-connection-item .social-icon.${network}`);
        socialIcon.classList.add('connected');
        AnimationController.showEmojiReaction(socialIcon, '✅');
    }, 2000);
}

// View a specific topic
function viewTopic(topicId) {
    // In a real app, this would open the specific topic thread
    const topics = [
        { id: 1, title: "Dealing with cramps naturally" },
        { id: 2, title: "Mental health during your cycle" },
        { id: 3, title: "Best foods for each cycle phase" }
    ];
    
    const topic = topics.find(t => t.id === topicId) || { title: "Topic" };
    
    window.app.showModal(`
        <div class="topic-modal">
            <h2>${topic.title}</h2>
            <div class="topic-content">
                <p class="placeholder-text">This would display the full topic thread in the production app.</p>
                <div class="topic-action-buttons">
                    <button class="btn btn-small">
                        <i class="fas fa-heart"></i> Like
                    </button>
                    <button class="btn btn-small">
                        <i class="fas fa-comment"></i> Reply
                    </button>
                    <button class="btn btn-small">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
            <button class="btn btn-outline" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `);
}

// View all topics
function viewAllTopics() {
    showToast("Loading all community topics...");
    
    // This would navigate to all topics view in a real app
    setTimeout(() => {
        window.app.showModal(`
            <div class="all-topics-modal">
                <h2>Community Topics</h2>
                <div class="topics-filter">
                    <button class="filter-btn active">All Topics</button>
                    <button class="filter-btn">Most Popular</button>
                    <button class="filter-btn">Recent</button>
                </div>
                <div class="topics-list">
                    <p class="placeholder-text">This would display all community topics in the production app.</p>
                </div>
                <button class="btn btn-outline" onclick="window.app.closeModal()">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        `);
    }, 1000);
}

// Helper to show toast notifications
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set toast content and type
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show the toast
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize community features
function initCommunity() {
    const communityScreen = document.getElementById('community');
    if (!communityScreen) return;
    
    // Create community hub
    createCommunityHub(communityScreen);
    
    // Apply animations to the entire screen
    AnimationController.applyScreenTransition(communityScreen);
}

// Update community posts without full reinitialization
function updateCommunityPosts() {
    // Find existing posts container
    const postsContainer = document.querySelector('.community-topics');
    if (!postsContainer) return;
    
    // Create a new post and add it to the top
    const newPost = document.createElement('div');
    newPost.className = 'topic-item card-3d new-post';
    
    // Get current date for the post
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()}`;
    
    // Set post content with animation
    newPost.innerHTML = `
        <div class="topic-info">
            <div class="topic-title">New post from community form</div>
            <div class="topic-meta">
                <span class="topic-author">You</span> · 
                <span class="topic-date">${formattedDate}</span> · 
                <span class="topic-category highlight">New</span>
            </div>
            <div class="topic-preview">Your post has been added to the community...</div>
        </div>
        <div class="topic-stats">
            <div class="stat"><i class="fas fa-heart"></i> 0</div>
            <div class="stat"><i class="fas fa-comment"></i> 0</div>
        </div>
    `;
    
    // Add highlight animation
    newPost.style.animation = 'highlight-new-content 2s ease-in-out';
    
    // Insert at the beginning of posts list
    if (postsContainer.firstChild) {
        postsContainer.insertBefore(newPost, postsContainer.firstChild);
    } else {
        postsContainer.appendChild(newPost);
    }
    
    // Increment post count in stats
    const postCountEl = document.querySelector('.community-stats .stat-item:nth-child(2) .stat-value');
    if (postCountEl) {
        const currentCount = parseInt(postCountEl.textContent, 10);
        postCountEl.textContent = (currentCount + 1).toString();
    }
}

// Export functions for use in other modules
window.createCommunityHub = createCommunityHub;
window.joinCommunity = joinCommunity;
window.connectSocial = connectSocial;
window.simulateSocialAuth = simulateSocialAuth;
window.viewTopic = viewTopic;
window.viewAllTopics = viewAllTopics;
window.initCommunity = initCommunity;
window.updateCommunityPosts = updateCommunityPosts;
