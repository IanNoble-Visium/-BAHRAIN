// 3D Map UI Controls Component
// Navigation, Mini-map, Legends, Alert Panel, Overlays

import * as Cesium from 'cesium';
import { generateBahrainAlerts, sectors } from '../data/bahrain-alerts.js';

let uiState = {
  miniMapVisible: true,
  legendExpanded: true,
  alertPanelVisible: true,
  alertsEnabled: true,
  heatmapEnabled: false,
  buildingsEnabled: true,
  networkLinesEnabled: false,
  cinematicMode: false
};

// Initialize all 3D Map UI components
export function initialize3DMapUI(viewer) {
  if (!viewer) return;
  
  createNavigationControls(viewer);
  createMiniMap(viewer);
  createEnhancedLegend(viewer);
  createAlertPanel(viewer);
  createOverlayToggles(viewer);
  createStatsOverlay(viewer);
}

// Navigation Controls with View Presets
function createNavigationControls(viewer) {
  const container = document.getElementById('cesiumContainer');
  if (!container) return;
  
  const navPanel = document.createElement('div');
  navPanel.id = 'map3d-nav-controls';
  navPanel.className = 'map3d-nav-panel';
  navPanel.innerHTML = `
    <div class="nav-header">
      <h4>🧭 Navigation</h4>
      <button class="nav-collapse" title="Collapse">−</button>
    </div>
    <div class="nav-body">
      <div class="view-presets">
        <button class="preset-btn" data-preset="manama">
          🏙️ Manama City
        </button>
        <button class="preset-btn" data-preset="diplomatic">
          🏛️ Diplomatic Area
        </button>
        <button class="preset-btn" data-preset="airport">
          ✈️ Airport
        </button>
        <button class="preset-btn" data-preset="waterfront">
          🌊 Waterfront
        </button>
        <button class="preset-btn" data-preset="overview">
          🗺️ Full Country
        </button>
      </div>
      <div class="nav-controls">
        <div class="control-row">
          <label>Tilt:</label>
          <input type="range" id="tiltControl" min="-90" max="0" value="-25" step="5">
          <span id="tiltValue">-25°</span>
        </div>
        <div class="control-row">
          <button class="nav-btn" id="resetNorth" title="Reset North">🧭 North</button>
          <button class="nav-btn" id="zoomIn" title="Zoom In">➕</button>
          <button class="nav-btn" id="zoomOut" title="Zoom Out">➖</button>
        </div>
        <div class="control-row">
          <label>
            <input type="checkbox" id="orbitToggle" checked>
            Auto-Orbit
          </label>
        </div>
      </div>
    </div>
  `;
  
  container.appendChild(navPanel);
  
  // Wire up event handlers
  setupNavigationHandlers(viewer, navPanel);
}

// Setup navigation event handlers
function setupNavigationHandlers(viewer, panel) {
  // View presets
  const viewPresets = {
    manama: {
      destination: Cesium.Cartesian3.fromDegrees(50.5677, 26.2135, 2000),
      heading: Cesium.Math.toRadians(45),
      pitch: Cesium.Math.toRadians(-25)
    },
    diplomatic: {
      destination: Cesium.Cartesian3.fromDegrees(50.5831, 26.2278, 1500),
      heading: Cesium.Math.toRadians(90),
      pitch: Cesium.Math.toRadians(-30)
    },
    airport: {
      destination: Cesium.Cartesian3.fromDegrees(50.6336, 26.2708, 3000),
      heading: Cesium.Math.toRadians(180),
      pitch: Cesium.Math.toRadians(-35)
    },
    waterfront: {
      destination: Cesium.Cartesian3.fromDegrees(50.5808, 26.2338, 1800),
      heading: Cesium.Math.toRadians(270),
      pitch: Cesium.Math.toRadians(-20)
    },
    overview: {
      destination: Cesium.Cartesian3.fromDegrees(50.5577, 26.0667, 50000),
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45)
    }
  };
  
  panel.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = viewPresets[btn.dataset.preset];
      if (preset && viewer) {
        viewer.camera.flyTo({
          ...preset,
          duration: 2.5
        });
      }
    });
  });
  
  // Tilt control
  const tiltControl = panel.querySelector('#tiltControl');
  const tiltValue = panel.querySelector('#tiltValue');
  if (tiltControl && viewer) {
    tiltControl.addEventListener('input', (e) => {
      const pitch = parseFloat(e.target.value);
      tiltValue.textContent = pitch + '°';
      viewer.camera.pitch = Cesium.Math.toRadians(pitch);
    });
  }
  
  // Zoom controls
  panel.querySelector('#zoomIn')?.addEventListener('click', () => {
    viewer.camera.zoomIn(viewer.camera.positionCartographic.height * 0.3);
  });
  
  panel.querySelector('#zoomOut')?.addEventListener('click', () => {
    viewer.camera.zoomOut(viewer.camera.positionCartographic.height * 0.3);
  });
  
  // Reset north
  panel.querySelector('#resetNorth')?.addEventListener('click', () => {
    viewer.camera.heading = 0;
  });
  
  // Orbit toggle
  panel.querySelector('#orbitToggle')?.addEventListener('change', (e) => {
    if (e.target.checked) {
      if (window.Map3D && window.Map3D.startOrbit) window.Map3D.startOrbit();
    } else {
      if (window.Map3D && window.Map3D.stopOrbit) window.Map3D.stopOrbit();
    }
  });
  
  // Collapse/expand
  const collapseBtn = panel.querySelector('.nav-collapse');
  const body = panel.querySelector('.nav-body');
  collapseBtn?.addEventListener('click', () => {
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
    collapseBtn.textContent = body.style.display === 'none' ? '+' : '−';
  });
}

