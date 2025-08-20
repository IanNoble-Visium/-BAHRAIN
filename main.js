// Main JavaScript for TruContext Bahrain Demo

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeCharts();
    initializeDemoControls();
    initializeContactForm();
    initializeVideoSystem();
    initializeAuth();
    initializeMap();
    initializeContextGraph();
    initializeSearch();
    renderRoleBadge();
    initializeState();



// Helper: set video src with fallbacks
function setVideoSourceWithFallback(videoEl, candidates) {
  if (!videoEl || !candidates || !candidates.length) return;
  let idx = 0;
  const tryNext = () => {
    if (idx >= candidates.length) return;
    const src = candidates[idx++];
    const sourceEl = videoEl.querySelector('source') || document.createElement('source');
    if (!sourceEl.parentElement) videoEl.appendChild(sourceEl);
    sourceEl.src = src;
    const onError = () => {
      videoEl.removeEventListener('error', onError);
      tryNext();
    };
    const onCanPlay = () => {
      videoEl.removeEventListener('canplay', onCanPlay);
    };
    videoEl.addEventListener('error', onError, { once: true });
    videoEl.addEventListener('canplay', onCanPlay, { once: true });
    videoEl.load();
  };
  tryNext();
}

});

// App state and datasets
function initializeState(){
  window.tcState = { view: 'executive', range: '24h' };
  const savedRole = localStorage.getItem('tc_role') || 'viewer';
  // Initial datasets per view for realism
  window.tcData = {
    executive: { security: [85,88,92,89,94,96], traffic: [78,65,89,92,56], entities: 15847, relationships: 89234, health: 98 },
    cybersecurity: { security: [78,82,86,84,90,93], traffic: [40,45,38,42,50], entities: 8934, relationships: 45621, health: 94 },
    traffic: { security: [88,90,91,93,94,95], traffic: [72,68,85,95,62], entities: 12456, relationships: 67890, health: 96,
      kpis: { manamaCongestion: 0.32, muharraqCongestion: 0.24, parkingUtil: 0.71, transitOnTime: 0.86 } },
    environment: { security: [90,91,92,93,94,95], traffic: [35,30,28,26,25], entities: 9450, relationships: 52310, health: 97,
      kpis: { aqiManama: 78, aqiMuharraq: 72, dustForecast: 0.3, heatIndex: 41 } },
    water: { security: [92,92,93,94,94,95], traffic: [20,22,24,23,21], entities: 8122, relationships: 40231, health: 98,
      kpis: { consumptionMLD: 390, leakRate: 0.07, desalEfficiency: 0.83, smartMeterAnoms: 42 } },
    energy: { security: [89,90,92,92,93,94], traffic: [25,27,28,29,27], entities: 10011, relationships: 50120, health: 99,
      kpis: { solarGenMW: 145, gridLoadMW: 1180, peakShavedMW: 42, renewablesPct: 0.12, carbonTpd: 1850 } },
    infrastructure: { security: [84,85,87,86,88,90], traffic: [40,42,45,48,50], entities: 6211, relationships: 35002, health: 96,
      kpis: { activeProjects: 128, onTimePct: 0.82, costOverrunRisk: 0.18, contractorScore: 0.76 } },
    health: { security: [90,92,95,96,97,98], traffic: [30,28,26,25,24], entities: 6789, relationships: 34567, health: 99,
      kpis: { erDemandIdx: 0.74, icuOccPct: 0.68, diabetesPrev: 0.19, obesityPrev: 0.29 } }
  };
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

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
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    document.querySelectorAll('.overview-card, .use-case-card, .dashboard-card, .value-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Animated counters
function initializeCounters() {
    const counters = document.querySelectorAll('[data-target]');

    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (target < 100) {
                    counter.textContent = current.toFixed(2);
                } else {
                    counter.textContent = Math.ceil(current).toLocaleString();
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target < 100) {
                    counter.textContent = target.toFixed(2);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            }
        };

        updateCounter();
    };

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Chart initialization
function initializeCharts() {
    window.tcCharts = window.tcCharts || {};
    // Security Trends Chart
    const securityCtx = document.getElementById('securityChart');
    if (securityCtx) {
        window.tcCharts.security = new Chart(securityCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [{
                    label: () => {
                            const v = window.tcState?.view || 'executive';
                            return v === 'cybersecurity' ? 'Threat Detections' :
                                   v === 'environment' ? 'Air Quality Index (scaled)' :
                                   v === 'energy' ? 'Grid Stability Score' :
                                   'Security Score';
                        },
                    data: [85, 88, 92, 89, 94, 96],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
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
                        beginAtZero: false,
                        min: 80,
                        max: 100,
                        grid: {
                            color: '#e5e7eb'
                        }
                    },
                    x: {
                        grid: {
                            color: '#e5e7eb'
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // Traffic Flow Chart
    const trafficCtx = document.getElementById('trafficChart');
    if (trafficCtx) {
        window.tcCharts.traffic = new Chart(trafficCtx, {
            type: 'bar',
            data: {
                labels: () => {
                        const v = window.tcState?.view || 'executive';
                        if (v === 'environment') return ['Manama', 'Muharraq', 'Riffa', 'Isa Town', 'Sitra'];
                        if (v === 'water') return ['West Network', 'North Network', 'East Network', 'South Network', 'Industrial'];
                        if (v === 'energy') return ['North Grid', 'South Grid', 'West Grid', 'East Grid', 'Manama'];
                        if (v === 'infrastructure') return ['Airport Exp.', 'Metro', 'Water Main', 'Port Upgrade', 'Housing'];
                        return ['King Faisal Hwy', 'Sheikh Khalifa Hwy', 'Diplomatic Area', 'Manama Center', 'Muharraq Bridge'];
                    },
                datasets: [{
                    label: () => {
                        const v = window.tcState?.view || 'executive';
                        return v === 'traffic' ? 'Traffic Flow' :
                               v === 'environment' ? 'AQI by District' :
                               v === 'water' ? 'Water Flow/Anomaly Index' :
                               v === 'energy' ? 'Grid Load % by Zone' :
                               v === 'infrastructure' ? 'Project Progress %' :
                               'Traffic Flow';
                    },
                    data: [78, 65, 89, 92, 56],
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#ef4444',
                        '#ef4444',
                        '#10b981'
                    ],
                    // Adjust labels for traffic chart by time range
                    if (window.tcState) {
                        const range = window.tcState.range;
                        if (range === '7d') {
                            window.tcCharts.traffic.data.labels = ['Man','Tue','Wed','Thu','Fri','Sat','Sun'];
                        } else if (range === '30d') {
                            window.tcCharts.traffic.data.labels = Array.from({length: 10}, (_,i)=>`Wk ${i+1}`);
                        } else {
                            const v = window.tcState.view;
                            if (v === 'environment') window.tcCharts.traffic.data.labels = ['Manama','Muharraq','Riffa','Isa Town','Sitra'];
                            else if (v === 'water') window.tcCharts.traffic.data.labels = ['West','North','East','South','Industrial'];
                            else if (v === 'energy') window.tcCharts.traffic.data.labels = ['North','South','West','East','Manama'];
                            else if (v === 'infrastructure') window.tcCharts.traffic.data.labels = ['Airport','Metro','Water Main','Port','Housing'];
                            else window.tcCharts.traffic.data.labels = ['King Faisal Hwy','Sheikh Khalifa Hwy','Diplomatic','Manama Center','Muharraq Bridge'];
                        }
                        window.tcCharts.traffic.update();
                    }

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
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: '#e5e7eb'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Demo dashboard controls
function initializeDemoControls() {
    const viewSelect = document.getElementById('demo-view');
    const timeButtons = document.querySelectorAll('.time-btn');

    // View selector
    if (viewSelect) {
        viewSelect.addEventListener('change', function() {
            window.tcState && (window.tcState.view = this.value);
            updateDashboardView(this.value);
        });
    }

    // Time range buttons
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const range = this.getAttribute('data-range');
            window.tcState && (window.tcState.range = range);
            updateTimeRange(range);
        });
    });

    // Simulate real-time updates
    setInterval(updateLiveData, 5000);
}

function updateDashboardView(view) {
    const dashboardCards = document.querySelectorAll('.dashboard-card');

    // Add loading effect
    dashboardCards.forEach(card => {
        card.style.opacity = '0.5';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 300);
    });

    // Update metrics based on view
    const metrics = getDashboardMetrics(view);
    updateDashboardMetrics(metrics);
    if (window.tcData && window.tcState) {
        const v = window.tcState.view;
        // Sync tiles with dataset
        const data = window.tcData[v];
        // entities/relationships/health reflect in updateDashboardMetrics already via metrics
        // Directly nudge charts too for immediate feedback
        if (window.tcCharts && window.tcCharts.security) {
            window.tcCharts.security.data.datasets[0].data = data.security.slice();
            window.tcCharts.security.update();
        }
        if (window.tcCharts && window.tcCharts.traffic) {
            window.tcCharts.traffic.data.datasets[0].data = data.traffic.slice();
            window.tcCharts.traffic.update();
        }
    }
}

function updateTimeRange(range) {
    console.log('Updating time range to:', range);
    // Simulate data refresh
    const numbers = document.querySelectorAll('.dashboard-card .number');
    numbers.forEach(num => {
        const currentValue = parseInt(num.textContent.replace(/,/g, ''));
        const variation = Math.floor(Math.random() * 1000) - 500;
        const newValue = Math.max(0, currentValue + variation);
        num.textContent = newValue.toLocaleString();
    });
}

function updateLiveData() {
    // Simulate live data updates
    // Update x-axis labels for charts based on selected time range
    if (window.tcCharts && window.tcState) {
        const range = window.tcState.range;
        // Security chart labels
        if (window.tcCharts.security) {
            window.tcCharts.security.data.labels = range === '7d' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] :
                range === '30d' ? Array.from({length: 10}, (_,i)=>`Day ${i*3+1}`) :
                ['00:00','04:00','08:00','12:00','16:00','20:00'];
            window.tcCharts.security.update();
        }
        // Traffic/sector bar labels
        if (window.tcCharts.traffic) {
            if (range === '7d') {
                window.tcCharts.traffic.data.labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            } else if (range === '30d') {
                window.tcCharts.traffic.data.labels = Array.from({length: 10}, (_,i)=>`Wk ${i+1}`);
            } else {
                const v = window.tcState.view;
                const defs = {
                    environment: ['Manama','Muharraq','Riffa','Isa Town','Sitra'],
                    water: ['West','North','East','South','Industrial'],
                    energy: ['North','South','West','East','Manama'],
                    infrastructure: ['Airport','Metro','Water Main','Port','Housing'],
                    traffic: ['King Faisal Hwy','Sheikh Khalifa Hwy','Diplomatic','Manama Center','Muharraq Bridge']
                };
                window.tcCharts.traffic.data.labels = defs[v] || defs.traffic;
            }
            window.tcCharts.traffic.update();
        }
    }

    // Adjust metric values slightly for range
    const factor = range === '7d' ? 1.05 : range === '30d' ? 1.12 : 1.0;
    const v = window.tcState?.view || 'executive';
    if (window.tcData) {
        const d = window.tcData[v];
        if (d && window.tcCharts) {
            if (window.tcCharts.security) {
                window.tcCharts.security.data.datasets[0].data = d.security.map(x=>Math.min(99, Math.round(x*factor)));
                window.tcCharts.security.update();
            }
            if (window.tcCharts.traffic) {
                window.tcCharts.traffic.data.datasets[0].data = d.traffic.map(x=>Math.min(100, Math.round(x*factor)));
                window.tcCharts.traffic.update();
            }
        }
    }

    const liveElements = document.querySelectorAll('[data-target]');
    liveElements.forEach(el => {
        if (el.closest('.dashboard-card')) {
            const currentValue = parseInt(el.textContent.replace(/,/g, ''));
            const variation = Math.floor(Math.random() * 100) - 50;
            const newValue = Math.max(0, currentValue + variation);
            el.textContent = newValue.toLocaleString();
        }
    });

    // Update trends
    // Swap dashboard video by view
    const video = document.getElementById('dashboardVideo');
    if (video) {
        const sources = {
            executive: 'publc/videos/Realtime_data_flow_202508200300_dtvgx.mp4',
            cybersecurity: 'publc/videos/8_security_threat_202508200300_wi77v.mp4',
            traffic: 'publc/videos/9_traffic_flow_202508200300_4a7jp.mp4',
            environment: 'publc/videos/environment_air_quality_preview.mp4',
            water: 'publc/videos/water_management_overview.mp4',
            energy: 'publc/videos/energy_grid_dashboard.mp4',
            infrastructure: 'publc/videos/infrastructure_projects_progress.mp4',
            health: 'publc/videos/10_health_analytics_202508200300_oyqjd.mp4'
        };
        const src = sources[view] || sources.executive;
    // Use tcData per current view
    if (window.tcData && window.tcState) {
        const v = window.tcState.view;
        if (window.tcCharts && window.tcCharts.security) {
            window.tcCharts.security.data.datasets[0].data = window.tcData[v].security.slice();
            window.tcCharts.security.update();
        }
        if (window.tcCharts && window.tcCharts.traffic) {
            window.tcCharts.traffic.data.datasets[0].data = window.tcData[v].traffic.slice();
            window.tcCharts.traffic.update();
        }
    }

        const playing = !video.paused;
        video.querySelector('source').src = src;
        video.load();
        if (playing) video.play().catch(()=>{});
    }

    // Update charts for realism by view
    if (window.tcCharts) {
        if (window.tcCharts.security) {
            window.tcCharts.security.data.datasets[0].data = generateRandomData(6, 82, 99);
            window.tcCharts.security.update();
        }
        if (window.tcCharts.traffic && view === 'traffic') {
            window.tcCharts.traffic.data.datasets[0].data = generateRandomData(5, 40, 98);
            window.tcCharts.traffic.update();
        }
    }

    const trends = document.querySelectorAll('.trend');
    trends.forEach(trend => {
        const isPositive = Math.random() > 0.3;
        const value = Math.floor(Math.random() * 20) + 1;
        trend.textContent = (isPositive ? '+' : '-') + value + '%';
        trend.className = 'trend ' + (isPositive ? 'positive' : 'negative');
    });
}

function getDashboardMetrics(view) {
    const base = {
        entities: 15847,
        relationships: 89234,
        threatLevel: 'LOW',
        health: 98
    };
    const map = {
        executive: base,
        cybersecurity: { entities: 8934, relationships: 45621, threatLevel: 'MEDIUM', health: 94 },
        traffic: { entities: 12456, relationships: 67890, threatLevel: 'LOW', health: 96 },
        environment: { entities: 9450, relationships: 52310, threatLevel: 'LOW', health: 97 },
        water: { entities: 8122, relationships: 40231, threatLevel: 'LOW', health: 98 },
        energy: { entities: 10011, relationships: 50120, threatLevel: 'LOW', health: 99 },
        infrastructure: { entities: 6211, relationships: 35002, threatLevel: 'LOW', health: 96 },
        health: { entities: 6789, relationships: 34567, threatLevel: 'LOW', health: 99 }
    };
    return map[view] || base;
}

function updateDashboardMetrics(metrics) {
    // Update network entities
    const entitiesEl = document.querySelector('.dashboard-card .number[data-target="15847"]');
    if (entitiesEl) {
        entitiesEl.textContent = metrics.entities.toLocaleString();
        entitiesEl.setAttribute('data-target', metrics.entities);
    }

    // Update relationships
    const relationshipsEl = document.querySelector('.dashboard-card .number[data-target="89234"]');
    if (relationshipsEl) {
        relationshipsEl.textContent = metrics.relationships.toLocaleString();
        relationshipsEl.setAttribute('data-target', metrics.relationships);
    }

    // Update threat level
    const threatEl = document.querySelector('.status-indicator');
    if (threatEl) {
        threatEl.textContent = metrics.threatLevel;
        threatEl.className = 'status-indicator ' + metrics.threatLevel.toLowerCase();
    }

    // Update health score
    const healthEl = document.querySelector('.health-score');
    if (healthEl) {
        healthEl.textContent = metrics.health + '%';
    }
}

// Contact form handling
function initializeContactForm() {
    const form = document.getElementById('demoForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your interest! We will contact you within 24 hours to schedule your TruContext demo.');
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
}

// Network graph animation
function animateNetworkGraph() {
    const svg = document.querySelector('#networkGraph svg');
    if (!svg) return;

    const circles = svg.querySelectorAll('circle');
    const lines = svg.querySelectorAll('line');

    // Animate connections
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '0';
            line.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                line.style.opacity = '1';
            }, 100);
        }, index * 200);
    });

    // Animate nodes
    circles.forEach((circle, index) => {
        setTimeout(() => {
            circle.style.transform = 'scale(1.2)';
            circle.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                circle.style.transform = 'scale(1)';
            }, 300);
        }, index * 150);
    });
}

