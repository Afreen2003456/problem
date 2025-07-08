// Airline Data Insights - Frontend JavaScript
const API_BASE_URL = 'http://localhost:8000';

// Global variables
let priceChart, marketShareChart, routeChart;
let currentFlights = [];
let allRoutes = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialData();
});

// Initialize the application
function initializeApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Initialize charts
    initializeCharts();
    
    // Load initial data
    loadPopularRoutes();
    loadAIInsights();
}

// Setup event listeners
function setupEventListeners() {
    // Flight search form
    document.getElementById('flightSearchForm').addEventListener('submit', handleFlightSearch);
    
    // Clear filters button
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Sort functionality
    document.getElementById('sortBy').addEventListener('change', sortFlights);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Handle flight search
async function handleFlightSearch(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const searchParams = {
        origin: formData.get('origin'),
        destination: formData.get('destination'),
        date: formData.get('date'),
        min_price: formData.get('minPrice') || undefined,
        max_price: formData.get('maxPrice') || undefined,
        airline: formData.get('airline') || undefined
    };
    
    // Remove undefined values
    Object.keys(searchParams).forEach(key => 
        searchParams[key] === undefined && delete searchParams[key]
    );
    
    showLoadingState('flightResults');
    
    try {
        const response = await fetch(`${API_BASE_URL}/flights/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(searchParams)
        });
        
        if (!response.ok) {
            throw new Error('Failed to search flights');
        }
        
        const data = await response.json();
        currentFlights = data.flights || [];
        displayFlights(currentFlights);
        
        // Update charts with new data
        updatePriceChart(currentFlights);
        
    } catch (error) {
        console.error('Error searching flights:', error);
        showErrorState('flightResults', 'Failed to search flights. Please try again.');
    }
}

// Display flights
function displayFlights(flights) {
    const container = document.getElementById('flightResults');
    
    if (!flights || flights.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5>No flights found</h5>
                <p class="text-muted">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = flights.map(flight => `
        <div class="flight-card fade-in">
            <div class="flight-header">
                <div class="d-flex align-items-center">
                    <div class="airline-logo bg-primary text-white d-flex align-items-center justify-content-center">
                        ${flight.airline.charAt(0)}
                    </div>
                    <div>
                        <div class="flight-route">${flight.origin} → ${flight.destination}</div>
                        <div class="text-muted">${flight.airline}</div>
                    </div>
                </div>
                <div class="flight-price">$${flight.price}</div>
            </div>
            <div class="flight-details">
                <div class="flight-detail">
                    <i class="fas fa-clock"></i>
                    <span>Duration: ${flight.duration}</span>
                </div>
                <div class="flight-detail">
                    <i class="fas fa-plane-departure"></i>
                    <span>Departure: ${flight.departure_time}</span>
                </div>
                <div class="flight-detail">
                    <i class="fas fa-plane-arrival"></i>
                    <span>Arrival: ${flight.arrival_time}</span>
                </div>
                <div class="flight-detail">
                    <i class="fas fa-calendar"></i>
                    <span>Date: ${flight.date}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Sort flights
function sortFlights() {
    const sortBy = document.getElementById('sortBy').value;
    
    if (!currentFlights || currentFlights.length === 0) return;
    
    const sortedFlights = [...currentFlights].sort((a, b) => {
        switch (sortBy) {
            case 'price':
                return parseFloat(a.price) - parseFloat(b.price);
            case 'duration':
                return parseDuration(a.duration) - parseDuration(b.duration);
            case 'departure':
                return a.departure_time.localeCompare(b.departure_time);
            default:
                return 0;
        }
    });
    
    displayFlights(sortedFlights);
}

// Parse duration string to minutes
function parseDuration(duration) {
    const matches = duration.match(/(\d+)h\s*(\d+)m/);
    if (matches) {
        return parseInt(matches[1]) * 60 + parseInt(matches[2]);
    }
    return 0;
}

// Clear filters
function clearFilters() {
    document.getElementById('flightSearchForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Clear results
    document.getElementById('flightResults').innerHTML = `
        <div class="text-center">
            <i class="fas fa-plane fa-2x text-muted mb-3"></i>
            <p>Search for flights to see results</p>
        </div>
    `;
    
    currentFlights = [];
}

// Load popular routes
async function loadPopularRoutes() {
    try {
        const response = await fetch(`${API_BASE_URL}/routes/popular`);
        if (!response.ok) throw new Error('Failed to load popular routes');
        
        const data = await response.json();
        allRoutes = data.routes || [];
        displayPopularRoutes(allRoutes);
        
    } catch (error) {
        console.error('Error loading popular routes:', error);
        showErrorState('popularRoutes', 'Failed to load popular routes');
    }
}

// Display popular routes
function displayPopularRoutes(routes) {
    const container = document.getElementById('popularRoutes');
    
    if (!routes || routes.length === 0) {
        container.innerHTML = '<p class="text-muted">No popular routes data available</p>';
        return;
    }
    
    container.innerHTML = routes.map(route => `
        <div class="route-item">
            <div class="route-info">
                <div class="route-name">${route.route}</div>
                <div class="route-stats">
                    ${route.flights} flights • Avg: $${route.avg_price}
                </div>
            </div>
            <div class="route-badge">
                ${route.popularity}% popular
            </div>
        </div>
    `).join('');
}

// Load AI insights
async function loadAIInsights() {
    try {
        const response = await fetch(`${API_BASE_URL}/insights/generate`);
        if (!response.ok) throw new Error('Failed to load AI insights');
        
        const data = await response.json();
        displayAIInsights(data.insights || []);
        
    } catch (error) {
        console.error('Error loading AI insights:', error);
        showErrorState('aiInsights', 'Failed to generate AI insights');
    }
}

// Display AI insights
function displayAIInsights(insights) {
    const container = document.getElementById('aiInsights');
    
    if (!insights || insights.length === 0) {
        container.innerHTML = '<p class="text-muted">No AI insights available</p>';
        return;
    }
    
    container.innerHTML = insights.map(insight => `
        <div class="insight-item">
            <div class="insight-title">${insight.title}</div>
            <div class="insight-text">${insight.description}</div>
        </div>
    `).join('');
}

// Initialize charts
function initializeCharts() {
    // Price trends chart
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    priceChart = new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Price',
                data: [],
                borderColor: '#0d6efd',
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Market share chart
    const marketCtx = document.getElementById('marketShareChart').getContext('2d');
    marketShareChart = new Chart(marketCtx, {
        type: 'doughnut',
        data: {
            labels: ['American Airlines', 'Delta Air Lines', 'United Airlines', 'Southwest Airlines', 'Others'],
            datasets: [{
                data: [25, 20, 18, 15, 22],
                backgroundColor: [
                    '#0d6efd',
                    '#198754',
                    '#ffc107',
                    '#dc3545',
                    '#6c757d'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Route popularity chart
    const routeCtx = document.getElementById('routeChart').getContext('2d');
    routeChart = new Chart(routeCtx, {
        type: 'bar',
        data: {
            labels: ['JFK-LAX', 'NYC-MIA', 'CHI-LAS', 'DFW-DEN', 'BOS-SFO'],
            datasets: [{
                label: 'Flights per Day',
                data: [45, 38, 32, 28, 25],
                backgroundColor: '#0d6efd',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Load initial chart data
    loadInitialData();
}

// Load initial data for charts
async function loadInitialData() {
    try {
        // Load price trends
        const trendsResponse = await fetch(`${API_BASE_URL}/trends/pricing`);
        if (trendsResponse.ok) {
            const trendsData = await trendsResponse.json();
            updatePriceTrendsChart(trendsData);
        }
        
        // Update route chart with popular routes data
        if (allRoutes.length > 0) {
            updateRouteChart(allRoutes);
        }
        
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}

// Update price trends chart
function updatePriceTrendsChart(data) {
    if (!data || !data.trends) return;
    
    const labels = data.trends.map(item => item.date);
    const prices = data.trends.map(item => item.avg_price);
    
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = prices;
    priceChart.update();
}

// Update price chart with flight data
function updatePriceChart(flights) {
    if (!flights || flights.length === 0) return;
    
    // Group flights by airline and calculate average price
    const airlineData = {};
    flights.forEach(flight => {
        if (!airlineData[flight.airline]) {
            airlineData[flight.airline] = {
                total: 0,
                count: 0
            };
        }
        airlineData[flight.airline].total += parseFloat(flight.price);
        airlineData[flight.airline].count++;
    });
    
    const labels = Object.keys(airlineData);
    const prices = labels.map(airline => 
        Math.round(airlineData[airline].total / airlineData[airline].count)
    );
    
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = prices;
    priceChart.update();
}

// Update route chart
function updateRouteChart(routes) {
    if (!routes || routes.length === 0) return;
    
    const labels = routes.slice(0, 5).map(route => route.route);
    const data = routes.slice(0, 5).map(route => route.flights);
    
    routeChart.data.labels = labels;
    routeChart.data.datasets[0].data = data;
    routeChart.update();
}

// Show loading state
function showLoadingState(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Loading...</p>
        </div>
    `;
}

// Show error state
function showErrorState(containerId, message) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h5>Error</h5>
            <p class="text-muted">${message}</p>
            <button class="btn btn-primary btn-sm" onclick="location.reload()">
                <i class="fas fa-redo me-2"></i>
                Retry
            </button>
        </div>
    `;
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Error handling for API calls
function handleApiError(error, context) {
    console.error(`API Error in ${context}:`, error);
    
    // Show user-friendly error message
    const errorMessage = error.message || 'An unexpected error occurred';
    
    // You could implement toast notifications here
    // For now, we'll just log to console
    console.warn(`User notification: ${errorMessage}`);
}

// Initialize tooltips (if using Bootstrap)
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Call initialize tooltips after DOM is loaded
document.addEventListener('DOMContentLoaded', initializeTooltips); 