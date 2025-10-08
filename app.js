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

// INITIALIZATION - MULTIPLE METHODS
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded - initializing app');
    setTimeout(() => {
        setupSplashClick();
        startAutoAdvance();
    }, 100);
});

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
    if (navigator.notification) {
        navigator.notification.alert(
            'This is a test notification from Homii app!',
            null,
            'Test Notification',
            'OK'
        );
    }
}

// AI Expert System - Home Planning & Design Consultant
let chatMessages = [];
let isTyping = false;
let chatInitialized = false;
let conversationState = {
    currentFlow: null,
    step: 0,
    userResponses: {},
    context: {},
    projectData: {}
};

// Voice Recognition and Language Support
let isRecording = false;
let recognition = null;
let currentLanguage = 'en';
let speechSynthesis = window.speechSynthesis;

// Initialize Voice Recognition
function initializeVoiceRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        
        recognition.onstart = function() {
            isRecording = true;
            document.getElementById('voice-btn').classList.add('recording');
            document.getElementById('voice-icon').textContent = '⏹️';
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
            isRecording = false;
            document.getElementById('voice-btn').classList.remove('recording');
            document.getElementById('voice-icon').textContent = '🎤';
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            document.getElementById('voice-btn').classList.remove('recording');
            document.getElementById('voice-icon').textContent = '🎤';
        };
        
        recognition.onend = function() {
            isRecording = false;
            document.getElementById('voice-btn').classList.remove('recording');
            document.getElementById('voice-icon').textContent = '🎤';
        };
    }
}

// Toggle Voice Recognition
function toggleVoiceRecognition() {
    if (!recognition) {
        initializeVoiceRecognition();
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        recognition.start();
    }
}

// Toggle Language (English/Hindi)
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    const languageBtn = document.getElementById('language-text');
    const inputPlaceholder = document.getElementById('chat-input');
    const suggestionsText = document.getElementById('input-suggestions-text');
    
    if (currentLanguage === 'hi') {
        languageBtn.textContent = 'हि';
        inputPlaceholder.placeholder = 'आर्किटेक्ट, बढ़ई, योजना के बारे में पूछें...';
        suggestionsText.innerHTML = '💡 कोशिश करें: "पुणे में प्लंबर खोजें", "अलमारी डिज़ाइन विचार", "2BHK के लिए बजट"';
    } else {
        languageBtn.textContent = 'EN';
        inputPlaceholder.placeholder = 'Ask me about architects, carpenters, planning...';
        suggestionsText.innerHTML = '💡 Try: "Find plumbers in Pune", "Cupboard design ideas", "Budget for 2BHK"';
    }
    
    // Update voice recognition language
    if (recognition) {
        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    }
}

