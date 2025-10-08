// GUARANTEED WORKING NAVIGATION - LOADED FIRST
console.log('🚀 Loading Homii navigation system...');

function showScreen(screenId) {
    console.log('🔄 Navigating to:', screenId);
    
    try {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            console.log('✅ Navigation successful:', screenId);
        } else {
            console.error('❌ Screen not found:', screenId);
        }
    } catch (error) {
        console.error('❌ Navigation error:', error);
        alert('Navigation error: ' + error.message);
    }
}

// Navigation functions
function navigateToSplash() { showScreen('splash'); }
function navigateToIntro() { showScreen('intro1'); }
function navigateToIntro1() { showScreen('intro1'); }
function navigateToIntro2() { showScreen('intro2'); }
function navigateToIntroBuild() { showScreen('intro-build'); }
function navigateToLogin() { showScreen('login'); }

// MULTIPLE CLICK HANDLERS FOR SPLASH SCREEN
function setupSplashClick() {
    console.log('🔧 Setting up splash click handlers...');
    
    const splash = document.getElementById('splash');
    if (!splash) {
        console.error('❌ Splash screen not found!');
        return;
    }

    // Method 1: Direct onclick
    splash.onclick = function(e) {
        console.log('🖱️ Splash clicked via onclick!');
        e.preventDefault();
        showScreen('intro1');
    };

    // Method 2: Event listener
    splash.addEventListener('click', function(e) {
        console.log('🖱️ Splash clicked via event listener!');
        e.preventDefault();
        showScreen('intro1');
    });

    // Method 3: Touch events for mobile
    splash.addEventListener('touchstart', function(e) {
        console.log('📱 Touch detected!');
        e.preventDefault();
        showScreen('intro1');
    });

    console.log('✅ Splash click handlers setup complete');
}

// Auto-advance timer
let autoAdvanceTimer = null;
function startAutoAdvance() {
    console.log('⏰ Starting 3-second auto-advance...');
    if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
    }
    autoAdvanceTimer = setTimeout(() => {
        console.log('⏰ Auto-advancing to intro1');
        showScreen('intro1');
    }, 3000);
}

// INITIALIZATION - SINGLE COMPREHENSIVE METHOD

// Mobile compatibility
document.addEventListener('deviceready', function() {
    console.log('📱 Device ready - mobile environment');
    setupSplashClick();
    startAutoAdvance();
}, false);

// Fallback initialization
window.addEventListener('load', function() {
    console.log('🌐 Window loaded - fallback initialization');
    setTimeout(() => {
        if (!document.querySelector('#splash').onclick) {
            console.log('🔧 Setting up fallback click handlers...');
            setupSplashClick();
        }
    }, 500);
});

console.log('✅ Navigation system loaded successfully');

// Cordova Device Ready Handler
document.addEventListener('deviceready', onDeviceReady, false);

// Browser fallback - if not running in Cordova
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing app');
    // Wait a bit to see if deviceready fires
    setTimeout(() => {
        if (!window.cordova) {
            console.log('Running in browser - initializing...');
            onDeviceReady();
        }
        setupSplashClick();
    }, 500);
});

function onDeviceReady() {
    console.log('Device is ready');
    if (window.cordova) {
        initializePushNotifications();
        requestLocationPermission();
    }
    
    // Initialize app
    console.log('Starting app - splash screen active');
    showScreen('splash');
    setupSplashClick();
    startAutoAdvance();
}

// Mobile Features Initialization
function initializePushNotifications() {
    if (window.PushNotification) {
        const push = PushNotification.init({
            android: {
                senderID: "YOUR_SENDER_ID", // Replace with your FCM Sender ID
                icon: 'notification_icon',
                iconColor: '#2196F3'
            }
        });

        push.on('registration', (data) => {
            console.log('Push registration token:', data.registrationId);
            // Store this token on your server
        });

        push.on('notification', (data) => {
            console.log('Push notification received:', data);
            if (data.additionalData.foreground) {
                // App is in foreground
                navigator.notification.alert(data.message, null, data.title, 'OK');
            }
        });

        push.on('error', (e) => {
            console.log('Push notification error:', e.message);
        });
    }
}

function requestLocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Location permission granted');
                window.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
            },
            (error) => {
                console.log('Location permission denied or error:', error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 600000 }
        );
    }
}

// Enhanced Camera Functions for Mobile
function capturePhoto() {
    if (navigator.camera) {
        const options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 600,
            allowEdit: true,
            correctOrientation: true
        };

        navigator.camera.getPicture(onCameraSuccess, onCameraError, options);
    } else {
        // Fallback to HTML5 file input
        document.getElementById('camera-input').click();
    }
}

function selectFromGallery() {
    if (navigator.camera) {
        const options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 800,
            targetHeight: 600,
            allowEdit: true
        };

        navigator.camera.getPicture(onCameraSuccess, onCameraError, options);
    } else {
        // Fallback to HTML5 file input
        document.getElementById('gallery-input').click();
    }
}

function onCameraSuccess(imageData) {
    const imageUrl = "data:image/jpeg;base64," + imageData;
    uploadedPhotos.push({
        id: Date.now(),
        url: imageUrl,
        timestamp: new Date().toISOString()
    });
    updatePhotoDisplay();
    navigator.notification.alert('Photo captured successfully!', null, 'Success', 'OK');
}

function onCameraError(message) {
    console.log('Camera error: ' + message);
    navigator.notification.alert('Failed to capture photo: ' + message, null, 'Camera Error', 'OK');
}

