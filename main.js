// Main JavaScript for TruContext Bahrain Demo

// Suppress CesiumJS resource loading errors (non-critical)
window.addEventListener('unhandledrejection', (event) => {
  // Suppress JSON parsing errors from CesiumJS resource loading
  if (event.reason && event.reason.message &&
      event.reason.message.includes('Unexpected token') &&
      event.reason.message.includes('<!DOCTYPE')) {
    console.debug('ℹ️ Suppressed CesiumJS resource loading error (non-critical)');
    event.preventDefault();
  }
});

// Diagnostic logs for debugging
console.log('🔍 DEBUG: main.js loaded successfully');

// Import ECharts utilities
import echartsInit from './echarts-dashboard-init.js';
window.echartsInit = echartsInit;
// Main JavaScript for TruContext Bahrain Demo

// Global utility functions (defined first to ensure availability)
window.tcUtils = {
  nowContext: function(){
    const d = new Date();
    return { hour: d.getHours(), day: d.getDay(), isWeekend: d.getDay()===5 || d.getDay()===6 };
  },
  rushHourMultiplier: function(hour){
    if ((hour>=7 && hour<=9) || (hour>=16 && hour<=19)) return 1.35;
    if ((hour>=6 && hour<7) || (hour>19 && hour<=20)) return 1.15;
    return 1.0;
  },
  weekendMultiplier: function(day){
    return (day===5 || day===6) ? 0.8 : 1.0;
  },
  jitterBounded: function(value, pct=0.05, min=0, max=100){
    const delta = value * pct * (Math.random()*2 - 1);
    const v = value + delta;
    return Math.max(min, Math.min(max, v));
  },
  clamp: function(v, min, max){ return Math.max(min, Math.min(max, v)); },
  getRealisticSeries: function(kind, view, range){
    const { hour, day } = window.tcUtils.nowContext();
    const base = (window.tcData?.[view]) || window.tcData?.executive || { security:[85,88,92,89,94,96], traffic:[70,65,80,90,60] };
    const factor = range==='7d' ? 1.03 : range==='30d' ? 1.06 : 1.0;
    let series = (kind==='security' ? base.security.slice() : base.traffic.slice());

    if (kind==='traffic' || view==='traffic'){
      const m = window.tcUtils.rushHourMultiplier(hour) * window.tcUtils.weekendMultiplier(day);
      series = series.map((v,i)=> window.tcUtils.clamp(Math.round(v*m), 10, 99));
      if (range==='7d'){
        const wk = window.tcUtils.weekendMultiplier(day);
        series = series.map(v=>Math.round(v*wk));
      }
      if (range==='30d'){
        series = series.map((v,i)=> Math.round(v * (1 + 0.05*Math.sin((i/series.length)*Math.PI*2))));
      }
    }
    if (view==='environment'){
      const eventBoost = (Math.random()<0.15) ? 1.12 : 1.0;
      series = series.map(v=> Math.round(window.tcUtils.clamp(v*eventBoost, 20, 99)));
    }

    series = series.map(v => Math.round(window.tcUtils.jitterBounded(v*factor, 0.06, 10, 99)));
    return series;
  },
  computeSectorKpis: function(view, range){
    const data = window.tcData?.[view]?.kpis || {};
    // Cross-sector influences (simple model)
    const t = window.tcData?.traffic?.kpis;
    const env = window.tcData?.environment?.kpis;
    const health = window.tcData?.health?.kpis;
    if (t && env) {
      const congestion = (t.manamaCongestion + t.muharraqCongestion)/2;
      if (view === 'environment') {
        data.aqiManama = Math.round((env.aqiManama + congestion * 20));
        data.aqiMuharraq = Math.round((env.aqiMuharraq + congestion * 18));
      }
      if (view === 'health' && health) {
        data.erDemandIdx = +(health.erDemandIdx + congestion*0.05).toFixed(2);
      }
    }
    // Time range scaling
    const factor = range==='7d' ? 1.05 : range==='30d' ? 1.12 : 1.0;
    const scaled = {};
    Object.keys(data).forEach(k=>{
      const v = data[k];
      scaled[k] = typeof v === 'number' ? +(v*factor).toFixed(2) : v;
    });
    return scaled;
  },
  renderKpiRow: function(view, range){
    const row = document.getElementById('kpiRow');
    if (!row) return;

    // Tooltip legend for cross-sector influences
    const legend = document.createElement('div');
    legend.className = 'kpi-legend';
    legend.style.gridColumn = '1 / -1';
    legend.style.fontSize = '12px';
    legend.style.color = '#6b7280';
    legend.title = 'Traffic congestion increases AQI and ER demand; time range scales values. Real-time data includes bounded jitter.';
    legend.textContent = 'ℹ️ Cross-sector influences and time scaling applied';
    if (!row.nextSibling || !row.nextSibling.classList || !row.nextSibling.classList.contains('kpi-legend')) {
      row.parentNode.insertBefore(legend, row.nextSibling);
    }

    const k = window.tcUtils.computeSectorKpis(view, range);
    const formatPct = v => (v<=1? Math.round(v*100)+'%': v);
    const byView = {
      traffic: [
        { label: 'Manama congestion', value: formatPct(k.manamaCongestion) },
        { label: 'Muharraq congestion', value: formatPct(k.muharraqCongestion) },
        { label: 'Parking utilization', value: formatPct(k.parkingUtil) },
        { label: 'Transit on-time', value: formatPct(k.transitOnTime) }
      ],
      environment: [
        { label: 'AQI Manama', value: k.aqiManama },
        { label: 'AQI Muharraq', value: k.aqiMuharraq },
        { label: 'Dust storm risk', value: formatPct(k.dustForecast) },
        { label: 'Heat index (°C)', value: k.heatIndex }
      ],
      water: [
        { label: 'Consumption (MLD)', value: k.consumptionMLD },
        { label: 'Leak rate', value: formatPct(k.leakRate) },
        { label: 'Desal efficiency', value: formatPct(k.desalEfficiency) },
        { label: 'Smart meter anomalies', value: k.smartMeterAnoms }
      ],
      energy: [
        { label: 'Solar gen (MW)', value: k.solarGenMW },
        { label: 'Grid load (MW)', value: k.gridLoadMW },
        { label: 'Peak shaved (MW)', value: k.peakShavedMW },
        { label: 'Renewables share', value: formatPct(k.renewablesPct) }
      ],
      health: [
        { label: 'ER demand index', value: k.erDemandIdx },
        { label: 'ICU occupancy', value: formatPct(k.icuOccPct) },
        { label: 'Diabetes prevalence', value: formatPct(k.diabetesPrev) },
        { label: 'Obesity prevalence', value: formatPct(k.obesityPrev) }
      ],
      cybersecurity: [
        { label: 'Network anomalies', value: k.anomalies },
        { label: 'Phishing indicators', value: k.phishing },
        { label: 'Critical alerts', value: k.criticalAlerts },
        { label: 'Patch compliance', value: formatPct(k.patchCompliance) }
      ],
      infrastructure: [
        { label: 'Active projects', value: k.activeProjects },
        { label: 'On-time rate', value: formatPct(k.onTimePct) },
        { label: 'Cost overrun risk', value: formatPct(k.costOverrunRisk) },
        { label: 'Contractor score', value: formatPct(k.contractorScore) }
      ],
      executive: [
        { label: 'Entities', value: window.tcData.executive.entities },
        { label: 'Relationships', value: window.tcData.executive.relationships },
        { label: 'Health', value: formatPct(window.tcData.executive.health/100) },
        { label: 'Live alerts', value: document.querySelectorAll('.alert-item').length }
      ]
    };
    const tiles = byView[view] || byView.executive;

    // Render KPI tiles with animated counters
    row.innerHTML = tiles.map((t, index) => {
      const uniqueId = `kpi-value-${view}-${index}`;
      return `<div class="kpi-card unified" style="animation-delay: ${index * 0.1}s;">
        <div class="kpi-label unified">${t.label}</div>
        <div class="kpi-value unified" id="${uniqueId}" data-target="${t.value}">${t.value ?? '—'}</div>
      </div>`;
    }).join('');

    // Animate the counter values
    setTimeout(() => {
      tiles.forEach((t, index) => {
        const uniqueId = `kpi-value-${view}-${index}`;
        const element = document.getElementById(uniqueId);
        if (!element) return;

        const value = t.value;
        if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
          const numValue = parseFloat(value);
          const duration = 1000;
          const steps = 30;
          const increment = numValue / steps;
          let current = 0;
          let step = 0;

          const timer = setInterval(() => {
            step++;
            current += increment;
            if (step >= steps) {
              element.textContent = value;
              clearInterval(timer);
            } else {
              element.textContent = Math.round(current);
            }
          }, duration / steps);
        }
      });
    }, 100);
  }
};

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
    // Initialize KPI display after state is set
    setTimeout(() => {
        if (window.tcUtils && window.tcState) {
            window.tcUtils.renderKpiRow(window.tcState.view, window.tcState.range);
            // Ensure standard dashboard is visible on load
            updateDashboardView(window.tcState.view);
        }
    }, 100);
});

