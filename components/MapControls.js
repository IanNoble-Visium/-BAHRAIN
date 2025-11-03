// Map Controls Component - 2D/3D Toggle, Filters, Performance Settings

import { sectors } from '../data/bahrain-alerts.js';

let currentMapMode = '2d';
let currentSectorFilters = ['all'];
let currentPerformanceMode = 'ultra';
let filterDialogOpen = false;

// Initialize map controls
export function initializeMapControls() {
  createMapToggle();
  createPerformanceToggle();
  createSectorFilterButton();
  createSectorFilterDialog();
  createMapLegend();
  setupEventListeners();
}

// Create 2D/3D toggle button
function createMapToggle() {
  const mapCard = document.querySelector('.dashboard-card:has(#bhMap)');
  if (!mapCard) return;

  const existing = mapCard.querySelector('.map-toggle');
  if (existing) return;

  const toggle = document.createElement('div');
  toggle.className = 'map-toggle';
  toggle.innerHTML = `
    <button class="toggle-btn active" data-mode="2d">2D</button>
    <button class="toggle-btn" data-mode="3d">3D</button>
  `;

  mapCard.insertBefore(toggle, mapCard.firstChild.nextSibling);
}

// Create performance mode toggle
function createPerformanceToggle() {
  const mapCard = document.querySelector('.dashboard-card:has(#bhMap)');
  if (!mapCard) return;

  const existing = mapCard.querySelector('.performance-toggle');
  if (existing) return;

  const toggle = document.createElement('div');
  toggle.className = 'performance-toggle';
  toggle.innerHTML = `
    <select id="performanceMode" title="Performance Mode">
      <option value="ultra">🚀 Ultra Quality</option>
      <option value="high-performance">⚡ High Performance</option>
    </select>
  `;

  mapCard.insertBefore(toggle, mapCard.firstChild.nextSibling);
}

// Create sector filter button
function createSectorFilterButton() {
  const mapCard = document.querySelector('.dashboard-card:has(#bhMap)');
  if (!mapCard) return;

  const existing = mapCard.querySelector('.filter-button');
  if (existing) return;

  const button = document.createElement('button');
  button.className = 'filter-button';
  button.id = 'sectorFilterBtn';
  button.innerHTML = `<span class="filter-icon">🔍</span> Filters <span class="filter-badge">All</span>`;
  button.title = 'Filter alerts by sector';

  mapCard.insertBefore(button, mapCard.firstChild.nextSibling);
}

