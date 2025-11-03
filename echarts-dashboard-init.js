/**
 * ECharts Dashboard Initialization
 * Creates diverse chart types for each dashboard view
 */

import * as echartsUtils from './echarts-utils.js';

// Chart configuration per view
const chartConfigs = {
  executive: {
    title: 'System Hierarchy',
    type: 'sunburst',
    data: {
      name: 'TruContext',
      children: [
        {
          name: 'Security',
          value: 96,
          children: [
            { name: 'Network', value: 45 },
            { name: 'Endpoints', value: 35 },
            { name: 'Cloud', value: 16 }
          ]
        },
        {
          name: 'Infrastructure',
          value: 88,
          children: [
            { name: 'Compute', value: 40 },
            { name: 'Storage', value: 35 },
            { name: 'Network', value: 13 }
          ]
        },
        {
          name: 'Operations',
          value: 92,
          children: [
            { name: 'Monitoring', value: 50 },
            { name: 'Alerting', value: 30 },
            { name: 'Automation', value: 12 }
          ]
        }
      ]
    }
  },

  cybersecurity: {
    title: 'Threat Flow Analysis',
    type: 'sankey',
    nodes: [
      { name: 'External Threats' },
      { name: 'Firewall' },
      { name: 'IDS/IPS' },
      { name: 'Blocked' },
      { name: 'Quarantine' },
      { name: 'Analyzed' }
    ],
    links: [
      { source: 0, target: 1, value: 100 },
      { source: 1, target: 2, value: 85 },
      { source: 2, target: 3, value: 45 },
      { source: 2, target: 4, value: 25 },
      { source: 2, target: 5, value: 15 }
    ]
  },

  traffic: {
    title: 'Traffic Correlation Analysis',
    type: 'scatter',
    data: [
      [65, 72, 'King Faisal Hwy'],
      [78, 85, 'Sheikh Khalifa Hwy'],
      [45, 52, 'Diplomatic Area'],
      [88, 92, 'Manama Center'],
      [35, 42, 'Muharraq Bridge'],
      [72, 78, 'Airport Road'],
      [55, 68, 'Industrial Zone'],
      [82, 88, 'Financial District']
    ]
  },

  environment: {
    title: 'Air Quality Metrics',
    type: 'polar',
    indicators: [
      { name: 'PM2.5', max: 100 },
      { name: 'PM10', max: 100 },
      { name: 'NO2', max: 100 },
      { name: 'O3', max: 100 },
      { name: 'SO2', max: 100 }
    ],
    data: [
      { name: 'Manama', value: [78, 92, 54, 61, 30] },
      { name: 'Muharraq', value: [72, 85, 49, 58, 28] }
    ]
  },

  water: {
    title: 'Water Consumption Breakdown',
    type: 'treemap',
    data: [
      {
        name: 'Residential',
        value: 180,
        children: [
          { name: 'Manama', value: 65 },
          { name: 'Muharraq', value: 55 },
          { name: 'Other', value: 60 }
        ]
      },
      {
        name: 'Industrial',
        value: 120,
        children: [
          { name: 'Desalination', value: 80 },
          { name: 'Manufacturing', value: 40 }
        ]
      },
      {
        name: 'Agricultural',
        value: 90,
        children: [
          { name: 'Irrigation', value: 90 }
        ]
      }
    ]
  },

  energy: {
    title: 'Grid Load Status',
    type: 'gauge',
    value: 78,
    min: 0,
    max: 100
  },

  infrastructure: {
    title: 'Project Progress Timeline',
    type: 'timeline',
    data: [
      { name: 'Airport Expansion', value: 78 },
      { name: 'Metro System', value: 55 },
      { name: 'Water Main Upgrade', value: 42 },
      { name: 'Port Modernization', value: 66 },
      { name: 'Housing Development', value: 35 }
    ]
  },

  health: {
    title: 'Hospital Capacity Analysis',
    type: 'bubble',
    data: [
      [65, 68, 450, 'Salmaniya'],
      [72, 62, 380, 'Royal Bahrain'],
      [58, 58, 320, 'BDF Hospital'],
      [78, 64, 410, 'King Hamad']
    ]
  }
};