// Start network animation on page load
setTimeout(animateNetworkGraph, 2000);
setInterval(animateNetworkGraph, 10000);

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function generateRandomData(length, min = 0, max = 100) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Performance monitoring
function trackPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

trackPerformance();

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

    // Alert -> video mapping
    const alertVideoMap = {
        traffic: 'publc/videos/12_traffic_congestion_202508200300_ikpda.mp4',
        network: 'publc/videos/11_cybersecurity_alert_202508200300_vghx1.mp4',
        water: 'publc/videos/13_infrastructure_anomaly_202508200300_z1ddp.mp4',
        health: 'publc/videos/14_health_system_202508200301_0d99a.mp4',
        environment: 'publc/videos/15_environmental_monitoring_202508200301_46l.mp4'
    };
    document.querySelectorAll('.alert-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            const text = item.innerText.toLowerCase();
            let key = 'environment';
            if (text.includes('traffic')) key = 'traffic';
            else if (text.includes('network') || text.includes('cyber')) key = 'network';
            else if (text.includes('water') || text.includes('pressure')) key = 'water';
            else if (text.includes('health') || text.includes('hospital')) key = 'health';
            modalVideo.src = alertVideoMap[key];
            videoModal.classList.remove('hidden');
            modalVideo.play().catch(()=>{});
        });
    });

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatNumber,
        generateRandomData,
        getDashboardMetrics
    };
}


