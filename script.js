// Global variables
let map;
let userLocation = null;
let markers = [];
let userMarker = null;
let activeOpportunityId = null;

// Mock data for volunteer opportunities
const volunteerOpportunities = [
    {
        id: 1,
        title: "Community Garden Cleanup",
        organization: "Green Future Initiative",
        category: "environment",
        description: "Help maintain our community garden by weeding, watering plants, and harvesting vegetables for local food banks. Learn about sustainable gardening practices while making a direct impact on food security in our neighborhood.",
        date: "2025-01-20",
        time: "9:00 AM - 12:00 PM",
        minAge: 13,
        maxVolunteers: 15,
        currentVolunteers: 8,
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Garden St, New York, NY",
        contact: "maria@greenfuture.org",
        phone: "(555) 123-4567",
        requirements: "Bring work gloves and water bottle",
        skills: "No special skills required",
        hours: 3
    },
    {
        id: 2,
        title: "Elementary Reading Tutoring",
        organization: "Literacy First",
        category: "education",
        description: "Support elementary students with reading comprehension and homework assistance. Work one-on-one or in small groups to help children develop critical literacy skills. Training provided for new volunteers.",
        date: "2025-01-22",
        time: "3:30 PM - 5:30 PM",
        minAge: 16,
        maxVolunteers: 12,
        currentVolunteers: 5,
        lat: 40.7589,
        lng: -73.9851,
        address: "456 Education Ave, New York, NY",
        contact: "john@literacyfirst.org",
        phone: "(555) 234-5678",
        requirements: "Background check required",
        skills: "Patience and enthusiasm for working with children",
        hours: 2
    },
    {
        id: 3,
        title: "Hospital Patient Support",
        organization: "City General Hospital",
        category: "healthcare",
        description: "Provide companionship and support to patients by reading, playing games, or simply being a friendly presence. Help distribute meals and assist nursing staff with non-medical tasks.",
        date: "2025-01-25",
        time: "10:00 AM - 2:00 PM",
        minAge: 18,
        maxVolunteers: 8,
        currentVolunteers: 3,
        lat: 40.7505,
        lng: -73.9934,
        address: "789 Health Blvd, New York, NY",
        contact: "sarah@citygeneral.org",
        phone: "(555) 345-6789",
        requirements: "Health screening and orientation required",
        skills: "Compassion and good communication skills",
        hours: 4
    },
    {
        id: 4,
        title: "Senior Center Activities",
        organization: "Golden Years Community Center",
        category: "seniors",
        description: "Lead activities for senior citizens including bingo, arts and crafts, light exercise classes, and technology tutorials. Help create a vibrant, engaging environment for our elderly community members.",
        date: "2025-01-18",
        time: "1:00 PM - 4:00 PM",
        minAge: 16,
        maxVolunteers: 10,
        currentVolunteers: 7,
        lat: 40.7282,
        lng: -73.9942,
        address: "321 Senior Way, New York, NY",
        contact: "betty@goldenyears.org",
        phone: "(555) 456-7890",
        requirements: "Enthusiasm and respect for elderly",
        skills: "Activity planning or teaching experience helpful",
        hours: 3
    },
    {
        id: 5,
        title: "Animal Shelter Care",
        organization: "Paws & Hearts Rescue",
        category: "animals",
        description: "Help care for rescued animals by feeding, grooming, exercising dogs, socializing cats, and cleaning kennels. Assist with adoption events and help potential adopters meet their perfect companions.",
        date: "2025-01-19",
        time: "8:00 AM - 12:00 PM",
        minAge: 16,
        maxVolunteers: 20,
        currentVolunteers: 12,
        lat: 40.7411,
        lng: -73.9897,
        address: "654 Animal Ave, New York, NY",
        contact: "mike@pawshearts.org",
        phone: "(555) 567-8901",
        requirements: "Comfortable around animals",
        skills: "Animal handling experience preferred but not required",
        hours: 4
    },
    {
        id: 6,
        title: "Food Bank Sorting",
        organization: "Neighborhood Food Network",
        category: "community",
        description: "Sort and package donated food items for distribution to families in need. Help organize inventory, check expiration dates, and prepare food boxes for weekly distributions.",
        date: "2025-01-21",
        time: "6:00 PM - 8:00 PM",
        minAge: 13,
        maxVolunteers: 25,
        currentVolunteers: 18,
        lat: 40.7350,
        lng: -74.0028,
        address: "987 Community Dr, New York, NY",
        contact: "lisa@foodnetwork.org",
        phone: "(555) 678-9012",
        requirements: "Closed-toe shoes required",
        skills: "Ability to lift 25 pounds",
        hours: 2
    },
    {
        id: 7,
        title: "Beach Cleanup Initiative",
        organization: "Ocean Guardians",
        category: "environment",
        description: "Join our monthly beach cleanup to remove trash and debris from the shoreline. Learn about marine conservation while protecting local wildlife habitats and keeping our beaches beautiful.",
        date: "2025-01-26",
        time: "7:00 AM - 11:00 AM",
        minAge: 13,
        maxVolunteers: 50,
        currentVolunteers: 32,
        lat: 40.7831,
        lng: -73.9712,
        address: "Ocean Beach Park, Queens, NY",
        contact: "alex@oceanguardians.org",
        phone: "(555) 789-0123",
        requirements: "Bring reusable water bottle and sun protection",
        skills: "Physical stamina for walking on sand",
        hours: 4
    },
    {
        id: 8,
        title: "Youth Mentorship Program",
        organization: "Future Leaders Academy",
        category: "education",
        description: "Mentor high school students in academic subjects, college preparation, and career planning. Share your experiences and help guide young people toward their educational and professional goals.",
        date: "2025-01-23",
        time: "4:00 PM - 6:00 PM",
        minAge: 18,
        maxVolunteers: 6,
        currentVolunteers: 4,
        lat: 40.7614,
        lng: -73.9776,
        address: "135 Future St, New York, NY",
        contact: "david@futureleaders.org",
        phone: "(555) 890-1234",
        requirements: "College experience or professional background",
        skills: "Strong communication and leadership skills",
        hours: 2
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    loadOpportunities();
    getUserLocation();
});