// Render current role badge in nav and demo toolbar
function renderRoleBadge(){
  const role = localStorage.getItem('tc_role') || 'viewer';
  const els = [document.getElementById('roleBadge'), document.getElementById('roleBadgeTop')];
  els.forEach(el => { if (el) el.textContent = `Role: ${role}`; });
}



// Helper: set video src with fallbacks (global)
function setVideoSourceWithFallback(videoEl, candidates) {
  if (!videoEl || !candidates || !candidates.length) return;


  let idx = 0;
  const tryNext = () => {
    if (idx >= candidates.length) return;
    const src = candidates[idx++];
    let sourceEl = videoEl.querySelector('source');
    if (!sourceEl) {
      sourceEl = document.createElement('source');
      videoEl.appendChild(sourceEl);
    }
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

// App state and datasets
function initializeState(){
  window.tcState = { view: 'executive', range: '24h' };
  const savedRole = localStorage.getItem('tc_role') || 'viewer';
  // Initial datasets per view for realism
  window.tcData = {
    executive: { security: [85,88,92,89,94,96], traffic: [78,65,89,92,56], entities: 15847, relationships: 89234, health: 98 },
    cybersecurity: { security: [78,82,86,84,90,93], traffic: [40,45,38,42,50], entities: 8934, relationships: 45621, health: 94,
      kpis: { anomalies: 124, phishing: 38, criticalAlerts: 3, patchCompliance: 0.91 } },
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
// Functions moved to window.tcUtils namespace (defined at top)

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

// Section background video utilities (placed after renderKpiRow is fully closed)
function initSectionBgVideos(){
  const videos = document.querySelectorAll('[data-bg-video]');
  const candidatesByKey = {
    cybersecurity: '/video-kpis/Usage Section background for Cybersecurity - Cybersecurity_prompt_bahrain_202508200431_sp.mp4',
    traffic: '/video-kpis/Usage Section background for Traffic -Traffic__smart_202508200424_ioo4s.mp4',
    environment: '/video-kpis/Usage Section background for Environment - Environment__air_202508200427_vpy54.mp4',
    water: '/video-kpis/Usage Section background for Water - Water_management_prompt_202508200427_6tv5o.mp4',
    energy: '/video-kpis/Usage Section background for Energy - Energy__renewables_202508200428_vdo1r.mp4',
    health: '/video-kpis/Usage Section background for Health - Healthcare_prompt_salmaniya_202508200429_5ql.mp4',
    infrastructure: '/video-kpis/Usage Section background for Infrastructure - Infrastructure_projects_prompt_202508200431_ (1).mp4'
  };
  if (!videos.length) return;
  videos.forEach(v=>{
    const src = candidatesByKey[v.getAttribute('data-bg-video')];
    if (src) setVideoSourceWithFallback(v, [src]);
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) vid.play().catch(()=>{});
      else vid.pause();
    });
  }, { threshold: 0.25 });
  videos.forEach(v=> io.observe(v));
}

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Skip if href is just "#" or empty
            if (!href || href === '#') {
                return;
            }

            e.preventDefault();
            const target = document.querySelector(href);
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

    // Domain Network Graph (ECharts 3D Graph)
    initializeDomainNetworkGraph();
}