// Mini-Map Overview
function createMiniMap(viewer) {
  const container = document.getElementById('cesiumContainer');
  if (!container) return;
  
  const miniMap = document.createElement('div');
  miniMap.id = 'map3d-minimap';
  miniMap.className = 'map3d-minimap';
  miniMap.innerHTML = `
    <div class="minimap-header">
      <span>Mini-Map</span>
      <button class="minimap-toggle" title="Toggle Mini-Map">✕</button>
    </div>
    <div id="minimapCanvas" class="minimap-canvas"></div>
  `;
  
  container.appendChild(miniMap);
  
  // Setup mini-map toggle
  miniMap.querySelector('.minimap-toggle')?.addEventListener('click', () => {
    uiState.miniMapVisible = !uiState.miniMapVisible;
    miniMap.style.display = uiState.miniMapVisible ? 'block' : 'none';
  });
  
  // Initialize mini-map with Leaflet (lightweight)
  initializeMiniMapCanvas();
}

function initializeMiniMapCanvas() {
  const canvas = document.getElementById('minimapCanvas');
  if (!canvas || !window.L) return;
  
  const miniMapInstance = L.map(canvas, {
    zoomControl: false,
    attributionControl: false,
    dragging: false,
    scrollWheelZoom: false
  }).setView([26.0667, 50.5577], 9);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
  }).addTo(miniMapInstance);
  
  // Add viewport indicator (will update with camera movements)
  const viewportRect = L.rectangle([[26.1, 50.5], [26.3, 50.6]], {
    color: '#CE1126',
    weight: 2,
    fillOpacity: 0.1
  }).addTo(miniMapInstance);
}

// Enhanced Legend with Toggles
function createEnhancedLegend(viewer) {
  const container = document.getElementById('cesiumContainer');
  if (!container) return;
  
  const legend = document.createElement('div');
  legend.id = 'map3d-legend';
  legend.className = 'map3d-legend';
  
  const alerts = generateBahrainAlerts();
  const severityCounts = {
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length
  };
  
  legend.innerHTML = `
    <div class="legend-header">
      <h4>📊 Map Legend</h4>
      <button class="legend-collapse">−</button>
    </div>
    <div class="legend-body">
      <div class="legend-section">
        <h5>Alert Severity</h5>
        <label class="legend-item">
          <input type="checkbox" checked data-toggle="high">
          <span class="legend-dot high"></span>
          <span>High <span class="badge">${severityCounts.high}</span></span>
        </label>
        <label class="legend-item">
          <input type="checkbox" checked data-toggle="medium">
          <span class="legend-dot medium"></span>
          <span>Medium <span class="badge">${severityCounts.medium}</span></span>
        </label>
        <label class="legend-item">
          <input type="checkbox" checked data-toggle="low">
          <span class="legend-dot low"></span>
          <span>Low <span class="badge">${severityCounts.low}</span></span>
        </label>
      </div>
      
      <div class="legend-section">
        <h5>Sectors</h5>
        ${sectors.filter(s => s.id !== 'all').map(sector => `
          <label class="legend-item">
            <input type="checkbox" checked data-sector="${sector.id}">
            <span style="font-size: 1rem;">${sector.icon}</span>
            <span>${sector.name}</span>
          </label>
        `).join('')}
      </div>
      
      <div class="legend-section">
        <h5>Map Layers</h5>
        <label class="legend-item">
          <input type="checkbox" checked data-layer="alerts">
          <span>🔔 Alert Markers</span>
        </label>
        <label class="legend-item">
          <input type="checkbox" checked data-layer="buildings">
          <span>🏢 3D Buildings</span>
        </label>
        <label class="legend-item">
          <input type="checkbox" data-layer="heatmap">
          <span>🔥 Traffic Heatmap</span>
        </label>
        <label class="legend-item">
          <input type="checkbox" data-layer="network">
          <span>🔗 Network Lines</span>
        </label>
        <label class="legend-item">
          <input type="checkbox" checked data-layer="terrain">
          <span>⛰️ Terrain</span>
        </label>
      </div>
    </div>
  `;
  
  container.appendChild(legend);
  
  // Setup legend event handlers
  setupLegendHandlers(viewer, legend);
  
  // Collapse/expand
  const collapseBtn = legend.querySelector('.legend-collapse');
  const body = legend.querySelector('.legend-body');
  collapseBtn?.addEventListener('click', () => {
    uiState.legendExpanded = !uiState.legendExpanded;
    body.style.display = uiState.legendExpanded ? 'block' : 'none';
    collapseBtn.textContent = uiState.legendExpanded ? '−' : '+';
  });
}