// Enhanced GPS Functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                window.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                if (navigator.notification) {
                    navigator.notification.alert(
                        `Location captured: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                        null,
                        'Location Found',
                        'OK'
                    );
                }
                
                // Update any location-dependent features
                updateNearbyArchitects();
            },
            (error) => {
                let errorMessage = 'Unable to get location: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Permission denied';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Position unavailable';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Request timeout';
                        break;
                }
                
                if (navigator.notification) {
                    navigator.notification.alert(errorMessage, null, 'Location Error', 'OK');
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
        );
    }
}

function updateNearbyArchitects() {
    // Update architect distances based on current location
    if (window.currentLocation) {
        console.log('Updating architect distances based on location:', window.currentLocation);
        // Implement distance calculation logic here
    }
}

// Send Push Notification (for testing)
function sendTestNotification() {
    if (window.PushNotification) {
        navigator.notification.alert('This is a test notification!', null, 'Test Notification', 'OK');
    }
}

// Global variables
let projects = JSON.parse(localStorage.getItem('homiiProjects')) || [];
let architects = [
    {
        id: 1,
        name: "Sarah Chen",
        specialty: "Modern Residential",
        experience: "12 years",
        rating: 4.8,
        projects: 85,
        price: "₹2,50,000",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b436?w=150&h=150&fit=crop&crop=face",
        portfolio: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300&h=200&fit=crop"
        ],
        bio: "Specializing in contemporary homes with sustainable design principles."
    },
    {
        id: 2,
        name: "Raj Patel",
        specialty: "Traditional & Heritage",
        experience: "15 years",
        rating: 4.9,
        projects: 120,
        price: "₹3,00,000",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        portfolio: [
            "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=300&h=200&fit=crop"
        ],
        bio: "Expert in blending traditional Indian architecture with modern amenities."
    },
    {
        id: 3,
        name: "Maya Singh",
        specialty: "Luxury Villas",
        experience: "10 years",
        rating: 4.7,
        projects: 45,
        price: "₹5,00,000",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        portfolio: [
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop",
            "https://images.unsplash.com/photo-1600563438938-a42d2c4e5b14?w=300&h=200&fit=crop"
        ],
        bio: "Creating stunning luxury homes with premium finishes and smart technology."
    }
];

let uploadedPhotos = [];
let currentProject = {
    id: null,
    name: '',
    type: '',
    area: '',
    budget: '',
    photos: [],
    boqFile: null,
    selectedArchitect: null,
    status: 'planning'
};

// Navigation helpers (showScreen function already defined above)

function navigateToProjectForm() {
    showScreen('project-form');
}

function navigateToProjectCreation() {
    showScreen('project-creation');
}

function navigateToHomeDetails() {
    showScreen('home-details-step1');
}

function navigateToArchitectSelection() {
    loadArchitects();
    showScreen('architect-selection');
}

function navigateToMyProjects() {
    loadMyProjects();
    showScreen('my-projects');
}

function navigateToProfile() {
    showScreen('profile');
}

function navigateToMessages() {
    showScreen('messages');
}

function navigateToChat() {
    showScreen('chat');
}

function navigateToSettings() {
    showScreen('settings');
}

function navigateToHelp() {
    showScreen('help');
}

function navigateToDashboard() { showScreen('dashboard'); }

// Project creation functions
function createProject() {
    const projectName = document.getElementById('project-name').value;
    
    if (!projectName.trim()) {
        alert('Please enter a project name');
        return;
    }
    
    currentProject.id = Date.now();
    currentProject.name = projectName;
    
    showScreen('home-details-step1');
}

function handleStep1(event) {
    event.preventDefault();
    const location = document.getElementById('location').value;
    currentProject.location = location;
    showScreen('home-details-step2');
}

function selectHouseType(type) {
    document.querySelectorAll('.house-type-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    const houseType = type;
    currentProject.type = houseType;
    showScreen('home-details-step3');
}

function handleStep3(event) {
    event.preventDefault();
    const area = document.getElementById('area-step3').value;
    currentProject.area = area;
    showScreen('home-details-step4');
}

function handleStep4(event) {
    event.preventDefault();
    const budget = document.getElementById('budget-step4').value;
    currentProject.budget = budget;
    
    // Project setup complete
    alert(`Project "${currentProject.name}" created successfully!`);
    showScreen('dashboard');
}

function handleBOQUpload(input) {
    const file = input.files[0];
    if (file) {
        currentProject.boqFile = file;
        document.getElementById('boq-status').innerHTML = `✅ ${file.name} uploaded successfully`;
    }
}

function addPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedPhotos.push({
                    id: Date.now(),
                    url: e.target.result,
                    name: file.name
                });
                updatePhotoDisplay();
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

function updatePhotoDisplay() {
    const container = document.getElementById('photo-container');
    if (!container) return;
    
    container.innerHTML = uploadedPhotos.map(photo => `
        <div class="photo-item">
            <img src="${photo.url}" alt="${photo.name}" onclick="viewPhoto('${photo.url}')">
            <button onclick="removePhoto(${photo.id})" class="remove-photo">×</button>
        </div>
    `).join('');
}

function removePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    updatePhotoDisplay();
}

function viewPhoto(url) {
    // Create modal to view full-size photo
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${url}" style="max-width: 100%; max-height: 100%;">
        </div>
    `;
    document.body.appendChild(modal);
}

