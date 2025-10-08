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
            expertise: ["Kitchen Design", "Bathroom Planning", "Living Room Layout", "Bedroom Design"]
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
            expertise: ["Energy Efficiency", "Natural Lighting", "Space Optimization", "Green Materials"]
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
            expertise: ["Smart Home Integration", "Luxury Finishes", "Landscape Design", "Pool Design"]
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
            specializations: ["Custom Furniture", "Kitchen Cabinets", "Wardrobes", "Wooden Flooring"],
            styles: ["Modern", "Traditional", "Custom"],
            budget: "20k-80k",
            phone: "+91 98765 43213",
            email: "suresh.carpenter@example.com",
            verified: true,
            portfolio: ["Modular Kitchen", "Walk-in Wardrobe", "Study Table"],
            expertise: ["Cupboard Design", "Kitchen Cabinets", "Bedroom Furniture", "Living Room Furniture", "Custom Storage"]
        },
        {
            id: 'carp_002',
            name: "Ramesh Singh",
            profession: "Carpenter",
            location: "Pune, India",
            distance: "2.1 km", 
            rating: 4.5,
            reviews: 18,
            experience: "8 years",
            specializations: ["Modular Furniture", "Office Furniture", "Repair Work", "Installation"],
            styles: ["Modular", "Contemporary", "Office"],
            budget: "15k-50k",
            phone: "+91 98765 43214",
            email: "ramesh.carpenter@example.com",
            verified: true,
            portfolio: ["Office Desk", "Modular Shelves", "Repair Work"],
            expertise: ["Modular Cupboards", "Office Furniture", "Furniture Repair", "Installation Services"]
        },
        {
            id: 'carp_003',
            name: "Vikram Joshi",
            profession: "Carpenter",
            location: "Delhi, India",
            distance: "5.2 km",
            rating: 4.8,
            reviews: 30,
            experience: "15+ years",
            specializations: ["Luxury Furniture", "Antique Restoration", "Custom Designs", "Wooden Interiors"],
            styles: ["Luxury", "Antique", "Custom", "Traditional"],
            budget: "40k-120k",
            phone: "+91 98765 43215",
            email: "vikram.carpenter@example.com",
            verified: true,
            portfolio: ["Luxury Bedroom Set", "Antique Cabinet", "Custom Dining Table"],
            expertise: ["Luxury Cupboards", "Antique Restoration", "Custom Woodwork", "Traditional Designs"]
        }
    ],
    plumbers: [
        {
            id: 'plumb_001',
            name: "Anil Kumar",
            profession: "Plumber",
            location: "Mumbai, India",
            distance: "1.5 km",
            rating: 4.4,
            reviews: 22,
            experience: "10 years",
            specializations: ["Bathroom Fitting", "Kitchen Plumbing", "Water Heater Installation", "Pipe Repair"],
            styles: ["Modern", "Standard"],
            budget: "5k-25k",
            phone: "+91 98765 43216",
            email: "anil.plumber@example.com",
            verified: true,
            portfolio: ["Bathroom Renovation", "Kitchen Plumbing", "Water System"],
            expertise: ["Bathroom Plumbing", "Kitchen Sinks", "Water Heaters", "Drainage Systems", "Pipe Installation"]
        },
        {
            id: 'plumb_002',
            name: "Mahesh Gupta",
            profession: "Plumber",
            location: "Pune, India",
            distance: "2.8 km",
            rating: 4.3,
            reviews: 16,
            experience: "7 years",
            specializations: ["Drainage Systems", "Water Supply", "Leak Repair", "Fixture Installation"],
            styles: ["Standard", "Emergency"],
            budget: "3k-15k",
            phone: "+91 98765 43217",
            email: "mahesh.plumber@example.com",
            verified: true,
            portfolio: ["Drainage Work", "Water Supply", "Leak Fixing"],
            expertise: ["Emergency Repairs", "Drainage Solutions", "Water Supply Systems", "Leak Detection"]
        },
        {
            id: 'plumb_003',
            name: "Deepak Sharma",
            profession: "Plumber",
            location: "Bangalore, India",
            distance: "4.1 km",
            rating: 4.7,
            reviews: 28,
            experience: "12+ years",
            specializations: ["Luxury Bathroom", "Smart Plumbing", "Solar Water Systems", "Swimming Pool"],
            styles: ["Luxury", "Smart", "Eco-friendly"],
            budget: "15k-60k",
            phone: "+91 98765 43218",
            email: "deepak.plumber@example.com",
            verified: true,
            portfolio: ["Luxury Bathroom", "Smart Home Plumbing", "Solar System"],
            expertise: ["Luxury Fixtures", "Smart Water Systems", "Solar Installations", "Pool Plumbing"]
        }
    ],
    painters: [
        {
            id: 'paint_001',
            name: "Ravi Verma",
            profession: "Painter",
            location: "Mumbai, India",
            distance: "2.2 km",
            rating: 4.5,
            reviews: 20,
            experience: "9 years",
            specializations: ["Interior Painting", "Exterior Painting", "Texture Work", "Wallpaper"],
            styles: ["Modern", "Traditional", "Textured"],
            budget: "8k-30k",
            phone: "+91 98765 43219",
            email: "ravi.painter@example.com",
            verified: true,
            portfolio: ["Living Room Paint", "Exterior House", "Textured Wall"],
            expertise: ["Wall Painting", "Ceiling Paint", "Texture Designs", "Color Consultation", "Wallpaper Installation"]
        },
        {
            id: 'paint_002',
            name: "Santosh Patil",
            profession: "Painter",
            location: "Pune, India",
            distance: "1.9 km",
            rating: 4.4,
            reviews: 14,
            experience: "6 years",
            specializations: ["Residential Painting", "Commercial Painting", "Wood Polishing", "Metal Painting"],
            styles: ["Residential", "Commercial"],
            budget: "5k-20k",
            phone: "+91 98765 43220",
            email: "santosh.painter@example.com",
            verified: true,
            portfolio: ["Home Painting", "Office Paint", "Wood Polish"],
            expertise: ["Room Painting", "Office Spaces", "Wood Finishes", "Metal Coatings"]
        },
        {
            id: 'paint_003',
            name: "Ajay Singh",
            profession: "Painter",
            location: "Delhi, India",
            distance: "6.8 km",
            rating: 4.6,
            reviews: 35,
            experience: "14+ years",
            specializations: ["Decorative Painting", "Artistic Work", "Restoration", "Specialty Finishes"],
            styles: ["Artistic", "Decorative", "Luxury"],
            budget: "15k-50k",
            phone: "+91 98765 43221",
            email: "ajay.painter@example.com",
            verified: true,
            portfolio: ["Artistic Mural", "Decorative Wall", "Restoration Work"],
            expertise: ["Artistic Designs", "Decorative Techniques", "Wall Art", "Specialty Coatings", "Restoration"]
        }
    ],
    electricians: [
        {
            id: 'elec_001',
            name: "Mohan Lal",
            profession: "Electrician",
            location: "Mumbai, India",
            distance: "1.7 km",
            rating: 4.6,
            reviews: 18,
            experience: "11 years",
            specializations: ["Home Wiring", "LED Installation", "Fan Installation", "Switch Boards"],
            styles: ["Modern", "Standard"],
            budget: "3k-18k",
            phone: "+91 98765 43222",
            email: "mohan.electrician@example.com",
            verified: true,
            portfolio: ["Home Wiring", "LED Setup", "Fan Installation"],
            expertise: ["Electrical Wiring", "Lighting Solutions", "Fan Installation", "Switch Installation", "Safety Systems"]
        },
        {
            id: 'elec_002',
            name: "Prakash Jain",
            profession: "Electrician",
            location: "Pune, India",
            distance: "3.1 km",
            rating: 4.5,
            reviews: 21,
            experience: "8 years",
            specializations: ["Smart Home", "Security Systems", "Solar Installation", "Automation"],
            styles: ["Smart", "Automated"],
            budget: "8k-35k",
            phone: "+91 98765 43223",
            email: "prakash.electrician@example.com",
            verified: true,
            portfolio: ["Smart Home Setup", "Security System", "Solar Panel"],
            expertise: ["Smart Lighting", "Home Automation", "Security Installation", "Solar Systems"]
        }
    ]
};

// App State Management
let currentUser = null;
let currentProject = null;
let selectedArchitects = [];
let uploadedPhotos = [];
let propertyAuditData = {};
let shortlistedProfessionals = [];
let selectedForComparison = [];
let currentPhotoIndex = 0;
let mediaRecorder = null;
let audioChunks = [];

// Mock architect data
const mockArchitects = [
    {
        id: 1,
        name: "Priya Sharma",
        location: "Mumbai, India",
        distance: "2.6 km",
        rating: 4.9,
        reviews: 12,
        bio: "Passionate about creating homes that blend modern aesthetics with traditional Indian architecture.",
        specialization: "Residential Design",
        experience: "8+ years",
        styles: ["Modern", "Traditional", "Contemporary"],
        budget: "150k-300k",
        avatar: "👩‍💼",
        portfolio: ["🏠", "🏡", "🏢"],
        services: ["Architecture Design", "Interior Design", "Project Management", "3D Visualization"],
        about: "With over 8 years of experience in residential architecture, I specialize in creating homes that perfectly balance functionality with aesthetic appeal. My designs incorporate sustainable practices and respect for Indian building traditions.",
        verified: true
    },
    {
        id: 2,
        name: "Rajesh Kumar",
        location: "Pune, India", 
        distance: "5.2 km",
        rating: 4.7,
        reviews: 8,
        bio: "Expert in sustainable architecture and energy-efficient design solutions for modern Indian homes.",
        specialization: "Sustainable Architecture",
        experience: "6 years",
        styles: ["Sustainable", "Modern", "Minimalist"],
        budget: "50k-150k",
        avatar: "👨‍💼",
        portfolio: ["🌿", "🏘️", "🏗️"],
        services: ["Sustainable Design", "Energy Consultation", "Green Building Certification"],
        about: "I focus on creating environmentally conscious designs that reduce energy consumption while maintaining comfort and style. Every project is an opportunity to build a better future.",
        verified: true
    },
    {
        id: 3,
        name: "Arun Mehta",
        location: "Mumbai, India",
        distance: "3.8 km", 
        rating: 4.8,
        reviews: 15,
        bio: "Specializing in luxury residential projects with a focus on contemporary Indian design.",
        specialization: "Luxury Residential",
        experience: "10+ years",
        styles: ["Contemporary", "Modern", "Luxury"],
        budget: "above-300k",
        avatar: "👨‍💻",
        portfolio: ["🏰", "🏖️", "🌆"],
        services: ["Luxury Design", "Custom Architecture", "High-end Interiors"],
        about: "With a decade of experience in luxury residential projects, I create bespoke architectural solutions that reflect my clients' lifestyle and aspirations.",
        verified: true
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('App loaded successfully');
    
    // Initialize the app
    initializeApp();
    
    // Add click handlers for all buttons
    setupEventListeners();
    
    // Add specific event listener for splash screen
    const splashScreen = document.getElementById('splash');
    if (splashScreen) {
        splashScreen.addEventListener('click', function() {
            console.log('Splash screen clicked');
            showScreen('intro1');
        });
    }
});

// Initialize Application
function initializeApp() {
    // Load saved data from localStorage
    loadUserData();
    loadProjectData();
    loadShortlistData();
    
    // Setup form validation
    setupFormValidation();
    
    // Initialize any required components
    initializeComponents();
}

// Simple, reliable navigation function
function showScreen(screenId) {
    console.log('Navigating to:', screenId);
    
    // Hide all screens
    const allScreens = document.querySelectorAll('.screen');
    console.log('Found screens:', allScreens.length);
    allScreens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        window.scrollTo(0, 0);
        
        // Update dashboard with user data when showing dashboard
        if (screenId === 'dashboard') {
            console.log('Updating dashboard names...');
            updateDashboardNames();
        }
        
        // Load notes list when showing notes list screen
        if (screenId === 'notes-list') {
            loadNotesList();
        }
        
        // Load architects when showing architect listing screen
        if (screenId === 'architect-listing') {
            loadProfessionals('architects');
        }
        
        console.log('Successfully navigated to:', screenId);
        console.log('Target screen classes:', targetScreen.className);
    } else {
        console.error('Screen not found:', screenId);
        console.log('Available screen IDs:', Array.from(document.querySelectorAll('.screen')).map(s => s.id));
    }
}

// Navigation Functions
function goToWelcome() {
    showScreen('welcome');
}

function goToLogin() {
    showScreen('login');
}

function goToSignup() {
    showScreen('signup');
}

function goToOnboarding() {
    showScreen('intro1');
}

function goToDashboard() {
    showScreen('main-menu');
}

function goToMainMenu() {
    showScreen('main-menu');
}

function goToStartProject() {
    showScreen('start-new-project');
}

function goToFindProfessionals() {
    showScreen('find-professionals-main');
}

function goToTrackProgress() {
    showScreen('track-progress-main');
}

// New Project Flow Functions
function goToProjectDetails() {
    showScreen('project-details-form');
}

function goToUploadPhotos() {
    showScreen('upload-photos');
}

function goToHomePathway() {
    showScreen('home-pathway');
}

function goToFindArchitect() {
    showScreen('find-professionals-main');
}

// Form Handling
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (email && password) {
        // Simulate login
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        saveUserData();
        showScreen('dashboard');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    if (email && password && password === confirmPassword) {
        // Simulate signup
        currentUser = {
            email: email,
            name: email.split('@')[0]
        };
        saveUserData();
        showScreen('onboarding1');
    }
}

// Step 1: Home Name Handling
function handleStep1(event) {
    event.preventDefault();
    const homeName = document.getElementById('home-name-step1').value;
    
    // Save step 1 data
    if (!currentProject) currentProject = {};
    currentProject.step1 = { homeName };
    saveProjectData();
    
    console.log('Step 1 completed, home name:', homeName);
    
    // Navigate to step 2
    showScreen('home-details-step2');
}

// Step 2: Home Details Handling
function handleStep2(event) {
    event.preventDefault();
    const formData = {
        homeType: document.getElementById('home-type-step2').value,
        bedrooms: document.getElementById('bedrooms-step2').value,
        squareFeet: document.getElementById('square-feet-step2').value,
        bathrooms: document.getElementById('bathrooms-step2').value,
        homeLocation: document.getElementById('home-location-step2').value
    };
    
    // Save step 2 data
    currentProject.step2 = formData;
    saveProjectData();
    
    // Navigate to step 3
    showScreen('home-details-step3');
}

// Step 3: Family Invitation Handling
function handleStep3(event) {
    event.preventDefault();
    const familyInvite = document.getElementById('family-invite-step3').value;
    
    // Save step 3 data
    currentProject.step3 = { familyInvite };
    saveProjectData();
    
    // Navigate to step 4
    showScreen('home-details-step4');
}

// Step 4: Budget Handling
function handleStep4(event) {
    event.preventDefault();
    const budget = document.getElementById('budget-step4').value;
    
    // Save step 4 data
    currentProject.step4 = { budget };
    saveProjectData();
    
    console.log('Step 4 completed, project setup finished');
    
    // Show congratulations and navigate to pathway
    showCongratulations();
}

// BOQ Upload Handling
function handleBOQUpload(input) {
    const file = input.files[0];
    const statusDiv = document.getElementById('boq-status');
    
    if (file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            statusDiv.textContent = 'File too large. Please choose a file under 10MB.';
            statusDiv.className = 'upload-status error';
            return;
        }
        
        // Success
        statusDiv.textContent = `✓ ${file.name} uploaded successfully`;
        statusDiv.className = 'upload-status success';
        
        // Store file reference
        if (!currentProject.step4) currentProject.step4 = {};
        currentProject.step4.boqFile = {
            name: file.name,
            size: file.size,
            type: file.type
        };
        saveProjectData();
    }
}

// Congratulations handler
function showCongratulations() {
    // For now, directly navigate to dashboard then pathway
    // This ensures the dashboard names are updated first
    console.log('Setup completed, navigating to dashboard then pathway');
    showScreen('dashboard');
    
    // Small delay to ensure dashboard loads before going to pathway
    setTimeout(() => {
        showScreen('home-pathway');
    }, 100);
}