// Video integration and modal
function initializeVideoSystem() {
    const dashboardVideo = document.getElementById('dashboardVideo');

// Alerts filtering and actions (RBAC-aware)
(function setupAlerts(){
    const select = document.getElementById('alertSeverityFilter');
    const role = localStorage.getItem('tc_role') || 'viewer';

    function applyFilter(){
        const val = (select?.value || 'all');
        document.querySelectorAll('.alert-item').forEach(item => {
            const sev = (item.getAttribute('data-severity') || '').toLowerCase();
            const match = val === 'all' || sev === val;
            item.style.display = match ? '' : 'none';
        });
    }

    function gateActions(){
        const canResolve = role === 'operator' || role === 'admin';
        document.querySelectorAll('.alert-item .resolve-btn').forEach(btn => btn.disabled = !canResolve);
        document.querySelectorAll('.alert-item .ack-btn').forEach(btn => btn.disabled = role === 'viewer');
    }

    function wireActions(){
        document.querySelectorAll('.alert-item').forEach(item => {

// Traffic heatmap toggle using Leaflet.heat
(function setupHeat(){
  const toggle = document.getElementById('heatToggle');
  const mapEl = document.getElementById('bhMap');
  if (!toggle || !mapEl || !window.L) return;
  // Ensure heat plugin is loaded if available (optional CDN)
  // If not present, we fallback to circle markers only.
  let heatLayer = null;
  let mapInstance = mapEl._leaflet_id && mapEl._leaflet ? mapEl._leaflet : null;

  // Grab existing map instance if we can (we stored it only locally). For demo, rebuild if missing.
  let map;
  try { map = L.map('bhMap'); } catch (e) { /* ignored: instance already exists */ }
  map = map || (window.__bhMapInstance);

  const points = [
    [26.2235, 50.5876, 0.8], // Manama
    [26.2579, 50.6119, 0.6], // Muharraq
    [26.1290, 50.5550, 0.9], // Riffa
    [26.1700, 50.50, 0.7],
    [26.24, 50.58, 0.65]
  ];

  function ensureMapRef(){
    // Leaflet doesn’t expose the map easily; store on window during initializeMap
    if (!window.__bhMapInstance && document.getElementById('bhMap')) {
      // no-op; initializeMap sets it
    }
  }

  function toggleHeat(){
    ensureMapRef();
    const on = toggle.value === 'on';
    if (!window.__bhMapInstance) return;
    const LHeat = window.L && (L.heatLayer || (L.HeatLayer));
    if (!LHeat) {
      console.warn('Leaflet.heat not available; heatmap toggle will be circles only');
      return;
    }
    if (on) {
      if (!heatLayer) {
        heatLayer = L.heatLayer(points, { radius: 25, blur: 15, maxZoom: 17 });
      }
      heatLayer.addTo(window.__bhMapInstance);
    } else if (heatLayer) {
      heatLayer.remove();
    }
  }

  toggle.addEventListener('change', toggleHeat);
})();

            const ack = item.querySelector('.ack-btn');
            const res = item.querySelector('.resolve-btn');
            if (ack && !ack.dataset.wired) {
                ack.dataset.wired = '1';
                ack.addEventListener('click', (e) => {
                    e.stopPropagation();
                    item.classList.add('acknowledged');
                    ack.disabled = true;
                });
            }
            if (res && !res.dataset.wired) {
                res.dataset.wired = '1';
                res.addEventListener('click', (e) => {
                    e.stopPropagation();
                    item.classList.add('resolved');
                    res.disabled = true;
                });
            }
        });
    }

    if (select) select.addEventListener('change', applyFilter);
    applyFilter();
    gateActions();
    wireActions();
})();

function renderRoleBadge(){
    const role = localStorage.getItem('tc_role') || 'viewer';
    const els = [document.getElementById('roleBadge'), document.getElementById('roleBadgeTop')];
    els.forEach(el => { if (el) el.textContent = `Role: ${role}`; });
}

// Refresh role gating when auth changes
const _applyRolePermissions = applyRolePermissions;
applyRolePermissions = function(role){
    _applyRolePermissions(role);
    renderRoleBadge();
    // Re-gate alert actions
    const canResolve = role === 'operator' || role === 'admin';
    document.querySelectorAll('.alert-item .resolve-btn').forEach(btn => btn.disabled = !canResolve);
    document.querySelectorAll('.alert-item .ack-btn').forEach(btn => btn.disabled = role === 'viewer');
};

    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const closeVideo = document.getElementById('closeVideo');

    if (dashboardVideo && videoModal && modalVideo) {
        dashboardVideo.addEventListener('click', () => {
            modalVideo.src = 'publc/videos/Digital_bahrain_network_202508200259_t1v94.mp4';
            videoModal.classList.remove('hidden');
            modalVideo.play().catch(()=>{});
        });
    }
    if (closeVideo && videoModal && modalVideo) {
        closeVideo.addEventListener('click', () => {
            modalVideo.pause();
            modalVideo.src = '';
            videoModal.classList.add('hidden');
        });
    }
}