// Text-to-Speech Response (for Hindi support)
function speakResponse(text) {
    if (speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// Expert Knowledge Base - Home Design & Planning
const homeDesignExpertise = {
    roomPlanning: {
        bedroom: {
            minSize: "10x10 feet",
            idealSize: "12x12 feet",
            essentials: ["bed", "wardrobe", "study area", "ventilation"],
            designPrinciples: ["natural light", "cross ventilation", "privacy", "storage optimization"]
        },
        livingRoom: {
            minSize: "12x14 feet", 
            idealSize: "16x18 feet",
            essentials: ["seating area", "entertainment unit", "coffee table", "lighting"],
            designPrinciples: ["focal point", "conversation areas", "natural light", "circulation space"]
        },
        kitchen: {
            minSize: "8x10 feet",
            idealSize: "10x12 feet", 
            essentials: ["cooking area", "prep area", "storage", "washing area"],
            designPrinciples: ["work triangle", "storage accessibility", "ventilation", "counter space"]
        },
        bathroom: {
            minSize: "5x7 feet",
            idealSize: "6x8 feet",
            essentials: ["toilet", "basin", "shower/bathtub", "storage"],
            designPrinciples: ["waterproofing", "ventilation", "safety", "accessibility"]
        }
    },
    
    houseSizes: {
        "1BHK": { area: "400-600 sqft", rooms: 1, bathrooms: 1, ideal: "young professionals, couples" },
        "2BHK": { area: "600-900 sqft", rooms: 2, bathrooms: 2, ideal: "small families, couples" },
        "3BHK": { area: "900-1200 sqft", rooms: 3, bathrooms: 2, ideal: "families with children" },
        "4BHK": { area: "1200-1600 sqft", rooms: 4, bathrooms: 3, ideal: "large families" },
        "Villa": { area: "1500+ sqft", rooms: "3-5", bathrooms: "3-4", ideal: "luxury living" }
    },
    
    budgetEstimates: {
        basic: { perSqft: 1200, quality: "Basic materials, simple finishes" },
        standard: { perSqft: 1800, quality: "Good quality materials, standard finishes" },
        premium: { perSqft: 2500, quality: "High-quality materials, premium finishes" },
        luxury: { perSqft: 3500, quality: "Luxury materials, designer finishes" }
    },
    
    constructionPhases: {
        structure: { percentage: 40, description: "Foundation, walls, roof", duration: "3-4 months" },
        plumbing: { percentage: 10, description: "Water supply, drainage", duration: "2-3 weeks" },
        electrical: { percentage: 10, description: "Wiring, connections", duration: "2-3 weeks" },
        flooring: { percentage: 15, description: "Tiles, marble, wood", duration: "3-4 weeks" },
        painting: { percentage: 8, description: "Primer, paint, finishes", duration: "2-3 weeks" },
        fixtures: { percentage: 12, description: "Doors, windows, fittings", duration: "2-3 weeks" },
        finishing: { percentage: 5, description: "Final touches, cleanup", duration: "1-2 weeks" }
    },
    
    vaastuPrinciples: {
        entrance: "North, East, or Northeast direction",
        kitchen: "Southeast corner",
        masterBedroom: "Southwest corner", 
        puja: "Northeast corner",
        bathrooms: "Northwest or Southeast",
        staircase: "South, Southwest, or West"
    },
    
    climateConsiderations: {
        hot: {
            features: ["Cross ventilation", "High ceilings", "Sun shading", "Light colors"],
            materials: ["Hollow blocks", "Reflective roofing", "Insulation"]
        },
        humid: {
            features: ["Moisture control", "Ventilation", "Elevated foundation"],
            materials: ["Moisture-resistant materials", "Anti-fungal treatments"]
        },
        cold: {
            features: ["Insulation", "South-facing windows", "Thermal mass"],
            materials: ["Double glazing", "Insulated walls", "Carpeting"]
        }
    }
};

// Comprehensive Professional Database
const professionalDatabase = {
    architects: [
        {
            id: 'arch_001',
            name: "Priya Sharma",
            profession: "Architect",
            location: "Mumbai, India",
            distance: "2.6 km",
            rating: 4.9,
            reviews: 12,
            experience: "8+ years",
            specializations: ["Residential Design", "Modern Architecture", "Sustainable Design", "Interior Planning"],
            styles: ["Modern", "Traditional", "Contemporary", "Minimalist"],
            budget: "150k-300k",
            phone: "+91 98765 43210",
            email: "priya.architect@example.com",
            verified: true,
            portfolio: ["Modern Villa", "Traditional Bungalow", "Eco-friendly Apartment"],
            expertise: ["Kitchen Design", "Bathroom Planning", "Living Room Layout", "Bedroom Design"],
            about: "With over 8 years of experience in residential architecture, I specialize in creating homes that perfectly balance functionality with aesthetic appeal. My designs incorporate sustainable practices and respect for Indian building traditions."
        },
        {
            id: 'arch_002',
            name: "Rajesh Kumar",
            profession: "Architect", 
            location: "Pune, India",
            distance: "1.2 km",
            rating: 4.7,
            reviews: 8,
            experience: "6 years",
            specializations: ["Sustainable Architecture", "Commercial Design", "Renovation", "Space Planning"],
            styles: ["Sustainable", "Modern", "Industrial"],
            budget: "50k-150k",
            phone: "+91 98765 43211",
            email: "rajesh.architect@example.com",
            verified: true,
            portfolio: ["Green Building", "Office Complex", "Home Renovation"],
            expertise: ["Energy Efficiency", "Natural Lighting", "Space Optimization", "Green Materials"],
            about: "I'm passionate about creating eco-friendly buildings that reduce environmental impact while maximizing comfort and functionality. My approach combines traditional wisdom with modern sustainable technologies."
        },
        {
            id: 'arch_003',
            name: "Ananya Patel",
            profession: "Architect",
            location: "Bangalore, India", 
            distance: "3.8 km",
            rating: 4.8,
            reviews: 15,
            experience: "10+ years",
            specializations: ["Luxury Homes", "Villa Design", "Landscape Architecture", "Smart Homes"],
            styles: ["Luxury", "Contemporary", "Colonial", "Mediterranean"],
            budget: "300k-600k",
            phone: "+91 98765 43212",
            email: "ananya.architect@example.com",
            verified: true,
            portfolio: ["Luxury Villa", "Smart Home", "Garden Villa"],
            expertise: ["Smart Home Integration", "Luxury Finishes", "Landscape Design", "Pool Design"],
            about: "Specializing in luxury residential projects, I create homes that embody sophistication and cutting-edge technology. Each project is a unique masterpiece tailored to the client's lifestyle and preferences."
        }
    ],
    carpenters: [
        {
            id: 'carp_001',
            name: "Suresh Yadav",
            profession: "Carpenter",
            location: "Mumbai, India",
            distance: "1.8 km",
            rating: 4.6,
            reviews: 25,
            experience: "12+ years",
            specializations: ["Custom Furniture", "Kitchen Cabinets", "Wardrobes", "Doors & Windows"],
            services: ["Furniture Making", "Repair Work", "Installation", "Polish & Finishing"],
            budget: "5k-50k",
            phone: "+91 98765 43220",
            email: "suresh.carpenter@example.com",
            verified: true,
            portfolio: ["Modern Kitchen", "Wooden Wardrobe", "Study Table"],
            expertise: ["Teak Wood", "Plywood Work", "Laminate Finishing", "Hardware Installation"]
        },
        {
            id: 'carp_002',
            name: "Ravi Gupta",
            profession: "Carpenter",
            location: "Delhi, India",
            distance: "2.3 km",
            rating: 4.5,
            reviews: 18,
            experience: "9 years",
            specializations: ["Interior Carpentry", "Modular Kitchen", "Ceiling Work", "Partition Work"],
            services: ["Design Consultation", "Material Supply", "Installation", "Maintenance"],
            budget: "8k-80k",
            phone: "+91 98765 43221",
            email: "ravi.carpenter@example.com",
            verified: true,
            portfolio: ["Modular Kitchen", "False Ceiling", "Room Divider"],
            expertise: ["Modular Design", "Space Saving Solutions", "Multi-functional Furniture", "Quick Installation"]
        }
    ],
    plumbers: [
        {
            id: 'plumb_001',
            name: "Ramesh Singh",
            profession: "Plumber",
            location: "Mumbai, India",
            distance: "1.5 km",
            rating: 4.7,
            reviews: 30,
            experience: "15+ years",
            specializations: ["Bathroom Plumbing", "Kitchen Plumbing", "Drainage Systems", "Water Heater Installation"],
            services: ["New Installation", "Repair & Maintenance", "Leak Detection", "Pipe Replacement"],
            budget: "500-5k",
            phone: "+91 98765 43230",
            email: "ramesh.plumber@example.com",
            verified: true,
            portfolio: ["Complete Bathroom Setup", "Kitchen Pipeline", "Drainage System"],
            expertise: ["CPVC Pipes", "Copper Fitting", "Sanitaryware Installation", "Water Pressure Systems"]
        }
    ],
    painters: [
        {
            id: 'paint_001',
            name: "Arjun Mehta",
            profession: "Painter",
            location: "Pune, India",
            distance: "2.1 km",
            rating: 4.6,
            reviews: 22,
            experience: "10+ years",
            specializations: ["Wall Painting", "Texture Painting", "Exterior Painting", "Wood Polishing"],
            services: ["Color Consultation", "Surface Preparation", "Painting", "Touch-up Work"],
            budget: "15-50 per sqft",
            phone: "+91 98765 43240",
            email: "arjun.painter@example.com",
            verified: true,
            portfolio: ["Modern Home Paint", "Textured Wall", "Exterior Paint"],
            expertise: ["Asian Paints", "Berger Paints", "Texture Work", "Color Matching"]
        }
    ]
};

// Global variables for current project
let currentProject = {
    name: '',
    type: '',
    bedrooms: 0,
    area: 0,
    bathrooms: 0,
    location: '',
    familyInvites: [],
    budget: 0,
    boqFile: null
};

let uploadedPhotos = [];
let selectedPhotos = [];

// Navigation Functions
function goToMainMenu() {
    showScreen('main-menu');
    // Initialize main menu when shown
    updateMenuCounters();
}

function goToFindProfessionals() {
    showScreen('find-professionals');
}

function goToProjects() {
    showScreen('my-projects');
}

function goToProjectDetails() {
    showScreen('project-details');
    updateProjectDetails();
}

function goToProjectSchedule() {
    showScreen('project-schedule');
    updateProjectSchedule();
}

function goToProjectBudget() {
    showScreen('project-budget');
    updateProjectBudget();
}

function goToProjectPhotos() {
    showScreen('project-photos');
    updateProjectPhotos();
}

function goToProjectChat() {
    showScreen('project-chat');
    if (!chatInitialized) {
        initializeProjectChat();
    }
}

function goToSettings() {
    showScreen('app-settings');
}

function goToProfessionalDetails(professionalId) {
    showScreen('professional-details');
    loadProfessionalDetails(professionalId);
}

// Professional Search Functions
function searchProfessionals() {
    const profession = document.getElementById('profession-select').value;
    const location = document.getElementById('location-input').value;
    const budget = document.getElementById('budget-range').value;
    
    displaySearchResults(profession, location, budget);
}

function displaySearchResults(profession, location, budget) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    let professionals = [];
    
    // Filter professionals by type
    switch(profession) {
        case 'architect':
            professionals = professionalDatabase.architects;
            break;
        case 'carpenter':
            professionals = professionalDatabase.carpenters;
            break;
        case 'plumber':
            professionals = professionalDatabase.plumbers;
            break;
        case 'painter':
            professionals = professionalDatabase.painters;
            break;
        default:
            professionals = [
                ...professionalDatabase.architects,
                ...professionalDatabase.carpenters,
                ...professionalDatabase.plumbers,
                ...professionalDatabase.painters
            ];
    }
    
    // Filter by location if specified
    if (location) {
        professionals = professionals.filter(prof => 
            prof.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Display results
    professionals.forEach(professional => {
        const professionalCard = createProfessionalCard(professional);
        resultsContainer.appendChild(professionalCard);
    });
    
    if (professionals.length === 0) {
        resultsContainer.innerHTML = '<p class="no-results">No professionals found matching your criteria.</p>';
    }
}

function createProfessionalCard(professional) {
    const card = document.createElement('div');
    card.className = 'professional-card';
    card.onclick = () => goToProfessionalDetails(professional.id);
    
    card.innerHTML = `
        <div class="professional-header">
            <div class="professional-avatar">
                ${professional.name.charAt(0)}
            </div>
            <div class="professional-info">
                <h3>${professional.name}</h3>
                <p class="profession">${professional.profession}</p>
                <div class="rating">
                    ${'⭐'.repeat(Math.floor(professional.rating))} ${professional.rating} (${professional.reviews} reviews)
                </div>
            </div>
            ${professional.verified ? '<div class="verified-badge">✓</div>' : ''}
        </div>
        <div class="professional-details">
            <p class="location">📍 ${professional.location} • ${professional.distance}</p>
            <p class="experience">🏗️ ${professional.experience}</p>
            <p class="budget">💰 ${professional.budget}</p>
            <div class="specializations">
                ${professional.specializations.slice(0, 2).map(spec => 
                    `<span class="spec-tag">${spec}</span>`
                ).join('')}
            </div>
        </div>
    `;
    
    return card;
}

function loadProfessionalDetails(professionalId) {
    // Find professional in database
    const allProfessionals = [
        ...professionalDatabase.architects,
        ...professionalDatabase.carpenters,
        ...professionalDatabase.plumbers,
        ...professionalDatabase.painters
    ];
    
    const professional = allProfessionals.find(p => p.id === professionalId);
    
    if (professional) {
        updateProfessionalDetailsView(professional);
    }
}

function updateProfessionalDetailsView(professional) {
    document.getElementById('prof-name').textContent = professional.name;
    document.getElementById('prof-profession').textContent = professional.profession;
    document.getElementById('prof-rating').textContent = `${professional.rating} (${professional.reviews} reviews)`;
    document.getElementById('prof-location').textContent = professional.location;
    document.getElementById('prof-experience').textContent = professional.experience;
    document.getElementById('prof-budget').textContent = professional.budget;
    
    // About section
    document.getElementById('prof-about').textContent = professional.about || 'Experienced professional dedicated to quality work.';
    
    // Specializations
    const specializationsContainer = document.getElementById('prof-specializations');
    specializationsContainer.innerHTML = professional.specializations.map(spec => 
        `<span class="spec-tag">${spec}</span>`
    ).join('');
    
    // Portfolio
    const portfolioContainer = document.getElementById('prof-portfolio');
    portfolioContainer.innerHTML = professional.portfolio.map(work => 
        `<div class="portfolio-item">${work}</div>`
    ).join('');
    
    // Contact info
    document.getElementById('prof-phone').textContent = professional.phone;
    document.getElementById('prof-email').textContent = professional.email;
}

// Project Management Functions
function updateProjectDetails() {
    document.getElementById('project-name-display').textContent = currentProject.name || 'My Home Project';
    document.getElementById('project-type-display').textContent = currentProject.type || 'Villa';
    document.getElementById('project-area-display').textContent = currentProject.area || '1200 sqft';
    document.getElementById('project-location-display').textContent = currentProject.location || 'Mumbai, India';
}

let projectSteps = [
    { id: 'planning', name: 'Planning & Design', status: 'completed', progress: 100 },
    { id: 'permits', name: 'Permits & Approvals', status: 'in-progress', progress: 75 },
    { id: 'foundation', name: 'Foundation Work', status: 'upcoming', progress: 0 },
    { id: 'structure', name: 'Structure Construction', status: 'upcoming', progress: 0 },
    { id: 'plumbing', name: 'Plumbing & Electrical', status: 'upcoming', progress: 0 },
    { id: 'finishing', name: 'Finishing Work', status: 'upcoming', progress: 0 }
];

function updateProjectSchedule() {
    const stepsContainer = document.getElementById('project-steps');
    stepsContainer.innerHTML = '';
    
    projectSteps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.className = `project-step ${step.status}`;
        stepElement.onclick = () => showStepDetails(step.id);
        
        stepElement.innerHTML = `
            <div class="step-icon">
                ${step.status === 'completed' ? '✅' : 
                  step.status === 'in-progress' ? '🔄' : '⏳'}
            </div>
            <div class="step-info">
                <h4>${step.name}</h4>
                <div class="step-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${step.progress}%"></div>
                    </div>
                    <span class="progress-text">${step.progress}%</span>
                </div>
            </div>
        `;
        
        stepsContainer.appendChild(stepElement);
    });
}

function showStepDetails(stepId) {
    const step = projectSteps.find(s => s.id === stepId);
    if (step) {
        alert(`${step.name}\nStatus: ${step.status}\nProgress: ${step.progress}%`);
    }
}

// Authentication Functions
function handleGoogleLogin() {
    // Simulate Google login
    console.log('Google login initiated');
    setTimeout(() => {
        alert('Google login successful!');
        showScreen('home-setup');
    }, 1000);
}

function handleEmailLogin() {
    const email = document.getElementById('welcome-email').value;
    if (email) {
        console.log('Email login for:', email);
        showScreen('home-setup');
    } else {
        alert('Please enter your email address');
    }
}

function showOtherOptions() {
    alert('Other login options:\n- Phone number\n- Facebook\n- Apple ID\n\nFeatures coming soon!');
}

// Form handling functions
function handleStep1(event) {
    event.preventDefault();
    const homeName = document.getElementById('home-name-step1').value;
    if (homeName) {
        currentProject.name = homeName;
        showScreen('home-details-step2');
    }
}

function handleStep2(event) {
    event.preventDefault();
    currentProject.type = document.getElementById('home-type-step2').value;
    currentProject.bedrooms = document.getElementById('bedrooms-step2').value;
    currentProject.area = document.getElementById('square-feet-step2').value;
    currentProject.bathrooms = document.getElementById('bathrooms-step2').value;
    currentProject.location = document.getElementById('home-location-step2').value;
    showScreen('home-details-step3');
}

function handleStep3(event) {
    event.preventDefault();
    const familyEmail = document.getElementById('family-invite-step3').value;
    if (familyEmail) {
        currentProject.familyInvites.push(familyEmail);
    }
    showScreen('home-details-step4');
}

function handleStep4(event) {
    event.preventDefault();
    const budget = document.getElementById('budget-step4').value;
    currentProject.budget = budget;
    
    // Project setup complete
    alert(`Project "${currentProject.name}" created successfully!`);
    showScreen('main-menu');
}

function handleBOQUpload(input) {
    const file = input.files[0];
    if (file) {
        currentProject.boqFile = file;
        document.getElementById('boq-status').innerHTML = `✅ ${file.name} uploaded successfully`;
    }
}

// Photo management functions
function openPhotoCapture() {
    showScreen('photo-capture');
}

function openGallery() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = handlePhotoSelection;
    input.click();
}