// Phase selection handler
function selectPhase(phaseNumber) {
    console.log('Phase selected:', phaseNumber);
    
    // Update active tab
    const tabs = document.querySelectorAll('.phase-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    tabs[phaseNumber - 1]?.classList.add('active');
    
    // In a real app, this would load different phase content
    // For now, we'll just log the selection
}

// Step details handler
function showStepDetails(stepId) {
    console.log('Step details requested for:', stepId);
    // In a real app, this would show detailed step information
}

// Property audit screen placeholder
function showPropertyAudit() {
    console.log('Property audit screen - to be implemented');
    // This will be implemented with the detailed property audit flow
}

// Login Functions
function handleGoogleLogin() {
    // Simulate Google login
    console.log('Google login clicked');
    currentUser = {
        email: 'user@gmail.com',
        name: 'User',
        loginMethod: 'google'
    };
    saveUserData();
    showScreen('home-setup');
}

function handleEmailLogin() {
    const email = document.getElementById('welcome-email').value;
    if (email && email.includes('@')) {
        // Simulate email login
        currentUser = {
            email: email,
            name: email.split('@')[0],
            loginMethod: 'email'
        };
        saveUserData();
        showScreen('home-setup');
    } else {
        alert('Please enter a valid email address');
    }
}

function showOtherOptions() {
    // This could show additional login options like Apple, Facebook, etc.
    console.log('Show other login options');
    // For now, just show the existing login screen
    showScreen('login');
}

// Data Management for Shortlist
function loadShortlistData() {
    const saved = localStorage.getItem('homii-shortlist');
    if (saved) {
        shortlistedProfessionals = JSON.parse(saved);
    }
}

function saveShortlistData() {
    localStorage.setItem('homii-shortlist', JSON.stringify(shortlistedProfessionals));
}

// Data Management
function loadUserData() {
    const saved = localStorage.getItem('homii-user');
    if (saved) {
        currentUser = JSON.parse(saved);
        console.log('Loaded user data:', currentUser);
    }
}

function saveUserData() {
    localStorage.setItem('homii-user', JSON.stringify(currentUser));
    console.log('Saved user data:', currentUser);
}

function loadProjectData() {
    const saved = localStorage.getItem('homii-project');
    if (saved) {
        currentProject = JSON.parse(saved);
        console.log('Loaded project data:', currentProject);
    }
}

function saveProjectData() {
    localStorage.setItem('homii-project', JSON.stringify(currentProject));
    console.log('Saved project data:', currentProject);
}

// Update Dashboard Names
function updateDashboardNames() {
    try {
        // Get user name - try multiple sources
        let userName = 'User';
        if (currentUser && currentUser.name) {
            userName = currentUser.name;
        } else if (currentUser && currentUser.email) {
            userName = currentUser.email.split('@')[0];
        }
        
        // Get home name from project data
        let homeName = 'User\'s Home';
        if (currentProject && currentProject.step1 && currentProject.step1.homeName) {
            homeName = currentProject.step1.homeName;
        }
        
        // Update the dashboard elements
        const userNameElement = document.getElementById('dashboard-user-name');
        const homeNameElements = document.querySelectorAll('#dashboard-home-name');
        
        if (userNameElement) {
            userNameElement.textContent = userName + '!';
        }
        
        homeNameElements.forEach(element => {
            if (element) {
                element.textContent = homeName;
            }
        });
        
        console.log('Dashboard updated with user:', userName, 'home:', homeName);
    } catch (error) {
        console.error('Error updating dashboard names:', error);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Add any additional event listeners here
    console.log('Event listeners setup complete');
}

// Form Validation
function setupFormValidation() {
    // Add form validation logic here
    console.log('Form validation setup complete');
}

// Initialize Components
function initializeComponents() {
    // Initialize any additional components as needed
    console.log('Components initialized successfully');
}

// Back Navigation
function goBack() {
    // Simple back navigation - in a real app you'd maintain a navigation history
    window.history.back();
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('homii-user');
    showScreen('welcome');
}

// Site Survey Photo Functions
function openPhotoOptions() {
    document.getElementById('photo-modal').style.display = 'block';
}

function closePhotoModal() {
    document.getElementById('photo-modal').style.display = 'none';
}

function takePhoto() {
    document.getElementById('camera-input').click();
    closePhotoModal();
}

function selectFromGallery() {
    document.getElementById('gallery-input').click();
    closePhotoModal();
}

function handlePhotoCapture(input) {
    const files = input.files;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                currentPhotoIndex = uploadedPhotos.length;
                showPhotoDetailModal(e.target.result, file);
            };
            reader.readAsDataURL(file);
        }
    }
    input.value = ''; // Reset input
}

function showPhotoDetailModal(imageSrc, file) {
    const modal = document.getElementById('photo-detail-modal');
    const preview = document.getElementById('photo-preview');
    preview.innerHTML = `<img src="${imageSrc}" alt="Photo preview">`;
    modal.style.display = 'block';
}

function closePhotoDetailModal() {
    document.getElementById('photo-detail-modal').style.display = 'none';
    document.getElementById('room-tag').value = '';
    document.getElementById('photo-notes').value = '';
}

function savePhotoDetails() {
    const roomTag = document.getElementById('room-tag').value;
    const notes = document.getElementById('photo-notes').value;
    const imageSrc = document.querySelector('#photo-preview img').src;
    
    const photo = {
        id: Date.now(),
        src: imageSrc,
        roomTag: roomTag || 'Untagged',
        notes: notes,
        timestamp: new Date().toLocaleString()
    };
    
    uploadedPhotos.push(photo);
    updatePhotoDisplay();
    closePhotoDetailModal();
    updateNextButton();
}

function updatePhotoDisplay() {
    const photoCount = document.getElementById('photo-count');
    const syncStatus = document.getElementById('sync-status');
    const photoGrid = document.getElementById('photo-grid');
    
    photoCount.textContent = `${uploadedPhotos.length} Photos Uploaded`;
    syncStatus.textContent = uploadedPhotos.length > 0 ? '✅ All synced' : '📤 Ready to sync';
    
    photoGrid.innerHTML = '';
    uploadedPhotos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.src}" alt="Site photo">
            <div class="photo-tag">${photo.roomTag}</div>
            <button class="photo-delete" onclick="deletePhoto(${index})">×</button>
        `;
        photoItem.onclick = () => viewPhotoDetail(index);
        photoGrid.appendChild(photoItem);
    });
}

function deletePhoto(index) {
    uploadedPhotos.splice(index, 1);
    updatePhotoDisplay();
    updateNextButton();
}

function viewPhotoDetail(index) {
    const photo = uploadedPhotos[index];
    alert(`Room: ${photo.roomTag}\nNotes: ${photo.notes || 'No notes'}\nTime: ${photo.timestamp}`);
}

function updateNextButton() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.disabled = uploadedPhotos.length === 0;
    }
}

function goToNext() {
    if (uploadedPhotos.length > 0) {
        // Save photos to project data
        if (!currentProject) currentProject = {};
        currentProject.sitePhotos = uploadedPhotos;
        saveProjectData();
        
        showScreen('home-pathway');
    }
}

function toggleVoiceRecording() {
    const voiceIcon = document.getElementById('voice-icon');
    const voiceText = document.getElementById('voice-text');
    const voiceStatus = document.getElementById('voice-status');
    
    if (!isRecording) {
        // Start recording
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    audioChunks = [];
                    
                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data);
                    };
                    
                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                        voiceStatus.textContent = '✅ Voice note recorded';
                    };
                    
                    mediaRecorder.start();
                    isRecording = true;
                    voiceIcon.textContent = '⏹️';
                    voiceText.textContent = 'Stop Recording';
                    voiceStatus.textContent = '🔴 Recording...';
                })
                .catch(err => {
                    voiceStatus.textContent = '❌ Could not access microphone';
                });
        }
    } else {
        // Stop recording
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        isRecording = false;
        voiceIcon.textContent = '🎤';
        voiceText.textContent = 'Add Voice Note';
    }
}

// Architect Listing Functions
function selectProfessionalTab(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load professionals based on tab
    loadProfessionals(tabName);
}

function loadProfessionals(type = 'architects') {
    const list = document.getElementById('professionals-list');
    list.innerHTML = '';
    
    if (type === 'architects') {
        mockArchitects.forEach(architect => {
            const card = createProfessionalCard(architect);
            list.appendChild(card);
        });
    } else {
        list.innerHTML = `<div style="text-align: center; padding: 40px; color: #666;">
            ${type.charAt(0).toUpperCase() + type.slice(1)} coming soon!
        </div>`;
    }
}

function createProfessionalCard(architect) {
    const card = document.createElement('div');
    card.className = 'professional-card';
    const isArchitectShortlisted = isShortlisted(architect.id);
    
    card.innerHTML = `
        <div class="professional-header">
            <div class="professional-avatar">
                <div style="font-size: 30px; display: flex; align-items: center; justify-content: center; height: 100%;">
                    ${architect.avatar}
                </div>
            </div>
            <div class="professional-info">
                <div class="professional-name">${architect.name}</div>
                <div class="professional-location">${architect.location} | ${architect.distance}</div>
                <div class="professional-rating">
                    ⭐ ${architect.rating} (${architect.reviews} reviews)
                </div>
            </div>
        </div>
        <div class="professional-bio">${architect.bio}</div>
        <div class="professional-actions">
            <button class="btn btn-outline ${isArchitectShortlisted ? 'shortlisted' : ''}" 
                    onclick="shortlistArchitect(${architect.id})" 
                    style="${isArchitectShortlisted ? 'background-color: #4CAF50; color: white;' : ''}">
                ${isArchitectShortlisted ? 'Shortlisted' : 'Shortlist'}
            </button>
            <button class="btn btn-primary" onclick="viewArchitectProfile(${architect.id})">View work</button>
        </div>
    `;
    return card;
}

function isShortlisted(architectId) {
    return shortlistedProfessionals.some(p => p.id === architectId);
}

function shortlistArchitect(architectId) {
    const architect = mockArchitects.find(a => a.id === architectId);
    
    if (architect) {
        if (!isShortlisted(architectId)) {
            // Add to shortlist
            shortlistedProfessionals.push(architect);
            saveShortlistData();
            
            // Update all shortlist buttons for this architect
            updateShortlistButtons(architectId, true);
            
            // Show feedback
            showToast('Added to shortlist!');
        } else {
            // Remove from shortlist
            shortlistedProfessionals = shortlistedProfessionals.filter(p => p.id !== architectId);
            saveShortlistData();
            
            // Update all shortlist buttons for this architect
            updateShortlistButtons(architectId, false);
            
            // Show feedback
            showToast('Removed from shortlist!');
        }
    }
}

function updateShortlistButtons(architectId, isShortlisted) {
    // Find all shortlist buttons for this architect and update them
    const buttons = document.querySelectorAll(`button[onclick="shortlistArchitect(${architectId})"]`);
    buttons.forEach(button => {
        if (isShortlisted) {
            button.textContent = 'Shortlisted';
            button.classList.add('shortlisted');
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
        } else {
            button.textContent = 'Shortlist';
            button.classList.remove('shortlisted');
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    });
}

function viewArchitectProfile(architectId) {
    const architect = mockArchitects.find(a => a.id === architectId);
    if (architect) {
        displayArchitectProfile(architect);
        showScreen('architect-profile');
    }
}

function displayArchitectProfile(architect) {
    const content = document.getElementById('architect-profile-content');
    content.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar">
                <div style="font-size: 50px; display: flex; align-items: center; justify-content: center; height: 100%;">
                    ${architect.avatar}
                </div>
            </div>
            <div class="profile-name">${architect.name}</div>
            <div class="profile-specialization">${architect.specialization}</div>
            <div class="profile-rating">
                ⭐ ${architect.rating} (${architect.reviews} reviews) ${architect.verified ? '✅' : ''}
            </div>
            <div class="profile-location">${architect.location}</div>
        </div>
        
        <div class="profile-tabs">
            <button class="profile-tab active" onclick="showProfileTab('about')">About</button>
            <button class="profile-tab" onclick="showProfileTab('portfolio')">Portfolio</button>
            <button class="profile-tab" onclick="showProfileTab('services')">Services</button>
            <button class="profile-tab" onclick="showProfileTab('reviews')">Reviews</button>
        </div>
        
        <div id="profile-tab-content">
            <div class="profile-section">
                <h4>About</h4>
                <p>${architect.about}</p>
                <p><strong>Experience:</strong> ${architect.experience}</p>
                <p><strong>Specializes in:</strong> ${architect.styles.join(', ')}</p>
            </div>
        </div>
        
        <div class="profile-actions">
            <button class="btn btn-outline ${isShortlisted(architect.id) ? 'shortlisted' : ''}" 
                    onclick="shortlistArchitect(${architect.id})" 
                    style="${isShortlisted(architect.id) ? 'background-color: #4CAF50; color: white;' : ''}">
                ${isShortlisted(architect.id) ? 'Shortlisted' : 'Shortlist'}
            </button>
            <button class="btn btn-primary" onclick="contactArchitect(${architect.id})">Contact</button>
        </div>
    `;
}

function showProfileTab(tabName) {
    const tabs = document.querySelectorAll('.profile-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    const content = document.getElementById('profile-tab-content');
    const architect = mockArchitects.find(a => a.id === parseInt(document.querySelector('.profile-actions .btn-primary').onclick.toString().match(/\d+/)[0]));
    
    switch(tabName) {
        case 'about':
            content.innerHTML = `
                <div class="profile-section">
                    <h4>About</h4>
                    <p>${architect.about}</p>
                    <p><strong>Experience:</strong> ${architect.experience}</p>
                    <p><strong>Specializes in:</strong> ${architect.styles.join(', ')}</p>
                </div>
            `;
            break;
        case 'portfolio':
            content.innerHTML = `
                <div class="profile-section">
                    <h4>Portfolio</h4>
                    <div class="portfolio-grid">
                        ${architect.portfolio.map(item => `
                            <div class="portfolio-item">
                                <div style="height: 120px; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                                    ${item}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        case 'services':
            content.innerHTML = `
                <div class="profile-section">
                    <h4>Services Offered</h4>
                    <div class="services-list">
                        ${architect.services.map(service => `
                            <span class="service-tag">${service}</span>
                        `).join('')}
                    </div>
                </div>
            `;
            break;
        case 'reviews':
            content.innerHTML = `
                <div class="profile-section">
                    <h4>Client Reviews</h4>
                    <div style="text-align: center; padding: 20px; color: #666;">
                        Reviews coming soon!
                    </div>
                </div>
            `;
            break;
    }
}

function contactArchitect(architectId) {
    showToast('Contact feature coming soon!');
}

// Filter Functions
function showFilterModal() {
    document.getElementById('filter-modal').style.display = 'block';
}

function closeFilterModal() {
    document.getElementById('filter-modal').style.display = 'none';
}

function updateRadiusValue(value) {
    document.getElementById('radius-value').textContent = value;
}

function toggleStyle(button) {
    button.classList.toggle('selected');
}

function resetFilters() {
    // Reset all filter inputs
    document.getElementById('location-filter').value = '';
    document.getElementById('radius-slider').value = 25;
    updateRadiusValue(25);
    
    document.querySelectorAll('input[name="experience"]').forEach(input => input.checked = false);
    document.querySelectorAll('input[name="budget"]').forEach(input => input.checked = false);
    document.querySelectorAll('.style-btn').forEach(btn => btn.classList.remove('selected'));
}

function applyFilters() {
    // Collect filter values
    const location = document.getElementById('location-filter').value;
    const radius = document.getElementById('radius-slider').value;
    const experience = document.querySelector('input[name="experience"]:checked')?.value;
    const budget = document.querySelector('input[name="budget"]:checked')?.value;
    const styles = Array.from(document.querySelectorAll('.style-btn.selected')).map(btn => btn.textContent);
    
    // Update active filters display
    updateActiveFilters({ location, radius, experience, budget, styles });
    
    // Filter and display results
    filterArchitects({ location, radius, experience, budget, styles });
    
    closeFilterModal();
}

function updateActiveFilters(filters) {
    const container = document.getElementById('active-filters');
    container.innerHTML = '';
    
    if (filters.location) {
        container.innerHTML += `<span class="filter-chip">${filters.location} <span onclick="removeFilter(this)">×</span></span>`;
    }
    if (filters.experience) {
        container.innerHTML += `<span class="filter-chip">${filters.experience} Level <span onclick="removeFilter(this)">×</span></span>`;
    }
    if (filters.budget) {
        const budgetLabels = {
            'under-50k': 'Under ₹50K',
            '50k-150k': '₹50K-1.5L',
            '150k-300k': '₹1.5L-3L',
            'above-300k': 'Above ₹3L'
        };
        container.innerHTML += `<span class="filter-chip">${budgetLabels[filters.budget]} <span onclick="removeFilter(this)">×</span></span>`;
    }
    if (filters.styles && filters.styles.length > 0) {
        filters.styles.forEach(style => {
            container.innerHTML += `<span class="filter-chip">${style} <span onclick="removeFilter(this)">×</span></span>`;
        });
    }
}

function removeFilter(element) {
    element.parentElement.remove();
    // Re-apply remaining filters
    loadProfessionals('architects');
}

function filterArchitects(filters) {
    let filteredArchitects = [...mockArchitects];
    
    if (filters.budget) {
        filteredArchitects = filteredArchitects.filter(architect => architect.budget === filters.budget);
    }
    
    if (filters.styles && filters.styles.length > 0) {
        filteredArchitects = filteredArchitects.filter(architect => 
            filters.styles.some(style => architect.styles.includes(style))
        );
    }
    
    // Display filtered results
    const list = document.getElementById('professionals-list');
    list.innerHTML = '';
    
    if (filteredArchitects.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 40px; color: #666;">
            No architects found matching your criteria. Try adjusting your filters.
        </div>`;
    } else {
        filteredArchitects.forEach(architect => {
            const card = createProfessionalCard(architect);
            list.appendChild(card);
        });
    }
}

// Utility Functions
function showToast(message) {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        z-index: 10000;
        font-size: 14px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
}

// Write Notes functionality
function writeNotes() {
    showScreen('write-notes');
}

function saveNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteContent = document.getElementById('note-content').value;
    
    if (noteTitle.trim() === '' || noteContent.trim() === '') {
        showToast('Please enter both title and content for the note');
        return;
    }
    
    const note = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        timestamp: new Date().toLocaleString(),
        project: currentProject?.step1?.homeName || 'Current Project'
    };
    
    // Load existing notes
    let notes = JSON.parse(localStorage.getItem('homii-notes') || '[]');
    notes.unshift(note); // Add to beginning of array
    
    // Save to localStorage
    localStorage.setItem('homii-notes', JSON.stringify(notes));
    
    // Show success message
    showToast('Note saved successfully!');
    
    // Clear form
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    
    // Update notes list if visible
    loadNotesList();
}

function loadNotesList() {
    const notesList = document.getElementById('notes-list');
    if (!notesList) return;
    
    const notes = JSON.parse(localStorage.getItem('homii-notes') || '[]');
    
    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-state">
                <span style="font-size: 48px;">📝</span>
                <h3>No notes yet</h3>
                <p>Start writing your thoughts and ideas</p>
            </div>
        `;
        return;
    }
    
    notesList.innerHTML = notes.map(note => `
        <div class="note-item">
            <div class="note-header">
                <h4 class="note-title">${note.title}</h4>
                <span class="note-date">${note.timestamp}</span>
            </div>
            <p class="note-content">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</p>
            <div class="note-footer">
                <span class="note-project">${note.project}</span>
                <button class="btn-delete" onclick="deleteNote(${note.id})" title="Delete note">🗑️</button>
            </div>
        </div>
    `).join('');
}

function deleteNote(noteId) {
    if (confirm('Are you sure you want to delete this note?')) {
        let notes = JSON.parse(localStorage.getItem('homii-notes') || '[]');
        notes = notes.filter(note => note.id !== noteId);
        localStorage.setItem('homii-notes', JSON.stringify(notes));
        loadNotesList();
        showToast('Note deleted');
    }
}

function goToDesignBrief() {
    showScreen('design-brief');
}

// Initialize architect listing when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProfessionals('architects');
});

