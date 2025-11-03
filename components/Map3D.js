// 3D Map Component using CesiumJS
// Lazy-loaded for performance optimization

import * as Cesium from 'cesium';
import { generateBahrainAlerts, getSeverityColor, sectors } from '../data/bahrain-alerts.js';

let cesiumViewer = null;
let alertEntities = [];
let isInitialized = false;
let currentFilters = { sectors: ['all'], performanceMode: 'ultra' };

// Suppress CesiumJS resource loading errors (non-critical)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Suppress JSON parsing errors from CesiumJS resource loading
    if (event.reason && event.reason.message &&
        event.reason.message.includes('Unexpected token') &&
        event.reason.message.includes('<!DOCTYPE')) {
      console.debug('ℹ️ Suppressed CesiumJS resource loading error (non-critical)');
      event.preventDefault();
    }
  });
}

// Initialize Cesium viewer with Bahrain view
export async function initializeCesiumViewer(containerId = 'cesiumContainer', options = {}) {
  if (isInitialized && cesiumViewer) {
    return cesiumViewer;
  }

  // Set Cesium Ion access token from environment variable
  // Try multiple ways to get the token for compatibility
  const cesiumToken = import.meta.env.VITE_CESIUM_ION_TOKEN ||
                      window.__CESIUM_TOKEN__ ||
                      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YjI1MTM4Ny0wZjUyLTQ2ZTYtOGRjOC1mNDY1MTE1MjYzY2IiLCJpZCI6MzI5NTg5LCJpYXQiOjE3NTQ1NDUxNDF9.ig14SHXBCSqLi-oYDtSfam1jllNfWEBkxzmJ_P6hJhQ';

  if (cesiumToken) {
    Cesium.Ion.defaultAccessToken = cesiumToken;
    console.log('✅ Cesium Ion token loaded successfully');
  } else {
    console.warn('⚠️ WARNING: VITE_CESIUM_ION_TOKEN not found in environment variables');
  }

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return null;
  }

  // Performance settings based on mode
  // Note: requestRenderMode: true requires explicit render calls, which can break rendering
  // Use continuous rendering mode for better compatibility
  const performanceSettings = currentFilters.performanceMode === 'ultra' ? {
    requestRenderMode: false, // Use continuous rendering for better compatibility
    maximumRenderTimeChange: Infinity,
    targetFrameRate: 60
  } : {
    requestRenderMode: false, // Use continuous rendering for better compatibility
    maximumRenderTimeChange: Infinity,
    targetFrameRate: 30
  };

  // Create Cesium viewer
  try {
    console.log('🔍 DEBUG: Creating terrain provider...');
    const terrainProvider = await Cesium.createWorldTerrainAsync();
    console.log('✅ Terrain provider created');

    console.log('🔍 DEBUG: Creating Cesium viewer with settings:', performanceSettings);
    cesiumViewer = new Cesium.Viewer(containerId, {
      ...performanceSettings,
      terrainProvider: terrainProvider,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      selectionIndicator: false, // Disable to prevent image decoding errors
      timeline: false,
      animation: false,
      navigationHelpButton: false,
      infoBox: false, // Disable to prevent InfoBoxDescription.css 404 and image decoding errors
      fullscreenButton: false,
      creditContainer: document.createElement('div'), // Hide credits
      scene3DOnly: true,
      shouldAnimate: false // Disable automatic animation
    });

    console.log('✅ Cesium viewer created successfully');
    console.log('🔍 DEBUG: Viewer canvas:', {
      canvas: cesiumViewer.canvas,
      width: cesiumViewer.canvas.width,
      height: cesiumViewer.canvas.height
    });
  } catch (error) {
    console.error('❌ Error creating Cesium viewer:', error);
    console.error('Stack:', error.stack);
    return null;
  }

  // Set initial camera view - Manama city 3D side view or full Bahrain
  if (options.focusManama) {
    // Dramatic Manama cityscape view - 3D side perspective
    // Position camera to the southwest looking northeast at Manama
    cesiumViewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(50.5677, 26.2135, 2000), // 2km altitude
      orientation: {
        heading: Cesium.Math.toRadians(45), // Looking northeast
        pitch: Cesium.Math.toRadians(-25), // Tilted down for 3D building view
        roll: 0.0
      },
      duration: 3 // Smooth 3-second intro flight
    });
  } else {
    // Default: Full Bahrain overview
    cesiumViewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(50.5577, 26.0667, 50000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0.0
      }
    });
  }

  // Configure scene
  const scene = cesiumViewer.scene;
  scene.globe.enableLighting = true;
  scene.globe.depthTestAgainstTerrain = true;

  // Disable problematic rendering features to prevent image decoding errors
  scene.globe.showGroundAtmosphere = false;
  scene.skyBox = null; // Disable skybox to prevent image loading issues

  // Performance optimizations for low-end mode
  if (currentFilters.performanceMode === 'high-performance') {
    scene.globe.maximumScreenSpaceError = 4; // Lower quality terrain
    scene.fog.enabled = false;
  } else {
    scene.globe.maximumScreenSpaceError = 2; // High quality terrain
    scene.fog.enabled = true;
    scene.fog.density = 0.0001;
  }

  // Add error handler for resource loading failures
  scene.renderError.addEventListener((error) => {
    console.warn('⚠️ Scene rendering error (non-critical):', error);
  });

  // Ensure render loop is active
  console.log('🔍 DEBUG: Checking render loop...');
  if (cesiumViewer.clock) {
    cesiumViewer.clock.shouldAnimate = true;
    console.log('✅ Render loop enabled');
  }

  // Force a render
  scene.requestRender();
  console.log('✅ Render requested');

  // Add subtle rotating camera animation after a delay (can be paused)
  setTimeout(() => {
    startCameraOrbit();
  }, 500);

  // Initialize UI controls
  setTimeout(async () => {
    try {
      const Map3DUI = await import('./Map3DUI.js');
      if (Map3DUI.initialize3DMapUI) {
        Map3DUI.initialize3DMapUI(cesiumViewer);
      }
    } catch (error) {
      console.warn('Map3D UI controls not available:', error);
    }
  }, 1000);

  isInitialized = true;
  return cesiumViewer;
}