function handlePhotoSelection(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedPhotos.push({
                id: Date.now() + Math.random(),
                url: e.target.result,
                file: file,
                timestamp: new Date().toISOString(),
                title: file.name,
                description: ''
            });
            updatePhotoDisplay();
        };
        reader.readAsDataURL(file);
    });
}

function takePhoto() {
    capturePhoto(); // Use the existing camera function
}

function updatePhotoDisplay() {
    const photosContainer = document.getElementById('captured-photos');
    const projectPhotosContainer = document.getElementById('project-photos-grid');
    
    if (photosContainer) {
        photosContainer.innerHTML = '';
        uploadedPhotos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-thumbnail';
            photoElement.onclick = () => showPhotoDetailModal(photo.url, photo.file);
            photoElement.innerHTML = `<img src="${photo.url}" alt="Photo">`;
            photosContainer.appendChild(photoElement);
        });
    }
    
    if (projectPhotosContainer) {
        projectPhotosContainer.innerHTML = '';
        uploadedPhotos.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.onclick = () => viewPhotoDetail(index);
            photoElement.innerHTML = `
                <img src="${photo.url}" alt="${photo.title || 'Photo'}">
                <div class="photo-info">
                    <h4>${photo.title || 'Untitled'}</h4>
                    <p>${new Date(photo.timestamp).toLocaleDateString()}</p>
                </div>
            `;
            projectPhotosContainer.appendChild(photoElement);
        });
    }
}

function showPhotoDetailModal(imageSrc, file) {
    // Create and show photo detail modal
    console.log('Showing photo detail for:', file.name);
}

function closePhotoDetailModal() {
    // Close photo detail modal
    console.log('Closing photo detail modal');
}

function savePhotoDetails() {
    // Save photo title and description
    console.log('Saving photo details');
    closePhotoDetailModal();
}

function deletePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(photo => photo.id !== photoId);
    updatePhotoDisplay();
}

function selectPhotoForReport(photoId) {
    const photo = uploadedPhotos.find(p => p.id === photoId);
    if (photo) {
        if (selectedPhotos.includes(photoId)) {
            selectedPhotos = selectedPhotos.filter(id => id !== photoId);
        } else {
            selectedPhotos.push(photoId);
        }
    }
}

function generatePhotoReport() {
    const selectedPhotoData = uploadedPhotos.filter(photo => 
        selectedPhotos.includes(photo.id)
    );
    
    console.log('Generating report with', selectedPhotoData.length, 'photos');
    alert(`Photo report generated with ${selectedPhotoData.length} photos!`);
}

function viewPhotoDetail(index) {
    const photo = uploadedPhotos[index];
    if (photo) {
        showScreen('photo-detail');
        document.getElementById('detail-photo').src = photo.url;
        document.getElementById('detail-title').value = photo.title || '';
        document.getElementById('detail-description').value = photo.description || '';
    }
}

// Budget management functions
let budgetItems = [
    { category: 'Construction', amount: 1500000, spent: 450000 },
    { category: 'Materials', amount: 800000, spent: 320000 },
    { category: 'Labor', amount: 600000, spent: 180000 },
    { category: 'Permits', amount: 100000, spent: 75000 },
    { category: 'Contingency', amount: 200000, spent: 0 }
];

function updateProjectBudget() {
    const budgetContainer = document.getElementById('budget-breakdown');
    const totalBudget = budgetItems.reduce((sum, item) => sum + item.amount, 0);
    const totalSpent = budgetItems.reduce((sum, item) => sum + item.spent, 0);
    
    // Update summary
    document.getElementById('total-budget').textContent = `₹${(totalBudget / 100000).toFixed(1)}L`;
    document.getElementById('total-spent').textContent = `₹${(totalSpent / 100000).toFixed(1)}L`;
    document.getElementById('remaining-budget').textContent = `₹${((totalBudget - totalSpent) / 100000).toFixed(1)}L`;
    
    // Update progress
    const progressPercentage = (totalSpent / totalBudget) * 100;
    document.getElementById('budget-progress-fill').style.width = `${progressPercentage}%`;
    document.getElementById('budget-progress-text').textContent = `${progressPercentage.toFixed(1)}%`;
    
    // Update breakdown
    budgetContainer.innerHTML = '';
    budgetItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'budget-item';
        const percentage = (item.spent / item.amount) * 100;
        
        itemElement.innerHTML = `
            <div class="budget-item-header">
                <h4>${item.category}</h4>
                <span class="budget-amount">₹${(item.amount / 100000).toFixed(1)}L</span>
            </div>
            <div class="budget-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <span class="progress-text">${percentage.toFixed(1)}%</span>
            </div>
            <div class="budget-details">
                <span>Spent: ₹${(item.spent / 100000).toFixed(1)}L</span>
                <span>Remaining: ₹${((item.amount - item.spent) / 100000).toFixed(1)}L</span>
            </div>
        `;
        
        budgetContainer.appendChild(itemElement);
    });
}

function addBudgetItem() {
    const category = prompt('Enter budget category:');
    const amount = parseFloat(prompt('Enter budget amount:'));
    
    if (category && amount) {
        budgetItems.push({
            category: category,
            amount: amount,
            spent: 0
        });
        updateProjectBudget();
    }
}

// Chat System Functions
function initializeProjectChat() {
    chatInitialized = true;
    const welcomeMessage = currentLanguage === 'hi' ? 
        "👋 नमस्ते! मैं आपका Homii AI असिस्टेंट हूँ। मैं आपके घर निर्माण, डिज़ाइन और योजना की सभी जरूरतों में मदद के लिए यहाँ हूँ। आप मुझसे इसके बारे में पूछ सकते हैं:\n\n🏗️ प्रोफेशनल ढूंढना (आर्किटेक्ट, बढ़ई, प्लंबर, पेंटर)\n🏠 घर डिज़ाइन की सलाह\n📐 योजना मार्गदर्शन\n💡 निर्माण टिप्स\n\nआप क्या जानना चाहते हैं?" :
        "👋 Hello! I'm your Homii AI Assistant. I'm here to help with all your home building, design, and planning needs. You can ask me about:\n\n🏗️ Finding professionals (architects, carpenters, plumbers, painters)\n🏠 Home design advice\n📐 Planning guidance\n💡 Construction tips\n\nWhat would you like to know?";
    
    addMessageToChat(welcomeMessage, 'ai');
}

// Make functions globally available for onclick handlers
window.sendMessage = function() {
    sendMessage();
}

window.addEventListener('DOMContentLoaded', function() {
    // Initialize chat when chat screen is first accessed
    const chatScreen = document.getElementById('project-chat');
    if (chatScreen) {
        new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (chatScreen.classList.contains('active') && !chatInitialized) {
                        setTimeout(() => initializeProjectChat(), 500);
                    }
                }
            });
        }).observe(chatScreen, { attributes: true });
    }
});

// Add enter key support for chat input
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && document.getElementById('chat-input') === document.activeElement) {
        event.preventDefault();
        sendMessage();
    }
});

function updateMenuCounters() {
    // Update various counters on the main menu
    document.getElementById('project-count').textContent = '1';
    document.getElementById('photo-count').textContent = uploadedPhotos.length.toString();
    document.getElementById('task-count').textContent = projectSteps.filter(step => step.status === 'in-progress').length.toString();
}

function updateProjectPhotos() {
    updatePhotoDisplay();
}