// Make functions globally available for onclick handlers
window.showScreen = showScreen;
window.goToWelcome = goToWelcome;
window.goToLogin = goToLogin;
window.goToSignup = goToSignup;
window.goToOnboarding = goToOnboarding;
window.goToDashboard = goToDashboard;
window.goToMainMenu = goToMainMenu;
window.goToStartProject = goToStartProject;
window.goToFindProfessionals = goToFindProfessionals;
window.goToTrackProgress = goToTrackProgress;
window.goToProjectDetails = goToProjectDetails;
window.goToUploadPhotos = goToUploadPhotos;
window.goToHomePathway = goToHomePathway;
window.goToFindArchitect = goToFindArchitect;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.handleStep1 = handleStep1;
window.handleStep2 = handleStep2;
window.handleStep3 = handleStep3;
window.handleStep4 = handleStep4;
window.handleBOQUpload = handleBOQUpload;
window.selectPhase = selectPhase;
window.showStepDetails = showStepDetails;
window.showPropertyAudit = showPropertyAudit;
window.handleGoogleLogin = handleGoogleLogin;
window.handleEmailLogin = handleEmailLogin;
window.showOtherOptions = showOtherOptions;
window.goBack = goBack;
window.logout = logout;

// Site Survey Functions
window.openPhotoOptions = openPhotoOptions;
window.closePhotoModal = closePhotoModal;
window.takePhoto = takePhoto;
window.selectFromGallery = selectFromGallery;
window.handlePhotoCapture = handlePhotoCapture;
window.showPhotoDetailModal = showPhotoDetailModal;
window.closePhotoDetailModal = closePhotoDetailModal;
window.savePhotoDetails = savePhotoDetails;
window.deletePhoto = deletePhoto;
window.viewPhotoDetail = viewPhotoDetail;
window.goToNext = goToNext;
window.toggleVoiceRecording = toggleVoiceRecording;

// Architect Functions  
window.selectProfessionalTab = selectProfessionalTab;
window.shortlistArchitect = shortlistArchitect;
window.viewArchitectProfile = viewArchitectProfile;
window.showProfileTab = showProfileTab;
window.contactArchitect = contactArchitect;
window.showFilterModal = showFilterModal;
window.closeFilterModal = closeFilterModal;
window.updateRadiusValue = updateRadiusValue;
window.toggleStyle = toggleStyle;
window.resetFilters = resetFilters;
window.applyFilters = applyFilters;
window.removeFilter = removeFilter;

// AI Chatbot System
function initializeChatbot() {
    if (!chatInitialized) {
        const welcomeMessage = currentLanguage === 'hi' ? 
            "👋 नमस्ते! मैं आपका Homii AI असिस्टेंट हूँ। मैं आपके घर निर्माण, डिज़ाइन और योजना की सभी जरूरतों में मदद के लिए यहाँ हूँ। आप मुझसे इसके बारे में पूछ सकते हैं:\n\n🏗️ प्रोफेशनल ढूंढना (आर्किटेक्ट, बढ़ई, प्लंबर, पेंटर)\n🏠 घर डिज़ाइन की सलाह\n📐 योजना मार्गदर्शन\n💡 निर्माण टिप्स\n\nआप क्या जानना चाहते हैं?" :
            "👋 Hello! I'm your Homii AI Assistant. I'm here to help you with all your home construction, design, and planning needs. You can ask me about:\n\n🏗️ Finding professionals (architects, carpenters, plumbers, painters)\n🏠 Home design advice\n📐 Planning guidance\n💡 Construction tips\n\nWhat would you like to know?";
            
        chatMessages = [
            {
                sender: 'bot',
                message: welcomeMessage,
                timestamp: new Date().toLocaleTimeString()
            }
        ];
        chatInitialized = true;
    }
    displayChatMessages();
}

function displayChatMessages() {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;
    
    chatContainer.innerHTML = '';
    
    chatMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sender}-message`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${msg.message}</div>
                <div class="message-time">${msg.timestamp}</div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('chat-input');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    chatMessages.push({
        sender: 'user',
        message: message,
        timestamp: new Date().toLocaleTimeString()
    });
    
    messageInput.value = '';
    displayChatMessages();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and generate response
    setTimeout(() => {
        const response = processUserMessage(message);
        hideTypingIndicator();
        
        chatMessages.push({
            sender: 'bot',
            message: response,
            timestamp: new Date().toLocaleTimeString()
        });
        
        displayChatMessages();
    }, 1000 + Math.random() * 2000); // Simulate thinking time
}

function showTypingIndicator() {
    isTyping = true;
    const chatContainer = document.getElementById('chat-messages');
    
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message bot-message typing';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

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
        `🏠 **I'm your Master Home Design & Planning Expert!** 🏗️\n\nI can help you with comprehensive consultation:\n\n🎯 **\"Plan my home\"** - Complete house planning from scratch\n📐 **\"Design my [room]\"** - Detailed room design consultation  \n💰 **\"Budget planning\"** - Accurate cost estimation\n🔧 **\"Construction advice\"** - Step-by-step building guidance\n🧭 **\"Vastu consultation\"** - Direction and placement advice\n🎨 **\"Interior design\"** - Style and decor recommendations\n📏 **\"Space planning\"** - Optimize your layout\n🏗️ **\"Material advice\"** - Best materials for your needs\n\n**Just tell me what you want to plan or design, and I'll guide you through every detail!**`;
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
            let budgetRange = extractBudgetFromMessage(message);
            conversationState.projectData.budget = budgetRange;
            
            return `💰 **Budget: ${budgetRange}** - Excellent! I can work with this budget effectively.\n\n**Question 5/9: Which city/climate are you building in?**\n\n🌍 This is crucial for:\n• Material selection\n• Ventilation planning  \n• Weather protection\n• Energy efficiency\n\nTell me your city or climate type (hot, humid, cold, moderate)`;
            
        case 5:
            conversationState.step = 6;
            conversationState.projectData.location = message;
            
            return `🏙️ **Location: ${message}** - Perfect! I'll consider climate factors.\n\n**Question 6/9: Do you want Vastu compliance in your home design?**\n\nA) Yes, strict Vastu compliance\nB) Partial Vastu (where practical)\nC) No Vastu requirements\nD) Not sure, please advise\n\n🧭 **Expert Insight:** Vastu can be balanced with modern design principles for optimal results.`;
            
        case 6:
            conversationState.step = 7;
            conversationState.projectData.vastu = message;
            
            return `🧭 **Vastu preference noted!**\n\n**Question 7/9: What are your priority rooms/areas?**\n\n🏠 **Common priorities:**\n• Large kitchen for cooking lovers\n• Spacious living room for entertaining\n• Master bedroom with attached bathroom\n• Study/work from home space\n• Dining area\n• Prayer room\n• Storage areas\n\nTell me your top 3 priorities!`;
            
        case 7:
            conversationState.step = 8;
            conversationState.projectData.priorities = message;
            
            return `🎯 **Priorities noted!** These will be the focus of my design.\n\n**Question 8/9: What style & aesthetics do you prefer for your home?**\n\nA) **Modern Minimalist** - Clean lines, neutral colors, clutter-free\nB) **Classic Traditional** - Warm wood, rich colors, ornate details\nC) **Industrial** - Exposed brick, metal fixtures, urban vibe\nD) **Bohemian** - Eclectic colors, artistic elements, cozy textures\nE) **Contemporary** - Latest trends, smart features, sleek finishes\nF) **Rustic** - Natural materials, earthy tones, country charm\n\n🎨 **Expert Tip:** Your style choice affects material selection, color schemes, and finishing details!\n\nJust type A, B, C, D, E, or F!`;
            
        case 8:
            conversationState.step = 9;
            conversationState.projectData.style = message;
            
            let selectedStyle = '';
            const lowerMessage = message.toLowerCase();
            if (lowerMessage.includes('a') || lowerMessage.includes('modern minimalist')) selectedStyle = 'Modern Minimalist';
            else if (lowerMessage.includes('b') || lowerMessage.includes('classic traditional')) selectedStyle = 'Classic Traditional';
            else if (lowerMessage.includes('c') || lowerMessage.includes('industrial')) selectedStyle = 'Industrial';
            else if (lowerMessage.includes('d') || lowerMessage.includes('bohemian')) selectedStyle = 'Bohemian';
            else if (lowerMessage.includes('e') || lowerMessage.includes('contemporary')) selectedStyle = 'Contemporary';
            else if (lowerMessage.includes('f') || lowerMessage.includes('rustic')) selectedStyle = 'Rustic';
            else selectedStyle = 'Custom Style';
            
            conversationState.projectData.selectedStyle = selectedStyle;
            
            return `🎨 **${selectedStyle}** - Excellent choice! This style will beautifully complement your home design.\n\n**Final Question 9/9: When do you plan to start construction?**\n\nA) Immediately (within 1 month)\nB) Soon (1-3 months)\nC) Planning phase (3-6 months)\nD) Future planning (6+ months)\n\n⏰ **Timeline affects:** Permit processing, material procurement, seasonal considerations.`;
            
        case 9:
            conversationState.projectData.timeline = message;
            return generateCompleteHomePlan();
            
        default:
            return resetConversation();
    }
}

function getStyleSpecificRecommendations(style) {
    const styleGuides = {
        'Modern Minimalist': `\n• Color Palette: White, grey, black with minimal accent colors\n• Materials: Glass, steel, concrete, smooth finishes\n• Furniture: Clean lines, built-in storage, minimal décor\n• Lighting: Recessed LED lights, pendant lighting\n• Flooring: Polished concrete, large tiles, or hardwood`,
        
        'Classic Traditional': `\n• Color Palette: Warm browns, deep reds, gold, cream tones\n• Materials: Natural wood, brass fittings, marble accents\n• Furniture: Ornate details, wooden furniture, rich fabrics\n• Lighting: Chandeliers, table lamps, warm lighting\n• Flooring: Hardwood, traditional tiles, area rugs`,
        
        'Industrial': `\n• Color Palette: Greys, blacks, raw metal tones, brick red\n• Materials: Exposed brick, metal beams, concrete, steel\n• Furniture: Metal fixtures, leather seating, functional design\n• Lighting: Track lighting, Edison bulbs, metal fixtures\n• Flooring: Polished concrete, metal gratings, industrial tiles`,
        
        'Bohemian': `\n• Color Palette: Rich jewel tones, earth colors, vibrant patterns\n• Materials: Natural textiles, woven fabrics, mixed materials\n• Furniture: Low seating, floor cushions, eclectic mix\n• Lighting: String lights, colorful lampshades, natural light\n• Flooring: Natural wood, colorful rugs, textured tiles`,
        
        'Contemporary': `\n• Color Palette: Neutral base with bold accent colors\n• Materials: Mixed materials, smart home integration\n• Furniture: Sleek designs, multi-functional pieces\n• Lighting: Smart lighting systems, modern fixtures\n• Flooring: Luxury vinyl, modern tiles, smart surfaces`,
        
        'Rustic': `\n• Color Palette: Earth tones, natural browns, forest greens\n• Materials: Natural wood, stone, wrought iron\n• Furniture: Handcrafted pieces, natural textures\n• Lighting: Warm ambient lighting, lantern-style fixtures\n• Flooring: Natural wood, stone tiles, rustic finishes`
    };
    
    return styleGuides[style] || '\n• Custom style elements will be designed based on your preferences\n• Natural materials and neutral colors recommended\n• Functional and aesthetic balance maintained';
}

function generateCompleteHomePlan() {
    const data = conversationState.projectData;
    const houseInfo = homeDesignExpertise.houseSizes[data.houseType] || {};
    
    resetConversation();
    
    return `🏠 **COMPLETE HOME PLANNING REPORT** 🏗️\n\n**═══════════════════════════════════**\n\n📋 **PROJECT SUMMARY:**\n• House Type: ${data.houseType}\n• Area: ${data.area} sqft\n• Family: ${data.familySize} members\n• Budget: ${data.budget}\n• Location: ${data.location}\n• Design Style: ${data.selectedStyle || 'Not specified'}\n• Timeline: ${data.timeline}\n\n🎯 **EXPERT RECOMMENDATIONS:**\n\n**🏗️ STRUCTURAL PLANNING:**\n• Foundation: RCC with waterproofing\n• Walls: 6" for external, 4" for internal  \n• Roof: RCC slab with insulation\n• Ventilation: Cross-ventilation in all rooms\n\n**📐 ROOM LAYOUT SUGGESTIONS:**\n• Living Room: 14x16 ft (focal point)\n• Master Bedroom: 12x14 ft (SW corner)\n• Kitchen: 10x12 ft (SE corner) \n• Bathrooms: 6x8 ft (proper ventilation)\n\n**🎨 STYLE-SPECIFIC DESIGN FEATURES:**${getStyleSpecificRecommendations(data.selectedStyle)}\n\n**💰 DETAILED BUDGET BREAKDOWN:**\n• Structure (40%): ₹${Math.round(parseFloat(data.budget.split('-')[0]) * 0.4)} Lakhs\n• Plumbing (10%): ₹${Math.round(parseFloat(data.budget.split('-')[0]) * 0.1)} Lakhs\n• Electrical (10%): ₹${Math.round(parseFloat(data.budget.split('-')[0]) * 0.1)} Lakhs\n• Flooring (15%): ₹${Math.round(parseFloat(data.budget.split('-')[0]) * 0.15)} Lakhs\n• Finishing (25%): ₹${Math.round(parseFloat(data.budget.split('-')[0]) * 0.25)} Lakhs\n\n**⏰ CONSTRUCTION TIMELINE:**\n• Total Duration: 8-10 months\n• Structure: 4 months\n• Finishing: 4 months\n• Final touches: 2 months\n\n**🎨 GENERAL DESIGN FEATURES:**\n• Natural lighting in all rooms\n• Efficient storage solutions\n• Energy-efficient design\n• Climate-appropriate materials\n\n**👥 RECOMMENDED PROFESSIONALS:**\n\nWould you like me to recommend specific architects, contractors, or other professionals for your project?\n\nOr would you like detailed advice on any specific aspect of this plan?`;
}

function startBudgetConsultationFlow() {
    conversationState.currentFlow = 'budgetConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `💰 **Master Budget Consultant** 📊\n\nHello! I'm your expert cost estimation specialist with 15+ years experience. I'll create a detailed, accurate budget by understanding your exact requirements.\n\n**Question 1/6: What type of project are you planning?**\n\nA) **New Construction** - Building from scratch\nB) **Complete Renovation** - Full house makeover\nC) **Partial Renovation** - Specific rooms/areas\nD) **Interior Design** - Furniture & decor only\nE) **Specific Work** - Kitchen, bathroom, flooring etc.\n\n📝 **Why this matters:** Different project types have completely different cost structures and requirements.\n\nWhich option best describes your project?`;
}

function continueBudgetConsultationFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let projectType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('new')) projectType = 'New Construction';
            else if (lowerMessage.includes('b') || lowerMessage.includes('complete')) projectType = 'Complete Renovation';
            else if (lowerMessage.includes('c') || lowerMessage.includes('partial')) projectType = 'Partial Renovation';
            else if (lowerMessage.includes('d') || lowerMessage.includes('interior')) projectType = 'Interior Design';
            else if (lowerMessage.includes('e') || lowerMessage.includes('specific')) projectType = 'Specific Work';
            
            conversationState.projectData.projectType = projectType;
            
            return `✅ **${projectType}** - Excellent choice!\n\n**Question 2/6: How big is your house/project?**\n\n📏 **I need to understand the size to calculate material and labor costs:**\n\n🏠 **For ${projectType}:**\n• Total built-up area (if full house)\n• Carpet area (usable space)\n• Specific room size (if partial work)\n\n📝 **Examples:**\n• "1200 sqft house"\n• "10x12 kitchen + 8x10 bedroom"\n• "2BHK apartment 800 sqft"\n\nWhat's the size/area of your project?`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.area = extractAreaFromMessage(message);
            
            return `📐 **${conversationState.projectData.area} sqft** - Got it!\n\n**Question 3/5: What quality level are you targeting?**\n\nA) **Basic** (₹1,200/sqft) - Standard materials, simple finishes\nB) **Standard** (₹1,800/sqft) - Good quality, decent finishes  \nC) **Premium** (₹2,500/sqft) - High quality, premium finishes\nD) **Luxury** (₹3,500/sqft) - Top materials, designer finishes\n\n💡 **Expert Tip:** Quality affects durability and long-term costs!`;
            
        case 3:
            conversationState.step = 4;
            let qualityLevel = '';
            let costPerSqft = 0;
            
            if (lowerMessage.includes('a') || lowerMessage.includes('basic')) {
                qualityLevel = 'Basic';
                costPerSqft = 1200;
            } else if (lowerMessage.includes('b') || lowerMessage.includes('standard')) {
                qualityLevel = 'Standard';
                costPerSqft = 1800;
            } else if (lowerMessage.includes('c') || lowerMessage.includes('premium')) {
                qualityLevel = 'Premium';
                costPerSqft = 2500;
            } else if (lowerMessage.includes('d') || lowerMessage.includes('luxury')) {
                qualityLevel = 'Luxury';
                costPerSqft = 3500;
            }
            
            conversationState.projectData.quality = qualityLevel;
            conversationState.projectData.costPerSqft = costPerSqft;
            
            return `⭐ **${qualityLevel} Quality** - Excellent choice!\n\n**Question 4/5: Any special requirements?**\n\n🔧 **Common additions:**\n• Modular kitchen\n• Designer bathrooms\n• Wooden flooring\n• False ceiling\n• Landscaping\n• Smart home features\n• Swimming pool\n• Solar panels\n\nTell me what special features you want, or type "none" for standard work.`;
            
        case 4:
            conversationState.step = 5;
            conversationState.projectData.specialRequirements = message;
            
            return `🎯 **Special requirements noted!**\n\n**Final Question 5/5: What's your preferred timeline?**\n\nA) Fast track (20% extra cost)\nB) Normal timeline\nC) Flexible timeline (cost savings possible)\nD) Seasonal timing (monsoon considerations)\n\n⏰ **Timeline affects:** Material costs, labor availability, weather factors.`;
            
        case 5:
            conversationState.projectData.timeline = message;
            return generateDetailedBudgetEstimate();
            
        default:
            return resetConversation();
    }
}

function generateDetailedBudgetEstimate() {
    const data = conversationState.projectData;
    const area = parseFloat(data.area);
    const baseRate = data.costPerSqft;
    const baseCost = area * baseRate;
    
    // Calculate various components
    const structure = baseCost * 0.40;
    const plumbing = baseCost * 0.10;
    const electrical = baseCost * 0.10;
    const flooring = baseCost * 0.15;
    const painting = baseCost * 0.08;
    const fixtures = baseCost * 0.12;
    const finishing = baseCost * 0.05;
    
    // Add special requirements cost (estimate 10-20% extra)
    const specialCost = data.specialRequirements && data.specialRequirements !== 'none' ? baseCost * 0.15 : 0;
    
    const totalCost = baseCost + specialCost;
    const contingency = totalCost * 0.10; // 10% contingency
    const finalCost = totalCost + contingency;
    
    resetConversation();
    
    return `💰 **DETAILED BUDGET ESTIMATE REPORT** 📊\n\n**═══════════════════════════════════**\n\n📋 **PROJECT DETAILS:**\n• Type: ${data.projectType}\n• Area: ${data.area} sqft\n• Quality: ${data.quality}\n• Rate: ₹${baseRate}/sqft\n\n💸 **DETAILED COST BREAKDOWN:**\n\n**🏗️ STRUCTURAL WORK (40%)**\n• Foundation & Structure: ₹${Math.round(structure/100000*100)/100} Lakhs\n\n**🔧 MEP WORK (20%)**\n• Plumbing & Sanitary: ₹${Math.round(plumbing/100000*100)/100} Lakhs\n• Electrical & Lighting: ₹${Math.round(electrical/100000*100)/100} Lakhs\n\n**🎨 FINISHING WORK (40%)**\n• Flooring & Tiles: ₹${Math.round(flooring/100000*100)/100} Lakhs\n• Painting & Polish: ₹${Math.round(painting/100000*100)/100} Lakhs\n• Doors & Fixtures: ₹${Math.round(fixtures/100000*100)/100} Lakhs\n• Final Finishing: ₹${Math.round(finishing/100000*100)/100} Lakhs\n\n**✨ SPECIAL FEATURES:**\n• Additional Work: ₹${Math.round(specialCost/100000*100)/100} Lakhs\n\n**📊 SUMMARY:**\n• Base Cost: ₹${Math.round(baseCost/100000*100)/100} Lakhs\n• Special Features: ₹${Math.round(specialCost/100000*100)/100} Lakhs\n• Contingency (10%): ₹${Math.round(contingency/100000*100)/100} Lakhs\n\n**🎯 TOTAL PROJECT COST: ₹${Math.round(finalCost/100000*100)/100} LAKHS**\n\n**⏰ PAYMENT SCHEDULE:**\n• Advance: 20% (₹${Math.round(finalCost*0.2/100000*100)/100} Lakhs)\n• Structure: 40% (₹${Math.round(finalCost*0.4/100000*100)/100} Lakhs)\n• Finishing: 35% (₹${Math.round(finalCost*0.35/100000*100)/100} Lakhs)\n• Final: 5% (₹${Math.round(finalCost*0.05/100000*100)/100} Lakhs)\n\n**💡 EXPERT COST-SAVING TIPS:**\n• Buy materials in bulk for 10-15% savings\n• Plan work during off-season for labor savings\n• Focus budget on structural quality\n• Consider phased execution to spread costs\n\n**🏗️ TIMELINE ESTIMATE:**\n• ${data.projectType}: 6-10 months\n• Monthly spend: ₹${Math.round(finalCost/8/100000*100)/100} Lakhs average\n\nWould you like me to recommend professionals who can execute this project within your budget?`;
}

function startKitchenDesignFlow() {
    conversationState.currentFlow = 'kitchenDesign';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🍳 **Expert Kitchen Design Consultation** 👨‍🍳\n\nAs your specialized kitchen designer, I'll create the perfect cooking space for you!\n\n**Question 1/6: What's your kitchen area/size?**\n\n📏 **Common kitchen sizes:**\n• Small: 6x8 feet (48 sqft)\n• Medium: 8x10 feet (80 sqft)\n• Large: 10x12 feet (120 sqft)\n• Extra Large: 12x14+ feet (168+ sqft)\n\nTell me your kitchen dimensions (e.g., "8x10 feet" or "80 sqft")`;
}

function continueKitchenDesignFlow(message, step) {
    switch (step) {
        case 1:
            conversationState.step = 2;
            conversationState.projectData.kitchenSize = message;
            
            return `📐 **Kitchen size: ${message}** - Perfect!\n\n**Question 2/6: What's your cooking style?**\n\nA) **Heavy cooking** - Full Indian meals, multiple dishes\nB) **Moderate cooking** - Regular home cooking\nC) **Light cooking** - Basic meals, minimal frying\nD) **Occasional cooking** - Mostly reheating, simple dishes\n\n👨‍🍳 **This determines:** Storage needs, ventilation, countertop space, appliance requirements.`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.cookingStyle = message;
            
            return `👨‍🍳 **Cooking style noted!**\n\n**Question 3/6: How many people regularly cook in your kitchen?**\n\nA) Single person cooking\nB) 2 people (couple cooking together)\nC) Multiple family members\nD) Professional cook/helper\n\n🏃‍♀️ **This affects:** Work triangle, counter space, storage accessibility, traffic flow.`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.cookingPeople = message;
            
            return `👥 **Kitchen users noted!**\n\n**Question 4/6: What kitchen layout do you prefer?**\n\nA) **L-Shaped** - Corner utilization, good for medium kitchens\nB) **Straight/Gallery** - Single wall, space-efficient\nC) **U-Shaped** - Maximum storage, large kitchens\nD) **Island Kitchen** - Central workspace, spacious kitchens\nE) **Parallel/Galley** - Two opposite walls\n\n📐 **Expert tip:** Layout depends on your space and workflow!`;
            
        case 4:
            conversationState.step = 5;
            conversationState.projectData.kitchenLayout = message;
            
            return `🏗️ **Layout preference saved!**\n\n**Question 5/6: What's your kitchen budget range?**\n\nA) ₹1-2 Lakhs (Basic modular)\nB) ₹2-4 Lakhs (Standard quality)\nC) ₹4-6 Lakhs (Premium finish)\nD) ₹6-10 Lakhs (Luxury kitchen)\nE) ₹10+ Lakhs (Ultra-premium)\n\n💰 **Includes:** Cabinets, countertop, appliances, plumbing, electrical work.`;
            
        case 5:
            conversationState.step = 6;
            conversationState.projectData.kitchenBudget = message;
            
            return `💰 **Budget range confirmed!**\n\n**Final Question 6/6: Any special requirements?**\n\n🔧 **Popular additions:**\n• Breakfast counter/dining area\n• Built-in appliances (OTG, microwave)\n• Modular storage solutions\n• Granite/quartz countertops\n• Under-cabinet lighting\n• Chimney and ventilation\n• Water purifier space\n• Dishwasher area\n\nTell me your special needs, or type "standard" for basic requirements.`;
            
        case 6:
            conversationState.projectData.specialKitchenNeeds = message;
            return generateKitchenDesignPlan();
            
        default:
            return resetConversation();
    }
}

function generateKitchenDesignPlan() {
    const data = conversationState.projectData;
    resetConversation();
    
    return `🍳 **COMPLETE KITCHEN DESIGN PLAN** 🏗️\n\n**═══════════════════════════════════**\n\n📋 **YOUR KITCHEN PROFILE:**\n• Size: ${data.kitchenSize}\n• Cooking Style: ${data.cookingStyle}\n• Users: ${data.cookingPeople}\n• Layout: ${data.kitchenLayout}\n• Budget: ${data.kitchenBudget}\n\n🎯 **EXPERT DESIGN RECOMMENDATIONS:**\n\n**📐 OPTIMAL WORK TRIANGLE:**\n• Sink ↔ Stove: 4-6 feet\n• Stove ↔ Fridge: 4-7 feet\n• Fridge ↔ Sink: 4-9 feet\n• Total triangle: 12-23 feet\n\n**🏗️ LAYOUT SPECIFICATIONS:**\n• Counter height: 32-34 inches\n• Counter depth: 24 inches\n• Upper cabinet height: 12-15 inches\n• Counter to upper cabinet: 18 inches\n\n**🎨 DESIGN FEATURES:**\n• **Countertop:** Granite/Quartz for durability\n• **Backsplash:** Tiles for easy cleaning\n• **Storage:** Pull-out drawers, corner solutions\n• **Lighting:** Under-cabinet LED + ceiling lights\n• **Ventilation:** 90cm chimney for Indian cooking\n\n**⚡ ELECTRICAL PLANNING:**\n• 15A point for chimney\n• 5A points for appliances (4-5 nos.)\n• Microwave dedicated point\n• Under-cabinet lighting points\n• GFCI protection for wet areas\n\n**🔧 PLUMBING LAYOUT:**\n• Hot & cold water lines to sink\n• Waste water connection\n• Water purifier provision\n• Dishwasher connection (if planned)\n\n**📦 STORAGE SOLUTIONS:**\n• Base cabinets: Pots, heavy items\n• Upper cabinets: Daily use items\n• Tall units: Groceries, appliances\n• Corner units: Maximum space utilization\n\n**🏷️ MATERIAL RECOMMENDATIONS:**\n• **Cabinets:** BWR plywood/MDF\n• **Shutters:** Laminate/Acrylic finish\n• **Hardware:** Soft-close hinges & slides\n• **Countertop:** 20mm granite/quartz\n\n**💰 BUDGET BREAKDOWN:**\n• Cabinets (60%): ₹${Math.round(parseFloat(data.kitchenBudget.split('-')[0]) * 0.6)} Lakhs\n• Appliances (25%): ₹${Math.round(parseFloat(data.kitchenBudget.split('-')[0]) * 0.25)} Lakhs\n• Labor & Misc (15%): ₹${Math.round(parseFloat(data.kitchenBudget.split('-')[0]) * 0.15)} Lakhs\n\n**⏰ EXECUTION TIMELINE:**\n• Design & approval: 1 week\n• Manufacturing: 3-4 weeks\n• Installation: 1 week\n• Total duration: 5-6 weeks\n\n**👥 RECOMMENDED PROFESSIONALS:**\n\nWould you like me to recommend specific kitchen designers and carpenters who can execute this plan within your budget?\n\nOr need more details on any specific aspect?`;
}

function extractAreaFromMessage(message) {
    const numbers = message.match(/\d+/g);
    if (numbers && numbers.length >= 1) {
        if (numbers.length >= 2) {
            return `${numbers[0]}x${numbers[1]} feet (${numbers[0] * numbers[1]} sqft)`;
        } else {
            return `${numbers[0]} sqft`;
        }
    }
    return message;
}

function extractNumberFromMessage(message) {
    const numbers = message.match(/\d+/);
    return numbers ? numbers[0] : message;
}

function extractBudgetFromMessage(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('a') || lowerMessage.includes('8-15')) return '8-15 Lakhs';
    if (lowerMessage.includes('b') || lowerMessage.includes('15-25')) return '15-25 Lakhs';
    if (lowerMessage.includes('c') || lowerMessage.includes('25-40')) return '25-40 Lakhs';
    if (lowerMessage.includes('d') || lowerMessage.includes('40+')) return '40+ Lakhs';
    return message;
}

function resetConversation() {
    conversationState.currentFlow = null;
    conversationState.step = 0;
    conversationState.userResponses = {};
    conversationState.projectData = {};
    
    return "🏠 **Consultation completed!** Thank you for the detailed discussion.\n\nFeel free to start a new consultation anytime. I'm here to help with:\n\n• Complete home planning\n• Room-specific design\n• Budget estimation\n• Construction advice\n• Professional recommendations\n\nWhat would you like to discuss next?";
}

function startCarpenterConsultationFlow() {
    conversationState.currentFlow = 'carpenterConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    const response = currentLanguage === 'hi' ? 
        `🔨 **नमस्ते! मैं आपका मास्टर बढ़ई हूँ** 🪵\n\nमैं 20+ साल का अनुभव रखने वाला विशेषज्ञ बढ़ई हूँ। आपको जो भी फर्नीचर या लकड़ी का काम चाहिए, मैं आपको सबसे बेहतरीन सलाह और सेवा दूंगा!\n\n**बताइए, आपको क्या काम करवाना है?**\n\nA) **अलमारी/वार्डरोब** - बेडरूम, किचन के लिए\nB) **किचन कैबिनेट** - पूरा मॉड्यूलर किचन\nC) **कस्टम फर्नीचर** - टेबल, कुर्सी, बेड, सोफा\nD) **स्टोरेज सोल्यूशन** - बुकशेल्फ, दराज, वॉल यूनिट\nE) **लकड़ी की फ्लोरिंग** - हार्डवुड, लैमिनेट\nF) **दरवाजे और खिड़कियां** - लकड़ी की फिटिंग\nG) **मरम्मत का काम** - पुराने फर्नीचर की मरम्मत\n\n💡 **मैं पूछ रहा हूँ क्योंकि:** अलग-अलग काम के लिए अलग तकनीक, उपकरण और लकड़ी की जरूरत होती है।\n\nआप क्या बनवाना चाहते हैं?` :
        `🔨 **Hello! I'm your Master Carpenter** 🪵\n\nI'm an expert carpenter with 20+ years of experience. Whatever furniture or woodwork you need, I'll give you the best advice and service!\n\n**Tell me, what work do you want to get done?**\n\nA) **Cupboard/Wardrobe** - For bedroom, kitchen storage\nB) **Kitchen Cabinets** - Complete modular kitchen setup\nC) **Custom Furniture** - Tables, chairs, beds, sofas\nD) **Storage Solutions** - Bookshelves, drawers, wall units\nE) **Wooden Flooring** - Hardwood, engineered, laminate\nF) **Doors & Windows** - Wooden installations & frames\nG) **Repair Work** - Fix existing furniture\n\n💡 **Why I'm asking:** Different work needs different techniques, tools, and wood types.\n\nWhat would you like me to make for you?`;
    
    return response;
}

function continueCarpenterConsultationFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let workType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('cupboard') || lowerMessage.includes('wardrobe') || lowerMessage.includes('अलमारी')) {
                workType = currentLanguage === 'hi' ? 'अलमारी/वार्डरोब' : 'Cupboard/Wardrobe';
            } else if (lowerMessage.includes('b') || lowerMessage.includes('kitchen') || lowerMessage.includes('किचन')) {
                workType = currentLanguage === 'hi' ? 'किचन कैबिनेट' : 'Kitchen Cabinets';
            } else if (lowerMessage.includes('c') || lowerMessage.includes('furniture') || lowerMessage.includes('फर्नीचर')) {
                workType = currentLanguage === 'hi' ? 'कस्टम फर्नीचर' : 'Custom Furniture';
            } else if (lowerMessage.includes('d') || lowerMessage.includes('storage') || lowerMessage.includes('स्टोरेज')) {
                workType = currentLanguage === 'hi' ? 'स्टोरेज सोल्यूशन' : 'Storage Solutions';
            } else if (lowerMessage.includes('e') || lowerMessage.includes('flooring') || lowerMessage.includes('फ्लोरिंग')) {
                workType = currentLanguage === 'hi' ? 'लकड़ी की फ्लोरिंग' : 'Wooden Flooring';
            } else if (lowerMessage.includes('f') || lowerMessage.includes('doors') || lowerMessage.includes('windows') || lowerMessage.includes('दरवाजे')) {
                workType = currentLanguage === 'hi' ? 'दरवाजे और खिड़कियां' : 'Doors & Windows';
            } else {
                workType = currentLanguage === 'hi' ? 'कस्टम काम' : 'Custom Work';
            }
            
            conversationState.projectData.workType = workType;
            
            return currentLanguage === 'hi' ? 
                `🔨 **${workType}** - बहुत बढ़िया चुनाव!\n\n**अब बताइए इसकी पूरी डिटेल:**\n\n📝 **${workType} के लिए मुझे जानना चाहिए:**\n• कितने पीस/यूनिट चाहिए?\n• साइज़ क्या होगा? (लंबाई x चौड़ाई x ऊंचाई)\n• कहाँ लगाना है? (कौन सा कमरा)\n• कोई खास डिज़ाइन चाहिए?\n\n📝 **उदाहरण:**\n• "मास्टर बेडरूम के लिए 2 अलमारी, हर एक 6 फीट चौड़ी"\n• "10x8 किचन के लिए पूरा कैबिनेट"\n• "4 सीटर डाइनिंग टेबल कुर्सियों के साथ"\n\nअपनी जरूरत की पूरी डिटेल बताइए:` :
                `🔨 **${workType}** - Excellent choice!\n\n**Tell me the complete details:**\n\n📝 **For ${workType}, I need to know:**\n• How many units/pieces do you need?\n• What are the dimensions? (length x width x height)\n• Where will this be installed? (which room)\n• Any specific design preferences?\n\n📝 **Examples:**\n• "2 wardrobes for master bedroom, 6 feet wide each"\n• "Complete kitchen cabinets for 10x8 kitchen"\n• "4-seater dining table with chairs"\n\nDescribe your exact requirement in detail:`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.dimensions = message;
            
            return currentLanguage === 'hi' ? 
                `📐 **साइज़: ${message}** - परफेक्ट!\n\n**अब बताइए, कौन सी लकड़ी/मटेरियल पसंद करेंगे?**\n\nA) **टीक वुड** - प्रीमियम, टिकाऊ, ₹800-1200/sqft\nB) **शीशम** - अच्छी क्वालिटी, ₹400-600/sqft\nC) **पाइन वुड** - किफायती, ₹300-500/sqft\nD) **प्लाईवुड + वेनीर** - मॉडर्न, ₹200-400/sqft\nE) **MDF + लैमिनेट** - बजट फ्रेंडली, ₹150-300/sqft\nF) **बढ़ई से सुझाव लें** - बजट और इस्तेमाल के अनुसार\n\n🌳 **एक्सपर्ट टिप:** लकड़ी का चुनाव मजबूती, दिखावट और कीमत को प्रभावित करता है!` :
                `📐 **Size: ${message}** - Perfect!\n\n**Now tell me, what type of wood/material do you prefer?**\n\nA) **Teak Wood** - Premium, durable, ₹800-1200/sqft\nB) **Sheesham** - Good quality, ₹400-600/sqft\nC) **Pine Wood** - Economical, ₹300-500/sqft\nD) **Plywood + Veneer** - Modern, ₹200-400/sqft\nE) **MDF + Laminate** - Budget-friendly, ₹150-300/sqft\nF) **Let carpenter suggest** - Based on budget & use\n\n🌳 **Expert tip:** Wood choice affects durability, appearance, and cost!`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.material = message;
            
            return currentLanguage === 'hi' ? 
                `🌳 **मटेरियल की पसंद नोट की गई!**\n\n**आपका बजट रेंज क्या है?**\n\nA) ₹10,000 - 25,000 (बेसिक काम)\nB) ₹25,000 - 50,000 (स्टैंडर्ड क्वालिटी)\nC) ₹50,000 - 1,00,000 (प्रीमियम काम)\nD) ₹1,00,000+ (लग्जरी/कस्टम)\nE) अपना स्पेसिफिक बजट बताएं\n\n💰 **बजट में शामिल:** मटेरियल, मजदूरी, हार्डवेयर, और फिनिशिंग।` :
                `🌳 **Material preference noted!**\n\n**What's your budget range?**\n\nA) ₹10,000 - 25,000 (Basic work)\nB) ₹25,000 - 50,000 (Standard quality)\nC) ₹50,000 - 1,00,000 (Premium work)\nD) ₹1,00,000+ (Luxury/Custom)\nE) Tell me your specific budget\n\n💰 **Budget includes:** Material, labor, hardware, and finishing.`;
            
        case 4:
            conversationState.step = 5;
            conversationState.projectData.budget = message;
            
            return currentLanguage === 'hi' ? 
                `💰 **बजट कन्फर्म हुआ!**\n\n**कब तक काम पूरा करना है?**\n\nA) **जल्दी** - 1 हफ्ते में (जल्दबाजी चार्ज लगेगा)\nB) **जल्दी** - 1-2 हफ्ते में\nC) **स्टैंडर्ड** - 2-4 हफ्ते में\nD) **फ्लेक्सिबल** - 1-2 महीने में (बेहतर प्राइसिंग)\n\n⏰ **टाइमलाइन प्रभावित करती है:** मटेरियल की खरीदारी, वर्कशॉप शेड्यूलिंग, इंस्टालेशन प्लानिंग।` :
                `💰 **Budget confirmed!**\n\n**When do you need this completed?**\n\nA) **Urgent** - Within 1 week (rush charges apply)\nB) **Soon** - 1-2 weeks\nC) **Standard** - 2-4 weeks\nD) **Flexible** - 1-2 months (better pricing)\n\n⏰ **Timeline affects:** Material procurement, workshop scheduling, installation planning.`;
            
        case 5:
            conversationState.projectData.timeline = message;
            return generateCarpenterRecommendation();
            
        default:
            return resetConversation();
    }
}

function generateCarpenterRecommendation() {
    const data = conversationState.projectData;
    
    // Find matching carpenters based on work type and budget
    let matchingCarpenters = professionalDatabase.carpenters.filter(carpenter => {
        const workTypeMatch = carpenter.expertise.some(exp => 
            exp.toLowerCase().includes(data.workType.toLowerCase().split('/')[0]) ||
            data.workType.toLowerCase().includes(exp.toLowerCase())
        );
        return workTypeMatch;
    });
    
    resetConversation();
    
    let recommendation = currentLanguage === 'hi' ? 
        `🔨 **बढ़ई की विशेषज्ञ रिपोर्ट** 🪵\n\n**═══════════════════════════════════**\n\n📋 **आपकी जरूरतें:**\n• काम का प्रकार: ${data.workType}\n• आकार: ${data.dimensions}\n• मटेरियल: ${data.material}\n• बजट: ${data.budget}\n• समय सीमा: ${data.timeline}\n\n🎯 **विशेषज्ञ सिफारिशें:**\n\n**🏗️ काम की स्पेसिफिकेशन:**\n• मटेरियल की मोटाई: मुख्य ढांचे के लिए 18-20mm\n• हार्डवेयर: सॉफ्ट-क्लोज़ हिंजेस और स्लाइड्स की सिफारिश\n• फिनिश: पॉलिश + प्रोटेक्टिव कोटिंग\n• इंस्टालेशन: प्रोफेशनल माउंटिंग जरूरी\n\n**💰 कॉस्ट ब्रेकडाउन:**\n• मटेरियल (60%): ₹${Math.round(parseFloat(data.budget.split('-')[0].replace(/[₹,]/g, '')) * 0.6).toLocaleString()}\n• मजदूरी (30%): ₹${Math.round(parseFloat(data.budget.split('-')[0].replace(/[₹,]/g, '')) * 0.3).toLocaleString()}\n• हार्डवेयर (10%): ₹${Math.round(parseFloat(data.budget.split('-')[0].replace(/[₹,]/g, '')) * 0.1).toLocaleString()}\n\n**⏰ एक्जीक्यूशन टाइमलाइन:**\n• डिज़ाइन अप्रूवल: 1-2 दिन\n• मटेरियल खरीदारी: 3-5 दिन\n• वर्कशॉप का काम: 1-2 हफ्ते\n• इंस्टालेशन: 1-2 दिन\n\n**👨‍🔧 परफेक्ट बढ़ई मैच:**\n\n` :
        `🔨 **CARPENTER EXPERT REPORT** 🪵\n\n**═══════════════════════════════════**\n\n📋 **YOUR REQUIREMENTS:**\n• Work Type: ${data.workType}\n• Dimensions: ${data.dimensions}\n• Material: ${data.material}\n• Budget: ${data.budget}\n• Timeline: ${data.timeline}\n\n🎯 **EXPERT RECOMMENDATIONS:**\n\n**🏗️ WORK SPECIFICATIONS:**\n• Material thickness: 18-20mm for main structure\n• Hardware: Soft-close hinges and slides recommended\n• Finish: Polish + protective coating\n• Installation: Professional mounting required\n\n**💰 COST BREAKDOWN:**\n• Material (60%): ₹${Math.round(parseFloat(data.budget.split('-')[0].replace(/[₹,]/g, '')) * 0.6).toLocaleString()}\n• Labor (30%): ₹${Math.round(parseFloat(data.budget.split('-')[0].replace(/[₹,]/g, '')) * 0.3).toLocaleString()}\n• Hardware (10%): ₹${Math.round(parseFloat(data.budget.split('-')[0].replace(/[₹,]/g, '')) * 0.1).toLocaleString()}\n\n**⏰ EXECUTION TIMELINE:**\n• Design approval: 1-2 days\n• Material procurement: 3-5 days\n• Workshop work: 1-2 weeks\n• Installation: 1-2 days\n\n**👨‍🔧 PERFECT CARPENTER MATCHES:**\n\n`;
    
    matchingCarpenters.slice(0, 2).forEach((carpenter, index) => {
        if (currentLanguage === 'hi') {
            recommendation += `**${index + 1}. ${carpenter.name}** ${carpenter.verified ? '✅' : ''}\n`;
            recommendation += `📍 ${carpenter.location} (${carpenter.distance})\n`;
            recommendation += `⭐ ${carpenter.rating}/5 (${carpenter.reviews} रिव्यूज)\n`;
            recommendation += `🔨 ${carpenter.experience} अनुभव\n`;
            recommendation += `🎯 विशेषज्ञता: ${carpenter.expertise.join(', ')}\n`;
            recommendation += `💰 बजट रेंज: ₹${carpenter.budget}\n`;
            recommendation += `📞 संपर्क: ${carpenter.phone}\n`;
            recommendation += `📧 ईमेल: ${carpenter.email}\n\n`;
        } else {
            recommendation += `**${index + 1}. ${carpenter.name}** ${carpenter.verified ? '✅' : ''}\n`;
            recommendation += `📍 ${carpenter.location} (${carpenter.distance})\n`;
            recommendation += `⭐ ${carpenter.rating}/5 (${carpenter.reviews} reviews)\n`;
            recommendation += `🔨 ${carpenter.experience} experience\n`;
            recommendation += `🎯 Expert in: ${carpenter.expertise.join(', ')}\n`;
            recommendation += `💰 Budget range: ₹${carpenter.budget}\n`;
            recommendation += `📞 Contact: ${carpenter.phone}\n`;
            recommendation += `📧 Email: ${carpenter.email}\n\n`;
        }
    });
    
    recommendation += currentLanguage === 'hi' ? 
        `💡 **विशेषज्ञ टिप्स:**\n• हमेशा पहले के काम के सैंपल देखें\n• काम शुरू करने से पहले मटेरियल की क्वालिटी कन्फर्म करें\n• डिटेल्ड लिखित कोटेशन लें\n• 10% एक्स्ट्रा बजट रखें आपातकालीन खर्चों के लिए\n• काम के दौरान सही वेंटिलेशन सुनिश्चित करें\n\n**🎯 अगले स्टेप्स:**\n1. सिफारिश किए गए बढ़ईयों से संपर्क करें\n2. अपनी जरूरतें शेयर करें\n3. डिटेल्ड कोट्स लें\n4. रेफरेंस और पुराने काम चेक करें\n5. टाइमलाइन फाइनल करके काम शुरू करें\n\nक्या आपको मटेरियल या डिज़ाइन की और कोई जानकारी चाहिए?` :
        `💡 **EXPERT TIPS:**\n• Always see previous work samples\n• Confirm material quality before starting\n• Get detailed written quotation\n• Plan for 10% extra budget for contingencies\n• Ensure proper ventilation during work\n\n**🎯 NEXT STEPS:**\n1. Contact recommended carpenters\n2. Share your requirements\n3. Get detailed quotes\n4. Check references and past work\n5. Finalize timeline and start work\n\nWould you like more specific advice on materials or design details?`;
    
    return recommendation;
}

function startArchitectConsultationFlow() {
    conversationState.currentFlow = 'architectConsultation';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🏗️ **Virtual Architect Consultation** 📐\n\nAs your expert architect, I'll understand your vision and create the perfect design solution!\n\n**Question 1/6: What type of architectural service do you need?**\n\nA) **Complete house design** - Full architectural planning\nB) **House renovation** - Modify existing structure\nC) **Interior layout** - Space planning and design\nD) **Specific room design** - Kitchen, bedroom, etc.\nE) **2D/3D drawings** - Plans and visualization\nF) **Construction supervision** - Site monitoring\nG) **Consultation only** - Expert advice\n\nWhich service matches your need?`;
}

function continueArchitectConsultationFlow(message, step) {
    // Similar implementation for architect consultation
    // ... (implementation would follow same pattern)
    return "Architect consultation flow - implementation in progress...";
}

function handleLocationQuery(message) {
    let location = '';
    let profession = '';
    
    // Extract location
    const locationWords = ['mumbai', 'pune', 'bangalore', 'delhi', 'hyderabad', 'chennai'];
    for (const loc of locationWords) {
        if (message.includes(loc)) {
            location = loc.charAt(0).toUpperCase() + loc.slice(1);
            break;
        }
    }
    
    // Extract profession
    if (message.includes('architect')) profession = 'architects';
    else if (message.includes('carpenter')) profession = 'carpenters';
    else if (message.includes('plumber')) profession = 'plumbers';
    else if (message.includes('painter')) profession = 'painters';
    else if (message.includes('electrician')) profession = 'electricians';
    
    if (location && profession) {
        const professionals = searchProfessionalsByLocation(profession, location);
        return formatProfessionalRecommendations(professionals, `${profession} in ${location}`);
    }
    
    return "I can help you find professionals in Mumbai, Pune, Bangalore, Delhi, and other major cities. Please specify both the location and type of professional you're looking for!";
}

function formatProfessionalRecommendations(professionals, title) {
    if (professionals.length === 0) {
        return `I couldn't find any ${title} in your specified criteria. Let me show you our best professionals who might be able to help you:\n\n${formatProfessionalRecommendations(getAllTopProfessionals(), "top-rated professionals")}`;
    }
    
    let response = `🔍 **EXPERT RECOMMENDATIONS: ${title.toUpperCase()}**\n\n`;
    
    professionals.slice(0, 2).forEach((prof, index) => {
        response += `**${index + 1}. ${prof.name}** ${prof.verified ? '✅' : ''}\n`;
        response += `📍 ${prof.location} (${prof.distance})\n`;
        response += `⭐ ${prof.rating}/5 (${prof.reviews} reviews)\n`;
        response += `💼 ${prof.experience} experience\n`;
        response += `🎯 Specializes in: ${prof.specializations.slice(0, 2).join(', ')}\n`;
        response += `🔧 Expert in: ${prof.expertise.slice(0, 3).join(', ')}\n`;
        response += `💰 Budget: ₹${prof.budget}\n`;
        response += `📞 ${prof.phone}\n`;
        response += `📧 ${prof.email}\n\n`;
    });
    
    if (professionals.length > 2) {
        response += `*And ${professionals.length - 2} more qualified professionals available!*\n\n`;
    }
    
    response += `💡 **NEXT STEPS:**\n`;
    response += `1. Contact them with your specific requirements\n`;
    response += `2. Ask for detailed quotations\n`;
    response += `3. Check their previous work portfolio\n`;
    response += `4. Compare proposals and select best fit\n\n`;
    response += `**Need help with requirements?** Ask me "How to brief a ${title.split(' ')[0]}" for expert tips!`;
    
    return response;
}

