# ECharts Implementation Guide

## Overview
This guide documents the diverse chart implementations using ECharts for the TruContext Bahrain dashboard. Each view features a unique, visually impressive chart type to showcase data in different ways.

## Chart Types by Dashboard View

### 1. Executive Dashboard - **Sunburst Chart**
**Purpose**: Hierarchical system overview showing relationships between components
**Data Structure**: Nested hierarchy (System → Domains → Components)
**Visual Features**:
- Concentric rings representing hierarchy levels
- Interactive drill-down capability
- Color-coded segments for different domains
- Animated transitions

**Data Example**:
```javascript
{
  name: 'TruContext',
  children: [
    {
      name: 'Security',
      value: 96,
      children: [
        { name: 'Network', value: 45 },
        { name: 'Endpoints', value: 35 }
      ]
    }
  ]
}
```

### 2. Cybersecurity Overview - **Sankey Diagram**
**Purpose**: Visualize threat flow through security layers
**Data Structure**: Nodes (sources/destinations) + Links (flows)
**Visual Features**:
- Flow visualization showing threat progression
- Width represents volume/severity
- Color-coded threat levels
- Interactive hover details

**Data Example**:
```javascript
nodes: [
  { name: 'External Threats' },
  { name: 'Firewall' },
  { name: 'Blocked' }
],
links: [
  { source: 0, target: 1, value: 100 }
]
```

### 3. Traffic Analytics - **Scatter Matrix**
**Purpose**: Analyze correlations between traffic metrics
**Data Structure**: Multi-dimensional points [x, y, label]
**Visual Features**:
- Scatter plot showing relationships
- Point size represents magnitude
- Hover tooltips with details
- Trend analysis capability

**Data Example**:
```javascript
[
  [65, 72, 'King Faisal Hwy'],
  [78, 85, 'Sheikh Khalifa Hwy']
]
```

### 4. Environment & Air Quality - **Polar/Radar Chart**
**Purpose**: Compare multiple pollutant levels across regions
**Data Structure**: Multi-axis indicators with values
**Visual Features**:
- Radar axes for each pollutant type
- Multiple series for different regions
- Filled areas for easy comparison
- Threshold indicators

**Data Example**:
```javascript
indicators: [
  { name: 'PM2.5', max: 100 },
  { name: 'PM10', max: 100 }
],
data: [
  { name: 'Manama', value: [78, 92, 54, 61, 30] }
]
```

### 5. Water Management - **Treemap**
**Purpose**: Show hierarchical breakdown of water consumption
**Data Structure**: Nested categories with values
**Visual Features**:
- Rectangle sizes proportional to values
- Color gradients for visual hierarchy
- Drill-down capability
- Category labels

**Data Example**:
```javascript
{
  name: 'Residential',
  value: 180,
  children: [
    { name: 'Manama', value: 65 }
  ]
}
```

### 6. Energy & Renewables - **Gauge Chart**
**Purpose**: Display grid load percentage in real-time
**Data Structure**: Single value with min/max range
**Visual Features**:
- Circular gauge with needle
- Color zones (green/yellow/red)
- Animated value transitions
- Percentage display

**Data Example**:
```javascript
{
  value: 78,
  min: 0,
  max: 100,
  title: 'Grid Load Status'
}
```

### 7. Infrastructure Projects - **Timeline/Gantt Chart**
**Purpose**: Show project progress and completion status
**Data Structure**: Projects with progress percentages
**Visual Features**:
- Horizontal bars for each project
- Progress indicators
- Percentage labels
- Color-coded status

**Data Example**:
```javascript
[
  { name: 'Airport Expansion', value: 78 },
  { name: 'Metro System', value: 55 }
]
```

### 8. Health Monitoring - **Bubble Chart**
**Purpose**: Analyze hospital capacity with three dimensions
**Data Structure**: Points with [x, y, size, label]
**Visual Features**:
- Bubble size represents capacity
- X/Y axes for different metrics
- Interactive tooltips
- Hover highlighting

**Data Example**:
```javascript
[
  [65, 68, 450, 'Salmaniya'],
  [72, 62, 380, 'Royal Bahrain']
]
```