// Chat System - Enhanced Version
function sendChatMessage() {
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process AI response
    setTimeout(() => {
        const response = processUserMessage(message);
        hideTypingIndicator();
        addMessageToChat(response, 'ai');
        
        // Speak response if it's in Hindi or user prefers voice
        if (currentLanguage === 'hi' || message.includes('speak') || message.includes('बोलो')) {
            speakResponse(response);
        }
    }, 1000 + Math.random() * 2000);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content user-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${timestamp}</div>
            </div>
            <div class="message-avatar user-avatar">👤</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar ai-avatar">🤖</div>
            <div class="message-content ai-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const chatMessages = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message ai-message typing';
    typingDiv.innerHTML = `
        <div class="message-avatar ai-avatar">🤖</div>
        <div class="message-content ai-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Enhanced AI Processing Functions
function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // If we're in the middle of a conversation flow, continue it
    if (conversationState.currentFlow) {
        return continueConversationFlow(message);
    }
    
    // Home planning and design flows
    if (lowerMessage.includes('plan') && (lowerMessage.includes('home') || lowerMessage.includes('house'))) {
        return startHomePlanningFlow();
    }
    
    if (lowerMessage.includes('design') && (lowerMessage.includes('home') || lowerMessage.includes('house') || lowerMessage.includes('interior'))) {
        return startHomeDesignFlow();
    }
    
    // Budget planning flow
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('estimate')) {
        return startBudgetConsultationFlow();
    }
    
    // Room-specific design
    if (lowerMessage.includes('kitchen')) {
        return startKitchenDesignFlow();
    }
    
    if (lowerMessage.includes('bedroom')) {
        return startBedroomDesignFlow();
    }
    
    if (lowerMessage.includes('bathroom')) {
        return startBathroomDesignFlow();
    }
    
    if (lowerMessage.includes('living room') || lowerMessage.includes('hall')) {
        return startLivingRoomDesignFlow();
    }
    
    // Professional consultation flows
    if (lowerMessage.includes('carpenter') || lowerMessage.includes('cupboard') || lowerMessage.includes('furniture') || 
        lowerMessage.includes('बढ़ई') || lowerMessage.includes('अलमारी') || lowerMessage.includes('फर्नीचर') ||
        lowerMessage.includes('need carpenter') || lowerMessage.includes('बढ़ई चाहिए')) {
        return startCarpenterConsultationFlow();
    }
    
    if (lowerMessage.includes('architect')) {
        return startArchitectConsultationFlow();
    }
    
    if (lowerMessage.includes('plumber')) {
        return startPlumberConsultationFlow();
    }
    
    if (lowerMessage.includes('painter') || lowerMessage.includes('paint')) {
        return startPainterConsultationFlow();
    }
    
    if (lowerMessage.includes('electrician') || lowerMessage.includes('electrical')) {
        return startElectricianConsultationFlow();
    }
    
    // Construction advice
    if (lowerMessage.includes('construction') || lowerMessage.includes('building')) {
        return startConstructionAdviceFlow();
    }
    
    // Vastu consultation
    if (lowerMessage.includes('vastu') || lowerMessage.includes('direction')) {
        return startVastuConsultationFlow();
    }
    
    // Material advice
    if (lowerMessage.includes('material') || lowerMessage.includes('tiles') || lowerMessage.includes('flooring')) {
        return startMaterialAdviceFlow();
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
        lowerMessage.includes('namaste') || lowerMessage.includes('नमस्ते')) {
        return currentLanguage === 'hi' ? 
            "🏠 **स्वागत है! मैं आपका मास्टर होम प्लानिंग और डिज़ाइन एक्सपर्ट हूँ** 🏗️\n\nमेरे पास **20+ साल का वर्चुअल एक्सपर्टीज** है:\n\n🎯 **पूरी होम प्लानिंग**\n📐 **आर्किटेक्चरल डिज़ाइन**\n🎨 **इंटीरियर डिज़ाइन**\n💰 **बजट ऑप्टिमाइज़ेशन**\n🔧 **कन्स्ट्रक्शन गाइडेंस**\n🧭 **वास्तु कंसल्टेशन**\n📏 **स्पेस प्लानिंग**\n🏗️ **मटेरियल सेलेक्शन**\n\n**आज आप क्या प्लान या डिज़ाइन करना चाहते हैं?**\n\n💡 कोशिश करें: \"मेरे 3BHK घर की योजना बनाएं\", \"मेरी किचन डिज़ाइन करें\", \"कन्स्ट्रक्शन के लिए बजट\"" :
            "🏠 **Welcome! I'm your Master Home Planning & Design Expert** 🏗️\n\nI have **20+ years of virtual expertise** in:\n\n🎯 **Complete Home Planning**\n📐 **Architectural Design** \n🎨 **Interior Design**\n💰 **Budget Optimization**\n🔧 **Construction Guidance**\n🧭 **Vastu Consultation**\n📏 **Space Planning**\n🏗️ **Material Selection**\n\n**What would you like to plan or design today?**\n\n💡 Try: \"Plan my 3BHK home\", \"Design my kitchen\", \"Budget for construction\"";
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! 😊 As your dedicated home design expert, I'm always here to help you create your dream home. Feel free to ask about any planning, design, or construction needs!";
    }
    
    // Default expert response
    return currentLanguage === 'hi' ? 
        `🏠 **मैं आपका मास्टर होम डिज़ाइन और प्लानिंग एक्सपर्ट हूँ!** 🏗️\n\nमैं आपको व्यापक कंसल्टेशन में मदद कर सकता हूँ:\n\n🎯 **"मेरे घर की योजना बनाएं"** - शुरुआत से पूरी होम प्लानिंग\n📐 **"मेरे [कमरे] को डिज़ाइन करें"** - विस्तृत रूम डिज़ाइन कंसल्टेशन\n💰 **"बजट प्लानिंग"** - सटीक कॉस्ट एस्टिमेशन\n🔧 **"कन्स्ट्रक्शन एडवाइस"** - चरणबद्ध बिल्डिंग गाइडेंस\n🧭 **"वास्तु कंसल्टेशन"** - दिशा और प्लेसमेंट एडवाइस\n🎨 **"इंटीरियर डिज़ाइन"** - स्टाइल और डेकोर रेकमेंडेशन\n📏 **"स्पेस प्लानिंग"** - आपका लेआउट ऑप्टिमाइज़ करें\n🏗️ **"मटेरियल एडवाइस"** - आपकी जरूरतों के लिए बेस्ट मटेरियल\n\n**बस मुझे बताएं कि आप क्या प्लान या डिज़ाइन करना चाहते हैं, और मैं आपको हर डिटेल में गाइड करूँगा!**` :
        `🏠 **I'm your Master Home Design & Planning Expert!** 🏗️\n\nI can help you with comprehensive consultation:\n\n🎯 **"Plan my home"** - Complete house planning from scratch\n📐 **"Design my [room]"** - Detailed room design consultation  \n💰 **"Budget planning"** - Accurate cost estimation\n🔧 **"Construction advice"** - Step-by-step building guidance\n🧭 **"Vastu consultation"** - Direction and placement advice\n🎨 **"Interior design"** - Style and decor recommendations\n📏 **"Space planning"** - Optimize your layout\n🏗️ **"Material advice"** - Best materials for your needs\n\n**Just tell me what you want to plan or design, and I'll guide you through every detail!**`;
}

// Expert Consultation Flow Functions

function continueConversationFlow(message) {
    const flow = conversationState.currentFlow;
    const step = conversationState.step;
    
    // Store user response
    conversationState.userResponses[`step${step}`] = message;
    
    switch (flow) {
        case 'homePlanning':
            return continueHomePlanningFlow(message, step);
        case 'budgetConsultation':
            return continueBudgetConsultationFlow(message, step);
        case 'kitchenDesign':
            return continueKitchenDesignFlow(message, step);
        case 'bedroomDesign':
            return continueBedroomDesignFlow(message, step);
        case 'bathroomDesign':
            return continueBathroomDesignFlow(message, step);
        case 'carpenterConsultation':
            return continueCarpenterConsultationFlow(message, step);
        case 'architectConsultation':
            return continueArchitectConsultationFlow(message, step);
        default:
            return resetConversation();
    }
}

function startHomePlanningFlow() {
    conversationState.currentFlow = 'homePlanning';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🏠 **Welcome to Complete Home Planning Consultation!** 🏗️\n\nAs your expert architect, I'll help you plan your entire home from scratch. Let's start with the basics:\n\n**Question 1/9: What type of home are you planning?**\n\nA) 1BHK (400-600 sqft) - Young professionals\nB) 2BHK (600-900 sqft) - Small families  \nC) 3BHK (900-1200 sqft) - Families with children\nD) 4BHK (1200-1600 sqft) - Large families\nE) Villa (1500+ sqft) - Luxury living\nF) Other - Tell me your specific requirements\n\nJust type A, B, C, D, E, or F, or describe your needs!`;
}

function continueHomePlanningFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let houseType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('1bhk')) houseType = '1BHK';
            else if (lowerMessage.includes('b') || lowerMessage.includes('2bhk')) houseType = '2BHK';
            else if (lowerMessage.includes('c') || lowerMessage.includes('3bhk')) houseType = '3BHK';
            else if (lowerMessage.includes('d') || lowerMessage.includes('4bhk')) houseType = '4BHK';
            else if (lowerMessage.includes('e') || lowerMessage.includes('villa')) houseType = 'Villa';
            else houseType = 'Custom';
            
            conversationState.projectData.houseType = houseType;
            
            return `✅ Great choice! **${houseType}** is perfect for your needs.\n\n**Question 2/9: What's your total plot/carpet area in square feet?**\n\n💡 **Expert Tip:** \n• 1BHK needs 400-600 sqft\n• 2BHK needs 600-900 sqft  \n• 3BHK needs 900-1200 sqft\n• 4BHK needs 1200+ sqft\n\nPlease tell me your available area (e.g., "1000 sqft" or "50x40 feet")`;
            
        case 2:
            conversationState.step = 3;
            const area = extractAreaFromMessage(message);
            conversationState.projectData.area = area;
            
            return `📏 **${area} sqft** - Perfect! That's a good size for your ${conversationState.projectData.houseType}.\n\n**Question 3/9: How many family members will live in this home?**\n\n👨‍👩‍👧‍👦 This helps me plan:\n• Bedroom requirements\n• Bathroom needs\n• Storage space\n• Common areas\n\nJust tell me the number (e.g., "4 members" or "family of 5")`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.familySize = extractNumberFromMessage(message);
            
            return `👪 **${conversationState.projectData.familySize} family members** - Got it!\n\n**Question 4/9: What's your budget range for construction?**\n\nA) ₹8-15 Lakhs (Basic quality)\nB) ₹15-25 Lakhs (Standard quality)  \nC) ₹25-40 Lakhs (Premium quality)\nD) ₹40+ Lakhs (Luxury quality)\nE) Tell me your specific budget\n\n💰 **Expert Note:** Budget includes structure, finishes, but excludes furniture & land cost.`;
            
        case 4:
            conversationState.step = 5;
            let budgetRange = '';
            if (lowerMessage.includes('a')) budgetRange = '₹8-15 Lakhs (Basic)';
            else if (lowerMessage.includes('b')) budgetRange = '₹15-25 Lakhs (Standard)';
            else if (lowerMessage.includes('c')) budgetRange = '₹25-40 Lakhs (Premium)';
            else if (lowerMessage.includes('d')) budgetRange = '₹40+ Lakhs (Luxury)';
            else budgetRange = extractBudgetFromMessage(message);
            
            conversationState.projectData.budget = budgetRange;
            
            return `💰 **Budget: ${budgetRange}** - Excellent planning!\n\n**Question 5/9: What's your preferred architectural style?**\n\nA) Modern/Contemporary - Clean lines, minimal design\nB) Traditional/Indian - Cultural elements, courtyards\nC) Mediterranean - Arches, tiles, warm colors\nD) Colonial - Classic, symmetrical, elegant\nE) Minimalist - Simple, functional, less is more\nF) Mixed/Fusion - Combine multiple styles\n\nWhich style appeals to you most?`;
            
        case 5:
            conversationState.step = 6;
            let style = '';
            if (lowerMessage.includes('a')) style = 'Modern/Contemporary';
            else if (lowerMessage.includes('b')) style = 'Traditional/Indian';
            else if (lowerMessage.includes('c')) style = 'Mediterranean';
            else if (lowerMessage.includes('d')) style = 'Colonial';
            else if (lowerMessage.includes('e')) style = 'Minimalist';
            else style = 'Mixed/Fusion';
            
            conversationState.projectData.style = style;
            
            return `🎨 **${style} style** - Fantastic choice!\n\n**Question 6/9: What's your location/city?**\n\n🌍 **This helps me consider:**\n• Local climate factors\n• Building regulations\n• Material availability\n• Regional architectural preferences\n• Vastu considerations\n\nPlease tell me your city or region.`;
            
        case 6:
            conversationState.step = 7;
            conversationState.projectData.location = message;
            
            return `📍 **Location: ${message}** - Perfect!\n\n**Question 7/9: What are your top 3 priorities for this home?**\n\n🎯 **Popular Priorities:**\n• Natural lighting & ventilation\n• Privacy & security\n• Storage space optimization\n• Energy efficiency\n• Entertainment areas\n• Home office/study\n• Garden/outdoor space\n• Modern kitchen\n• Luxury bathrooms\n• Guest accommodation\n\nTell me your top 3 priorities!`;
            
        case 7:
            conversationState.step = 8;
            conversationState.projectData.priorities = message;
            
            return `✨ **Your priorities noted!** I'll design around these key elements.\n\n**Question 8/9: Any specific requirements or special features?**\n\n🏠 **Consider mentioning:**\n• Accessibility needs (elderly, differently-abled)\n• Home office requirements\n• Entertainment room/theater\n• Gym or wellness area\n• Pet-friendly features\n• Solar panels/green features\n• Swimming pool\n• Parking for multiple vehicles\n• Servant quarters\n• Special storage needs\n\nWhat special features do you want? (Or type "none" if no special requirements)`;
            
        case 8:
            conversationState.step = 9;
            conversationState.projectData.specialFeatures = message;
            
            return `🏗️ **Final Question 9/9: When do you plan to start construction?**\n\nA) Immediately (within 1-2 months)\nB) Soon (3-6 months)\nC) This year (6-12 months)\nD) Next year\nE) Just planning for now\n\n⏰ **Timeline affects:**\n• Design development schedule\n• Material procurement\n• Contractor selection\n• Permit processing\n• Budget finalization\n\nWhat's your preferred timeline?`;
            
        case 9:
            // Generate comprehensive home plan
            return generateComprehensiveHomePlan();
            
        default:
            return resetConversation();
    }
}

function generateComprehensiveHomePlan() {
    const data = conversationState.projectData;
    
    // Calculate recommendations based on inputs
    const costPerSqft = calculateCostPerSqft(data.budget, data.area);
    const designRecommendations = getDesignRecommendations(data.style);
    const roomLayout = generateRoomLayout(data.houseType, data.familySize, data.area);
    
    conversationState.currentFlow = null; // End conversation flow
    
    return `🎉 **COMPREHENSIVE HOME PLAN READY!** 🏠\n\n**📋 PROJECT SUMMARY:**\n🏠 **Type:** ${data.houseType}\n📏 **Area:** ${data.area} sqft\n👥 **Family:** ${data.familySize} members\n💰 **Budget:** ${data.budget}\n🎨 **Style:** ${data.style}\n📍 **Location:** ${data.location}\n\n**🏗️ RECOMMENDED LAYOUT:**\n${roomLayout}\n\n**💰 BUDGET BREAKDOWN:**\n• **Structure (40%):** ₹${(extractBudgetNumber(data.budget) * 0.4 / 100000).toFixed(1)}L\n• **Finishes (25%):** ₹${(extractBudgetNumber(data.budget) * 0.25 / 100000).toFixed(1)}L\n• **Plumbing & Electrical (15%):** ₹${(extractBudgetNumber(data.budget) * 0.15 / 100000).toFixed(1)}L\n• **Materials (20%):** ₹${(extractBudgetNumber(data.budget) * 0.2 / 100000).toFixed(1)}L\n\n**🎨 ${data.style.toUpperCase()} DESIGN ELEMENTS:**\n${designRecommendations}\n\n**⏰ CONSTRUCTION TIMELINE:**\n• **Design Development:** 4-6 weeks\n• **Approvals & Permits:** 6-8 weeks\n• **Construction:** 8-12 months\n• **Finishing:** 2-3 months\n\n**🎯 YOUR PRIORITIES INCORPORATED:**\n${data.priorities}\n\n**✨ SPECIAL FEATURES:**\n${data.specialFeatures}\n\n**🧭 VASTU RECOMMENDATIONS:**\n• Main entrance: Northeast/East\n• Kitchen: Southeast corner\n• Master bedroom: Southwest\n• Pooja room: Northeast\n\n**📞 NEXT STEPS:**\n1. **Architect selection** - I can help you find the perfect architect\n2. **Detailed drawings** - Floor plans, elevations, 3D views\n3. **Permit applications** - Building approvals\n4. **Contractor selection** - Verified builders\n\n**💬 Would you like me to help you with any specific aspect? I can:**\n• Find architects in your area\n• Detailed room-by-room design\n• Material selection guidance\n• Construction timeline planning\n• Budget optimization tips`;
}

// Helper functions for home planning
function extractAreaFromMessage(message) {
    const numbers = message.match(/\d+/g);
    if (numbers) {
        if (numbers.length === 1) {
            return numbers[0];
        } else if (numbers.length === 2) {
            return (parseInt(numbers[0]) * parseInt(numbers[1])).toString();
        }
    }
    return '1000'; // Default
}

function extractNumberFromMessage(message) {
    const numbers = message.match(/\d+/g);
    return numbers ? numbers[0] : '4';
}

function extractBudgetFromMessage(message) {
    const numbers = message.match(/\d+/g);
    if (numbers) {
        return `₹${numbers[0]} Lakhs`;
    }
    return '₹25 Lakhs';
}

function extractBudgetNumber(budgetString) {
    const numbers = budgetString.match(/\d+/g);
    return numbers ? parseInt(numbers[0]) * 100000 : 2500000;
}

function calculateCostPerSqft(budget, area) {
    const budgetNumber = extractBudgetNumber(budget);
    const areaNumber = parseInt(area);
    return Math.round(budgetNumber / areaNumber);
}

function generateRoomLayout(houseType, familySize, area) {
    const areaNum = parseInt(area);
    
    if (houseType === '1BHK') {
        return `• **Living + Dining:** 200 sqft\n• **Bedroom:** 120 sqft\n• **Kitchen:** 80 sqft\n• **Bathroom:** 40 sqft\n• **Balcony:** 60 sqft`;
    } else if (houseType === '2BHK') {
        return `• **Living Room:** 180 sqft\n• **Dining Area:** 100 sqft\n• **Master Bedroom:** 140 sqft\n• **Bedroom 2:** 120 sqft\n• **Kitchen:** 90 sqft\n• **Bathroom 1:** 45 sqft\n• **Bathroom 2:** 35 sqft\n• **Balconies:** 90 sqft`;
    } else if (houseType === '3BHK') {
        return `• **Living Room:** 220 sqft\n• **Dining Area:** 120 sqft\n• **Master Bedroom:** 160 sqft\n• **Bedroom 2:** 130 sqft\n• **Bedroom 3:** 120 sqft\n• **Kitchen:** 100 sqft\n• **Master Bathroom:** 50 sqft\n• **Common Bathroom:** 40 sqft\n• **Balconies:** 100 sqft\n• **Utility/Store:** 60 sqft`;
    } else {
        return `• **Living Room:** 280 sqft\n• **Dining Area:** 150 sqft\n• **Master Bedroom:** 180 sqft\n• **Bedroom 2:** 140 sqft\n• **Bedroom 3:** 130 sqft\n• **Bedroom 4:** 120 sqft\n• **Kitchen:** 120 sqft\n• **Master Bathroom:** 60 sqft\n• **Bathroom 2:** 45 sqft\n• **Bathroom 3:** 40 sqft\n• **Study/Office:** 100 sqft\n• **Utility:** 80 sqft\n• **Balconies:** 150 sqft`;
    }
}

function getDesignRecommendations(style) {
    const styleGuides = {
        'Modern/Contemporary': '\n• Clean lines and minimal ornamentation\n• Large windows for natural light\n• Open floor plans\n• Neutral color palette with bold accents\n• Modern materials like glass, steel, concrete\n• Flat or simple sloped roofs',
        'Traditional/Indian': '\n• Central courtyard or open space\n• Wooden elements and carved details\n• Warm earth tones and vibrant colors\n• Traditional tile work and patterns\n• Sloped roofs with clay tiles\n• Verandas and covered outdoor spaces',
        'Mediterranean': '\n• Stucco walls in warm earth tones\n• Red clay tile roofs\n• Arched windows and doorways\n• Wrought iron details\n• Outdoor terraces and courtyards\n• Natural stone accents',
        'Colonial': '\n• Symmetrical facade design\n• Columns and covered porches\n• Multi-pane windows with shutters\n• Classic proportions and details\n• Formal room arrangements\n• Traditional materials like brick and wood',
        'Minimalist': '\n• "Less is more" philosophy\n• Clean, uncluttered spaces\n• Monochromatic color schemes\n• Hidden storage solutions\n• Simple geometric forms\n• Quality over quantity in furnishings'
    };
    
    return styleGuides[style] || '\n• Custom style elements will be designed based on your preferences\n• Natural materials and neutral colors recommended\n• Functional and aesthetic balance maintained';
}