function handleCarpenterQuery(message) {
    let carpenters = professionalDatabase.carpenters;
    
    if (message.includes('cupboard') || message.includes('wardrobe')) {
        carpenters = carpenters.filter(c => 
            c.expertise.some(exp => exp.toLowerCase().includes('cupboard') || exp.toLowerCase().includes('wardrobe'))
        );
        return formatProfessionalList(carpenters, "carpenters specializing in cupboards and wardrobes");
    }
    
    if (message.includes('kitchen')) {
        carpenters = carpenters.filter(c => 
            c.expertise.some(exp => exp.toLowerCase().includes('kitchen'))
        );
        return formatProfessionalList(carpenters, "carpenters specializing in kitchen work");
    }
    
    if (message.includes('furniture')) {
        carpenters = carpenters.filter(c => 
            c.expertise.some(exp => exp.toLowerCase().includes('furniture'))
        );
        return formatProfessionalList(carpenters, "carpenters specializing in furniture");
    }
    
    return formatProfessionalList(carpenters, "carpenters");
}

function handleArchitectQuery(message) {
    let architects = professionalDatabase.architects;
    
    if (message.includes('luxury') || message.includes('villa')) {
        architects = architects.filter(a => 
            a.specializations.some(spec => spec.toLowerCase().includes('luxury') || spec.toLowerCase().includes('villa'))
        );
        return formatProfessionalList(architects, "architects specializing in luxury homes and villas");
    }
    
    if (message.includes('sustainable') || message.includes('eco') || message.includes('green')) {
        architects = architects.filter(a => 
            a.specializations.some(spec => spec.toLowerCase().includes('sustainable') || spec.toLowerCase().includes('eco'))
        );
        return formatProfessionalList(architects, "architects specializing in sustainable design");
    }
    
    return formatProfessionalList(architects, "architects");
}

function handlePlumberQuery(message) {
    let plumbers = professionalDatabase.plumbers;
    
    if (message.includes('bathroom')) {
        plumbers = plumbers.filter(p => 
            p.expertise.some(exp => exp.toLowerCase().includes('bathroom'))
        );
        return formatProfessionalList(plumbers, "plumbers specializing in bathroom work");
    }
    
    if (message.includes('kitchen')) {
        plumbers = plumbers.filter(p => 
            p.expertise.some(exp => exp.toLowerCase().includes('kitchen'))
        );
        return formatProfessionalList(plumbers, "plumbers specializing in kitchen plumbing");
    }
    
    if (message.includes('luxury') || message.includes('smart')) {
        plumbers = plumbers.filter(p => 
            p.specializations.some(spec => spec.toLowerCase().includes('luxury') || spec.toLowerCase().includes('smart'))
        );
        return formatProfessionalList(plumbers, "plumbers specializing in luxury and smart plumbing");
    }
    
    return formatProfessionalList(plumbers, "plumbers");
}

function handlePainterQuery(message) {
    let painters = professionalDatabase.painters;
    
    if (message.includes('interior')) {
        painters = painters.filter(p => 
            p.specializations.some(spec => spec.toLowerCase().includes('interior'))
        );
        return formatProfessionalList(painters, "painters specializing in interior work");
    }
    
    if (message.includes('exterior')) {
        painters = painters.filter(p => 
            p.specializations.some(spec => spec.toLowerCase().includes('exterior'))
        );
        return formatProfessionalList(painters, "painters specializing in exterior work");
    }
    
    if (message.includes('artistic') || message.includes('decorative')) {
        painters = painters.filter(p => 
            p.specializations.some(spec => spec.toLowerCase().includes('artistic') || spec.toLowerCase().includes('decorative'))
        );
        return formatProfessionalList(painters, "painters specializing in artistic and decorative work");
    }
    
    return formatProfessionalList(painters, "painters");
}

function handleElectricianQuery(message) {
    let electricians = professionalDatabase.electricians;
    
    if (message.includes('smart') || message.includes('automation')) {
        electricians = electricians.filter(e => 
            e.specializations.some(spec => spec.toLowerCase().includes('smart') || spec.toLowerCase().includes('automation'))
        );
        return formatProfessionalList(electricians, "electricians specializing in smart home systems");
    }
    
    return formatProfessionalList(electricians, "electricians");
}

function handleBudgetQuery(message) {
    return `💰 **Budget Planning Guide:**

**Architects:**
• Basic Design: ₹50k - ₹150k
• Premium Design: ₹150k - ₹300k
• Luxury Projects: ₹300k - ₹600k

**Carpenters:**
• Basic Furniture: ₹15k - ₹50k
• Custom Work: ₹20k - ₹80k
• Luxury Furniture: ₹40k - ₹120k

**Plumbers:**
• Basic Work: ₹3k - ₹15k
• Standard Fitting: ₹5k - ₹25k
• Luxury Installation: ₹15k - ₹60k

**Painters:**
• Standard Painting: ₹5k - ₹20k
• Quality Work: ₹8k - ₹30k
• Artistic/Decorative: ₹15k - ₹50k

**Tips:**
• Get multiple quotes
• Check reviews and past work
• Plan for 10-15% extra budget
• Consider material costs separately

Would you like specific quotes for your project?`;
}

function handleAdviceQuery(message) {
    return `🏠 **Expert Home Construction Advice:**

**Planning Phase:**
1. Define your requirements clearly
2. Set a realistic budget (add 15% buffer)
3. Get necessary approvals/permits
4. Choose professionals carefully

**Design Phase:**
1. Focus on functionality first
2. Plan for natural light and ventilation
3. Consider future needs
4. Don't compromise on structural elements

**Construction Tips:**
• Quality materials save money long-term
• Regular site visits are essential
• Document everything with photos
• Weather-proof your timelines

**Professional Selection:**
• Check credentials and past work
• Get detailed written quotes
• Verify insurance and licenses
• Ask for client references

**Common Mistakes to Avoid:**
❌ Choosing cheapest quotes without quality check
❌ Changing plans during construction
❌ Skipping quality materials for structure
❌ Not planning for storage space

What specific aspect would you like more advice on?`;
}

function searchProfessionalsByLocation(profession, location) {
    return professionalDatabase[profession].filter(professional => 
        professional.location.toLowerCase().includes(location.toLowerCase())
    );
}

function formatProfessionalList(professionals, title) {
    if (professionals.length === 0) {
        return `I couldn't find any ${title} in your specified criteria. Let me show you our best professionals who might be able to help you:\n\n${formatProfessionalList(getAllTopProfessionals(), "top-rated professionals")}`;
    }
    
    let response = `🔍 **Here are the best ${title}:**\n\n`;
    
    professionals.slice(0, 3).forEach((prof, index) => {
        response += `**${index + 1}. ${prof.name}** ${prof.verified ? '✅' : ''}\n`;
        response += `📍 ${prof.location} (${prof.distance})\n`;
        response += `⭐ ${prof.rating}/5 (${prof.reviews} reviews)\n`;
        response += `💼 ${prof.experience} experience\n`;
        response += `🎯 Specializes in: ${prof.specializations.slice(0, 2).join(', ')}\n`;
        response += `💰 Budget: ₹${prof.budget}\n`;
        response += `📞 ${prof.phone}\n\n`;
    });
    
    if (professionals.length > 3) {
        response += `And ${professionals.length - 3} more professionals available!\n\n`;
    }
    
    response += `💡 **Want to:**\n`;
    response += `• See more professionals? Ask "show more ${title}"\n`;
    response += `• Get specific help? Ask "who can help with [specific work]"\n`;
    response += `• Compare options? Ask "compare these professionals"\n`;
    
    return response;
}

function getAllTopProfessionals() {
    const allProfessionals = [
        ...professionalDatabase.architects,
        ...professionalDatabase.carpenters,
        ...professionalDatabase.plumbers,
        ...professionalDatabase.painters,
        ...professionalDatabase.electricians
    ];
    
    return allProfessionals
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
}

function showChatbot() {
    initializeChatbot();
    initializeVoiceRecognition();
    showScreen('ai-chatbot-screen');
}

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
                <p>${message}</p>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-avatar user-avatar">👤</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-avatar ai-avatar">🤖</div>
            <div class="message-content ai-content">
                <p>${message}</p>
                <span class="message-time">${timestamp}</span>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar ai-avatar">🤖</div>
        <div class="message-content ai-content">
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function showChatbot() {
    showScreen('ai-chatbot-screen');
    
    // Initialize chat if not done already
    if (!chatInitialized) {
        initializeChat();
        chatInitialized = true;
    }
}

function initializeChat() {
    const welcomeMessage = currentLanguage === 'hi' ? 
        `🙏 नमस्ते! मैं Homii AI असिस्टेंट हूं। मैं आपकी घर बनाने की यात्रा में मदद कर सकता हूं:\n\n🏗️ आर्किटेक्ट्स और इंजीनियर्स खोजना\n🪑 बढ़ई और फर्नीचर डिज़ाइन\n💰 बजट प्लानिंग\n🎨 डिज़ाइन सुझाव\n📋 प्रोजेक्ट प्लानिंग\n\nआप मुझसे कुछ भी पूछ सकते हैं!` :
        `👋 Hi! I'm your Homii AI Assistant. I can help you with your home building journey:\n\n🏗️ Finding architects & engineers\n🪑 Carpenter & furniture design\n💰 Budget planning\n🎨 Design suggestions\n📋 Project planning\n\nFeel free to ask me anything!`;
    
    addMessageToChat(welcomeMessage, 'ai');
}

function handleChatInputKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Notes Functions
window.writeNotes = writeNotes;
window.saveNote = saveNote;
window.loadNotesList = loadNotesList;
window.deleteNote = deleteNote;
window.goToDesignBrief = goToDesignBrief;

// Enhanced AI Chatbot Functions - More Intelligent & Conversational
function processUserMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // If we're in the middle of a conversation flow, continue it
    if (conversationState.currentFlow) {
        return continueConversationFlow(message);
    }
    
    // Enhanced Budget Planning Flow - Ask detailed questions first
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('estimate')) {
        return startEnhancedBudgetFlow();
    }
    
    // Enhanced Carpenter Consultation - More detailed questioning
    if (lowerMessage.includes('carpenter') || lowerMessage.includes('cupboard') || lowerMessage.includes('furniture') || lowerMessage.includes('wood')) {
        return startEnhancedCarpenterFlow();
    }
    
    // Enhanced Professional Search - Ask requirements first
    if (lowerMessage.includes('architect')) {
        return startEnhancedArchitectFlow();
    }
    
    if (lowerMessage.includes('plumber')) {
        return startEnhancedPlumberFlow();
    }
    
    if (lowerMessage.includes('painter') || lowerMessage.includes('paint')) {
        return startEnhancedPainterFlow();
    }
    
    // Home planning and design flows
    if (lowerMessage.includes('plan') && (lowerMessage.includes('home') || lowerMessage.includes('house'))) {
        return startHomePlanningFlow();
    }
    
    if (lowerMessage.includes('design') && (lowerMessage.includes('home') || lowerMessage.includes('house') || lowerMessage.includes('interior'))) {
        return startHomeDesignFlow();
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
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "🏠 **Welcome! I'm your AI Home Planning Expert** 🏗️\n\nI'm designed to be truly helpful by understanding your needs first, then providing expert advice and professional recommendations.\n\n🎯 **I can help you with:**\n\n💰 **Smart Budget Planning** - I'll ask about your house size, rooms, quality needs to estimate accurate costs\n🔨 **Carpenter Consultation** - Tell me about cupboards, wood types, timeline and I'll find perfect carpenters\n🏗️ **Complete Home Planning** - From design to construction\n📐 **Expert Professional Matching** - Based on your specific requirements\n\n**Just tell me what you're planning, and I'll ask the right questions to help you!**\n\n💡 Try: \"I need budget for my house\", \"I want cupboards made\", \"Find me an architect\"";
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! 😊 I'm designed to understand your needs first and then provide the most relevant help. Feel free to ask about any planning, design, or construction needs!";
    }
    
    // Default response for unclear messages
    return "🤔 I want to help you in the best way possible! Could you tell me more specifically about what you're planning?\n\n🏠 **I specialize in:**\n• Budget planning (I'll ask about house size, rooms, quality)\n• Finding carpenters (I'll ask about cupboard type, wood, timeline)\n• Architect recommendations (based on your project type)\n• Complete home planning and design\n\nWhat would you like help with today?";
}

// Enhanced Budget Flow - Much more detailed questioning
function startEnhancedBudgetFlow() {
    conversationState.currentFlow = 'enhancedBudget';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `💰 **Smart Budget Planning Expert** 📊\n\nHello! Instead of just giving you random estimates, let me ask the RIGHT questions to give you an accurate, detailed budget breakdown.\n\n**Question 1/7: What type of project are you budgeting for?**\n\nA) **New house construction** - Building from scratch\nB) **Complete house renovation** - Full makeover of existing house\nC) **Specific rooms renovation** - Kitchen, bathrooms, bedrooms\nD) **Interior design only** - Furniture, decor, false ceiling\nE) **Extension/Addition** - Adding rooms or floors\n\n🎯 **Why this matters:** Each project type has completely different cost structures and requirements.\n\nWhich one describes your project?`;
}

// Enhanced Carpenter Flow - Detailed questioning like a real carpenter would ask
function startEnhancedCarpenterFlow() {
    conversationState.currentFlow = 'enhancedCarpenter';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🔨 **Master Carpenter Consultation** 🪵\n\nHi! I'm your virtual carpentry expert. Instead of immediately giving you phone numbers, let me understand your needs like a real carpenter would during a site visit.\n\n**Question 1/6: What carpentry work are you planning?**\n\nA) **Bedroom cupboards/wardrobes** - Clothes storage\nB) **Kitchen cabinets** - Modular kitchen setup\nC) **Living room furniture** - TV unit, showcase, center table\nD) **Study/office furniture** - Desk, bookshelf, storage\nE) **Custom furniture** - Dining table, beds, chairs\nF) **Wooden flooring** - Hardwood, laminate installation\nG) **Repair/modification** - Fix existing furniture\n\n📝 **Different work needs different expertise and wood types.**\n\nWhat type of carpentry work do you have in mind?`;
}