/**
 * Initialize ECharts for current view
 */
export function initializeEChartsForView(view) {
  const config = chartConfigs[view];
  if (!config) return;

  // Hide all echarts containers first
  document.querySelectorAll('.echarts-container').forEach(el => {
    el.style.display = 'none';
  });

  // Show and initialize the appropriate chart
  const container = document.getElementById('echartsCard1');
  const chartDiv = document.getElementById('echartsChart1');
  const titleEl = document.getElementById('echartsTitle1');

  if (!container || !chartDiv) return;

  container.style.display = 'block';
  titleEl.textContent = config.title;

  // Create chart based on type
  let chart;
  try {
    switch (config.type) {
      case 'sunburst':
        chart = echartsUtils.createSunburstChart('echartsChart1', config.data, config.title);
        break;
      case 'sankey':
        chart = echartsUtils.createSankeyChart('echartsChart1', config.nodes, config.links, config.title);
        break;
      case 'scatter':
        chart = echartsUtils.createScatterMatrixChart('echartsChart1', config.data, [], config.title);
        break;
      case 'polar':
        chart = echartsUtils.createPolarChart('echartsChart1', config.data, config.indicators, config.title);
        break;
      case 'treemap':
        chart = echartsUtils.createTreemapChart('echartsChart1', config.data, config.title);
        break;
      case 'gauge':
        chart = echartsUtils.createGaugeChart('echartsChart1', config.value, config.title, config.min, config.max);
        break;
      case 'timeline':
        chart = echartsUtils.createTimelineChart('echartsChart1', config.data, config.title);
        break;
      case 'bubble':
        chart = echartsUtils.createBubbleChart('echartsChart1', config.data, config.title);
        break;
    }
  } catch (error) {
    console.error('🔍 DEBUG: ECharts initialization failed:', error, 'Config:', config);
    // Hide the chart container on error
    if (container) container.style.display = 'none';
    return null;
  }

  return chart;
}

/**
 * Update chart data based on time range
 */
export function updateEChartsData(view, range) {
  const chart = echartsUtils.getChart('echartsChart1');
  if (!chart) return;

  // Apply time-range specific adjustments
  const factor = range === '7d' ? 1.05 : range === '30d' ? 1.12 : 1.0;

  // Update data based on view and range
  if (view === 'energy') {
    const newValue = Math.min(100, Math.round(chartConfigs.energy.value * factor));
    echartsUtils.createGaugeChart('echartsChart1', newValue, chartConfigs.energy.title);
  }
}

/**
 * Animate chart data updates
 */
export function animateChartUpdate(view) {
  const chart = echartsUtils.getChart('echartsChart1');
  if (!chart) return;

  // Add subtle animation to data
  const config = chartConfigs[view];
  if (config && config.type === 'gauge') {
    const newValue = Math.round(config.value * (0.95 + Math.random() * 0.1));
    echartsUtils.createGaugeChart('echartsChart1', newValue, config.title);
  }
}

/**
 * Dispose all ECharts instances
 */
export function disposeECharts() {
  echartsUtils.disposeAllCharts();
}

/**
 * Get chart configuration for a view
 */
export function getChartConfig(view) {
  return chartConfigs[view] || null;
}

/**
 * Update all chart sizes (for responsive design)
 */
export function resizeAllCharts() {
  Object.values(window.tcECharts || {}).forEach(chart => {
    if (chart && typeof chart.resize === 'function') {
      chart.resize();
    }
  });
}

export default {
  initializeEChartsForView,
  updateEChartsData,
  animateChartUpdate,
  disposeECharts,
  getChartConfig,
  resizeAllCharts,
  chartConfigs
};