// Budget Consultation Flow
function startBudgetConsultationFlow() {
    conversationState.currentFlow = 'budgetConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `💰 **Professional Budget Consultation Started!** 📊\n\nAs your cost estimation expert, I'll help you plan a realistic budget for your project.\n\n**Question 1/6: What type of project do you need budget for?**\n\nA) New home construction\nB) Home renovation/remodeling\nC) Interior design only\nD) Specific room renovation\nE) Commercial space\nF) Other - Tell me about your project\n\nWhich option describes your project?`;
}

function continueBudgetConsultationFlow(message, step) {
    // Implementation similar to home planning flow
    // This would continue the budget consultation process
    return `💰 Budget consultation continues... Step ${step + 1}`;
}

// Kitchen Design Flow
function startKitchenDesignFlow() {
    conversationState.currentFlow = 'kitchenDesign';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🍳 **Professional Kitchen Design Consultation!** 👨‍🍳\n\nI'll help you create the perfect kitchen for your needs.\n\n**Question 1/7: What's your kitchen area/size?**\n\nA) Small (6x8 to 8x10 feet)\nB) Medium (8x10 to 10x12 feet)\nC) Large (10x12 to 12x15 feet)\nD) Very Large (12x15+ feet)\nE) I'll tell you exact dimensions\n\nWhat size kitchen are we designing?`;
}

function continueKitchenDesignFlow(message, step) {
    // Implementation for kitchen design consultation
    return `🍳 Kitchen design continues... Step ${step + 1}`;
}

// Carpenter Consultation Flow
function startCarpenterConsultationFlow() {
    conversationState.currentFlow = 'carpenterConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return currentLanguage === 'hi' ? 
        `🪑 **बढ़ई की सेवा चाहिए? मैं सही बढ़ई खोजने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसा काम करवाना है?**\n\n🛠️ **काम का प्रकार:**\n• अलमारी/वार्डरोब\n• किचन कैबिनेट\n• बेड/फर्नीचर\n• दरवाजे/खिड़कियां\n• मरम्मत का काम\n\nबताएं कि क्या काम है?` :
        `🪑 **Need a carpenter? I'll help you find the right one!**\n\n**Question 1/4: What type of work do you need?**\n\n🛠️ **Work Type:**\n• Cupboard/Wardrobe\n• Kitchen Cabinets\n• Bed/Furniture\n• Doors/Windows\n• Repair Work\n\nTell me what work you need?`;
}

function continueCarpenterConsultationFlow(message, step) {
    // Implementation for carpenter consultation
    return `🪑 Carpenter consultation continues... Step ${step + 1}`;
}

// Plumber Consultation Flow
function startPlumberConsultationFlow() {
    conversationState.currentFlow = 'plumberConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return currentLanguage === 'hi' ? 
        `🔧 **प्लंबर चाहिए? मैं अच्छे प्लंबर खोजने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसा काम है?**\n\n💧 **काम का प्रकार:**\n• नया प्लंबिंग इंस्टॉलेशन\n• लीकेज की मरम्मत\n• बाथरूम फिटिंग\n• किचन प्लंबिंग\n• गीजर इंस्टॉलेशन\n\nबताएं कि क्या काम है?` :
        `🔧 **Need a plumber? I'll help you find a good one!**\n\n**Question 1/4: What type of work is it?**\n\n💧 **Work Type:**\n• New plumbing installation\n• Leakage repair\n• Bathroom fitting\n• Kitchen plumbing\n• Geyser installation\n\nTell me what work you need?`;
}

// Painter Consultation Flow  
function startPainterConsultationFlow() {
    conversationState.currentFlow = 'painterConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return currentLanguage === 'hi' ? 
        `🎨 **पेंटर चाहिए? मैं बेस्ट पेंटर ढूंढने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसी पेंटिंग करवानी है?**\n\n🖌️ **पेंटिंग का प्रकार:**\n• पूरे घर की पेंटिंग\n• कमरे की पेंटिंग\n• एक्सटीरियर पेंटिंग\n• टेक्सचर पेंटिंग\n• वॉलपेपर लगवाना\n\nबताएं कि कैसी पेंटिंग है?` :
        `🎨 **Need a painter? I'll help you find the best one!**\n\n**Question 1/4: What type of painting work?**\n\n🖌️ **Painting Type:**\n• Whole house painting\n• Room painting\n• Exterior painting\n• Texture painting\n• Wallpaper installation\n\nTell me what painting work you need?`;
}

// Additional flow functions would be implemented similarly...

function startArchitectConsultationFlow() {
    return `🏗️ **Architect Consultation Started!** I'll help you find the perfect architect for your project.`;
}

function startElectricianConsultationFlow() {
    return `⚡ **Electrician Consultation Started!** I'll help you with electrical work needs.`;
}

function startConstructionAdviceFlow() {
    return `🏗️ **Construction Guidance Started!** I'll provide expert construction advice.`;
}

function startVastuConsultationFlow() {
    return `🧭 **Vastu Consultation Started!** I'll help you with Vastu compliance for your home.`;
}

function startMaterialAdviceFlow() {
    return `🏗️ **Material Selection Guidance Started!** I'll help you choose the best materials.`;
}

function startHomeDesignFlow() {
    return `🎨 **Home Design Consultation Started!** I'll help you design your dream home.`;
}

function startBedroomDesignFlow() {
    return `🛏️ **Bedroom Design Consultation Started!** I'll help you create the perfect bedroom.`;
}

function startBathroomDesignFlow() {
    return `🚿 **Bathroom Design Consultation Started!** I'll help you design a beautiful bathroom.`;
}

function startLivingRoomDesignFlow() {
    return `🛋️ **Living Room Design Consultation Started!** I'll help you create an amazing living space.`;
}

function resetConversation() {
    conversationState.currentFlow = null;
    conversationState.step = 0;
    conversationState.userResponses = {};
    conversationState.projectData = {};
    
    return `🔄 **Conversation Reset** - How can I help you today with your home planning and design needs?`;
}

// Enhanced Professional Services

// Professional Search & Recommendation System
function findNearbyProfessionals(profession, location, requirements) {
    let professionals = [];
    
    switch(profession.toLowerCase()) {
        case 'carpenter':
        case 'बढ़ई':
            professionals = professionalDatabase.carpenters;
            break;
        case 'plumber':
        case 'प्लंबर':
            professionals = professionalDatabase.plumbers;
            break;
        case 'painter':
        case 'पेंटर':
            professionals = professionalDatabase.painters;
            break;
        case 'architect':
        case 'आर्किटेक्ट':
            professionals = professionalDatabase.architects;
            break;
        default:
            professionals = [
                ...professionalDatabase.carpenters,
                ...professionalDatabase.plumbers,
                ...professionalDatabase.painters,
                ...professionalDatabase.architects
            ];
    }
    
    // Filter by location if specified
    if (location) {
        professionals = professionals.filter(prof => 
            prof.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    // Sort by rating and distance
    professionals.sort((a, b) => {
        const ratingDiff = b.rating - a.rating;
        if (Math.abs(ratingDiff) < 0.2) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        }
        return ratingDiff;
    });
    
    return professionals.slice(0, 3); // Return top 3
}

function generateDetailedBudgetEstimate() {
    const projectType = conversationState.projectData.houseType || '3BHK';
    const area = parseInt(conversationState.projectData.area) || 1000;
    const budget = extractBudgetNumber(conversationState.projectData.budget || '₹25 Lakhs');
    
    const costPerSqft = budget / area;
    
    return `💰 **DETAILED BUDGET BREAKDOWN**\n\n📊 **Project:** ${projectType} (${area} sqft)\n💵 **Total Budget:** ₹${(budget/100000).toFixed(1)}L\n📏 **Cost per sqft:** ₹${costPerSqft.toFixed(0)}\n\n**🏗️ PHASE-WISE BREAKDOWN:**\n\n**1. STRUCTURE (40% - ₹${(budget*0.4/100000).toFixed(1)}L)**\n• Foundation & Excavation: ₹${(budget*0.12/100000).toFixed(1)}L\n• Walls & Columns: ₹${(budget*0.15/100000).toFixed(1)}L\n• Roof & Slab: ₹${(budget*0.13/100000).toFixed(1)}L\n\n**2. FINISHES (25% - ₹${(budget*0.25/100000).toFixed(1)}L)**\n• Flooring: ₹${(budget*0.10/100000).toFixed(1)}L\n• Wall Finishes: ₹${(budget*0.08/100000).toFixed(1)}L\n• Ceiling: ₹${(budget*0.07/100000).toFixed(1)}L\n\n**3. PLUMBING & ELECTRICAL (15% - ₹${(budget*0.15/100000).toFixed(1)}L)**\n• Plumbing: ₹${(budget*0.08/100000).toFixed(1)}L\n• Electrical: ₹${(budget*0.07/100000).toFixed(1)}L\n\n**4. DOORS & WINDOWS (10% - ₹${(budget*0.10/100000).toFixed(1)}L)**\n• Main Door: ₹${(budget*0.03/100000).toFixed(1)}L\n• Internal Doors: ₹${(budget*0.04/100000).toFixed(1)}L\n• Windows: ₹${(budget*0.03/100000).toFixed(1)}L\n\n**5. CONTINGENCY (10% - ₹${(budget*0.10/100000).toFixed(1)}L)**\n• Unforeseen expenses\n• Material price fluctuation\n• Design changes\n\n**⏰ PAYMENT SCHEDULE:**\n• **Foundation (25%):** ₹${(budget*0.25/100000).toFixed(1)}L\n• **Structure (35%):** ₹${(budget*0.35/100000).toFixed(1)}L\n• **Finishes (25%):** ₹${(budget*0.25/100000).toFixed(1)}L\n• **Final (15%):** ₹${(budget*0.15/100000).toFixed(1)}L`;
}

// Advanced Carpenter Services
function handleCarpenterQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('cupboard') || lowerMessage.includes('wardrobe') || 
        lowerMessage.includes('अलमारी') || lowerMessage.includes('वार्डरोब')) {
        return startCupboardDesignFlow();
    }
    
    if (lowerMessage.includes('kitchen') || lowerMessage.includes('cabinet') ||
        lowerMessage.includes('किचन') || lowerMessage.includes('कैबिनेट')) {
        return startKitchenCabinetFlow();
    }
    
    if (lowerMessage.includes('furniture') || lowerMessage.includes('फर्नीचर')) {
        return startFurnitureDesignFlow();
    }
    
    return startGeneralCarpenterFlow();
}