// Simple role-based auth (front-end simulated)
function initializeAuth() {
    const openBtn = document.getElementById('openAuthModal');
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuth');
    const cancelBtn = document.getElementById('cancelAuth');
    const form = document.getElementById('authForm');

    function close() { modal.classList.add('hidden'); }

    if (openBtn && modal) openBtn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.remove('hidden'); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (cancelBtn) cancelBtn.addEventListener('click', close);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('authRole').value;
            localStorage.setItem('tc_role', role);
            close();
            applyRolePermissions(role);
        });
    }

    // Apply saved role on load
    const saved = localStorage.getItem('tc_role');
    if (saved) applyRolePermissions(saved);
}

function applyRolePermissions(role) {
    // Example: restrict advanced actions unless operator/admin
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => btn.disabled = (role === 'viewer'));
}

// Leaflet map of Bahrain
function initializeMap() {
    const el = document.getElementById('bhMap');
    if (!el || !window.L) return;
    const map = L.map('bhMap', { zoomControl: false }).setView([26.0667, 50.5577], 11);
    window.__bhMapInstance = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const regions = [
        { name: 'Manama', coords: [26.2235, 50.5876], severity: 'medium' },
        { name: 'Muharraq', coords: [26.2579, 50.6119], severity: 'low' },
        { name: 'Riffa', coords: [26.1290, 50.5550], severity: 'high' }
    ];

    regions.forEach(r => {
        const color = r.severity === 'high' ? '#ef4444' : r.severity === 'medium' ? '#f59e0b' : '#10b981';
        L.circle(r.coords, { radius: 1200, color, fillColor: color, fillOpacity: 0.25 })
            .addTo(map)
            .bindPopup(`<strong>${r.name}</strong><br/>Severity: ${r.severity.toUpperCase()}`);
    });
}