// Initialize Leaflet map
function initializeMap() {
    // Default to NYC coordinates
    map = L.map('map').setView([40.7128, -74.0060], 12);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add click handler to close opportunity details when clicking on map
    map.on('click', function() {
        clearActiveOpportunity();
    });
}

// Get user's current location
function getUserLocation() {
    if ("geolocation" in navigator) {
        showLoading(true);
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                // Center map on user location
                map.setView([userLocation.lat, userLocation.lng], 13);
                
                // Add user location marker
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                const userIcon = L.divIcon({
                    html: '<i class="fas fa-user-circle" style="color: #FFD700; font-size: 24px;"></i>',
                    iconSize: [24, 24],
                    className: 'user-location-marker'
                });
                
                userMarker = L.marker([userLocation.lat, userLocation.lng], {
                    icon: userIcon
                }).addTo(map);
                
                userMarker.bindPopup("Your Location").openPopup();
                
                // Recalculate distances and reload opportunities
                loadOpportunities();
                showLoading(false);
            },
            function(error) {
                console.warn("Geolocation error:", error);
                showLoading(false);
                // Continue with default location (NYC)
                loadOpportunities();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    } else {
        // Geolocation not supported, use default location
        loadOpportunities();
    }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Load and display volunteer opportunities
function loadOpportunities() {
    // Calculate distances if user location is available
    const opportunitiesWithDistance = volunteerOpportunities.map(opp => {
        if (userLocation) {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                opp.lat, opp.lng
            );
            return { ...opp, distance: Math.round(distance * 10) / 10 };
        }
        return { ...opp, distance: null };
    });
    
    // Sort by distance if available, otherwise by date
    opportunitiesWithDistance.sort((a, b) => {
        if (a.distance !== null && b.distance !== null) {
            return a.distance - b.distance;
        }
        return new Date(a.date) - new Date(b.date);
    });
    
    displayOpportunities(opportunitiesWithDistance);
    addMarkersToMap(opportunitiesWithDistance);
}