function setupLegendHandlers(viewer, legend) {
  // Severity toggles
  legend.querySelectorAll('[data-toggle]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const severity = e.target.dataset.toggle;
      toggleAlertsBySeverity(viewer, severity, e.target.checked);
    });
  });
  
  // Sector toggles
  legend.querySelectorAll('[data-sector]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const sector = e.target.dataset.sector;
      toggleAlertsBySector(viewer, sector, e.target.checked);
    });
  });
  
  // Layer toggles
  legend.querySelectorAll('[data-layer]').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const layer = e.target.dataset.layer;
      toggleMapLayer(viewer, layer, e.target.checked);
    });
  });
}

// Live Alert Panel
function createAlertPanel(viewer) {
  const container = document.getElementById('cesiumContainer');
  if (!container) return;
  
  const alertPanel = document.createElement('div');
  alertPanel.id = 'map3d-alert-panel';
  alertPanel.className = 'map3d-alert-panel';
  
  const alerts = generateBahrainAlerts().slice(0, 10); // Latest 10
  
  alertPanel.innerHTML = `
    <div class="alert-panel-header">
      <h4>🚨 Live Alerts <span class="alert-count-badge">${alerts.length}</span></h4>
      <button class="panel-toggle" title="Toggle Panel">✕</button>
    </div>
    <div class="alert-panel-body">
      ${alerts.map(alert => `
        <div class="live-alert-item ${alert.severity}" data-alert-id="${alert.id}">
          <div class="alert-icon">${sectors.find(s => s.id === alert.sector)?.icon || '⚠️'}</div>
          <div class="alert-content">
            <div class="alert-msg">${alert.message}</div>
            <div class="alert-time">${new Date(alert.timestamp).toLocaleTimeString()}</div>
          </div>
          <button class="alert-fly-btn" title="Fly to location">🎯</button>
        </div>
      `).join('')}
    </div>
    <div class="alert-panel-footer">
      <label>
        <input type="checkbox" id="alertSoundsToggle">
        <span>🔊 Sounds</span>
      </label>
      <label>
        <input type="checkbox" id="alertBlinkToggle" checked>
        <span>✨ Pulse Effect</span>
      </label>
    </div>
  `;
  
  container.appendChild(alertPanel);
  
  // Setup alert panel handlers
  setupAlertPanelHandlers(viewer, alertPanel);
}

function setupAlertPanelHandlers(viewer, panel) {
  // Toggle panel visibility
  panel.querySelector('.panel-toggle')?.addEventListener('click', () => {
    uiState.alertPanelVisible = !uiState.alertPanelVisible;
    panel.querySelector('.alert-panel-body').style.display = uiState.alertPanelVisible ? 'block' : 'none';
    panel.querySelector('.alert-panel-footer').style.display = uiState.alertPanelVisible ? 'flex' : 'none';
  });
  
  // Fly to alert on click
  panel.querySelectorAll('.alert-fly-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const alertItem = e.target.closest('.live-alert-item');
      const alertId = alertItem?.dataset.alertId;
      if (alertId && viewer && window.Map3D) {
        const entity = viewer.entities.getById(alertId);
        if (entity && window.Map3D.flyToAlert) {
          window.Map3D.flyToAlert(entity);
        }
      }
    });
  });
  
  // Click on alert item
  panel.querySelectorAll('.live-alert-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('alert-fly-btn')) return;
      const flyBtn = item.querySelector('.alert-fly-btn');
      if (flyBtn) flyBtn.click();
    });
  });
}