// Camera orbit animation
let orbitAnimation = null;
function startCameraOrbit(duration = 120) {
  if (!cesiumViewer || !cesiumViewer.scene || !cesiumViewer.scene.clock) return;
  
  const scene = cesiumViewer.scene;
  const camera = cesiumViewer.camera;
  
  try {
    // Gentle orbit around Bahrain
    orbitAnimation = scene.clock.onTick.addEventListener(() => {
      const angle = Cesium.Math.TWO_PI * (scene.clock.currentTime.secondsOfDay / duration);
      camera.position = Cesium.Cartesian3.fromDegrees(
        50.5577 + Math.cos(angle) * 0.5,
        26.0667 + Math.sin(angle) * 0.5,
        50000
      );
      camera.lookAt(
        Cesium.Cartesian3.fromDegrees(50.5577, 26.0667, 0),
        new Cesium.Cartesian3(0, 0, camera.positionCartographic.height)
      );
    });
  } catch (error) {
    console.warn('Camera orbit animation not available:', error);
  }
}

export function stopCameraOrbit() {
  if (orbitAnimation && cesiumViewer && cesiumViewer.scene && cesiumViewer.scene.clock) {
    try {
      cesiumViewer.scene.clock.onTick.removeEventListener(orbitAnimation);
    } catch (error) {
      console.warn('Error stopping camera orbit:', error);
    }
    orbitAnimation = null;
  }
}

// Add alert markers to the map
export function addAlertMarkers(filters = { sectors: ['all'], severity: 'all' }) {
  if (!cesiumViewer) return;

  // Clear existing entities
  clearAlertMarkers();

  // Get filtered alerts
  let alerts = generateBahrainAlerts();
  
  // Filter by sector
  if (!filters.sectors.includes('all')) {
    alerts = alerts.filter(alert => filters.sectors.includes(alert.sector));
  }
  
  // Filter by severity
  if (filters.severity !== 'all') {
    alerts = alerts.filter(alert => alert.severity === filters.severity);
  }

  // Add each alert as an entity
  alerts.forEach((alert, index) => {
    const color = Cesium.Color.fromCssColorString(getSeverityColor(alert.severity));
    
    // Create 3D entity based on severity
    let entity;
    
    if (alert.severity === 'high') {
      // High severity: Pulsing 3D cylinder
      entity = cesiumViewer.entities.add({
        id: alert.id,
        position: Cesium.Cartesian3.fromDegrees(alert.location.lon, alert.location.lat, 250),
        cylinder: {
          length: 500,
          topRadius: 150,
          bottomRadius: 150,
          material: color.withAlpha(0.7),
          outline: true,
          outlineColor: color,
          outlineWidth: 2
        },
        properties: alert
      });
      
      // Add pulsing animation
      addPulseAnimation(entity, 500, 600, 2000);
      
    } else if (alert.severity === 'medium') {
      // Medium severity: Billboard with icon
      entity = cesiumViewer.entities.add({
        id: alert.id,
        position: Cesium.Cartesian3.fromDegrees(alert.location.lon, alert.location.lat, 0),
        billboard: {
          image: createAlertCanvas(alert.sector, 'medium'),
          width: 48,
          height: 48,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.5, 50000, 0.5)
        },
        properties: alert
      });
      
    } else {
      // Low severity: Simple point marker
      entity = cesiumViewer.entities.add({
        id: alert.id,
        position: Cesium.Cartesian3.fromDegrees(alert.location.lon, alert.location.lat, 0),
        point: {
          pixelSize: 12,
          color: color,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1000, 1.5, 50000, 0.5)
        },
        properties: alert
      });
    }
    
    // Add label
    entity.label = {
      text: alert.location.name || alert.message.substring(0, 20) + '...',
      font: '14px sans-serif',
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -50),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      scaleByDistance: new Cesium.NearFarScalar(1000, 1.0, 50000, 0.3)
    };
    
    alertEntities.push(entity);
    
    // Animate entrance
    setTimeout(() => {
      animateEntityEntrance(entity);
    }, index * 100);
  });
  
  // Set up click handlers
  setupClickHandlers();
}