// Display opportunities in the list
function displayOpportunities(opportunities) {
    const container = document.getElementById('opportunities-list');
    const countElement = document.getElementById('opportunity-count');
    
    if (opportunities.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--gray);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No opportunities found</h3>
                <p>Try adjusting your filters or expanding your search area.</p>
            </div>
        `;
        countElement.textContent = "0 opportunities found";
        return;
    }
    
    countElement.textContent = `${opportunities.length} ${opportunities.length === 1 ? 'opportunity' : 'opportunities'} found`;
    
    container.innerHTML = opportunities.map(opp => `
        <div class="opportunity-card" onclick="selectOpportunity(${opp.id})" id="card-${opp.id}">
            <div class="opportunity-header">
                <div>
                    <div class="opportunity-title">${opp.title}</div>
                    <div class="opportunity-organization">${opp.organization}</div>
                </div>
                ${opp.distance !== null ? `<div class="opportunity-distance">${opp.distance} mi</div>` : ''}
            </div>
            
            <div class="opportunity-details">
                <div class="opportunity-detail">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(opp.date)}
                </div>
                <div class="opportunity-detail">
                    <i class="fas fa-clock"></i>
                    ${opp.time}
                </div>
                <div class="opportunity-detail">
                    <i class="fas fa-users"></i>
                    ${opp.currentVolunteers}/${opp.maxVolunteers}
                </div>
                <div class="opportunity-detail">
                    <i class="fas fa-user-check"></i>
                    Age ${opp.minAge}+
                </div>
            </div>
            
            <div class="opportunity-category">${opp.category}</div>
            <div class="opportunity-description">${opp.description}</div>
        </div>
    `).join('');
}

// Add markers to map
function addMarkersToMap(opportunities) {
    // Clear existing markers
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    markers = [];
    
    // Create custom icons for different categories
    const categoryIcons = {
        environment: 'leaf',
        education: 'book',
        healthcare: 'heartbeat',
        community: 'users',
        seniors: 'home',
        animals: 'paw'
    };
    
    opportunities.forEach(opp => {
        const iconClass = categoryIcons[opp.category] || 'hands-helping';
        
        const customIcon = L.divIcon({
            html: `<div class="custom-marker">
                     <i class="fas fa-${iconClass}"></i>
                   </div>`,
            iconSize: [30, 30],
            className: 'custom-marker-container'
        });
        
        const marker = L.marker([opp.lat, opp.lng], {
            icon: customIcon
        }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="marker-popup">
                <h4>${opp.title}</h4>
                <p><strong>${opp.organization}</strong></p>
                <p><i class="fas fa-calendar"></i> ${formatDate(opp.date)}</p>
                <p><i class="fas fa-clock"></i> ${opp.time}</p>
                <p><i class="fas fa-users"></i> ${opp.currentVolunteers}/${opp.maxVolunteers} volunteers</p>
                <button onclick="openOpportunityModal(${opp.id})" class="popup-btn">
                    View Details
                </button>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('click', function() {
            selectOpportunity(opp.id);
        });
        
        markers.push(marker);
    });
}

// Select and highlight an opportunity
function selectOpportunity(id) {
    // Clear previous selection
    clearActiveOpportunity();
    
    // Set active opportunity
    activeOpportunityId = id;
    
    // Highlight card
    const card = document.getElementById(`card-${id}`);
    if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Find and highlight marker
    const opportunity = volunteerOpportunities.find(opp => opp.id === id);
    if (opportunity) {
        // Center map on opportunity
        map.setView([opportunity.lat, opportunity.lng], 15);
        
        // Find corresponding marker and open popup
        const markerIndex = volunteerOpportunities.findIndex(opp => opp.id === id);
        if (markers[markerIndex]) {
            markers[markerIndex].openPopup();
        }
    }
}

// Clear active opportunity selection
function clearActiveOpportunity() {
    if (activeOpportunityId) {
        const previousCard = document.getElementById(`card-${activeOpportunityId}`);
        if (previousCard) {
            previousCard.classList.remove('active');
        }
    }
    activeOpportunityId = null;
}

// Open opportunity details modal
function openOpportunityModal(id) {
    const opportunity = volunteerOpportunities.find(opp => opp.id === id);
    if (!opportunity) return;
    
    const modal = document.getElementById('opportunity-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = opportunity.title;
    
    modalBody.innerHTML = `
        <div class="modal-info-grid">
            <div class="modal-info-item">
                <i class="fas fa-building"></i>
                <div>
                    <strong>Organization</strong><br>
                    ${opportunity.organization}
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-calendar"></i>
                <div>
                    <strong>Date</strong><br>
                    ${formatDate(opportunity.date)}
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-clock"></i>
                <div>
                    <strong>Time</strong><br>
                    ${opportunity.time}
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-hourglass-half"></i>
                <div>
                    <strong>Service Hours</strong><br>
                    ${opportunity.hours} hours
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Location</strong><br>
                    ${opportunity.address}
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-users"></i>
                <div>
                    <strong>Volunteers</strong><br>
                    ${opportunity.currentVolunteers}/${opportunity.maxVolunteers}
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-user-check"></i>
                <div>
                    <strong>Age Requirement</strong><br>
                    ${opportunity.minAge} years and older
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-tag"></i>
                <div>
                    <strong>Category</strong><br>
                    ${opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                </div>
            </div>
        </div>
        
        <div class="modal-description">
            <h4>Description</h4>
            <p>${opportunity.description}</p>
        </div>
        
        <div class="modal-description">
            <h4>Requirements</h4>
            <p>${opportunity.requirements}</p>
        </div>
        
        <div class="modal-description">
            <h4>Skills Needed</h4>
            <p>${opportunity.skills}</p>
        </div>
        
        <div class="modal-actions">
            <button class="modal-btn primary" onclick="signUpForOpportunity(${opportunity.id})">
                <i class="fas fa-user-plus"></i>
                Sign Up to Volunteer
            </button>
            <button class="modal-btn secondary" onclick="getDirections(${opportunity.lat}, ${opportunity.lng})">
                <i class="fas fa-directions"></i>
                Get Directions
            </button>
            <a href="mailto:${opportunity.contact}" class="modal-btn secondary" style="background: var(--success); color: white;">
                <i class="fas fa-envelope"></i>
                Contact Organizer
            </a>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('opportunity-modal');
    modal.classList.remove('active');
}