// Architect functions
function loadArchitects() {
    const container = document.getElementById('architects-container');
    if (!container) return;
    
    container.innerHTML = architects.map(architect => `
        <div class="architect-card" onclick="selectArchitect(${architect.id})">
            <img src="${architect.image}" alt="${architect.name}" class="architect-image">
            <div class="architect-info">
                <h3>${architect.name}</h3>
                <p class="specialty">${architect.specialty}</p>
                <div class="architect-stats">
                    <span>⭐ ${architect.rating}</span>
                    <span>📁 ${architect.projects} projects</span>
                    <span>💰 ${architect.price}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function selectArchitect(architectId) {
    const architect = architects.find(a => a.id === architectId);
    currentProject.selectedArchitect = architect;
    
    // Show architect details
    showArchitectDetails(architect);
}

function showArchitectDetails(architect) {
    document.getElementById('architect-detail-name').textContent = architect.name;
    document.getElementById('architect-detail-image').src = architect.image;
    document.getElementById('architect-detail-specialty').textContent = architect.specialty;
    document.getElementById('architect-detail-experience').textContent = architect.experience;
    document.getElementById('architect-detail-rating').textContent = architect.rating;
    document.getElementById('architect-detail-projects').textContent = architect.projects;
    document.getElementById('architect-detail-price').textContent = architect.price;
    document.getElementById('architect-detail-bio').textContent = architect.bio;
    
    // Load portfolio
    const portfolioContainer = document.getElementById('architect-portfolio');
    portfolioContainer.innerHTML = architect.portfolio.map(img => `
        <img src="${img}" alt="Portfolio" class="portfolio-image">
    `).join('');
    
    showScreen('architect-detail');
}

function hireArchitect() {
    if (!currentProject.selectedArchitect) {
        alert('No architect selected');
        return;
    }
    
    // Save project
    projects.push(Object.assign({}, currentProject));
    localStorage.setItem('homiiProjects', JSON.stringify(projects));
    
    alert(`${currentProject.selectedArchitect.name} has been hired for your project!`);
    
    // Reset current project
    currentProject = {
        id: null,
        name: '',
        type: '',
        area: '',
        budget: '',
        photos: [],
        boqFile: null,
        selectedArchitect: null,
        status: 'planning'
    };
    
    showScreen('dashboard');
}

function loadMyProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    if (projects.length === 0) {
        container.innerHTML = '<p class="no-projects">No projects yet. Start your first project!</p>';
        return;
    }
    
    container.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.name}</h3>
            <p><strong>Type:</strong> ${project.type}</p>
            <p><strong>Area:</strong> ${project.area} sq ft</p>
            <p><strong>Budget:</strong> ₹${project.budget}</p>
            ${project.selectedArchitect ? `<p><strong>Architect:</strong> ${project.selectedArchitect.name}</p>` : ''}
            <div class="project-status ${project.status}">${project.status}</div>
        </div>
    `).join('');
}

// Messaging functions
function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatContainer = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${new Date().toLocaleTimeString()}</div>
    `;
    
    chatContainer.appendChild(messageElement);
    input.value = '';
    
    // Simulate architect response
    setTimeout(() => {
        const responseElement = document.createElement('div');
        responseElement.className = 'message architect-message';
        responseElement.innerHTML = `
            <div class="message-content">Thank you for your message. I'll review your requirements and get back to you soon.</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        chatContainer.appendChild(responseElement);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Settings functions
function updateProfile() {
    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;
    const phone = document.getElementById('profile-phone').value;
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify({
        name: name,
        email: email,
        phone: phone
    }));
    
    alert('Profile updated successfully!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        showScreen('login');
    }
}

// Load user profile on page load
function loadUserProfile() {
    const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    if (profile.name) {
        document.getElementById('profile-name').value = profile.name;
    }
    if (profile.email) {
        document.getElementById('profile-email').value = profile.email;
    }
    if (profile.phone) {
        document.getElementById('profile-phone').value = profile.phone;
    }
}

// App initialization will be handled by the main DOMContentLoaded listener at the end

// Notification functions
function scheduleReminder() {
    const message = document.getElementById('reminder-message').value;
    const time = document.getElementById('reminder-time').value;
    
    if (!message || !time) {
        alert('Please fill in all fields');
        return;
    }
    
    const reminderTime = new Date(time).getTime();
    const currentTime = new Date().getTime();
    const delay = reminderTime - currentTime;
    
    if (delay <= 0) {
        alert('Please select a future time');
        return;
    }
    
    setTimeout(() => {
        if (navigator.notification) {
            navigator.notification.alert(message, null, 'Reminder', 'OK');
        } else {
            alert(message);
        }
    }, delay);
    
    alert('Reminder scheduled successfully!');
    document.getElementById('reminder-message').value = '';
    document.getElementById('reminder-time').value = '';
}

// Enhanced photo management
function openCamera() {
    if (navigator.camera) {
        capturePhoto();
    } else {
        // Fallback for web browsers
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'camera';
        input.onchange = handleFileSelect;
        input.click();
    }
}