// Initialize Domain Network Graph with ECharts
function initializeDomainNetworkGraph() {
    const domainChartEl = document.getElementById('domainChart');
    if (!domainChartEl || !window.echarts) return;

    const domainChart = window.echarts.init(domainChartEl);

    // Generate network graph data with bold, high-contrast colors
    const categories = [
        { name: 'Core Infrastructure', itemStyle: { color: '#dc2626' } },      // Bold Red
        { name: 'Security Systems', itemStyle: { color: '#ea580c' } },         // Bold Orange
        { name: 'IoT Devices', itemStyle: { color: '#16a34a' } },              // Bold Green
        { name: 'Data Centers', itemStyle: { color: '#2563eb' } },             // Bold Blue
        { name: 'Edge Nodes', itemStyle: { color: '#9333ea' } }                // Bold Purple
    ];

    const nodes = [
        { id: '0', name: 'Central Hub', value: 100, category: 0, symbolSize: 95 },
        { id: '1', name: 'Security Gateway', value: 85, category: 1, symbolSize: 78 },
        { id: '2', name: 'Firewall Cluster', value: 75, category: 1, symbolSize: 72 },
        { id: '3', name: 'IoT Gateway', value: 70, category: 2, symbolSize: 68 },
        { id: '4', name: 'Sensor Network', value: 65, category: 2, symbolSize: 65 },
        { id: '5', name: 'Data Center 1', value: 90, category: 3, symbolSize: 85 },
        { id: '6', name: 'Data Center 2', value: 88, category: 3, symbolSize: 82 },
        { id: '7', name: 'Edge Server 1', value: 60, category: 4, symbolSize: 62 },
        { id: '8', name: 'Edge Server 2', value: 58, category: 4, symbolSize: 60 },
        { id: '9', name: 'Edge Server 3', value: 56, category: 4, symbolSize: 58 },
        { id: '10', name: 'Traffic Monitor', value: 72, category: 2, symbolSize: 70 },
        { id: '11', name: 'Analytics Engine', value: 80, category: 3, symbolSize: 76 },
        { id: '12', name: 'API Gateway', value: 68, category: 0, symbolSize: 68 },
        { id: '13', name: 'Load Balancer', value: 77, category: 0, symbolSize: 74 },
        { id: '14', name: 'Backup System', value: 82, category: 3, symbolSize: 77 }
    ];

    const links = [
        { source: '0', target: '1', value: 10 },
        { source: '0', target: '5', value: 15 },
        { source: '0', target: '6', value: 14 },
        { source: '0', target: '12', value: 12 },
        { source: '0', target: '13', value: 13 },
        { source: '1', target: '2', value: 8 },
        { source: '1', target: '3', value: 7 },
        { source: '3', target: '4', value: 6 },
        { source: '3', target: '10', value: 5 },
        { source: '5', target: '11', value: 9 },
        { source: '5', target: '14', value: 8 },
        { source: '6', target: '11', value: 9 },
        { source: '6', target: '14', value: 7 },
        { source: '7', target: '0', value: 4 },
        { source: '8', target: '0', value: 4 },
        { source: '9', target: '0', value: 4 },
        { source: '12', target: '13', value: 6 },
        { source: '11', target: '12', value: 7 }
    ];

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            borderColor: '#2563eb',
            borderWidth: 3,
            textStyle: {
                color: '#111827',
                fontSize: 15,
                fontWeight: '500'
            },
            formatter: function(params) {
                if (params.dataType === 'node') {
                    return `<strong style="font-size: 16px; color: #111827; font-weight: 700;">${params.data.name}</strong><br/>
                            <span style="color: #4b5563; font-size: 14px;">Category:</span> <strong style="font-size: 14px;">${categories[params.data.category].name}</strong><br/>
                            <span style="color: #4b5563; font-size: 14px;">Value:</span> <strong style="font-size: 14px;">${params.data.value}</strong><br/>
                            <span style="color: #4b5563; font-size: 14px;">Connections:</span> <strong style="font-size: 14px;">${links.filter(l => l.source === params.data.id || l.target === params.data.id).length}</strong>`;
                } else {
                    const sourceName = nodes.find(n => n.id === params.data.source)?.name || params.data.source;
                    const targetName = nodes.find(n => n.id === params.data.target)?.name || params.data.target;
                    return `<strong style="font-size: 15px; font-weight: 600;">${sourceName}</strong> → <strong style="font-weight: 600;">${targetName}</strong><br/>
                            <span style="color: #4b5563; font-size: 14px;">Connection Strength:</span> <strong style="font-size: 14px;">${params.data.value}</strong>`;
                }
            }
        },
        legend: [{
            data: categories.map(c => c.name),
            orient: 'vertical',
            left: 18,
            top: 30,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: '#d1d5db',
            borderWidth: 2,
            borderRadius: 8,
            padding: [15, 18],
            textStyle: {
                color: '#111827',
                fontSize: 15,
                fontWeight: '600'
            },
            itemWidth: 22,
            itemHeight: 22,
            itemGap: 12,
            shadowBlur: 8,
            shadowColor: 'rgba(0, 0, 0, 0.15)',
            shadowOffsetX: 0,
            shadowOffsetY: 2
        }],
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [{
            type: 'graph',
            layout: 'force',
            data: nodes,
            links: links,
            categories: categories,
            roam: true,
            label: {
                show: true,
                position: 'right',
                formatter: '{b}',
                fontSize: 16,
                fontWeight: '700',
                color: '#000000',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: [6, 12],
                borderRadius: 6,
                borderColor: '#9ca3af',
                borderWidth: 2,
                shadowBlur: 6,
                shadowColor: 'rgba(0, 0, 0, 0.25)',
                shadowOffsetX: 0,
                shadowOffsetY: 2
            },
            labelLayout: {
                hideOverlap: false,
                moveOverlap: 'shiftY'
            },
            scaleLimit: {
                min: 0.5,
                max: 3
            },
            lineStyle: {
                color: 'source',
                curveness: 0.3,
                opacity: 0.7,
                width: 3.5
            },
            emphasis: {
                focus: 'adjacency',
                lineStyle: {
                    width: 6,
                    opacity: 1
                },
                label: {
                    fontSize: 18,
                    fontWeight: '800',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 3,
                    borderColor: '#2563eb',
                    shadowBlur: 10,
                    shadowColor: 'rgba(37, 99, 235, 0.4)'
                }
            },
            force: {
                repulsion: 450,
                gravity: 0.06,
                edgeLength: [100, 250],
                layoutAnimation: true,
                friction: 0.5
            },
            itemStyle: {
                borderColor: '#ffffff',
                borderWidth: 4,
                shadowBlur: 15,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }]
    };

    domainChart.setOption(option);

    // Store instance for cleanup
    window.tcCharts = window.tcCharts || {};
    window.tcCharts.domain = domainChart;

    // Handle resize
    window.addEventListener('resize', () => {
        domainChart.resize();
    });
}

// Demo dashboard controls
function initializeDemoControls() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle && sidebar && mainContent) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            sidebarToggle.classList.toggle('active');
        });
    }

    // Sidebar navigation links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const view = this.getAttribute('data-view');

            // Update active state
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Update dashboard view
            window.tcState && (window.tcState.view = view);
            updateDashboardView(view);
            window.tcUtils.renderKpiRow(window.tcState.view, window.tcState.range);

            // Update dashboard title
            const dashboardTitle = document.getElementById('dashboardTitle');
            if (dashboardTitle) {
                const label = this.querySelector('.sidebar-label').textContent;
                dashboardTitle.textContent = label;
            }
        });
    });

    // Time range buttons
    const timeButtons = document.querySelectorAll('.time-btn');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const range = this.getAttribute('data-range');
            window.tcState && (window.tcState.range = range);
            updateTimeRange(range);
            window.tcUtils.renderKpiRow(window.tcState.view, window.tcState.range);
        });
    });

    // Simulate real-time updates
    setInterval(updateLiveData, 5000);
}