// Create canvas for alert icon
function createAlertCanvas(sector, severity) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  // Draw circle background
  const color = getSeverityColor(severity);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(32, 32, 28, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw white border
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Draw sector icon (simplified)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const icons = {
    traffic: '🚦',
    health: '🏥',
    environment: '🌬️',
    water: '💧',
    cybersecurity: '🛡️',
    energy: '⚡',
    infrastructure: '🏗️'
  };
  
  ctx.fillText(icons[sector] || '⚠️', 32, 32);
  
  return canvas;
}

// Pulse animation for high severity alerts
function addPulseAnimation(entity, minLength, maxLength, duration) {
  if (!entity.cylinder) return;
  
  const startTime = cesiumViewer.clock.currentTime;
  
  cesiumViewer.scene.preRender.addEventListener(() => {
    const elapsed = Cesium.JulianDate.secondsDifference(cesiumViewer.clock.currentTime, startTime);
    const t = (elapsed % (duration / 1000)) / (duration / 1000);
    const scale = Math.sin(t * Math.PI * 2) * 0.5 + 0.5;
    entity.cylinder.length = minLength + (maxLength - minLength) * scale;
  });
}

// Animate entity entrance
function animateEntityEntrance(entity) {
  if (!entity) return;
  
  const originalPosition = entity.position.getValue(cesiumViewer.clock.currentTime);
  const startHeight = originalPosition.z - 1000;
  
  // Animate from below ground to surface
  let progress = 0;
  const interval = setInterval(() => {
    progress += 0.05;
    if (progress >= 1) {
      clearInterval(interval);
      return;
    }
    
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentHeight = startHeight + (originalPosition.z - startHeight) * easeOut;
    
    entity.position = new Cesium.ConstantPositionProperty(
      new Cesium.Cartesian3(originalPosition.x, originalPosition.y, currentHeight)
    );
  }, 16);
}

// Set up click handlers for alerts
function setupClickHandlers() {
  if (!cesiumViewer) return;
  
  const handler = new Cesium.ScreenSpaceEventHandler(cesiumViewer.scene.canvas);
  
  handler.setInputAction((click) => {
    const pickedObject = cesiumViewer.scene.pick(click.position);
    
    if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.properties) {
      const alert = pickedObject.id.properties.getValue(cesiumViewer.clock.currentTime);
      
      // Fly to alert location
      flyToAlert(pickedObject.id);
      
      // Show alert modal
      showAlertModal(alert);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// Fly camera to alert
export function flyToAlert(entity) {
  if (!cesiumViewer || !entity) return;
  
  const position = entity.position.getValue(cesiumViewer.clock.currentTime);
  
  cesiumViewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromCartesian3(position, new Cesium.Cartesian3(0, 0, 5000)),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45),
      roll: 0.0
    },
    duration: 1.5
  });
}

// Show alert modal
function showAlertModal(alert) {
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  
  if (modal && modalVideo && alert) {
    modalVideo.src = alert.videoUrl;
    modal.classList.remove('hidden');
    modalVideo.play().catch(() => {});
    
    // Update modal title with alert info
    const modalTitle = modal.querySelector('h3');
    if (modalTitle) {
      modalTitle.textContent = alert.message;
    }
  }
}

// Clear all alert markers
export function clearAlertMarkers() {
  if (!cesiumViewer) return;
  
  alertEntities.forEach(entity => {
    cesiumViewer.entities.remove(entity);
  });
  alertEntities = [];
}

// Update performance mode
export function setPerformanceMode(mode) {
  currentFilters.performanceMode = mode;
  
  if (!cesiumViewer) return;
  
  const scene = cesiumViewer.scene;
  
  if (mode === 'high-performance') {
    scene.globe.maximumScreenSpaceError = 4;
    scene.fog.enabled = false;
    scene.globe.showGroundAtmosphere = false;
    scene.requestRenderMode = true;
    scene.targetFrameRate = 30;
  } else {
    scene.globe.maximumScreenSpaceError = 2;
    scene.fog.enabled = true;
    scene.fog.density = 0.0001;
    scene.globe.showGroundAtmosphere = true;
    scene.targetFrameRate = 60;
  }
}

// Update sector filters
export function updateSectorFilters(sectors) {
  currentFilters.sectors = sectors;
  addAlertMarkers(currentFilters);
}

// Destroy viewer (cleanup)
export function destroyCesiumViewer() {
  if (cesiumViewer) {
    stopCameraOrbit();
    cesiumViewer.destroy();
    cesiumViewer = null;
    isInitialized = false;
    alertEntities = [];
  }
}

// Get viewer instance
export function getCesiumViewer() {
  return cesiumViewer;
}

// Export for window access
if (typeof window !== 'undefined') {
  window.Map3D = {
    initialize: initializeCesiumViewer,
    addAlertMarkers,
    clearAlertMarkers,
    setPerformanceMode,
    updateSectorFilters,
    flyToAlert,
    destroy: destroyCesiumViewer,
    getViewer: getCesiumViewer
  };
}