## File Structure

### Core Files
- **echarts-utils.js**: Reusable ECharts utility functions
- **echarts-dashboard-init.js**: View-specific chart configurations
- **main.js**: Integration with dashboard lifecycle

### Key Functions

#### echarts-utils.js
```javascript
initEChart(containerId, options)        // Initialize chart instance
createSunburstChart(...)                // Create sunburst visualization
createSankeyChart(...)                  // Create sankey diagram
createScatterMatrixChart(...)           // Create scatter plot
createBubbleChart(...)                  // Create bubble chart
createTreemapChart(...)                 // Create treemap
createPolarChart(...)                   // Create polar/radar chart
createGaugeChart(...)                   // Create gauge
createTimelineChart(...)                // Create timeline
createRainfallChart(...)                // Create rainfall chart
createHeatmapChart(...)                 // Create heatmap
```

#### echarts-dashboard-init.js
```javascript
initializeEChartsForView(view)          // Initialize chart for view
updateEChartsData(view, range)          // Update data for time range
animateChartUpdate(view)                // Animate data changes
disposeECharts()                        // Clean up instances
resizeAllCharts()                       // Handle responsive resize
```

## Integration Points

### View Change Handler
When user selects a new view:
1. Chart is disposed
2. New chart initialized for selected view
3. Data loaded from `window.tcData`
4. Chart rendered in container

### Time Range Updates
When user changes time range (24h, 7d, 30d):
1. Data is scaled by factor (1.0, 1.05, 1.12)
2. Chart data updated
3. Smooth transition animation

### Live Data Updates
Every 5 seconds:
1. Data values updated with jitter
2. Chart re-rendered
3. Animations applied

## Performance Considerations

### Optimization Techniques
- Canvas renderer for better performance
- Lazy initialization on view change
- Efficient data updates without full re-render
- Responsive resize handling

### Memory Management
- Chart instances stored in `window.tcECharts`
- Proper disposal on view change
- No memory leaks from event listeners

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Fallback to canvas rendering
- Touch-friendly interactions

## Customization Guide

### Adding New Chart Type
1. Create function in echarts-utils.js
2. Add configuration to chartConfigs in echarts-dashboard-init.js
3. Add case in initializeEChartsForView switch
4. Update HTML container if needed

### Modifying Chart Appearance
Edit `chartTheme` object in echarts-utils.js:
```javascript
const chartTheme = {
  colors: [...],           // Color palette
  textStyle: {...},        // Font settings
  backgroundColor: '...',  // Background
  title: {...},            // Title styling
  legend: {...},           // Legend styling
  tooltip: {...}           // Tooltip styling
};
```

### Updating Data
Modify `chartConfigs` in echarts-dashboard-init.js:
```javascript
const chartConfigs = {
  viewName: {
    title: 'Chart Title',
    type: 'chartType',
    data: { /* chart data */ }
  }
};
```

## Testing Checklist

- [ ] All 8 views render correct chart type
- [ ] Charts are responsive on mobile/tablet/desktop
- [ ] View switching works smoothly
- [ ] Time range updates work correctly
- [ ] Live data updates animate smoothly
- [ ] No console errors
- [ ] Performance is acceptable (< 500ms load)
- [ ] Touch interactions work on mobile
- [ ] Charts resize on window resize
- [ ] Memory usage is stable

## Troubleshooting

### Chart Not Rendering
1. Check container exists in HTML
2. Verify ECharts library loaded
3. Check browser console for errors
4. Ensure data format is correct

### Performance Issues
1. Reduce animation duration
2. Use canvas renderer instead of SVG
3. Limit data points
4. Disable hover effects

### Memory Leaks
1. Ensure charts disposed on view change
2. Check event listeners removed
3. Monitor window.tcECharts size
4. Use browser DevTools memory profiler

## Future Enhancements

- [ ] Add more chart types (Heatmap, Funnel, Waterfall)
- [ ] Implement chart export (PNG, SVG, PDF)
- [ ] Add drill-down interactions
- [ ] Real-time data streaming
- [ ] Custom color themes
- [ ] Chart comparison view
- [ ] Historical data playback
- [ ] Advanced filtering options