function updateDashboardView(view) {
    console.log('🔍 DEBUG: updateDashboardView called with view:', view);

    // Get all view containers
    let standardDashboard = document.getElementById('standardDashboard');
    let map3DView = document.getElementById('map3DView');
    let aiAgentsApp = document.getElementById('aiAgentsApp');
    const demoContainer = document.querySelector('.demo-container.compact');
    const container = document.querySelector('.demo .container');

    console.log('🔍 DEBUG: Elements found:', {
        standardDashboard: !!standardDashboard,
        map3DView: !!map3DView,
        aiAgentsApp: !!aiAgentsApp,
        demoContainer: !!demoContainer,
        container: !!container
    });

    // Debug: list all divs with id and their parents
    const allDivsWithId = Array.from(document.querySelectorAll('div[id]'));
    console.log('🔍 DEBUG: All divs with id in DOM:', allDivsWithId.map(d => ({id: d.id, parentTag: d.parentElement?.tagName, parentId: d.parentElement?.id})));

    // If elements don't exist, try to create them or find them in a different way
    if (!map3DView && container) {
        console.warn('⚠️ WARNING: map3DView not found, attempting to create it');
        map3DView = document.createElement('div');
        map3DView.id = 'map3DView';
        map3DView.style.display = 'none';
        map3DView.style.position = 'relative';
        map3DView.style.width = '100%';
        map3DView.style.height = 'calc(100vh - 100px)';

        // Create back button
        const backBtn = document.createElement('button');
        backBtn.id = 'backToDashboard';
        backBtn.style.position = 'absolute';
        backBtn.style.top = '10px';
        backBtn.style.left = '10px';
        backBtn.style.zIndex = '10000';
        backBtn.style.padding = '12px 24px';
        backBtn.style.background = 'linear-gradient(135deg, #CE1126 0%, #a00d1f 100%)';
        backBtn.style.color = 'white';
        backBtn.style.border = 'none';
        backBtn.style.borderRadius = '8px';
        backBtn.style.fontWeight = '600';
        backBtn.style.fontSize = '1rem';
        backBtn.style.cursor = 'pointer';
        backBtn.style.boxShadow = '0 4px 12px rgba(206, 17, 38, 0.4)';
        backBtn.style.transition = 'all 0.3s ease';
        backBtn.textContent = '← Back to Dashboard';

        // Create Cesium container
        const cesiumContainer = document.createElement('div');
        cesiumContainer.id = 'cesiumContainer';
        cesiumContainer.style.width = '100%';
        cesiumContainer.style.height = '100%';
        cesiumContainer.style.borderRadius = '12px';
        cesiumContainer.style.overflow = 'hidden';

        map3DView.appendChild(backBtn);
        map3DView.appendChild(cesiumContainer);
        container.appendChild(map3DView);
        console.log('✅ Created map3DView element');
    }

    if (!aiAgentsApp && container) {
        console.warn('⚠️ WARNING: aiAgentsApp not found, attempting to create it');
        aiAgentsApp = document.createElement('div');
        aiAgentsApp.id = 'aiAgentsApp';
        aiAgentsApp.style.display = 'none';
        container.appendChild(aiAgentsApp);
        console.log('✅ Created aiAgentsApp element');
    }

    // Debug specific check for map3DView
    if (!map3DView) {
        const manualCheck = document.querySelector('#map3DView');
        console.log('🔍 DEBUG: Manual check for #map3DView:', {found: !!manualCheck, element: manualCheck});
    }

    // Hide all views first with fade out animation
    const hideView = (element) => {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease-out';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    };

    hideView(standardDashboard);
    hideView(map3DView);
    hideView(aiAgentsApp);

    console.log('🔍 DEBUG: Hidden all views with fade animation');

    // Helper function to show view with fade in animation
    const showView = (element, displayType = 'block') => {
        if (!element) return;
        setTimeout(() => {
            element.style.display = displayType;
            element.style.opacity = '0';
            requestAnimationFrame(() => {
                element.style.transition = 'opacity 0.4s ease-in';
                element.style.opacity = '1';
            });
        }, 350);
    };

    // Show the appropriate view
    if (view === '3dmap') {
        console.log('🔍 DEBUG: Showing 3D map view');
        // Re-query map3DView to ensure we get the current element
        const map3DEl = document.getElementById('map3DView');
        if (map3DEl) {
            showView(map3DEl, 'block');
            if (demoContainer) demoContainer.style.display = 'none';
            console.log('🔍 DEBUG: map3DView display set to block');
            // Initialize Cesium if not already done
            if (!window.cesiumInitialized) {
                console.log('🔍 DEBUG: Calling initialize3DMap()');
                setTimeout(() => initialize3DMap(), 400);
            } else {
                console.log('🔍 DEBUG: Cesium already initialized');
            }
        } else {
            console.error('❌ ERROR: map3DView element not found!');
        }
    } else if (view === 'aiagents') {
        // Show AI Agents dashboard
        if (aiAgentsApp) {
            showView(aiAgentsApp, 'block');
            if (demoContainer) demoContainer.style.display = 'none';
            if (typeof initAIAgentsDashboard === 'function') {
                setTimeout(() => initAIAgentsDashboard(), 400);
            }
        }
    } else {
        // Show standard dashboard for all other views
        if (standardDashboard) {
            // IMPORTANT: Set visibility of conditional cards BEFORE showing the view
            const isExecutiveView = view === 'executive';

            // Hide/show KPI metric cards based on view
            const networkEntitiesCard = document.getElementById('networkEntitiesCard');
            const activeRelationshipsCard = document.getElementById('activeRelationshipsCard');
            const threatLevelCard = document.getElementById('threatLevelCard');
            const systemHealthCard = document.getElementById('systemHealthCard');

            if (networkEntitiesCard) {
                networkEntitiesCard.style.display = isExecutiveView ? 'block' : 'none';
            }
            if (activeRelationshipsCard) {
                activeRelationshipsCard.style.display = isExecutiveView ? 'block' : 'none';
            }
            if (threatLevelCard) {
                threatLevelCard.style.display = isExecutiveView ? 'block' : 'none';
            }
            if (systemHealthCard) {
                systemHealthCard.style.display = isExecutiveView ? 'block' : 'none';
            }

            // Hide/show Domain Network Graph based on view
            const domainNetworkGraphCard = document.getElementById('domainNetworkGraphCard');
            if (domainNetworkGraphCard) {
                domainNetworkGraphCard.style.display = isExecutiveView ? 'block' : 'none';
            }

            showView(standardDashboard, 'grid');

            // Add staggered fade-in effect for cards (but skip hidden cards)
            setTimeout(() => {
                const dashboardCards = standardDashboard.querySelectorAll('.dashboard-card');
                dashboardCards.forEach((card, index) => {
                    // Skip animation for cards that should be hidden
                    if (card.style.display === 'none') {
                        return;
                    }
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }, 400);
        }
        
        // Make sure demo-container is visible for standard views
        if (demoContainer) {
            demoContainer.style.display = 'block';
        }

        // Update metrics based on view
        const metrics = getDashboardMetrics(view);
        updateDashboardMetrics(metrics);

        // CHANGE 1: Hide Network Topology on all views
        const networkTopologyCard = document.querySelector('.dashboard-card.graph-card');
        if (networkTopologyCard) {
            networkTopologyCard.style.display = 'none';
        }

        // CHANGE 2: Show/hide Chart.js charts based on view
        const securityChartCard = document.getElementById('securityChart')?.closest('.dashboard-card');
        const trafficChartCard = document.getElementById('trafficChart')?.closest('.dashboard-card');

        const isExecutiveView = view === 'executive';

        // Show Chart.js charts only on Executive Dashboard
        if (securityChartCard) {
            securityChartCard.style.display = isExecutiveView ? 'block' : 'none';
        }
        if (trafficChartCard) {
            trafficChartCard.style.display = isExecutiveView ? 'block' : 'none';
        }

        // Initialize sector-specific ECharts visualizations
        setTimeout(() => {
            initializeSectorECharts(view);
        }, 500);

        if (window.tcData && window.tcState) {
            const v = window.tcState.view;
            // Sync tiles with dataset
            const data = window.tcData[v];
            // entities/relationships/health reflect in updateDashboardMetrics already via metrics
            // Directly nudge charts too for immediate feedback
            if (window.tcCharts && window.tcCharts.security && data && data.security && isExecutiveView) {
                window.tcCharts.security.data.datasets[0].data = data.security.slice();
                window.tcCharts.security.update();
            }
            if (window.tcCharts && window.tcCharts.traffic && data && data.traffic && isExecutiveView) {
                window.tcCharts.traffic.data.datasets[0].data = data.traffic.slice();
                window.tcCharts.traffic.update();
            }
        }
    }
}

// Initialize 3D Map using Map3D component
async function initialize3DMap() {
    console.log('🔍 DEBUG: Initializing 3D Map...');
    const container = document.getElementById('cesiumContainer');
    
    if (!container) {
        console.error('❌ ERROR: Cesium container not found');
        return;
    }

    // Setup back button handler
    const backBtn = document.getElementById('backToDashboard');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            console.log('🔍 DEBUG: Back button clicked');
            // Cleanup Cesium
            if (window.Map3D && window.Map3D.destroy) {
                window.Map3D.destroy();
            }
            window.cesiumInitialized = false;
            // Switch back to executive view
            const executiveLink = document.querySelector('.sidebar-link[data-view="executive"]');
            if (executiveLink) {
                executiveLink.click();
            }
        });
        backBtn.onmouseover = () => {
            backBtn.style.transform = 'translateY(-2px)';
            backBtn.style.boxShadow = '0 6px 20px rgba(206, 17, 38, 0.5)';
        };
        backBtn.onmouseout = () => {
            backBtn.style.transform = 'translateY(0)';
            backBtn.style.boxShadow = '0 4px 12px rgba(206, 17, 38, 0.4)';
        };
    }

    // Check if Map3D component is loaded
    if (window.Map3D && typeof window.Map3D.initialize === 'function') {
        try {
            console.log('✅ Map3D component available - Loading CesiumJS...');
            console.log('🔍 DEBUG: Container dimensions:', {
                width: container.offsetWidth,
                height: container.offsetHeight,
                clientWidth: container.clientWidth,
                clientHeight: container.clientHeight
            });

            // Clear container but keep it ready for Cesium
            container.innerHTML = '';
            container.style.width = '100%';
            container.style.height = '100%';

            // Initialize the Cesium viewer with Manama focus
            const viewer = await window.Map3D.initialize('cesiumContainer', {
                focusManama: true,
                performanceMode: 'ultra'
            });

            if (viewer) {
                console.log('🔍 DEBUG: Cesium viewer created, checking canvas...');
                const canvas = container.querySelector('canvas');
                if (canvas) {
                    console.log('✅ Canvas element found:', {
                        width: canvas.width,
                        height: canvas.height,
                        offsetWidth: canvas.offsetWidth,
                        offsetHeight: canvas.offsetHeight
                    });
                } else {
                    console.warn('⚠️ WARNING: Canvas element not found in container');
                }

                // Add alert markers
                await window.Map3D.addAlertMarkers({ sectors: ['all'] });
                window.cesiumInitialized = true;
                console.log('✅ 3D Map initialized successfully with Manama view and alert markers');
            } else {
                throw new Error('Failed to create Cesium viewer');
            }
        } catch (error) {
            console.error('❌ ERROR: Error initializing 3D map:', error);
            container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Inter, sans-serif;">
                    <div style="text-align: center; padding: 2rem;">
                        <h2 style="font-size: 2rem; margin-bottom: 1rem;">🌍 3D Map View</h2>
                        <p style="font-size: 1.2rem; margin-bottom: 2rem;">Interactive Cesium map visualization</p>
                        <p style="opacity: 0.9; margin-bottom: 1rem;">Note: Full 3D map requires Vite development server.</p>
                        <p style="font-size: 0.9rem; opacity: 0.8;">Error: ${error.message}</p>
                        <button onclick="document.querySelector('.sidebar-link[data-view=\\'executive\\']').click();"
                                style="margin-top: 2rem; padding: 12px 24px; background: white; color: #667eea; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                            Back to Executive View
                        </button>
                    </div>
                </div>
            `;
        }
    } else {
        // Map3D component not loaded - show informational message
        console.warn('⚠️ WARNING: Map3D component not loaded. Run npm run dev for full 3D functionality.');
        container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-family: Inter, sans-serif;">
                <div style="text-align: center; padding: 2rem;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">🌍 3D Map View</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 2rem;">Interactive CesiumJS 3D Visualization of Manama</p>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem;">
                        <p style="opacity: 0.9; margin-bottom: 1rem;">⚠️ The 3D map requires the Vite development server to load properly.</p>
                        <p style="opacity: 0.9; margin-bottom: 1rem;">Run: <code style="background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 4px;">npm run dev</code></p>
                        <p style="opacity: 0.8; font-size: 0.9rem;">Then navigate to: http://localhost:5173/dashboard.html</p>
                    </div>
                    <button onclick="document.querySelector('.sidebar-link[data-view=\\'executive\\']').click();"
                            style="margin-top: 1rem; padding: 12px 24px; background: white; color: #667eea; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        Back to Executive View
                    </button>
                </div>
            </div>
        `;
        window.cesiumInitialized = true;
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
    const range = window.tcState?.range || '24h';
    const view = window.tcState?.view || 'executive';
    const isExecutiveView = view === 'executive';

    // Simulate live data updates
    // Update x-axis labels for charts based on selected time range
    // Only update Chart.js charts on Executive Dashboard
    if (window.tcCharts && window.tcState && isExecutiveView) {
        const range = window.tcState.range;
        // Security chart labels
        if (window.tcCharts.security) {
            window.tcCharts.security.data.labels = range === '7d' ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] :
                range === '30d' ? Array.from({length: 10}, (_,i)=>`Day ${i*3+1}`) :
                ['00:00','04:00','08:00','12:00','16:00','20:00'];
            // Use realistic series for security
            window.tcCharts.security.data.datasets[0].data = window.tcUtils.getRealisticSeries('security', view, range);
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
            // Realistic traffic series
            window.tcCharts.traffic.data.datasets[0].data = window.tcUtils.getRealisticSeries('traffic', window.tcState.view, range);

            window.tcCharts.traffic.update();
        }
    }

    // Adjust metric values slightly for range
    const factor = range === '7d' ? 1.05 : range === '30d' ? 1.12 : 1.0;
    const v = window.tcState?.view || 'executive';
    const isExecutive = v === 'executive';

    // Only update Chart.js charts on Executive Dashboard
    if (window.tcData && isExecutive) {
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
        const kpiSources = {
            traffic: '/video-kpis/Usage Dashboard video for Traffic - view_sector_traffic_202508200423_g1b9a.mp4',
            environment: '/video-kpis/Usage Dashboard video for Environment view - Environment__air_202508200424_i0jb0.mp4',
            water: '/video-kpis/Usage Dashboard video for Water view - Environment__air_202508200427_oguhe.mp4',
            energy: '/video-kpis/Usage Dashboard video for Energy view - Water_management_prompt_202508200428_tqwni.mp4',
            health: '/video-kpis/Usage Dashboard video for Health view - Energy__renewables_202508200429_ow7sw.mp4',
            cybersecurity: '/video-kpis/Usage Dashboard video for Cybersecurity view - Healthcare_prompt_hospital_202508200430_4m1c.mp4',
            infrastructure: '/video-kpis/Usage Dashboard video for Infrastructure view -Infrastructure_projects_prompt_202508200431_.mp4'
        };
        const fallbackSources = {
            executive: '/videos/Realtime_data_flow_202508200300_dtvgx.mp4',
            cybersecurity: '/videos/8_security_threat_202508200300_wi77v.mp4',
            traffic: '/videos/9_traffic_flow_202508200300_4a7jp.mp4',
            environment: '/videos/15_environmental_monitoring_202508200301_46l.mp4',
            water: '/videos/Smart_infrastructure_in_202508200301_qeeuc.mp4',
            energy: '/videos/Real_Time_Grid_Strain_Dashboard.mp4',
            infrastructure: '/videos/Smart_city_infrastructure_202508200300_y1fx5.mp4',
            health: '/videos/10_health_analytics_202508200300_oyqjd.mp4'
        };
        const candidates = [];
        if (kpiSources[view]) candidates.push(kpiSources[view]);
        if (fallbackSources[view]) candidates.push(fallbackSources[view]);
        candidates.push(fallbackSources.executive);
        setVideoSourceWithFallback(video, candidates);
    // Use tcData per current view - only update Chart.js charts on Executive Dashboard
    if (window.tcData && window.tcState) {
        const v = window.tcState.view;
        const isExecutive = v === 'executive';

        if (window.tcData[v] && window.tcCharts && window.tcCharts.security && isExecutive) {
            window.tcCharts.security.data.datasets[0].data = window.tcData[v].security.slice();
            window.tcCharts.security.update();
        }
        if (window.tcData[v] && window.tcCharts && window.tcCharts.traffic && isExecutive) {
            window.tcCharts.traffic.data.datasets[0].data = window.tcData[v].traffic.slice();
            window.tcCharts.traffic.update();
        }
    }

        const playing = !video.paused;
        // If already playing, try to resume after source resolution
        setTimeout(()=>{ if (playing) video.play().catch(()=>{}); }, 200);
    }

    // Update charts for realism by view - only update Chart.js charts on Executive Dashboard
    if (window.tcCharts && isExecutiveView) {
        if (window.tcCharts.security) {
            window.tcCharts.security.data.datasets[0].data = window.tcUtils.getRealisticSeries('security', view, range);
            window.tcCharts.security.update();
        }
        if (window.tcCharts.traffic) {
            window.tcCharts.traffic.data.datasets[0].data = window.tcUtils.getRealisticSeries('traffic', view, range);
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

// Initialize ECharts visualizations for sector-specific views
function initializeSectorECharts(view) {
    if (!window.echarts) {
        console.warn('ECharts library not loaded');
        return;
    }

    // Show/hide ECharts cards based on view
    const echartsCards = document.querySelectorAll('.echarts-container');
    const shouldShowECharts = ['cybersecurity', 'traffic', 'environment', 'water', 'energy', 'health', 'infrastructure'].includes(view);

    echartsCards.forEach(card => {
        card.style.display = shouldShowECharts ? 'block' : 'none';
    });

    if (!shouldShowECharts) return;

    // Get chart containers
    const chart1 = document.getElementById('echartsChart1');
    const chart2 = document.getElementById('echartsChart2');
    const chart3 = document.getElementById('echartsChart3');

    if (!chart1 || !chart2 || !chart3) return;

    // Initialize or get existing chart instances
    const echartsInstance1 = window.echarts.init(chart1);
    const echartsInstance2 = window.echarts.init(chart2);
    const echartsInstance3 = window.echarts.init(chart3);

    // Store instances for cleanup
    window.tcECharts = { chart1: echartsInstance1, chart2: echartsInstance2, chart3: echartsInstance3 };

    // Update titles
    document.getElementById('echartsTitle1').textContent = getSectorChartTitle(view, 1);
    document.getElementById('echartsTitle2').textContent = getSectorChartTitle(view, 2);
    document.getElementById('echartsTitle3').textContent = getSectorChartTitle(view, 3);

    // Render charts based on sector
    switch(view) {
        case 'cybersecurity':
            renderCybersecurityCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
        case 'traffic':
            renderTrafficCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
        case 'environment':
            renderEnvironmentCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
        case 'water':
            renderWaterCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
        case 'energy':
            renderEnergyCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
        case 'health':
            renderHealthCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
        case 'infrastructure':
            renderInfrastructureCharts(echartsInstance1, echartsInstance2, echartsInstance3);
            break;
    }
}

function getSectorChartTitle(view, chartNum) {
    const titles = {
        cybersecurity: ['Threat Distribution (Sunburst)', 'Attack Vectors (Radar)', 'Security Events Timeline (Scatter)'],
        traffic: ['Traffic Flow Patterns (Sankey)', 'Congestion Heatmap (Polar)', 'Vehicle Distribution (Treemap)'],
        environment: ['Air Quality Trends (Rainfall)', 'Pollution Sources (Sunburst)', 'Temperature Distribution (Scatter Matrix)'],
        water: ['Water Flow Network (Sankey)', 'Consumption Patterns (Bubble)', 'Leak Detection (Scatter)'],
        energy: ['Energy Distribution (Treemap)', 'Grid Load (Polar)', 'Renewable Sources (Sunburst)'],
        health: ['Patient Flow (Sankey)', 'Disease Prevalence (Bubble)', 'Hospital Capacity (Radar)'],
        infrastructure: ['Project Timeline (Scatter)', 'Budget Allocation (Treemap)', 'Resource Distribution (Sunburst)']
    };
    return titles[view]?.[chartNum - 1] || 'Advanced Visualization';
}

// Cybersecurity Charts
function renderCybersecurityCharts(chart1, chart2, chart3) {
    // Chart 1: Threat Distribution (Sunburst)
    chart1.setOption({
        series: {
            type: 'sunburst',
            data: [{
                name: 'Threats',
                children: [
                    {
                        name: 'Malware',
                        value: 45,
                        children: [
                            { name: 'Ransomware', value: 20 },
                            { name: 'Trojans', value: 15 },
                            { name: 'Worms', value: 10 }
                        ]
                    },
                    {
                        name: 'Network Attacks',
                        value: 35,
                        children: [
                            { name: 'DDoS', value: 15 },
                            { name: 'Port Scanning', value: 12 },
                            { name: 'Man-in-Middle', value: 8 }
                        ]
                    },
                    {
                        name: 'Social Engineering',
                        value: 20,
                        children: [
                            { name: 'Phishing', value: 12 },
                            { name: 'Spear Phishing', value: 8 }
                        ]
                    }
                ]
            }],
            radius: [0, '90%'],
            label: { rotate: 'radial' }
        }
    });

    // Chart 2: Attack Vectors (Radar)
    chart2.setOption({
        radar: {
            indicator: [
                { name: 'Email', max: 100 },
                { name: 'Web', max: 100 },
                { name: 'Network', max: 100 },
                { name: 'Application', max: 100 },
                { name: 'Physical', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: [
                { value: [85, 72, 68, 55, 30], name: 'Current Week' },
                { value: [78, 65, 72, 60, 25], name: 'Last Week' }
            ]
        }]
    });

    // Chart 3: Security Events Timeline (Scatter)
    const scatterData = Array.from({ length: 50 }, () => [
        Math.random() * 24,
        Math.random() * 100,
        Math.random() * 50 + 10
    ]);
    chart3.setOption({
        xAxis: { name: 'Hour of Day', max: 24 },
        yAxis: { name: 'Severity' },
        series: [{
            type: 'scatter',
            symbolSize: (data) => data[2],
            data: scatterData,
            itemStyle: { color: '#ef4444' }
        }]
    });
}

// Traffic Charts
function renderTrafficCharts(chart1, chart2, chart3) {
    // Chart 1: Traffic Flow Patterns (Sankey)
    chart1.setOption({
        series: {
            type: 'sankey',
            data: [
                { name: 'North Entry' },
                { name: 'South Entry' },
                { name: 'East Entry' },
                { name: 'Manama Center' },
                { name: 'Diplomatic Area' },
                { name: 'Muharraq' },
                { name: 'North Exit' },
                { name: 'South Exit' }
            ],
            links: [
                { source: 'North Entry', target: 'Manama Center', value: 120 },
                { source: 'South Entry', target: 'Manama Center', value: 95 },
                { source: 'East Entry', target: 'Diplomatic Area', value: 80 },
                { source: 'Manama Center', target: 'Muharraq', value: 85 },
                { source: 'Diplomatic Area', target: 'Muharraq', value: 60 },
                { source: 'Muharraq', target: 'North Exit', value: 75 },
                { source: 'Muharraq', target: 'South Exit', value: 70 }
            ]
        }
    });

    // Chart 2: Congestion Heatmap (Polar)
    chart2.setOption({
        polar: {},
        angleAxis: {
            type: 'category',
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        },
        radiusAxis: {},
        series: [{
            type: 'bar',
            data: [25, 15, 85, 65, 90, 75],
            coordinateSystem: 'polar',
            itemStyle: { color: '#3b82f6' }
        }]
    });

    // Chart 3: Vehicle Distribution (Treemap)
    chart3.setOption({
        series: [{
            type: 'treemap',
            data: [
                { name: 'Private Cars', value: 4500 },
                { name: 'Taxis', value: 850 },
                { name: 'Buses', value: 320 },
                { name: 'Trucks', value: 280 },
                { name: 'Motorcycles', value: 150 }
            ]
        }]
    });
}

// Environment Charts
function renderEnvironmentCharts(chart1, chart2, chart3) {
    // Chart 1: Air Quality Trends (Rainfall)
    chart1.setOption({
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value', name: 'AQI' },
        series: [{
            type: 'line',
            data: [65, 72, 68, 85, 92, 78, 70],
            areaStyle: { color: 'rgba(16, 185, 129, 0.3)' },
            itemStyle: { color: '#10b981' }
        }]
    });

    // Chart 2: Pollution Sources (Sunburst)
    chart2.setOption({
        series: {
            type: 'sunburst',
            data: [{
                name: 'Pollution',
                children: [
                    {
                        name: 'Industrial',
                        value: 40,
                        children: [
                            { name: 'Factories', value: 25 },
                            { name: 'Refineries', value: 15 }
                        ]
                    },
                    {
                        name: 'Transportation',
                        value: 35,
                        children: [
                            { name: 'Vehicles', value: 20 },
                            { name: 'Ships', value: 15 }
                        ]
                    },
                    { name: 'Dust Storms', value: 25 }
                ]
            }],
            radius: [0, '90%']
        }
    });

    // Chart 3: Temperature Distribution (Scatter)
    const tempData = Array.from({ length: 30 }, (_, i) => [i, 35 + Math.random() * 10]);
    chart3.setOption({
        xAxis: { name: 'Day of Month' },
        yAxis: { name: 'Temperature (°C)' },
        series: [{
            type: 'scatter',
            data: tempData,
            itemStyle: { color: '#f59e0b' }
        }]
    });
}

// Water Charts
function renderWaterCharts(chart1, chart2, chart3) {
    // Chart 1: Water Flow Network (Sankey)
    chart1.setOption({
        series: {
            type: 'sankey',
            data: [
                { name: 'Desalination' },
                { name: 'Treatment' },
                { name: 'North Network' },
                { name: 'South Network' },
                { name: 'Residential' },
                { name: 'Industrial' },
                { name: 'Commercial' }
            ],
            links: [
                { source: 'Desalination', target: 'Treatment', value: 450 },
                { source: 'Treatment', target: 'North Network', value: 220 },
                { source: 'Treatment', target: 'South Network', value: 230 },
                { source: 'North Network', target: 'Residential', value: 120 },
                { source: 'North Network', target: 'Commercial', value: 100 },
                { source: 'South Network', target: 'Residential', value: 130 },
                { source: 'South Network', target: 'Industrial', value: 100 }
            ]
        }
    });

    // Chart 2: Consumption Patterns (Bubble)
    chart2.setOption({
        xAxis: { name: 'Hour' },
        yAxis: { name: 'Consumption (MLD)' },
        series: [{
            type: 'scatter',
            symbolSize: (data) => data[2] * 2,
            data: [
                [6, 280, 25], [9, 350, 35], [12, 420, 45],
                [15, 390, 40], [18, 450, 50], [21, 320, 30]
            ],
            itemStyle: { color: '#3b82f6' }
        }]
    });

    // Chart 3: Leak Detection (Scatter)
    const leakData = Array.from({ length: 20 }, () => [
        Math.random() * 100,
        Math.random() * 100,
        Math.random() * 30 + 5
    ]);
    chart3.setOption({
        xAxis: { name: 'Network Zone' },
        yAxis: { name: 'Pressure (PSI)' },
        series: [{
            type: 'scatter',
            symbolSize: (data) => data[2],
            data: leakData,
            itemStyle: { color: '#ef4444' }
        }]
    });
}

// Energy Charts
function renderEnergyCharts(chart1, chart2, chart3) {
    // Chart 1: Energy Distribution (Treemap)
    chart1.setOption({
        series: [{
            type: 'treemap',
            data: [
                { name: 'Residential', value: 450 },
                { name: 'Commercial', value: 380 },
                { name: 'Industrial', value: 320 },
                { name: 'Government', value: 180 },
                { name: 'Street Lighting', value: 70 }
            ]
        }]
    });

    // Chart 2: Grid Load (Polar)
    chart2.setOption({
        polar: {},
        angleAxis: {
            type: 'category',
            data: ['North', 'South', 'East', 'West', 'Central', 'Muharraq']
        },
        radiusAxis: { max: 100 },
        series: [{
            type: 'bar',
            data: [85, 72, 68, 78, 92, 65],
            coordinateSystem: 'polar',
            itemStyle: { color: '#8b5cf6' }
        }]
    });

    // Chart 3: Renewable Sources (Sunburst)
    chart3.setOption({
        series: {
            type: 'sunburst',
            data: [{
                name: 'Energy',
                children: [
                    {
                        name: 'Renewable',
                        value: 145,
                        children: [
                            { name: 'Solar', value: 120 },
                            { name: 'Wind', value: 25 }
                        ]
                    },
                    {
                        name: 'Conventional',
                        value: 1035,
                        children: [
                            { name: 'Natural Gas', value: 850 },
                            { name: 'Oil', value: 185 }
                        ]
                    }
                ]
            }],
            radius: [0, '90%']
        }
    });
}

// Health Charts
function renderHealthCharts(chart1, chart2, chart3) {
    // Chart 1: Patient Flow (Sankey)
    chart1.setOption({
        series: {
            type: 'sankey',
            data: [
                { name: 'Emergency' },
                { name: 'Outpatient' },
                { name: 'Triage' },
                { name: 'ICU' },
                { name: 'General Ward' },
                { name: 'Discharged' },
                { name: 'Transferred' }
            ],
            links: [
                { source: 'Emergency', target: 'Triage', value: 180 },
                { source: 'Outpatient', target: 'Triage', value: 120 },
                { source: 'Triage', target: 'ICU', value: 45 },
                { source: 'Triage', target: 'General Ward', value: 155 },
                { source: 'ICU', target: 'General Ward', value: 30 },
                { source: 'General Ward', target: 'Discharged', value: 140 },
                { source: 'General Ward', target: 'Transferred', value: 45 }
            ]
        }
    });

    // Chart 2: Disease Prevalence (Bubble)
    chart2.setOption({
        xAxis: { name: 'Age Group' },
        yAxis: { name: 'Prevalence (%)' },
        series: [{
            type: 'scatter',
            symbolSize: (data) => data[2] * 3,
            data: [
                [1, 5, 15], [2, 8, 20], [3, 12, 25],
                [4, 19, 30], [5, 25, 35], [6, 29, 28]
            ],
            itemStyle: { color: '#ef4444' }
        }]
    });

    // Chart 3: Hospital Capacity (Radar)
    chart3.setOption({
        radar: {
            indicator: [
                { name: 'ICU Beds', max: 100 },
                { name: 'General Beds', max: 100 },
                { name: 'ER Capacity', max: 100 },
                { name: 'Staff Availability', max: 100 },
                { name: 'Equipment', max: 100 }
            ]
        },
        series: [{
            type: 'radar',
            data: [
                { value: [68, 82, 75, 88, 92], name: 'Current' },
                { value: [85, 90, 85, 95, 98], name: 'Target' }
            ]
        }]
    });
}

// Infrastructure Charts
function renderInfrastructureCharts(chart1, chart2, chart3) {
    // Chart 1: Project Timeline (Scatter)
    const projectData = [
        [1, 45, 25, 'Airport Expansion'],
        [3, 72, 35, 'Metro Line 2'],
        [5, 38, 20, 'Water Main Upgrade'],
        [7, 85, 40, 'Port Modernization'],
        [9, 62, 30, 'Housing Development']
    ];
    chart1.setOption({
        xAxis: { name: 'Project Phase' },
        yAxis: { name: 'Completion (%)' },
        series: [{
            type: 'scatter',
            symbolSize: (data) => data[2],
            data: projectData,
            itemStyle: { color: '#3b82f6' }
        }]
    });

    // Chart 2: Budget Allocation (Treemap)
    chart2.setOption({
        series: [{
            type: 'treemap',
            data: [
                { name: 'Transportation', value: 450 },
                { name: 'Utilities', value: 320 },
                { name: 'Housing', value: 280 },
                { name: 'Public Facilities', value: 180 },
                { name: 'Smart Systems', value: 120 }
            ]
        }]
    });

    // Chart 3: Resource Distribution (Sunburst)
    chart3.setOption({
        series: {
            type: 'sunburst',
            data: [{
                name: 'Resources',
                children: [
                    {
                        name: 'Labor',
                        value: 450,
                        children: [
                            { name: 'Engineers', value: 180 },
                            { name: 'Workers', value: 220 },
                            { name: 'Supervisors', value: 50 }
                        ]
                    },
                    {
                        name: 'Materials',
                        value: 380,
                        children: [
                            { name: 'Steel', value: 150 },
                            { name: 'Concrete', value: 180 },
                            { name: 'Equipment', value: 50 }
                        ]
                    },
                    { name: 'Technology', value: 170 }
                ]
            }],
            radius: [0, '90%']
        }
    });
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
        traffic: '/video-kpis/Usage Alert modal for congestionincident - Traffic__smart_202508200424_7ritq.mp4',
        network: '/video-kpis/Usage Alert modal for critical infra incidents - Cybersecurity_prompt_soc_202508200431_h6ar5.mp4',
        water: '/video-kpis/Usage Alert modal for leak events - Water_management_prompt_202508200427_o0yt6.mp4',
        health: '/video-kpis/Usage Alert modal for capacity alerts -Healthcare_prompt_salmaniya_202508200430_7ml.mp4',
        environment: '/video-kpis/Usage Alert modal for dustpollution events - Environment__air_202508200427_0tmxt.mp4'
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

  // Use existing map created by initializeMap; never create here to avoid duplicate init
  const map = window.__bhMapInstance || null;

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
            modalVideo.src = '/videos/Digital_bahrain_network_202508200259_t1v94.mp4';
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
            window.location.href = '/dashboard.html';
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
    // Robust singleton: if a map already exists on this element, reuse it
    if (window.__bhMapInstance && window.__bhMapInstance._container === el) {
        return; // already initialized for this container
    }
    // If Leaflet attached a _leaflet_id to the element, clear its contents
    if (el._leaflet_id) {
        el.innerHTML = '';
    }
    const map = L.map(el, { zoomControl: false }).setView([26.0667, 50.5577], 11);
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
    console.log('🔍 DEBUG: initializeContextGraph called, el:', el, 'cytoscape:', !!window.cytoscape);
    if (!el || !window.cytoscape) {
        console.warn('🔍 DEBUG: Cytoscape initialization skipped - missing element or library');
        return;
    }

    try {
        console.log('🔍 DEBUG: Creating Cytoscape instance...');
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

        // Store reference and try to fit after layout
        window.tcCytoscape = cy;
        setTimeout(() => {
            try {
                if (cy && typeof cy.fit === 'function') {
                    console.log('🔍 DEBUG: Calling cy.fit()...');
                    cy.fit();
                    console.log('🔍 DEBUG: cy.fit() completed successfully');
                } else {
                    console.warn('🔍 DEBUG: cy.fit() not available or cy is null');
                }
            } catch (e) {
                console.warn('🔍 DEBUG: Cytoscape fit failed:', e);
            }
        }, 100);
    } catch (error) {
        console.warn('🔍 DEBUG: Cytoscape initialization failed:', error);
    }
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