// Enhanced Architect Flow
function startEnhancedArchitectFlow() {
    conversationState.currentFlow = 'enhancedArchitect';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🏗️ **Master Architect Consultation** 📐\n\nHello! As your virtual architect, let me understand your vision first, then recommend the perfect architect for your specific needs.\n\n**Question 1/5: What architectural service do you need?**\n\nA) **Complete house design** - Full architectural planning from scratch\nB) **House renovation design** - Modify existing structure\nC) **Interior space planning** - Room layouts and design\nD) **Specific room design** - Kitchen, bathroom, bedroom layout\nE) **3D visualization** - See your design before construction\nF) **Construction supervision** - Architect to monitor building work\n\n🎯 **Different services need architects with different specializations.**\n\nWhich service best describes what you need?`;
}

// Enhanced Plumber Flow
function startEnhancedPlumberFlow() {
    conversationState.currentFlow = 'enhancedPlumber';
    conversationState.step = 1;
    conversationState.userResponses = {};
    
    return `🔧 **Master Plumber Consultation** 💧\n\nHi! Let me understand your plumbing needs first, then recommend the right plumber with the exact expertise you need.\n\n**Question 1/4: What plumbing work do you need?**\n\nA) **New bathroom setup** - Complete bathroom plumbing\nB) **Kitchen plumbing** - Sink, water connections, drainage\nC) **Water heater installation** - Geyser, solar heater setup\nD) **Pipe repair/replacement** - Leakage, old pipe replacement\nE) **Drainage problems** - Blockage, sewage issues\nF) **Water tank/pump installation** - Overhead tank, motor setup\nG) **Emergency repair** - Urgent leakage or blockage\n\n🔧 **Different plumbing work needs different expertise and tools.**\n\nWhat plumbing work are you planning?`;
}

// Continue conversation flows for enhanced versions
function continueConversationFlow(message) {
    const lowerMessage = message.toLowerCase();
    
    switch (conversationState.currentFlow) {
        case 'enhancedBudget':
            return continueEnhancedBudgetFlow(message, conversationState.step);
        case 'enhancedCarpenter':
            return continueEnhancedCarpenterFlow(message, conversationState.step);
        case 'enhancedArchitect':
            return continueEnhancedArchitectFlow(message, conversationState.step);
        case 'enhancedPlumber':
            return continueEnhancedPlumberFlow(message, conversationState.step);
        case 'budgetConsultation':
            return continueBudgetConsultationFlow(message, conversationState.step);
        case 'carpenterConsultation':
            return continueCarpenterConsultationFlow(message, conversationState.step);
        case 'architectConsultation':
            return continueArchitectConsultationFlow(message, conversationState.step);
        default:
            return resetConversation();
    }
}

// Enhanced Budget Flow Implementation
function continueEnhancedBudgetFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let projectType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('new')) projectType = 'New Construction';
            else if (lowerMessage.includes('b') || lowerMessage.includes('complete')) projectType = 'Complete Renovation';
            else if (lowerMessage.includes('c') || lowerMessage.includes('specific')) projectType = 'Specific Rooms';
            else if (lowerMessage.includes('d') || lowerMessage.includes('interior')) projectType = 'Interior Design';
            else if (lowerMessage.includes('e') || lowerMessage.includes('extension')) projectType = 'Extension/Addition';
            
            conversationState.projectData.projectType = projectType;
            
            return `✅ **${projectType}** - Perfect!\n\n**Question 2/7: How big is your house/project area?**\n\n📏 **I need specific measurements for accurate costing:**\n\n🏠 **Please tell me:**\n• Total area in square feet (like \"1200 sqft\")\n• OR room-wise details (like \"10x12 kitchen + 2 bedrooms\")\n• Built-up area vs carpet area (if you know)\n\n📝 **Examples:**\n• \"1500 sqft independent house\"\n• \"900 sqft 2BHK apartment\"\n• \"Kitchen 8x10 + 2 bathrooms 6x8 each\"\n\nWhat's the size of your project?`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.area = message;
            
            return `📐 **Area: ${message}** - Got it!\n\n**Question 3/7: How many rooms does your house have?**\n\n🏠 **Room configuration affects costs significantly:**\n\nA) **1 BHK** - 1 bedroom, 1 bathroom, kitchen, living\nB) **2 BHK** - 2 bedrooms, 2 bathrooms, kitchen, living\nC) **3 BHK** - 3 bedrooms, 2-3 bathrooms, kitchen, living\nD) **4+ BHK** - 4+ bedrooms, multiple bathrooms\nE) **Villa/Independent** - Multiple floors, special rooms\nF) **Custom configuration** - Tell me your room details\n\n💡 **Why this matters:** Kitchens cost ₹2000-3000/sqft, bathrooms cost ₹2500-4000/sqft, while bedrooms cost ₹1200-2000/sqft.\n\nWhat's your house configuration?`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.rooms = message;
            
            return `🏠 **Configuration noted!**\n\n**Question 4/7: What quality/finish level do you want?**\n\n⭐ **This is crucial for accurate budgeting:**\n\nA) **Basic** (₹1,200-1,500/sqft) - Standard materials, simple finishes\nB) **Standard** (₹1,800-2,200/sqft) - Good quality materials, decent finishes\nC) **Premium** (₹2,500-3,000/sqft) - High-quality materials, premium finishes\nD) **Luxury** (₹3,500-5,000/sqft) - Top materials, designer finishes\nE) **Mixed** - Different quality for different rooms\n\n🎯 **What's included at each level:**\n• **Basic:** Vitrified tiles, basic fixtures, standard paint\n• **Premium:** Marble/granite, modular fittings, texture paint\n• **Luxury:** Imported materials, designer elements\n\nWhich quality level suits your vision and budget?`;
            
        case 4:
            conversationState.step = 5;
            conversationState.projectData.quality = message;
            
            return `⭐ **Quality level set!**\n\n**Question 5/7: Any special features or requirements?**\n\n✨ **Special additions that affect budget:**\n\n🏠 **Common extras:**\n• Modular kitchen (₹1-3 lakhs extra)\n• Designer bathrooms (₹50K-2L extra each)\n• False ceiling (₹100-300/sqft)\n• Wooden flooring (₹200-800/sqft)\n• Smart home features (₹50K-2L)\n• Solar panels (₹1-2L)\n• Landscaping/garden (₹50K-3L)\n• Swimming pool (₹3-8L)\n\n📝 **List any special features you want, or type \"standard\" for basic work.**\n\nWhat special features do you have in mind?`;
            
        case 5:
            conversationState.step = 6;
            conversationState.projectData.specialFeatures = message;
            
            return `✨ **Special features noted!**\n\n**Question 6/7: What's your target timeline?**\n\n⏰ **Timeline affects costs and planning:**\n\nA) **Fast track** (6-8 months) - 15-20% extra cost but quick completion\nB) **Normal** (8-12 months) - Standard timeline, balanced costs\nC) **Relaxed** (12-18 months) - Potential cost savings, better planning\nD) **Specific deadline** - Tell me when you need it completed\n\n📅 **Timeline factors:**\n• Material availability and pricing\n• Labor costs (rush work costs more)\n• Weather considerations (monsoon delays)\n• Permit processing time\n\nWhat timeline works for you?`;
            
        case 6:
            conversationState.step = 7;
            conversationState.projectData.timeline = message;
            
            return `⏰ **Timeline set!**\n\n**Final Question 7/7: What's your budget range or budget preference?**\n\n💰 **This helps me tailor recommendations:**\n\nA) **Tell me my total cost first** - Calculate based on my requirements\nB) **I have a fixed budget** - Tell me your budget limit\nC) **Show me options** - Different budget scenarios\nD) **Focus on value** - Best quality within reasonable cost\n\n💡 **I'll provide:**\n• Detailed cost breakdown\n• Phase-wise payment plan\n• Cost-saving recommendations\n• Professional recommendations within budget\n\nHow would you like me to approach your budget?`;
            
        case 7:
            conversationState.projectData.budgetPreference = message;
            return generateDetailedBudgetReport();
            
        default:
            return resetConversation();
    }
}

// Enhanced Carpenter Flow Implementation  
function continueEnhancedCarpenterFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let workType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('bedroom') || lowerMessage.includes('cupboard')) {
                workType = 'Bedroom Cupboards/Wardrobes';
            } else if (lowerMessage.includes('b') || lowerMessage.includes('kitchen')) {
                workType = 'Kitchen Cabinets';
            } else if (lowerMessage.includes('c') || lowerMessage.includes('living')) {
                workType = 'Living Room Furniture';
            } else if (lowerMessage.includes('d') || lowerMessage.includes('study') || lowerMessage.includes('office')) {
                workType = 'Study/Office Furniture';
            } else if (lowerMessage.includes('e') || lowerMessage.includes('custom')) {
                workType = 'Custom Furniture';
            } else if (lowerMessage.includes('f') || lowerMessage.includes('flooring')) {
                workType = 'Wooden Flooring';
            } else {
                workType = 'Repair/Modification Work';
            }
            
            conversationState.projectData.workType = workType;
            
            return `🔨 **${workType}** - Great choice!\n\n**Question 2/6: Tell me the exact details of what you need:**\n\n📝 **For ${workType}, I need to know:**\n\n📏 **Specific requirements:**\n• How many units/pieces? (like \"2 wardrobes\", \"complete kitchen\")\n• What size/dimensions? (like \"6 feet wardrobe\", \"10x8 kitchen\")\n• Which rooms? (master bedroom, kitchen, etc.)\n• Any specific design ideas?\n\n💡 **Example:** \"2 sliding door wardrobes for master bedroom, 7 feet wide each, with mirror on one door\"\n\nDescribe exactly what you want made:`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.details = message;
            
            return `📝 **Requirements: ${message}** - Perfect details!\n\n**Question 3/6: What type of wood/material do you prefer?**\n\n🌳 **As your carpenter expert, here's what I recommend for ${conversationState.projectData.workType}:**\n\nA) **Teak Wood** - Premium, 50+ year life, beautiful grain, ₹800-1200/sqft\nB) **Sheesham/Rosewood** - Excellent choice, 25+ years, ₹400-600/sqft\nC) **Mango Wood** - Good quality, nice finish, ₹300-500/sqft\nD) **Commercial Plywood + Veneer** - Modern, practical, ₹200-400/sqft\nE) **MDF + Laminate** - Budget-friendly, smooth finish, ₹150-300/sqft\nF) **Ask me to recommend** - I'll suggest best for your use\n\n🎯 **My expert opinion:** For ${conversationState.projectData.workType}, I usually recommend specific woods based on usage, moisture exposure, and budget.\n\nWhich material sounds right for you?`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.material = message;
            
            return `🌳 **Material choice noted!**\n\n**Question 4/6: What's your budget range for this work?**\n\n💰 **Honest carpenter advice on pricing:**\n\nA) **₹15,000 - 30,000** - Basic work, simple designs\nB) **₹30,000 - 60,000** - Good quality, standard features\nC) **₹60,000 - 1,20,000** - Premium work, custom designs\nD) **₹1,20,000+** - High-end, luxury carpentry\nE) **Tell me your exact budget** - I'll work within it\nF) **Calculate cost for me** - Based on my requirements\n\n📊 **Budget includes:** Material cost (60%) + Labor (30%) + Hardware/fittings (10%)\n\n💡 **Pro tip:** Quality hardware (hinges, slides) makes a huge difference in longevity!\n\nWhat budget range works for you?`;
            
        case 4:
            conversationState.step = 5;
            conversationState.projectData.budget = message;
            
            return `💰 **Budget noted!**\n\n**Question 5/6: When do you need this completed?**\n\n⏰ **Timeline planning (affects cost and carpenter availability):**\n\nA) **Urgent (1-2 weeks)** - Rush job, 20-30% extra cost but quick delivery\nB) **Soon (2-4 weeks)** - Normal priority, standard pricing\nC) **Standard (1-2 months)** - Good planning time, better pricing\nD) **Flexible (2+ months)** - Best pricing, can work around other jobs\nE) **Specific date needed** - Tell me your deadline\n\n🔨 **What affects timeline:**\n• Material procurement (2-7 days)\n• Workshop/manufacturing time\n• Installation and finishing\n• Other ongoing projects\n\nWhat timeline suits you?`;
            
        case 5:
            conversationState.step = 6;
            conversationState.projectData.timeline = message;
            
            return `⏰ **Timeline set!**\n\n**Final Question 6/6: Any specific design preferences or special requirements?**\n\n🎨 **Design elements that matter:**\n\n✨ **Popular options:**\n• Soft-close hinges and drawers\n• LED lighting inside cupboards\n• Mirror or glass panels\n• Specific color/finish preferences\n• Handles and hardware style\n• Internal organization (shelves, hangers, drawers)\n\n🏠 **Installation considerations:**\n• Wall mounting requirements\n• Electrical work needed (for lights)\n• Room access and size constraints\n\n📝 **Tell me any specific design ideas, or type \"standard design\" for regular carpentry work.**\n\nAny special design requirements?`;
            
        case 6:
            conversationState.projectData.designPrefs = message;
            return generateCarpenterRecommendationReport();
            
        default:
            return resetConversation();
    }
}

// Generate detailed budget report
function generateDetailedBudgetReport() {
    const data = conversationState.projectData;
    resetConversation();
    
    return `💰 **COMPREHENSIVE BUDGET ANALYSIS REPORT** 📊\n\n**═══════════════════════════════════**\n\n📋 **YOUR PROJECT PROFILE:**\n• Project Type: ${data.projectType}\n• Area: ${data.area}\n• Configuration: ${data.rooms}\n• Quality Level: ${data.quality}\n• Special Features: ${data.specialFeatures}\n• Timeline: ${data.timeline}\n• Budget Approach: ${data.budgetPreference}\n\n🎯 **DETAILED COST BREAKDOWN:**\n\n**🏗️ MAJOR COMPONENTS:**\n• **Structure & Civil Work (40%):** Foundation, walls, roof\n• **Electrical & Plumbing (20%):** Complete MEP work\n• **Flooring & Tiling (15%):** All floor and wall finishes\n• **Painting & Finishing (10%):** Paint, polish, final touches\n• **Doors & Windows (8%):** All openings and fittings\n• **Miscellaneous (7%):** Permits, supervision, extras\n\n**💡 EXPERT RECOMMENDATIONS:**\n\n1. **Phase your project** for better cash flow management\n2. **Buy materials in bulk** for 10-15% savings\n3. **Plan for 10% contingency** for unexpected costs\n4. **Focus budget on structural quality** first\n\n**📞 NEXT STEPS:**\nBased on your detailed requirements, I can now recommend the perfect professionals who specialize in your type of project and budget range.\n\nWould you like me to find architects, contractors, or other professionals who can execute this project within your requirements?`;
}

// Generate detailed carpenter recommendation report
function generateCarpenterRecommendationReport() {
    const data = conversationState.projectData;
    
    // Find matching carpenters
    let matchingCarpenters = professionalDatabase.carpenters.filter(carpenter => {
        return carpenter.expertise.some(exp => 
            data.workType.toLowerCase().includes(exp.toLowerCase()) ||
            exp.toLowerCase().includes(data.workType.toLowerCase().split(' ')[0])
        );
    });
    
    resetConversation();
    
    let report = `🔨 **MASTER CARPENTER CONSULTATION REPORT** 🪵\n\n**═══════════════════════════════════**\n\n📋 **YOUR CARPENTRY PROJECT:**\n• Work Type: ${data.workType}\n• Details: ${data.details}\n• Material: ${data.material}\n• Budget: ${data.budget}\n• Timeline: ${data.timeline}\n• Design Preferences: ${data.designPrefs}\n\n🎯 **EXPERT CARPENTRY RECOMMENDATIONS:**\n\n**🔧 TECHNICAL SPECIFICATIONS:**\n• Material thickness: 18-20mm for structure, 12mm for backs\n• Hardware: Soft-close hinges and drawer slides recommended\n• Finish: 3-coat polish + protective coating\n• Installation: Professional wall mounting with L-brackets\n\n**💰 ACCURATE COST BREAKDOWN:**\n• Material Cost (60%): High-quality wood and boards\n• Labor Cost (30%): Skilled carpentry work\n• Hardware & Fittings (10%): Hinges, handles, slides\n\n**⏰ REALISTIC TIMELINE:**\n• Design finalization: 1-2 days\n• Material procurement: 3-5 days\n• Workshop manufacturing: 1-2 weeks\n• Site installation: 1-2 days\n• Total duration: 2-3 weeks\n\n**👨‍🔧 PERFECT CARPENTER MATCHES FOR YOUR PROJECT:**\n\n`;
    
    matchingCarpenters.slice(0, 3).forEach((carpenter, index) => {
        report += `**${index + 1}. ${carpenter.name}** ${carpenter.verified ? '✅ Verified' : ''}\n`;
        report += `📍 Location: ${carpenter.location} (${carpenter.distance} away)\n`;
        report += `⭐ Rating: ${carpenter.rating}/5 (${carpenter.reviews} reviews)\n`;
        report += `🔨 Experience: ${carpenter.experience}\n`;
        report += `🎯 Specializes in: ${carpenter.expertise.join(', ')}\n`;
        report += `💰 Budget range: ₹${carpenter.budget}\n`;
        report += `📞 Contact: ${carpenter.phone}\n`;
        report += `📧 Email: ${carpenter.email}\n\n`;
    });
    
    report += `💡 **PROFESSIONAL ADVICE:**\n• Always see portfolio/previous work samples\n• Get detailed written quotation with material specifications\n• Confirm timeline and payment schedule\n• Plan for 5-10% extra budget for modifications\n• Ensure proper ventilation during polishing work\n\n🎯 **RECOMMENDED NEXT STEPS:**\n1. Contact 2-3 recommended carpenters\n2. Share your detailed requirements\n3. Ask for site visit and quotation\n4. Compare quotes and check references\n5. Finalize carpenter and start work\n\nWould you like more specific advice on wood selection or design details?`;
    
    return report;
}

// Enhanced Architect Flow Implementation
function continueEnhancedArchitectFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let serviceType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('complete')) serviceType = 'Complete House Design';
            else if (lowerMessage.includes('b') || lowerMessage.includes('renovation')) serviceType = 'Renovation Design';
            else if (lowerMessage.includes('c') || lowerMessage.includes('interior')) serviceType = 'Interior Space Planning';
            else if (lowerMessage.includes('d') || lowerMessage.includes('specific')) serviceType = 'Specific Room Design';
            else if (lowerMessage.includes('e') || lowerMessage.includes('3d')) serviceType = '3D Visualization';
            else serviceType = 'Construction Supervision';
            
            conversationState.projectData.serviceType = serviceType;
            
            return `🏗️ **${serviceType}** - Excellent choice!\n\n**Question 2/5: What's the size and type of your project?**\n\n🏠 **Project details I need:**\n• House/area size (like "1200 sqft", "3BHK")\n• Project location (city/area)\n• New construction or existing house?\n• Any specific architectural style preference?\n\n📝 **Example:** "1500 sqft 3BHK house in Mumbai, new construction, modern style"\n\nTell me about your project:`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.projectDetails = message;
            
            return `📋 **Project details noted!**\n\n**Question 3/5: What's your budget range for architectural services?**\n\n💰 **Architect fees typically:**\n\nA) **₹50,000 - 1,50,000** - Basic design, standard plans\nB) **₹1,50,000 - 3,00,000** - Detailed design, 3D views\nC) **₹3,00,000 - 6,00,000** - Premium design, full service\nD) **₹6,00,000+** - Luxury, custom architectural design\nE) **Calculate for me** - Based on my project scope\n\n📐 **What's typically included:** Floor plans, elevations, structural guidance, permit drawings\n\nWhat budget range works for you?`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.budget = message;
            
            return `💰 **Budget range set!**\n\n**Question 4/5: What's your timeline for this architectural work?**\n\n⏰ **Typical architectural timelines:**\n\nA) **Urgent (2-4 weeks)** - Rush project, premium charges\nB) **Standard (1-2 months)** - Normal timeline, good planning\nC) **Detailed (2-3 months)** - Comprehensive design process\nD) **Flexible** - Take time for best results\n\nWhat timeline suits your project?`;
            
        case 4:
            conversationState.step = 5;
            conversationState.projectData.timeline = message;
            
            return `⏰ **Timeline confirmed!**\n\n**Final Question 5/5: Any specific architectural preferences or requirements?**\n\n🎨 **Design considerations:**\n• Architectural style (modern, traditional, contemporary)\n• Vastu compliance requirements\n• Energy efficiency/green building features\n• Special rooms or features needed\n• Structural preferences\n\n📝 **Tell me your specific preferences, or type "standard design" for conventional architecture.**\n\nAny special architectural requirements?`;
            
        case 5:
            conversationState.projectData.preferences = message;
            return generateArchitectRecommendationReport();
            
        default:
            return resetConversation();
    }
}