// Cytoscape context graph
function initializeContextGraph() {
    const el = document.getElementById('cyGraph');
    if (!el || !window.cytoscape) return;
    const cy = cytoscape({
        container: el,
        style: [
            { selector: 'node', style: { 'background-color': '#3b82f6', 'label': 'data(label)', 'color':'#334155', 'font-size':'10px' } },
            { selector: 'edge', style: { 'width': 2, 'line-color': '#94a3b8', 'curve-style': 'bezier' } },
            { selector: '.threat', style: { 'background-color': '#ef4444' } },
            { selector: '.service', style: { 'background-color': '#10b981' } }
        ],
        layout: { name: 'cose', animate: true }
    });

    const nodes = [
        { data: { id: 'core', label: 'Core Router' } },
        { data: { id: 'manama', label: 'Manama DC' }, classes: 'service' },
        { data: { id: 'muharraq', label: 'Muharraq Sensor Hub' }, classes: 'service' },
        { data: { id: 'threat1', label: 'Threat IOC' }, classes: 'threat' }
    ];
    const edges = [
        { data: { id: 'e1', source: 'core', target: 'manama' } },
        { data: { id: 'e2', source: 'core', target: 'muharraq' } },
        { data: { id: 'e3', source: 'manama', target: 'threat1' } }
    ];
    cy.add(nodes);
    cy.add(edges);
}

// Global search across cards/alerts
function initializeSearch() {
    const input = document.getElementById('globalSearch');
    if (!input) return;
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        document.querySelectorAll('.dashboard-card, .alert-item').forEach(el => {
            const text = el.innerText.toLowerCase();
            el.style.display = text.includes(q) ? '' : 'none';
        });
    });
}