// Overlay Toggles
function createOverlayToggles(viewer) {
  const container = document.getElementById('cesiumContainer');
  if (!container) return;
  
  const toggles = document.createElement('div');
  toggles.id = 'map3d-overlay-toggles';
  toggles.className = 'map3d-overlay-toggles';
  toggles.innerHTML = `
    <button class="overlay-toggle-btn" data-overlay="heatmap" title="Toggle Traffic Heatmap">
      🔥 Heatmap
    </button>
    <button class="overlay-toggle-btn active" data-overlay="buildings" title="Toggle 3D Buildings">
      🏢 Buildings
    </button>
    <button class="overlay-toggle-btn" data-overlay="network" title="Toggle Network Lines">
      🔗 Network
    </button>
    <button class="overlay-toggle-btn" id="cinematicModeBtn" title="Cinematic Mode - Hide All UI">
      🎬 Cinematic
    </button>
    <button class="overlay-toggle-btn" id="fullscreenBtn" title="Fullscreen">
      ⛶ Fullscreen
    </button>
  `;
  
  container.appendChild(toggles);
  
  // Setup overlay handlers
  toggles.querySelectorAll('[data-overlay]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const overlay = btn.dataset.overlay;
      const enabled = btn.classList.contains('active');
      toggleMapLayer(viewer, overlay, enabled);
    });
  });
  
  // Cinematic mode
  document.getElementById('cinematicModeBtn')?.addEventListener('click', () => {
    uiState.cinematicMode = !uiState.cinematicMode;
    toggleCinematicMode();
  });
  
  // Fullscreen
  document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
    } else {
      document.exitFullscreen();
    }
  });
}

// Stats Dashboard Overlay
function createStatsOverlay(viewer) {
  const container = document.getElementById('cesiumContainer');
  if (!container) return;
  
  const alerts = generateBahrainAlerts();
  
  const stats = document.createElement('div');
  stats.id = 'map3d-stats';
  stats.className ='map3d-stats';
  stats.innerHTML = `
    <div class="stat-item">
      <div class="stat-value">${alerts.length}</div>
      <div class="stat-label">Live Alerts</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">17</div>
      <div class="stat-label">Active Cameras</div>
    </div>
    <div class="stat-item">
      <div class="stat-value">98%</div>
      <div class="stat-label">System Health</div>
    </div>
    <div class="stat-item">
      <div class="stat-value pulse-dot"></div>
      <div class="stat-label">Connected</div>
    </div>
  `;
  
  container.appendChild(stats);
}

// Helper Functions

function toggleAlertsBySeverity(viewer, severity, enabled) {
  if (!viewer) return;
  viewer.entities.values.forEach(entity => {
    if (entity.properties && entity.properties.severity === severity) {
      entity.show = enabled;
    }
  });
}

function toggleAlertsBySector(viewer, sector, enabled) {
  if (!viewer) return;
  viewer.entities.values.forEach(entity => {
    if (entity.properties && entity.properties.sector === sector) {
      entity.show = enabled;
    }
  });
}

function toggleMapLayer(viewer, layer, enabled) {
  if (!viewer) return;
  const scene = viewer.scene;
  
  switch(layer) {
    case 'alerts':
      uiState.alertsEnabled = enabled;
      viewer.entities.values.forEach(e => e.show = enabled);
      break;
    case 'buildings':
      uiState.buildingsEnabled = enabled;
      // Cesium automatically shows OSM Buildings
      scene.primitives.show = enabled;
      break;
    case 'terrain':
      scene.globe.show = enabled;
      break;
    case 'heatmap':
      uiState.heatmapEnabled = enabled;
      addHeatmapOverlay(viewer, enabled);
      break;
    case 'network':
      uiState.networkLinesEnabled = enabled;
      addNetworkLines(viewer, enabled);
      break;
  }
}

function addHeatmapOverlay(viewer, enabled) {
  if (!viewer) return;
  
  // Placeholder for heatmap implementation
  // Would use Cesium's image overlay with traffic density data
  console.log('Heatmap overlay:', enabled ? 'enabled' : 'disabled');
}

function addNetworkLines(viewer, enabled) {
  if (!viewer) return;
  
  if (enabled) {
    // Add polylines connecting major infrastructure
    const locations = [
      [26.2235, 50.5876], // Manama
      [26.2579, 50.6119], // Muharraq
      [26.1290, 50.5550]  // Riffa
    ];
    
    viewer.entities.add({
      id: 'network-line-1',
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          ...locations[0], ...locations[1]
        ]),
        width: 3,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.2,
          color: Cesium.Color.CYAN
        })
      }
    });
  } else {
    viewer.entities.removeById('network-line-1');
  }
}

function toggleCinematicMode() {
  const elements = [
    '.map3d-nav-panel',
    '.map3d-minimap',
    '.map3d-legend',
    '.map3d-alert-panel',
    '.map3d-overlay-toggles',
    '.map3d-stats',
    '#backToDashboard'
  ];
  
  elements.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      el.style.display = uiState.cinematicMode ? 'none' : '';
    }
  });
}

// Export functions
export {
  toggleAlertsBySeverity,
  toggleAlertsBySector,
  toggleMapLayer,
  toggleCinematicMode
};