// Sign up for opportunity (simulation)
function signUpForOpportunity(id) {
    alert('Thank you for your interest! In a real application, this would connect you with the volunteer organization to complete your registration.');
    closeModal();
}

// Get directions to opportunity
function getDirections(lat, lng) {
    if (userLocation) {
        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`;
        window.open(url, '_blank');
    } else {
        const url = `https://www.google.com/maps/search/${lat},${lng}`;
        window.open(url, '_blank');
    }
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const ageFilter = parseInt(document.getElementById('age-filter').value) || 0;
    const distanceFilter = parseInt(document.getElementById('distance-filter').value) || Infinity;
    
    let filtered = volunteerOpportunities.filter(opp => {
        // Category filter
        if (categoryFilter && opp.category !== categoryFilter) {
            return false;
        }
        
        // Age filter
        if (ageFilter && opp.minAge > ageFilter) {
            return false;
        }
        
        // Date filter
        if (dateFilter) {
            const oppDate = new Date(opp.date);
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const monthFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            
            switch (dateFilter) {
                case 'today':
                    if (opp.date !== todayStr) return false;
                    break;
                case 'week':
                    if (oppDate < today || oppDate > weekFromNow) return false;
                    break;
                case 'month':
                    if (oppDate < today || oppDate > monthFromNow) return false;
                    break;
                case 'upcoming':
                    if (oppDate < today) return false;
                    break;
            }
        }
        
        return true;
    });
    
    // Calculate distances and apply distance filter
    if (userLocation) {
        filtered = filtered.map(opp => {
            const distance = calculateDistance(
                userLocation.lat, userLocation.lng,
                opp.lat, opp.lng
            );
            return { ...opp, distance: Math.round(distance * 10) / 10 };
        }).filter(opp => opp.distance <= distanceFilter);
        
        // Sort by distance
        filtered.sort((a, b) => a.distance - b.distance);
    }
    
    displayOpportunities(filtered);
    addMarkersToMap(filtered);
}

// Clear all filters
function clearFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('date-filter').value = '';
    document.getElementById('age-filter').value = '';
    document.getElementById('distance-filter').value = '';
    
    loadOpportunities();
}

// Center map on user location
function centerMapOnUser() {
    if (userLocation) {
        map.setView([userLocation.lat, userLocation.lng], 13);
        if (userMarker) {
            userMarker.openPopup();
        }
    } else {
        getUserLocation();
    }
}

// Smooth scroll to map
function scrollToMap() {
    document.getElementById('map').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Show/hide loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loading-spinner');
    if (show) {
        spinner.classList.add('active');
    } else {
        spinner.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('opportunity-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Add CSS for custom markers
const markerStyles = document.createElement('style');
markerStyles.textContent = `
    .custom-marker-container {
        background: none !important;
        border: none !important;
    }
    
    .custom-marker {
        background: var(--fbla-blue);
        color: var(--fbla-yellow);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border: 3px solid var(--fbla-yellow);
        box-shadow: 0 2px 8px rgba(0, 51, 102, 0.3);
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .custom-marker:hover {
        transform: scale(1.1);
    }
    
    .marker-popup {
        text-align: center;
        max-width: 250px;
    }
    
    .marker-popup h4 {
        color: var(--fbla-blue);
        margin-bottom: 8px;
        font-size: 1.1rem;
    }
    
    .marker-popup p {
        margin: 4px 0;
        font-size: 0.9rem;
        color: var(--gray);
    }
    
    .marker-popup p strong {
        color: var(--dark-gray);
    }
    
    .marker-popup p i {
        color: var(--fbla-blue);
        width: 16px;
        margin-right: 4px;
    }
    
    .popup-btn {
        background: var(--fbla-blue);
        color: var(--white);
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 8px;
        transition: background 0.2s ease;
    }
    
    .popup-btn:hover {
        background: var(--dark-blue);
    }
    
    .user-location-marker {
        background: none !important;
        border: none !important;
    }
`;
document.head.appendChild(markerStyles);
