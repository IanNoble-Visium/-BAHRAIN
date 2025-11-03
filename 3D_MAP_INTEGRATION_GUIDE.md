# 3D Map Integration Guide

## Overview
The 3D Map View (🌍 3D Map View) provides an immersive CesiumJS-based visualization of Bahrain with real-time alert markers, interactive features, and performance optimization options.

## Architecture

### Components
- **Map3D.js**: Core CesiumJS viewer initialization and management
- **MapControls.js**: UI controls for filtering and performance settings
- **bahrain-alerts.js**: Alert data generation and management
- **dashboard.html**: Container and modal for 3D view

### Key Features
1. **3D Terrain Visualization**: High-quality terrain rendering of Bahrain
2. **Alert Markers**: Severity-based 3D representations
3. **Interactive Camera**: Orbit animation and fly-to functionality
4. **Performance Modes**: Ultra quality vs. high-performance rendering
5. **Sector Filtering**: Filter alerts by domain (traffic, health, etc.)
6. **Alert Modal**: Video playback for detailed alert information

## View Integration

### HTML Structure
```html
<!-- 3D Map Container -->
<div id="cesiumContainer" style="width: 100%; height: 100%;"></div>

<!-- Video Modal for Alert Details -->
<div id="videoModal" class="modal hidden">
  <div class="modal-content">
    <button class="modal-close" id="closeVideo">✕</button>
    <h3>Alert Details</h3>
    <video id="modalVideo" controls style="width: 100%; max-height: 70vh;">
      <source src="" type="video/mp4">
    </video>
  </div>
</div>
```

### View Selector Option
```html
<option value="3dmap">🌍 3D Map View</option>
```

## Initialization Flow

### 1. View Selection
When user selects "3D Map View":
```javascript
if (view === '3dmap') {
  // Hide standard dashboard
  dashboardGrid.style.display = 'none';
  
  // Initialize 3D map
  Map3D.initialize('cesiumContainer');
  Map3D.addAlertMarkers();
}
```

### 2. CesiumJS Setup
- Creates viewer with Bahrain terrain
- Sets initial camera position (50.5577°E, 26.0667°N)
- Enables lighting and depth testing
- Starts camera orbit animation

### 3. Alert Markers
Three marker types based on severity:
- **High**: Pulsing 3D cylinders (500m tall)
- **Medium**: Billboard icons with sector emoji
- **Low**: Simple point markers

### 4. Interactivity
- Click markers to fly camera and show alert modal
- Hover for label display
- Sector filtering to show/hide alerts
- Performance mode toggle

## Data Structure

### Alert Object
```javascript
{
  id: 'alert-123',
  severity: 'high|medium|low',
  sector: 'traffic|health|environment|water|cybersecurity|energy|infrastructure',
  location: {
    name: 'Manama Center',
    lat: 26.1234,
    lon: 50.5678
  },
  message: 'Traffic congestion detected',
  videoUrl: '/video-kpis/alert-video.mp4',
  timestamp: '2025-11-02T14:32:00Z'
}
```

### Sector Mapping
```javascript
const sectors = {
  traffic: { icon: '🚦', color: '#ef4444' },
  health: { icon: '🏥', color: '#ec4899' },
  environment: { icon: '🌬️', color: '#10b981' },
  water: { icon: '💧', color: '#3b82f6' },
  cybersecurity: { icon: '🛡️', color: '#f59e0b' },
  energy: { icon: '⚡', color: '#8b5cf6' },
  infrastructure: { icon: '🏗️', color: '#14b8a6' }
};
```

## Performance Optimization

### Ultra Quality Mode (Default)
- Terrain quality: High (maximumScreenSpaceError = 2)
- Lighting: Enabled
- Atmosphere: Enabled
- Target FPS: 60
- Best for: Desktop with good GPU

### High-Performance Mode
- Terrain quality: Medium (maximumScreenSpaceError = 4)
- Lighting: Disabled
- Atmosphere: Disabled
- Target FPS: 30
- Best for: Mobile/low-end devices

### Optimization Techniques
1. **Request Render Mode**: Only render when needed
2. **Lazy Loading**: Initialize on view selection
3. **Entity Pooling**: Reuse entities when possible
4. **LOD (Level of Detail)**: Scale markers by distance
5. **Culling**: Hide off-screen entities

## API Reference

### Initialization
```javascript
// Initialize viewer
await Map3D.initialize('cesiumContainer');

// Get viewer instance
const viewer = Map3D.getViewer();
```

### Alert Management
```javascript
// Add alert markers with filters
Map3D.addAlertMarkers({
  sectors: ['traffic', 'health'],
  severity: 'high'
});

// Clear all markers
Map3D.clearAlertMarkers();

// Fly to specific alert
Map3D.flyToAlert(entity);
```

### Controls
```javascript
// Set performance mode
Map3D.setPerformanceMode('high-performance');

// Update sector filters
Map3D.updateSectorFilters(['traffic', 'environment']);

// Cleanup
Map3D.destroy();
```

## Integration with Chart System

### Unified Dashboard Experience
1. **Executive View**: Sunburst chart + 3D map option
2. **Sector Views**: Domain-specific charts + 3D map overlay
3. **Alert Correlation**: Charts show trends, 3D map shows locations

### Data Flow
```
Alert Data (bahrain-alerts.js)
    ↓
Chart System (ECharts) ← Aggregated metrics
    ↓
3D Map (CesiumJS) ← Geographic visualization
    ↓
User Interaction (click, filter, zoom)
```

### Synchronized Updates
- Time range changes update both charts and map
- Sector filters apply to both visualizations
- Alert severity affects both chart colors and map markers

## Styling

### Modal Styles
```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal.hidden {
  display: none;
}
```

## Browser Requirements
- WebGL support (for CesiumJS)
- Modern browser (Chrome, Firefox, Safari, Edge)
- Minimum 2GB RAM recommended
- Stable internet connection (for terrain tiles)

## Troubleshooting

### Map Not Loading
1. Check Cesium Ion token validity
2. Verify container element exists
3. Check browser console for errors
4. Ensure WebGL is enabled

### Performance Issues
1. Switch to high-performance mode
2. Reduce number of alert markers
3. Disable camera orbit animation
4. Lower terrain quality

### Alert Markers Not Showing
1. Verify alert data is generated
2. Check sector filters
3. Ensure coordinates are valid
4. Check browser console for errors

## Future Enhancements
- [ ] Real-time alert streaming
- [ ] Custom marker types
- [ ] Heat map overlay
- [ ] Traffic flow visualization
- [ ] 3D building models
- [ ] Weather overlay
- [ ] Historical playback
- [ ] Multi-user collaboration
- [ ] Export map as image/video
- [ ] Custom color themes