function startCupboardDesignFlow() {
    return `🗄️ **Cupboard Design Consultation**\n\n**Tell me about your cupboard needs:**\n\n📐 **Size Options:**\n• 2-door (4-5 feet width)\n• 3-door (6-7 feet width)\n• 4-door (8+ feet width)\n• Corner cupboard\n• Wall-mounted\n\n🎨 **Design Styles:**\n• Modern with sliding doors\n• Traditional with swing doors\n• Walk-in wardrobe\n• Built-in wall cupboard\n\n💰 **Price Range:**\n• Basic laminate: ₹8,000-15,000\n• Premium laminate: ₹15,000-25,000\n• Wooden finish: ₹25,000-45,000\n• Luxury design: ₹45,000+\n\n**What type and size cupboard do you need?**`;
}

function startKitchenCabinetFlow() {
    return `🍳 **Kitchen Cabinet Design**\n\n**Let's design your perfect kitchen:**\n\n📏 **Kitchen Layout:**\n• Straight/Linear kitchen\n• L-shaped kitchen\n• U-shaped kitchen\n• Island kitchen\n• Parallel/Galley kitchen\n\n🎨 **Cabinet Styles:**\n• Modern handleless\n• Traditional with handles\n• Shaker style\n• Glass front cabinets\n• Open shelving combination\n\n💡 **Features:**\n• Soft-close hinges\n• Pull-out drawers\n• Corner solutions\n• Built-in organizers\n• Under-cabinet lighting\n\n💰 **Budget Range:**\n• Modular: ₹50,000-1,50,000\n• Semi-modular: ₹80,000-2,50,000\n• Fully customized: ₹1,50,000+\n\n**What's your kitchen size and layout preference?**`;
}

function startFurnitureDesignFlow() {
    return `🪑 **Custom Furniture Design**\n\n**What furniture piece do you need?**\n\n🛏️ **Bedroom Furniture:**\n• Bed with storage\n• Study table\n• Dressing table\n• Night stands\n• Chest of drawers\n\n🛋️ **Living Room:**\n• TV unit/Entertainment center\n• Coffee table\n• Sofa cum bed\n• Display units\n• Shoe rack\n\n📚 **Study/Office:**\n• Computer table\n• Bookshelves\n• Office chair\n• Filing cabinets\n• Study desk\n\n🍽️ **Dining:**\n• Dining table set\n• Crockery unit\n• Bar counter\n• Serving trolley\n\n**Which furniture piece interests you most?**`;
}

function startGeneralCarpenterFlow() {
    return `🔨 **General Carpentry Services**\n\n**I can help you find carpenters for:**\n\n🛠️ **Installation Work:**\n• Door & window fitting\n• Ceiling work\n• Partition walls\n• Staircase railing\n• Wall paneling\n\n🔧 **Repair Work:**\n• Door/window repair\n• Furniture repair\n• Loose joint fixing\n• Hardware replacement\n• Wood polishing\n\n🎨 **Finishing Work:**\n• Wood staining\n• Varnish application\n• Laminate work\n• Veneer application\n• Paint preparation\n\n💰 **Service Charges:**\n• Basic work: ₹300-500/day\n• Skilled work: ₹500-800/day\n• Expert craftsman: ₹800-1200/day\n\n**What specific carpentry work do you need?**`;
}

// Enhanced Professional Matching System
function matchProfessionalToRequirements(requirements, location, budget) {
    const professionals = findNearbyProfessionals('carpenter', location, requirements);
    
    let recommendations = professionals.map(prof => {
        let matchScore = 0;
        
        // Rating weight (40%)
        matchScore += (prof.rating / 5.0) * 40;
        
        // Experience weight (30%)
        const expYears = parseInt(prof.experience);
        matchScore += Math.min(expYears / 15.0, 1.0) * 30;
        
        // Specialization match (20%)
        const hasMatchingSpec = prof.specializations.some(spec => 
            requirements.toLowerCase().includes(spec.toLowerCase())
        );
        if (hasMatchingSpec) matchScore += 20;
        
        // Verification weight (10%)
        if (prof.verified) matchScore += 10;
        
        return {
            ...prof,
            matchScore: Math.round(matchScore)
        };
    });
    
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    
    return recommendations.slice(0, 3);
}