// Create sector filter dialog
function createSectorFilterDialog() {
  const existing = document.getElementById('sectorFilterDialog');
  if (existing) return;

  const dialog = document.createElement('div');
  dialog.id = 'sectorFilterDialog';
  dialog.className = 'filter-dialog hidden';
  dialog.innerHTML = `
    <div class="filter-dialog-content">
      <div class="filter-header">
        <h4>Filter Alerts by Sector</h4>
        <button class="close-filter" id="closeFilterDialog">✕</button>
      </div>
      <div class="filter-body">
        ${sectors.map(sector => `
          <label class="filter-option" data-sector="${sector.id}">
            <input type="checkbox" value="${sector.id}" 
              ${sector.id === 'all' ? 'checked' : ''}>
            <span class="filter-icon" style="color: ${sector.color}">${sector.icon}</span>
            <span class="filter-name">${sector.name}</span>
          </label>
        `).join('')}
      </div>
      <div class="filter-footer">
        <button class="btn-secondary" id="clearFilters">Clear All</button>
        <button class="btn-primary" id="applyFilters">Apply Filters</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);
}

// Create map legend
function createMapLegend() {
  const mapCard = document.querySelector('.dashboard-card:has(#bhMap)');
  if (!mapCard) return;

  const existing = mapCard.querySelector('.map-legend');
  if (existing) return;

  const legend = document.createElement('div');
  legend.className = 'map-legend';
  legend.innerHTML = `
    <div class="legend-title">Alert Severity</div>
    <div class="legend-item">
      <span class="legend-dot high"></span>
      <span class="legend-label">High</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot medium"></span>
      <span class="legend-label">Medium</span>
    </div>
    <div class="legend-item">
      <span class="legend-dot low"></span>
      <span class="legend-label">Low</span>
    </div>
  `;

  mapCard.appendChild(legend);
}

// Setup event listeners
function setupEventListeners() {
  // 2D/3D toggle
  const toggleButtons = document.querySelectorAll('.map-toggle .toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => handleMapModeChange(btn.dataset.mode));
  });

  // Performance mode
  const perfSelect = document.getElementById('performanceMode');
  if (perfSelect) {
    perfSelect.addEventListener('change', (e) => {
      currentPerformanceMode = e.target.value;
      if (currentMapMode === '3d' && window.Map3D) {
        window.Map3D.setPerformanceMode(currentPerformanceMode);
      }
    });
  }

  // Filter dialog
  const filterBtn = document.getElementById('sectorFilterBtn');
  if (filterBtn) {
    filterBtn.addEventListener('click', openFilterDialog);
  }

  const closeBtn = document.getElementById('closeFilterDialog');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeFilterDialog);
  }

  const applyBtn = document.getElementById('applyFilters');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }

  const clearBtn = document.getElementById('clearFilters');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearFilters);
  }

  // Handle "All Sectors" checkbox
  const dialog = document.getElementById('sectorFilterDialog');
  if (dialog) {
    const allCheckbox = dialog.querySelector('input[value="all"]');
    if (allCheckbox) {
      allCheckbox.addEventListener('change', (e) => {
        const otherCheckboxes = dialog.querySelectorAll('input[type="checkbox"]:not([value="all"])');
        otherCheckboxes.forEach(cb => cb.checked = false);
        if (e.target.checked) {
          otherCheckboxes.forEach(cb => cb.disabled = true);
        } else {
          otherCheckboxes.forEach(cb => cb.disabled = false);
        }
      });
    }

    // Handle individual sector checkboxes
    const sectorCheckboxes = dialog.querySelectorAll('input[type="checkbox"]:not([value="all"])');
    sectorCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked && allCheckbox) {
          allCheckbox.checked = false;
        }
      });
    });
  }
}

// Handle map mode change
async function handleMapModeChange(mode) {
  if (mode === currentMapMode) return;

  const toggleButtons = document.querySelectorAll('.map-toggle .toggle-btn');
  toggleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  currentMapMode = mode;

  if (mode === '3d') {
    await switch3DMode();
  } else {
    switch2DMode();
  }
}

// Switch to 3D mode
async function switch3DMode() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;

  // Show loading indicator
  mapContainer.innerHTML = '<div class="map-loading">Loading 3D Map... 🌍</div>';

  try {
    // Lazy load Cesium
    if (!window.Map3D) {
      const Map3D = await import('./Map3D.js');
      window.Map3D = Map3D;
    }

    // Create Cesium container
    mapContainer.innerHTML = '<div id="cesiumContainer" style="width: 100%; height: 100%;"></div>';

    // Initialize Cesium viewer
    await window.Map3D.initializeCesiumViewer('cesiumContainer');

    // Set performance mode
    window.Map3D.setPerformanceMode(currentPerformanceMode);

    // Add alerts with current filters
    window.Map3D.addAlertMarkers({ sectors: currentSectorFilters });

    // Hide Leaflet-specific controls
    const heatToggle = document.getElementById('heatToggle');
    if (heatToggle && heatToggle.closest('.control-group')) {
      heatToggle.closest('.control-group').style.display = 'none';
    }

  } catch (error) {
    console.error('Error loading 3D map:', error);
    mapContainer.innerHTML = '<div class="map-error">⚠️ Failed to load 3D map. Please try 2D mode.</div>';
  }
}

// Switch to 2D mode
function switch2DMode() {
  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;

  // Cleanup Cesium
  if (window.Map3D) {
    window.Map3D.destroy();
  }

  // Restore 2D map
  mapContainer.innerHTML = '<div id="bhMap" style="width: 100%; height: 100%;"></div>';

  // Reinitialize Leaflet map
  if (typeof initializeMap === 'function') {
    initializeMap();
  }

  // Show Leaflet-specific controls
  const heatToggle = document.getElementById('heatToggle');
  if (heatToggle && heatToggle.closest('.control-group')) {
    heatToggle.closest('.control-group').style.display = '';
  }
}

// Open filter dialog
function openFilterDialog() {
  const dialog = document.getElementById('sectorFilterDialog');
  if (dialog) {
    dialog.classList.remove('hidden');
    filterDialogOpen = true;
  }
}

// Close filter dialog
function closeFilterDialog() {
  const dialog = document.getElementById('sectorFilterDialog');
  if (dialog) {
    dialog.classList.add('hidden');
    filterDialogOpen = false;
  }
}

// Apply filters
function applyFilters() {
  const dialog = document.getElementById('sectorFilterDialog');
  if (!dialog) return;

  const checkedBoxes = dialog.querySelectorAll('input[type="checkbox"]:checked');
  currentSectorFilters = Array.from(checkedBoxes).map(cb => cb.value);

  // Update filter badge
  const badge = document.querySelector('.filter-badge');
  if (badge) {
    if (currentSectorFilters.includes('all') || currentSectorFilters.length === 0) {
      badge.textContent = 'All';
    } else if (currentSectorFilters.length === 1) {
      const sector = sectors.find(s => s.id === currentSectorFilters[0]);
      badge.textContent = sector ? sector.name : currentSectorFilters.length;
    } else {
      badge.textContent = currentSectorFilters.length;
    }
  }

  // Apply filters to current map
  if (currentMapMode === '3d' && window.Map3D) {
    window.Map3D.updateSectorFilters(currentSectorFilters);
  }

  closeFilterDialog();
}

// Clear filters
function clearFilters() {
  const dialog = document.getElementById('sectorFilterDialog');
  if (!dialog) return;

  const checkboxes = dialog.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.checked = cb.value === 'all';
    cb.disabled = cb.value !== 'all';
  });
}

// Export for window access
if (typeof window !== 'undefined') {
  window.MapControls = {
    initialize: initializeMapControls,
    setMapMode: handleMapModeChange,
    getCurrentMode: () => currentMapMode,
    getCurrentFilters: () => currentSectorFilters,
    getCurrentPerformance: () => currentPerformanceMode
  };
}