function openGallery() {
    if (navigator.camera) {
        selectFromGallery();
    } else {
        // Fallback for web browsers
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = handleFileSelect;
        input.click();
    }
}

function handleFileSelect(event) {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedPhotos.push({
                id: Date.now() + i,
                url: e.target.result,
                name: file.name,
                timestamp: new Date().toISOString()
            });
            updatePhotoDisplay();
        };
        
        reader.readAsDataURL(file);
    }
}

// Enhanced project management
function editProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        currentProject = Object.assign({}, project);
        showScreen('project-form');
    }
}

function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('homiiProjects', JSON.stringify(projects));
        loadMyProjects();
    }
}

function shareProject(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project && navigator.share) {
        navigator.share({
            title: `Homii Project: ${project.name}`,
            text: `Check out my ${project.type} project with ${project.area} sq ft area and ₹${project.budget} budget.`,
            url: window.location.href
        });
    } else {
        // Fallback for browsers without native sharing
        const shareText = `Check out my Homii project: ${project.name} - ${project.type}, ${project.area} sq ft, ₹${project.budget} budget.`;
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Project details copied to clipboard!');
        });
    }
}

// Enhanced search and filter
function searchArchitects() {
    const searchTerm = document.getElementById('architect-search').value.toLowerCase();
    const filteredArchitects = architects.filter(architect => 
        architect.name.toLowerCase().includes(searchTerm) ||
        architect.specialty.toLowerCase().includes(searchTerm)
    );
    
    displayArchitects(filteredArchitects);
}

function filterBySpecialty(specialty) {
    const filteredArchitects = specialty === 'all' 
        ? architects 
        : architects.filter(architect => architect.specialty.toLowerCase().includes(specialty.toLowerCase()));
    
    displayArchitects(filteredArchitects);
}

function displayArchitects(architectList) {
    const container = document.getElementById('architects-container');
    if (!container) return;
    
    container.innerHTML = architectList.map(architect => `
        <div class="architect-card" onclick="selectArchitect(${architect.id})">
            <img src="${architect.image}" alt="${architect.name}" class="architect-image">
            <div class="architect-info">
                <h3>${architect.name}</h3>
                <p class="specialty">${architect.specialty}</p>
                <div class="architect-stats">
                    <span>⭐ ${architect.rating}</span>
                    <span>📁 ${architect.projects} projects</span>
                    <span>💰 ${architect.price}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Performance monitoring
function trackUserAction(action, details = {}) {
    const event = {
        action: action,
        timestamp: new Date().toISOString(),
        details: details,
        userAgent: navigator.userAgent,
        url: window.location.href
    };
    
    console.log('User Action:', event);
    
    // Store in localStorage for analytics
    const analytics = JSON.parse(localStorage.getItem('homiiAnalytics') || '[]');
    analytics.push(event);
    
    // Keep only last 100 events
    if (analytics.length > 100) {
        analytics.splice(0, analytics.length - 100);
    }
    
    localStorage.setItem('homiiAnalytics', JSON.stringify(analytics));
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    trackUserAction('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
    });
});

// Performance tracking
window.addEventListener('load', function() {
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        trackUserAction('page_load', {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            domInteractive: perfData.domInteractive - perfData.fetchStart
        });
    }, 0);
});

// Auto-save functionality
function autoSaveProject() {
    if (currentProject.id) {
        localStorage.setItem('currentProject', JSON.stringify(currentProject));
    }
}

// Load auto-saved project
function loadAutoSavedProject() {
    const saved = localStorage.getItem('currentProject');
    if (saved) {
        currentProject = JSON.parse(saved);
    }
}

// Initialize auto-save
setInterval(autoSaveProject, 30000); // Auto-save every 30 seconds

// Main app initialization - consolidate with browser fallback
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Main DOM loaded - initializing app data');
    
    // Load user data
    loadAutoSavedProject();
    loadUserProfile();
    
    // Note: Splash screen setup is handled by the browser fallback listener above
});

console.log('✅ Homii app loaded successfully');