// Enhanced Chat Response System
function sendChatMessage() {
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process AI response
    setTimeout(() => {
        const response = processUserMessage(message);
        hideTypingIndicator();
        addMessageToChat(response, 'ai');
        
        // Speak response if it's in Hindi or user prefers voice
        if (currentLanguage === 'hi' || message.includes('speak') || message.includes('बोलो')) {
            speakResponse(response);
        }
    }, 1000 + Math.random() * 2000);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            <div class="message-content user-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${timestamp}</div>
            </div>
            <div class="message-avatar user-avatar">👤</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar ai-avatar">🤖</div>
            <div class="message-content ai-content">
                <div class="message-text">${message}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    const chatMessages = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'chat-message ai-message typing';
    typingDiv.innerHTML = `
        <div class="message-avatar ai-avatar">🤖</div>
        <div class="message-content ai-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Enhanced AI Processing Functions
function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // If we're in the middle of a conversation flow, continue it
    if (conversationState.currentFlow) {
        return continueConversationFlow(message);
    }
    
    // Home planning and design flows
    if (lowerMessage.includes('plan') && (lowerMessage.includes('home') || lowerMessage.includes('house'))) {
        return startHomePlanningFlow();
    }
    
    if (lowerMessage.includes('design') && (lowerMessage.includes('home') || lowerMessage.includes('house') || lowerMessage.includes('interior'))) {
        return startHomeDesignFlow();
    }
    
    // Budget planning flow
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('estimate')) {
        return startBudgetConsultationFlow();
    }
    
    // Room-specific design
    if (lowerMessage.includes('kitchen')) {
        return startKitchenDesignFlow();
    }
    
    if (lowerMessage.includes('bedroom')) {
        return startBedroomDesignFlow();
    }
    
    if (lowerMessage.includes('bathroom')) {
        return startBathroomDesignFlow();
    }
    
    if (lowerMessage.includes('living room') || lowerMessage.includes('hall')) {
        return startLivingRoomDesignFlow();
    }
    
    // Professional consultation flows
    if (lowerMessage.includes('carpenter') || lowerMessage.includes('cupboard') || lowerMessage.includes('furniture') || 
        lowerMessage.includes('बढ़ई') || lowerMessage.includes('अलमारी') || lowerMessage.includes('फर्नीचर') ||
        lowerMessage.includes('need carpenter') || lowerMessage.includes('बढ़ई चाहिए')) {
        return startCarpenterConsultationFlow();
    }
    
    if (lowerMessage.includes('architect')) {
        return startArchitectConsultationFlow();
    }
    
    if (lowerMessage.includes('plumber')) {
        return startPlumberConsultationFlow();
    }
    
    if (lowerMessage.includes('painter') || lowerMessage.includes('paint')) {
        return startPainterConsultationFlow();
    }
    
    if (lowerMessage.includes('electrician') || lowerMessage.includes('electrical')) {
        return startElectricianConsultationFlow();
    }
    
    // Construction advice
    if (lowerMessage.includes('construction') || lowerMessage.includes('building')) {
        return startConstructionAdviceFlow();
    }
    
    // Vastu consultation
    if (lowerMessage.includes('vastu') || lowerMessage.includes('direction')) {
        return startVastuConsultationFlow();
    }
    
    // Material advice
    if (lowerMessage.includes('material') || lowerMessage.includes('tiles') || lowerMessage.includes('flooring')) {
        return startMaterialAdviceFlow();
    }
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || 
        lowerMessage.includes('namaste') || lowerMessage.includes('नमस्ते')) {
        return currentLanguage === 'hi' ? 
            "🏠 **स्वागत है! मैं आपका मास्टर होम प्लानिंग और डिज़ाइन एक्सपर्ट हूँ** 🏗️\n\nमेरे पास **20+ साल का वर्चुअल एक्सपर्टीज** है:\n\n🎯 **पूरी होम प्लानिंग**\n📐 **आर्किटेक्चरल डिज़ाइन**\n🎨 **इंटीरियर डिज़ाइन**\n💰 **बजट ऑप्टिमाइज़ेशन**\n🔧 **कन्स्ट्रक्शन गाइडेंस**\n🧭 **वास्तु कंसल्टेशन**\n📏 **स्पेस प्लानिंग**\n🏗️ **मटेरियल सेलेक्शन**\n\n**आज आप क्या प्लान या डिज़ाइन करना चाहते हैं?**\n\n💡 कोशिश करें: \"मेरे 3BHK घर की योजना बनाएं\", \"मेरी किचन डिज़ाइन करें\", \"कन्स्ट्रक्शन के लिए बजट\"" :
            "🏠 **Welcome! I'm your Master Home Planning & Design Expert** 🏗️\n\nI have **20+ years of virtual expertise** in:\n\n🎯 **Complete Home Planning**\n📐 **Architectural Design** \n🎨 **Interior Design**\n💰 **Budget Optimization**\n🔧 **Construction Guidance**\n🧭 **Vastu Consultation**\n📏 **Space Planning**\n🏗️ **Material Selection**\n\n**What would you like to plan or design today?**\n\n💡 Try: \"Plan my 3BHK home\", \"Design my kitchen\", \"Budget for construction\"";
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! 😊 As your dedicated home design expert, I'm always here to help you create your dream home. Feel free to ask about any planning, design, or construction needs!";
    }
    
    // Default expert response
    return currentLanguage === 'hi' ? 
        `🏠 **मैं आपका मास्टर होम डिज़ाइन और प्लानिंग एक्सपर्ट हूँ!** 🏗️\n\nमैं आपको व्यापक कंसल्टेशन में मदद कर सकता हूँ:\n\n🎯 **"मेरे घर की योजना बनाएं"** - शुरुआत से पूरी होम प्लानिंग\n📐 **"मेरे [कमरे] को डिज़ाइन करें"** - विस्तृत रूम डिज़ाइन कंसल्टेशन\n💰 **"बजट प्लानिंग"** - सटीक कॉस्ट एस्टिमेशन\n🔧 **"कन्स्ट्रक्शन एडवाइस"** - चरणबद्ध बिल्डिंग गाइडेंस\n🧭 **"वास्तु कंसल्टेशन"** - दिशा और प्लेसमेंट एडवाइस\n🎨 **"इंटीरियर डिज़ाइन"** - स्टाइल और डेकोर रेकमेंडेशन\n📏 **"स्पेस प्लानिंग"** - आपका लेआउट ऑप्टिमाइज़ करें\n🏗️ **"मटेरियल एडवाइस"** - आपकी जरूरतों के लिए बेस्ट मटेरियल\n\n**बस मुझे बताएं कि आप क्या प्लान या डिज़ाइन करना चाहते हैं, और मैं आपको हर डिटेल में गाइड करूँगा!**` :
        `🏠 **I'm your Master Home Design & Planning Expert!** 🏗️\n\nI can help you with comprehensive consultation:\n\n🎯 **"Plan my home"** - Complete house planning from scratch\n📐 **"Design my [room]"** - Detailed room design consultation  \n💰 **"Budget planning"** - Accurate cost estimation\n🔧 **"Construction advice"** - Step-by-step building guidance\n🧭 **"Vastu consultation"** - Direction and placement advice\n🎨 **"Interior design"** - Style and decor recommendations\n📏 **"Space planning"** - Optimize your layout\n🏗️ **"Material advice"** - Best materials for your needs\n\n**Just tell me what you want to plan or design, and I'll guide you through every detail!**`;
}

// Advanced Budget Calculator
function generateDetailedBudgetReport() {
    const area = parseInt(conversationState.projectData.area) || 1000;
    const houseType = conversationState.projectData.houseType || '3BHK';
    
    const basicRate = 1200;
    const standardRate = 1800;
    const premiumRate = 2500;
    const luxuryRate = 3500;
    
    return `💰 **COMPREHENSIVE BUDGET CALCULATOR** 🏗️\n\n📏 **Project Details:**\n• Type: ${houseType}\n• Area: ${area} sqft\n\n**💵 BUDGET OPTIONS:**\n\n**🥉 BASIC QUALITY (₹${basicRate}/sqft)**\n• Total: ₹${(area * basicRate / 100000).toFixed(1)}L\n• Basic materials, simple finishes\n• Standard fixtures\n• Basic electrical & plumbing\n\n**🥈 STANDARD QUALITY (₹${standardRate}/sqft)**\n• Total: ₹${(area * standardRate / 100000).toFixed(1)}L\n• Good quality materials\n• Better finishes & fixtures\n• Improved electrical layout\n\n**🥇 PREMIUM QUALITY (₹${premiumRate}/sqft)**\n• Total: ₹${(area * premiumRate / 100000).toFixed(1)}L\n• High-quality materials\n• Premium finishes\n• Advanced electrical & smart features\n\n**💎 LUXURY QUALITY (₹${luxuryRate}/sqft)**\n• Total: ₹${(area * luxuryRate / 100000).toFixed(1)}L\n• Luxury materials & finishes\n• Designer fixtures\n• Complete smart home integration\n\n**📊 COST BREAKDOWN (Standard Quality):**\n• Structure: ₹${(area * standardRate * 0.4 / 100000).toFixed(1)}L (40%)\n• Finishes: ₹${(area * standardRate * 0.25 / 100000).toFixed(1)}L (25%)\n• Electrical & Plumbing: ₹${(area * standardRate * 0.15 / 100000).toFixed(1)}L (15%)\n• Doors & Windows: ₹${(area * standardRate * 0.10 / 100000).toFixed(1)}L (10%)\n• Contingency: ₹${(area * standardRate * 0.10 / 100000).toFixed(1)}L (10%)\n\n**⚠️ Additional Costs (Not Included):**\n• Land cost\n• Furniture & appliances\n• Landscaping\n• Solar panels (if required)\n• Swimming pool (if planned)\n\n💡 **Expert Tip:** Always keep 10-15% extra budget for unforeseen expenses!`;
}

// Enhanced Professional Services
function startEnhancedCarpenterFlow() {
    return `🪑 **प्रोफेशनल कार्पेंटर सर्विसेज** 🛠️\n\n**मैं आपको बेस्ट कार्पेंटर कनेक्ट करवाऊंगा:**\n\n**🔧 सर्विसेज अवेलेबल:**\n• **कस्टम फर्नीचर डिज़ाइन**\n• **किचन कैबिनेट्स** (मॉड्यूलर/कस्टम)\n• **वार्डरोब/अलमारी** (सभी साइज़)\n• **बेड डिज़ाइन** (स्टोरेज के साथ)\n• **TV यूनिट/एंटरटेनमेंट सेंटर**\n• **स्टडी टेबल** (कस्टम साइज़)\n• **डाइनिंग टेबल सेट**\n\n**💰 प्राइस रेंज:**\n• बेसिक क्वालिटी: ₹8,000-20,000\n• स्टैंडर्ड क्वालिटी: ₹20,000-50,000\n• प्रीमियम क्वालिटी: ₹50,000-1,00,000\n• लक्जरी डिज़ाइन: ₹1,00,000+\n\n**📱 कॉन्टैक्ट प्रोसेस:**\n1. आपकी रिक्वायरमेंट बताएं\n2. फ्री कोटेशन & डिज़ाइन मिलेगा\n3. वेरिफाइड कार्पेंटर कनेक्ट करवाएंगे\n4. वर्क कंप्लीट होने तक सपोर्ट मिलेगा\n\n**कौन सा काम करवाना है? डिटेल में बताएं।**`;
}

function startEnhancedPlumberFlow() {
    return `🔧 **प्रोफेशनल प्लंबिंग सर्विसेज** 💧\n\n**सभी प्रकार के प्लंबिंग वर्क के लिए एक्सपर्ट प्लंबर्स:**\n\n**🚿 सर्विसेज अवेलेबल:**\n• **नया प्लंबिंग इंस्टॉलेशन** (पूरा घर)\n• **बाथरूम कंप्लीट सेटअप**\n• **किचन प्लंबिंग** (सिंक, RO, वॉशर)\n• **गीजर इंस्टॉलेशन** (सभी ब्रांड्स)\n• **पाइप लीकेज रिपेयर**\n• **टॉयलेट सीट रिप्लेसमेंट**\n• **वॉटर प्रेशर सोल्यूशन**\n• **ड्रेनेज सिस्टम क्लीनिंग**\n\n**💰 सर्विस चार्जेस:**\n• एमरजेंसी रिपेयर: ₹300-800\n• नया इंस्टॉलेशन: ₹500-1500/पॉइंट\n• बाथरूम कंप्लीट: ₹15,000-40,000\n• किचन प्लंबिंग: ₹8,000-25,000\n\n**⚡ स्पेशल फीचर्स:**\n• 24x7 एमरजेंसी सर्विस\n• 1 साल की वारंटी\n• क्वालिटी मटेरियल गारंटी\n• फ्री साइट विजिट & एस्टिमेशन\n\n**आपको कौन सा प्लंबिंग वर्क करवाना है? एरिया और प्रॉब्लम बताएं।**`;
}

function startEnhancedPainterFlow() {
    return `🎨 **प्रोफेशनल पेंटिंग सर्विसेज** 🖌️\n\n**बेस्ट क्वालिटी पेंटिंग वर्क के लिए एक्सपर्ट पेंटर्स:**\n\n**🏠 पेंटिंग सर्विसेज:**\n• **इंटीरियर पेंटिंग** (कमरे, हॉल, किचन)\n• **एक्सटीरियर पेंटिंग** (बाहरी दीवारें)\n• **टेक्सचर पेंटिंग** (3D इफेक्ट)\n• **वुड पॉलिशिंग** (दरवाजे, खिड़कियां)\n• **वॉलपेपर इंस्टॉलेशन**\n• **वॉटरप्रूफिंग** (छत, बाथरूम)\n• **रस्ट ट्रीटमेंट** (मेटल सरफेस)\n\n**🎨 पेंट ब्रांड्स अवेलेबल:**\n• Asian Paints (रॉयल/एपेक्स)\n• Berger Paints (सिल्क/वेदर कोट)\n• Nerolac (एक्सेल/इम्प्रेशन)\n• Dulux (वेदरशील्ड)\n\n**💰 पेंटिंग रेट्स (Material + Labor):**\n• बेसिक पेंट: ₹12-18/sqft\n• प्रीमियम पेंट: ₹18-28/sqft\n• टेक्सचर पेंट: ₹25-45/sqft\n• वॉटरप्रूफिंग: ₹35-60/sqft\n\n**🔧 सर्विस इन्क्लूड्स:**\n• फ्री कलर कंसल्टेशन\n• वॉल प्रिपरेशन (पुट्टी, सैंडिंग)\n• 2 कोट्स एप्लिकेशन\n• क्लीनअप आफ्टर वर्क\n• 2 साल की वारंटी\n\n**कितना एरिया पेंट करवाना है और कौन सा टाइप चाहिए?**`;
}
