/**
 * ECharts Utilities for TruContext Dashboard
 * Provides reusable functions for creating diverse chart types
 */

// Global chart instances storage
window.tcECharts = window.tcECharts || {};

/**
 * Initialize ECharts instance with responsive sizing
 */
export function initEChart(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container ${containerId} not found`);
    return null;
  }

  // Destroy existing chart if present
  if (window.tcECharts[containerId]) {
    window.tcECharts[containerId].dispose();
  }

  // Use global echarts if available
  if (typeof echarts === 'undefined') {
    console.warn('ECharts library not loaded');
    return null;
  }

  const chart = echarts.init(container, 'light', { renderer: 'canvas' });
  window.tcECharts[containerId] = chart;

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.tcECharts[containerId]) {
      window.tcECharts[containerId].resize();
    }
  });

  return chart;
}

/**
 * Common theme configuration
 */
export const chartTheme = {
  colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
  textStyle: { fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#374151' },
  backgroundColor: 'transparent',
  title: { textStyle: { fontSize: 14, fontWeight: 600, color: '#1f2937' } },
  legend: { textStyle: { fontSize: 12, color: '#6b7280' } },
  tooltip: { backgroundColor: 'rgba(0,0,0,0.8)', borderColor: '#e5e7eb', textStyle: { color: '#fff' } }
};

/**
 * Sunburst Chart - Hierarchical data visualization
 */
export function createSunburstChart(containerId, data, title = 'Hierarchical Overview') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'sunburst',
      data: data,
      radius: [0, '90%'],
      label: { rotate: 'radial' },
      itemStyle: { borderRadius: 7, borderWidth: 2 }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Sankey Diagram - Flow visualization
 */
export function createSankeyChart(containerId, nodes, links, title = 'Flow Analysis') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item', triggerOn: 'mousemove' },
    series: [{
      type: 'sankey',
      data: nodes,
      links: links,
      emphasis: { focus: 'series' },
      lineStyle: { color: 'source', curveness: 0.5 }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Scatter Matrix - Multi-dimensional correlation
 */
export function createScatterMatrixChart(containerId, data, dimensions, title = 'Correlation Analysis') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item' },
    grid: { containLabel: true },
    xAxis: { type: 'value', gridIndex: 0 },
    yAxis: { type: 'value', gridIndex: 0 },
    series: [{
      type: 'scatter',
      symbolSize: 8,
      data: data,
      itemStyle: { color: chartTheme.colors[0], opacity: 0.7 }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Bubble Chart - Three-dimensional data
 */
export function createBubbleChart(containerId, data, title = 'Bubble Analysis') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item', formatter: (params) => {
      if (params.componentSubType === 'scatter') {
        return `${params.name}<br/>X: ${params.value[0]}<br/>Y: ${params.value[1]}<br/>Size: ${params.value[2]}`;
      }
    }},
    grid: { containLabel: true },
    xAxis: { type: 'value', scale: true },
    yAxis: { type: 'value', scale: true },
    series: [{
      type: 'scatter',
      symbolSize: (val) => val[2] / 10,
      data: data,
      itemStyle: { color: chartTheme.colors[0], opacity: 0.6 }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Treemap - Hierarchical area visualization
 */
export function createTreemapChart(containerId, data, title = 'Hierarchical Distribution') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item', formatter: '{b}: {c}' },
    series: [{
      type: 'treemap',
      data: data,
      leafDepth: 2,
      label: { show: true },
      itemStyle: { borderColor: '#fff', borderWidth: 2 }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Polar/Radar Chart - Multi-axis comparison
 */
export function createPolarChart(containerId, data, indicators, title = 'Multi-Axis Analysis') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item' },
    radar: { indicator: indicators, shape: 'polygon', splitNumber: 4 },
    series: [{
      type: 'radar',
      data: data,
      areaStyle: { opacity: 0.3 },
      lineStyle: { width: 2 }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Gauge Chart - Single metric display
 */
export function createGaugeChart(containerId, value, title = 'Gauge', min = 0, max = 100) {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    series: [{
      type: 'gauge',
      min: min,
      max: max,
      progress: { itemStyle: { color: chartTheme.colors[0] } },
      axisLine: { lineStyle: { color: [[1, '#E5E7EB']] } },
      axisTick: { distance: -30, length: 8, lineStyle: { color: '#fff', width: 2 } },
      splitLine: { distance: -30, length: 30, lineStyle: { color: '#fff', width: 4 } },
      axisLabel: { color: 'auto', distance: 40, fontSize: 16 },
      detail: { valueAnimation: true, formatter: '{value}%', color: 'auto', fontSize: 20 },
      data: [{ value: value, name: title }]
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Heatmap Chart - 2D data density
 */
export function createHeatmapChart(containerId, data, xAxis, yAxis, title = 'Heatmap') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item', formatter: (params) => {
      return `${xAxis[params.value[0]]}, ${yAxis[params.value[1]]}: ${params.value[2]}`;
    }},
    grid: { height: '70%', top: 60 },
    xAxis: { type: 'category', data: xAxis },
    yAxis: { type: 'category', data: yAxis },
    visualMap: { min: 0, max: 100, calculable: true, orient: 'vertical', right: '5%' },
    series: [{
      type: 'heatmap',
      data: data,
      emphasis: { itemStyle: { borderColor: '#333', borderWidth: 1 } }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Timeline/Gantt Chart - Project progress
 */
export function createTimelineChart(containerId, data, title = 'Timeline') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'item', formatter: (params) => {
      return `${params.name}: ${params.value[1]}% complete`;
    }},
    grid: { left: '15%', right: '10%', top: 60, bottom: 40, containLabel: true },
    xAxis: { type: 'value', max: 100 },
    yAxis: { type: 'category', data: data.map(d => d.name) },
    series: [{
      type: 'bar',
      data: data.map(d => d.value),
      itemStyle: { color: chartTheme.colors[0] },
      label: { show: true, position: 'right', formatter: '{c}%' }
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Rainfall Chart - Precipitation/distribution
 */
export function createRainfallChart(containerId, data, labels, title = 'Distribution') {
  const chart = initEChart(containerId);
  if (!chart) return null;

  const option = {
    title: { text: title, left: 'center', textStyle: chartTheme.title.textStyle },
    tooltip: { trigger: 'axis' },
    grid: { left: '10%', right: '10%', top: 60, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value' },
    series: [{
      type: 'bar',
      data: data,
      itemStyle: { color: chartTheme.colors[0], opacity: 0.8 },
      smooth: true
    }],
    color: chartTheme.colors
  };
  chart.setOption(option);
  return chart;
}

/**
 * Dispose all charts
 */
export function disposeAllCharts() {
  Object.values(window.tcECharts).forEach(chart => {
    if (chart && typeof chart.dispose === 'function') {
      chart.dispose();
    }
  });
  window.tcECharts = {};
}

/**
 * Get chart instance
 */
export function getChart(containerId) {
  return window.tcECharts[containerId] || null;
}

/**
 * Update chart data
 */
export function updateChartData(containerId, newData) {
  const chart = window.tcECharts[containerId];
  if (chart) {
    chart.setOption(newData, true);
  }
}

export default {
  initEChart,
  createSunburstChart,
  createSankeyChart,
  createScatterMatrixChart,
  createBubbleChart,
  createTreemapChart,
  createPolarChart,
  createGaugeChart,
  createHeatmapChart,
  createTimelineChart,
  createRainfallChart,
  disposeAllCharts,
  getChart,
  updateChartData,
  chartTheme
};