// Enhanced Plumber Flow Implementation
function continueEnhancedPlumberFlow(message, step) {
    const lowerMessage = message.toLowerCase();
    
    switch (step) {
        case 1:
            conversationState.step = 2;
            let workType = '';
            if (lowerMessage.includes('a') || lowerMessage.includes('bathroom')) workType = 'New Bathroom Setup';
            else if (lowerMessage.includes('b') || lowerMessage.includes('kitchen')) workType = 'Kitchen Plumbing';
            else if (lowerMessage.includes('c') || lowerMessage.includes('heater')) workType = 'Water Heater Installation';
            else if (lowerMessage.includes('d') || lowerMessage.includes('repair')) workType = 'Pipe Repair/Replacement';
            else if (lowerMessage.includes('e') || lowerMessage.includes('drainage')) workType = 'Drainage Problems';
            else if (lowerMessage.includes('f') || lowerMessage.includes('tank')) workType = 'Water Tank/Pump Installation';
            else workType = 'Emergency Repair';
            
            conversationState.projectData.workType = workType;
            
            return `🔧 **${workType}** - I understand!\n\n**Question 2/4: Tell me the specific details of your plumbing work:**\n\n💧 **For ${workType}, I need to know:**\n• Exact location (which room/area)\n• Current problem or new installation details\n• Any urgency level\n• Access to main water line\n\n📝 **Example:** "Master bathroom complete plumbing, new construction, need geyser point and drainage"\n\nDescribe your plumbing requirement:`;
            
        case 2:
            conversationState.step = 3;
            conversationState.projectData.details = message;
            
            return `💧 **Requirements: ${message}** - Clear!\n\n**Question 3/4: What's your budget for this plumbing work?**\n\n💰 **Typical plumbing costs:**\n\nA) **₹3,000 - 8,000** - Basic repairs, small installations\nB) **₹8,000 - 20,000** - Standard bathroom/kitchen work\nC) **₹20,000 - 50,000** - Complete bathroom setup, major work\nD) **₹50,000+** - Premium fixtures, complex installations\nE) **Emergency rate** - Urgent work, immediate attention\n\n🔧 **Includes:** Labor, basic fittings, pipes (premium fixtures extra)\n\nWhat's your budget range?`;
            
        case 3:
            conversationState.step = 4;
            conversationState.projectData.budget = message;
            
            return `💰 **Budget noted!**\n\n**Final Question 4/4: When do you need this plumbing work completed?**\n\n⏰ **Plumbing timeline options:**\n\nA) **Emergency (same day)** - Urgent issues, premium charges\nB) **ASAP (1-2 days)** - Quick turnaround\nC) **This week (3-5 days)** - Standard scheduling\nD) **Flexible (1-2 weeks)** - Better planning, cost optimization\n\n💡 **Timeline affects:** Plumber availability, material procurement, cost\n\nWhat timeline works for you?`;
            
        case 4:
            conversationState.projectData.timeline = message;
            return generatePlumberRecommendationReport();
            
        default:
            return resetConversation();
    }
}

// Generate architect recommendation report
function generateArchitectRecommendationReport() {
    const data = conversationState.projectData;
    
    // Find matching architects
    let matchingArchitects = professionalDatabase.architects.filter(architect => {
        return architect.specializations.some(spec => 
            data.serviceType.toLowerCase().includes(spec.toLowerCase()) ||
            spec.toLowerCase().includes('residential')
        );
    });
    
    resetConversation();
    
    let report = `🏗️ **MASTER ARCHITECT CONSULTATION REPORT** 📐\n\n**═══════════════════════════════════**\n\n📋 **YOUR ARCHITECTURAL PROJECT:**\n• Service Type: ${data.serviceType}\n• Project Details: ${data.projectDetails}\n• Budget Range: ${data.budget}\n• Timeline: ${data.timeline}\n• Preferences: ${data.preferences}\n\n🎯 **ARCHITECTURAL RECOMMENDATIONS:**\n\n**📐 SCOPE OF WORK:**\n• Detailed floor plans and elevations\n• Structural layout and specifications\n• 3D visualization and walkthroughs\n• Building permit drawings\n• Construction supervision (if opted)\n\n**⏰ TYPICAL PROJECT PHASES:**\n• Concept design: 1-2 weeks\n• Detailed drawings: 3-4 weeks\n• Permit submissions: 2-3 weeks\n• Construction guidance: Ongoing\n\n**👨‍💼 PERFECT ARCHITECT MATCHES:**\n\n`;
    
    matchingArchitects.slice(0, 3).forEach((architect, index) => {
        report += `**${index + 1}. ${architect.name}** ${architect.verified ? '✅ Verified' : ''}\n`;
        report += `📍 Location: ${architect.location} (${architect.distance} away)\n`;
        report += `⭐ Rating: ${architect.rating}/5 (${architect.reviews} reviews)\n`;
        report += `🏗️ Experience: ${architect.experience}\n`;
        report += `🎯 Specializes in: ${architect.specializations.join(', ')}\n`;
        report += `💰 Fee range: ₹${architect.budget}\n`;
        report += `📞 Contact: ${architect.phone}\n`;
        report += `📧 Email: ${architect.email}\n\n`;
    });
    
    report += `💡 **EXPERT ADVICE:**\n• Review portfolio and previous projects\n• Discuss timeline and deliverables clearly\n• Understand fee structure and payment terms\n• Ensure architect is registered with local authorities\n• Check references from past clients\n\nWould you like specific guidance on architectural planning or design elements?`;
    
    return report;
}

// Generate plumber recommendation report
function generatePlumberRecommendationReport() {
    const data = conversationState.projectData;
    
    // Find matching plumbers
    let matchingPlumbers = professionalDatabase.plumbers.filter(plumber => {
        return plumber.expertise.some(exp => 
            data.workType.toLowerCase().includes(exp.toLowerCase()) ||
            exp.toLowerCase().includes(data.workType.toLowerCase().split(' ')[0])
        );
    });
    
    resetConversation();
    
    let report = `🔧 **MASTER PLUMBER CONSULTATION REPORT** 💧\n\n**═══════════════════════════════════**\n\n📋 **YOUR PLUMBING PROJECT:**\n• Work Type: ${data.workType}\n• Details: ${data.details}\n• Budget Range: ${data.budget}\n• Timeline: ${data.timeline}\n\n🎯 **PLUMBING RECOMMENDATIONS:**\n\n**💧 TECHNICAL SPECIFICATIONS:**\n• Use ISI marked pipes and fittings\n• Proper slope for drainage (1:100 ratio)\n• Hot/cold water separate lines\n• Isolation valves for easy maintenance\n\n**🔧 WORK SCOPE:**\n• Material procurement and installation\n• Testing for leaks and pressure\n• Proper pipe insulation where needed\n• Clean-up and debris removal\n\n**👨‍🔧 PERFECT PLUMBER MATCHES:**\n\n`;
    
    matchingPlumbers.slice(0, 3).forEach((plumber, index) => {
        report += `**${index + 1}. ${plumber.name}** ${plumber.verified ? '✅ Verified' : ''}\n`;
        report += `📍 Location: ${plumber.location} (${plumber.distance} away)\n`;
        report += `⭐ Rating: ${plumber.rating}/5 (${plumber.reviews} reviews)\n`;
        report += `🔧 Experience: ${plumber.experience}\n`;
        report += `🎯 Specializes in: ${plumber.expertise.join(', ')}\n`;
        report += `💰 Rate range: ₹${plumber.budget}\n`;
        report += `📞 Contact: ${plumber.phone}\n`;
        report += `📧 Email: ${plumber.email}\n\n`;
    });
    
    report += `💡 **PROFESSIONAL TIPS:**\n• Always test all connections before final payment\n• Keep warranty receipts for materials\n• Ensure proper ventilation in bathroom work\n• Check water pressure after installation\n• Get written quotation with material details\n\nNeed more specific advice on plumbing materials or installation?`;
    
    return report;
}

function resetConversation() {
    conversationState.currentFlow = null;
    conversationState.step = 0;
    conversationState.userResponses = {};
    conversationState.projectData = {};
    return "How else can I help you with your home planning needs?";
}

// Enhanced AI Consultation Flow Functions
function startEnhancedBudgetFlow() {
    conversationState.currentFlow = 'budget';
    conversationState.step = 1;
    
    return currentLanguage === 'hi' ? 
        `💰 **बजट प्लानिंग में आपकी सहायता करूंगा!**\n\n**प्रश्न 1/4: आपका प्रोजेक्ट कैसा है?**\n\n🏗️ **चुनें:**\n• नया घर निर्माण\n• रेनोवेशन/मरम्मत\n• इंटीरियर डिजाइन\n• कमरा एडिशन\n\nबताएं कि आप क्या बना रहे हैं?` :
        `💰 **I'll help you plan your budget!**\n\n**Question 1/4: What type of project is this?**\n\n🏗️ **Choose from:**\n• New home construction\n• Renovation/repair\n• Interior design\n• Room addition\n\nTell me what you're building?`;
}

function startEnhancedCarpenterFlow() {
    conversationState.currentFlow = 'carpenter';
    conversationState.step = 1;
    
    return currentLanguage === 'hi' ? 
        `🪑 **बढ़ई की सेवा चाहिए? मैं सही बढ़ई खोजने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसा काम करवाना है?**\n\n🛠️ **काम का प्रकार:**\n• अलमारी/वार्डरोब\n• किचन कैबिनेट\n• बेड/फर्नीचर\n• दरवाजे/खिड़कियां\n• मरम्मत का काम\n\nबताएं कि क्या काम है?` :
        `🪑 **Need a carpenter? I'll help you find the right one!**\n\n**Question 1/4: What type of work do you need?**\n\n🛠️ **Work type:**\n• Cupboard/wardrobe\n• Kitchen cabinets\n• Bed/furniture\n• Doors/windows\n• Repair work\n\nTell me what work you need?`;
}

function startEnhancedArchitectFlow() {
    conversationState.currentFlow = 'architect';
    conversationState.step = 1;
    
    return currentLanguage === 'hi' ? 
        `🏗️ **आर्किटेक्ट खोज रहे हैं? मैं बेहतरीन आर्किटेक्ट ढूंढने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसा प्रोजेक्ट है?**\n\n🏠 **प्रोजेक्ट का प्रकार:**\n• नया घर डिजाइन\n• रेसिडेंशियल प्लान\n• कमर्शियल बिल्डिंग\n• रेनोवेशन प्लान\n• लैंडस्केप डिजाइन\n\nबताएं कि कैसा प्रोजेक्ट है?` :
        `🏗️ **Looking for an architect? I'll help you find the perfect one!**\n\n**Question 1/4: What type of project is this?**\n\n🏠 **Project type:**\n• New home design\n• Residential planning\n• Commercial building\n• Renovation planning\n• Landscape design\n\nTell me about your project?`;
}

function startEnhancedPlumberFlow() {
    conversationState.currentFlow = 'plumber';
    conversationState.step = 1;
    
    return currentLanguage === 'hi' ? 
        `🔧 **प्लंबर चाहिए? मैं अच्छे प्लंबर खोजने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसा काम है?**\n\n💧 **काम का प्रकार:**\n• नया प्लंबिंग इंस्टॉलेशन\n• लीकेज की मरम्मत\n• बाथरूम फिटिंग\n• किचन प्लंबिंग\n• गीजर इंस्टॉलेशन\n\nबताएं कि क्या काम है?` :
        `🔧 **Need a plumber? I'll help you find a skilled one!**\n\n**Question 1/4: What type of work is needed?**\n\n💧 **Work type:**\n• New plumbing installation\n• Leak repair\n• Bathroom fitting\n• Kitchen plumbing\n• Geyser installation\n\nTell me what work you need?`;
}

function startEnhancedPainterFlow() {
    conversationState.currentFlow = 'painter';
    conversationState.step = 1;
    
    return currentLanguage === 'hi' ? 
        `🎨 **पेंटर चाहिए? मैं बेस्ट पेंटर ढूंढने में मदद करूंगा!**\n\n**प्रश्न 1/4: कैसी पेंटिंग करवानी है?**\n\n🖌️ **पेंटिंग का प्रकार:**\n• पूरे घर की पेंटिंग\n• कमरे की पेंटिंग\n• एक्सटीरियर पेंटिंग\n• टेक्सचर पेंटिंग\n• वॉलपेपर लगवाना\n\nबताएं कि कैसी पेंटिंग है?` :
        `🎨 **Need a painter? I'll help you find an expert painter!**\n\n**Question 1/4: What type of painting work?**\n\n🖌️ **Painting type:**\n• Whole house painting\n• Room painting\n• Exterior painting\n• Texture painting\n• Wallpaper installation\n\nTell me what painting work you need?`;
}

// Continue conversation flows
function continueConversationFlow(message) {
    if (!conversationState.currentFlow) {
        return "I'm not sure what you're referring to. Could you please start a new question?";
    }
    
    const flow = conversationState.currentFlow;
    const step = conversationState.step;
    
    // Store user response
    conversationState.userResponses[`step_${step}`] = message;
    
    switch (flow) {
        case 'budget':
            return continueBudgetFlow(message, step);
        case 'carpenter':
            return continueCarpenterFlow(message, step);
        case 'architect':
            return continueArchitectFlow(message, step);
        case 'plumber':
            return continuePlumberFlow(message, step);
        case 'painter':
            return continuePainterFlow(message, step);
        default:
            return resetConversation();
    }
}

function continueBudgetFlow(message, step) {
    conversationState.step = step + 1;
    
    switch (step) {
        case 1:
            conversationState.projectData.projectType = message;
            return `💰 **Great! ${message} project noted.**\n\n**Question 2/4: What's your location?**\n\n📍 **This helps me suggest:**\n• Local material costs\n• Labor rates in your area\n• Nearby suppliers\n\nExample: "Mumbai, Andheri" or "Pune, Kothrud"`;
            
        case 2:
            conversationState.projectData.location = message;
            return `📍 **Location: ${message}**\n\n**Question 3/4: What's your approximate budget range?**\n\n💰 **Budget range:**\n• Under ₹5 Lakhs\n• ₹5-15 Lakhs\n• ₹15-30 Lakhs\n• ₹30+ Lakhs\n\nOr tell me your specific budget amount:`;
            
        case 3:
            conversationState.projectData.budget = message;
            return `💰 **Budget: ${message}**\n\n**Final Question 4/4: Any specific requirements?**\n\n📝 **Optional details:**\n• Timeline (when to start)\n• Special materials needed\n• Specific design preferences\n• Any constraints\n\nOr type "done" to get your budget plan:`;
            
        case 4:
            conversationState.projectData.requirements = message;
            return generateBudgetPlan(conversationState.projectData);
            
        default:
            return resetConversation();
    }
}

function generateBudgetPlan(data) {
    resetConversation();
    
    return `💰 **PERSONALIZED BUDGET PLAN**\n\n🏠 **Project:** ${data.projectType}\n📍 **Location:** ${data.location}\n💳 **Budget:** ${data.budget}\n\n**📊 BUDGET BREAKDOWN:**\n• Material costs (50-60%)\n• Labor charges (25-35%)\n• Design & permits (5-10%)\n• Contingency (10-15%)\n\n**🔍 NEXT STEPS:**\n1. Get 3 quotes from contractors\n2. Visit material suppliers nearby\n3. Factor in 15% extra for changes\n\n**👥 RECOMMENDED PROFESSIONALS:**\nWould you like me to suggest contractors and suppliers in ${data.location}?`;
}

// AI Chatbot Functions
window.showChatbot = showChatbot;
window.sendChatMessage = sendChatMessage;
window.handleChatInputKeyPress = handleChatInputKeyPress;
window.toggleVoiceRecognition = toggleVoiceRecognition;
window.toggleLanguage = toggleLanguage;