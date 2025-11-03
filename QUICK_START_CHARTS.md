# Quick Start Guide - Chart Diversity System

## Overview
The dashboard now features 8 unique chart types powered by ECharts 5.4.3. Each view automatically displays the appropriate chart based on the selected dashboard view.

## Getting Started

### 1. View the Charts
Simply select a view from the dropdown to see the corresponding chart:
- **Executive** → Sunburst Chart
- **Cybersecurity** → Sankey Diagram
- **Traffic** → Scatter Matrix
- **Environment** → Polar/Radar Chart
- **Water** → Treemap
- **Energy** → Gauge Chart
- **Infrastructure** → Timeline
- **Health** → Bubble Chart

### 2. Interact with Charts
- **Hover**: See detailed tooltips
- **Click**: Drill down (Sunburst, Treemap)
- **Zoom**: Scroll to zoom in/out
- **Pan**: Drag to move around
- **Time Range**: Change 24h/7d/30d to update data

### 3. 3D Map View
Select "🌍 3D Map View" to see:
- Interactive 3D map of Bahrain
- Alert markers by severity
- Click markers to see alert details
- Filter by sector
- Toggle performance mode

## For Developers

### Adding a New Chart Type

1. **Create chart function in echarts-utils.js**:
```javascript
export function createMyChart(containerId, data, title) {
  const chart = initEChart(containerId);
  const option = {
    title: { text: title },
    series: [{ type: 'myChartType', data: data }]
  };
  chart.setOption(option);
  return chart;
}
```

2. **Add configuration in echarts-dashboard-init.js**:
```javascript
myview: {
  title: 'My Chart Title',
  type: 'myChartType',
  data: { /* your data */ }
}
```

3. **Add case in initializeEChartsForView()**:
```javascript
case 'myChartType':
  chart = echartsUtils.createMyChart(containerId, config.data, config.title);
  break;
```

### Updating Chart Data

```javascript
// Update data for current view
window.echartsInit.updateEChartsData(view, range);

// Animate chart update
window.echartsInit.animateChartUpdate(view);

// Resize all charts
window.echartsInit.resizeAllCharts();
```

### Accessing Chart Instances

```javascript
// Get specific chart
const chart = window.tcECharts['echartsChart1'];

// Update chart data
chart.setOption({ series: [{ data: newData }] });

// Dispose chart
chart.dispose();
```

## Chart Configuration Reference

### Sunburst Chart
```javascript
{
  name: 'Root',
  children: [
    { name: 'Child1', value: 100 },
    { name: 'Child2', value: 200 }
  ]
}
```

### Sankey Diagram
```javascript
{
  nodes: [
    { name: 'Source' },
    { name: 'Target' }
  ],
  links: [
    { source: 0, target: 1, value: 100 }
  ]
}
```

### Scatter Matrix
```javascript
[
  [x1, y1, 'label1'],
  [x2, y2, 'label2']
]
```

### Polar/Radar
```javascript
{
  indicators: [
    { name: 'Metric1', max: 100 },
    { name: 'Metric2', max: 100 }
  ],
  data: [
    { name: 'Series1', value: [80, 90] }
  ]
}
```

### Treemap
```javascript
{
  name: 'Root',
  children: [
    {
      name: 'Category',
      value: 100,
      children: [
        { name: 'Item', value: 50 }
      ]
    }
  ]
}
```

### Gauge
```javascript
{
  value: 75,
  min: 0,
  max: 100,
  title: 'Gauge Title'
}
```

### Timeline
```javascript
[
  { name: 'Project1', value: 75 },
  { name: 'Project2', value: 50 }
]
```

### Bubble
```javascript
[
  [x1, y1, size1, 'label1'],
  [x2, y2, size2, 'label2']
]
```

## Styling

### Theme Colors
```javascript
const colors = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316'  // Orange
];
```

### Customizing Theme
Edit `chartTheme` in echarts-utils.js:
```javascript
export const chartTheme = {
  colors: [...],
  textStyle: { fontFamily: '...', fontSize: 12 },
  backgroundColor: 'transparent',
  title: { textStyle: { fontSize: 14 } },
  legend: { textStyle: { fontSize: 12 } },
  tooltip: { backgroundColor: 'rgba(0,0,0,0.8)' }
};
```

## Performance Tips

1. **Use Canvas Renderer** (default)
   - Better for large datasets
   - Lower memory usage

2. **Lazy Initialize**
   - Charts only created when view selected
   - Reduces initial load time

3. **Efficient Updates**
   - Use `setOption(data, true)` for partial updates
   - Avoid full re-renders

4. **Responsive Design**
   - Charts auto-resize on window change
   - Use `resizeAllCharts()` after DOM changes

## Troubleshooting

### Chart Not Showing
1. Check container exists: `document.getElementById('echartsChart1')`
2. Verify ECharts loaded: `typeof echarts !== 'undefined'`
3. Check browser console for errors
4. Ensure data format is correct

### Performance Issues
1. Reduce animation duration
2. Limit data points
3. Use high-performance mode
4. Disable hover effects

### Memory Leaks
1. Ensure charts disposed on view change
2. Check event listeners removed
3. Monitor `window.tcECharts` size
4. Use browser DevTools memory profiler

## Resources

- **ECharts Documentation**: https://echarts.apache.org/
- **Implementation Guide**: See ECHARTS_IMPLEMENTATION_GUIDE.md
- **3D Map Guide**: See 3D_MAP_INTEGRATION_GUIDE.md
- **Planning Document**: See CHART_DIVERSITY_IMPLEMENTATION_PLAN.md

## Support

For issues or questions:
1. Check the documentation files
2. Review echarts-utils.js for available functions
3. Check browser console for error messages
4. Verify data format matches chart type requirements

