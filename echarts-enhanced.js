/**
 * Enhanced ECharts Configuration Module
 * Professional, well-spaced charts for Bahrain Smart City Dashboard
 * Unified design system with modern aesthetics
 */

class EChartsEnhanced {
  constructor() {
    this.instances = {};
    this.theme = this.createTheme();
  }

  /**
   * Create unified chart theme
   */
  createTheme() {
    return {
      color: [
        '#2563eb', // Primary blue
        '#10b981', // Success green
        '#f59e0b', // Warning orange
        '#ef4444', // Error red
        '#8b5cf6', // Purple
        '#06b6d4', // Cyan
        '#ec4899', // Pink
        '#84cc16'  // Lime
      ],
      backgroundColor: 'transparent',
      textStyle: {
        fontFamily: 'Inter, sans-serif',
        fontSize: 13,
        color: '#374151'
      },
      title: {
        textStyle: {
          fontWeight: 600,
          fontSize: 16,
          color: '#111827'
        },
        subtextStyle: {
          fontSize: 13,
          color: '#6b7280'
        }
      },
      line: {
        smooth: true,
        symbolSize: 6,
        lineStyle: {
          width: 3
        }
      },
      bar: {
        barCategoryGap: '40%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0]
        }
      },
      pie: {
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          fontSize: 13,
          fontWeight: 500
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      legend: {
        textStyle: {
          fontSize: 13,
          color: '#6b7280'
        },
        top: 10
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#111827',
          fontSize: 13
        },
        extraCssText: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 12px;'
      }
    };
  }

  /**
   * Initialize chart with enhanced configuration
   */
  initChart(containerId, option) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return null;
    }

    // Dispose existing instance
    if (this.instances[containerId]) {
      this.instances[containerId].dispose();
    }

    // Create new instance
    const chart = echarts.init(container);
    this.instances[containerId] = chart;

    // Apply theme and option
    chart.setOption(option);

    // Auto resize
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(container);

    return chart;
  }

  /**
   * Create line chart configuration
   */
  createLineChart(data, config = {}) {
    const {
      title = '',
      subtitle = '',
      xAxisData = [],
      series = [],
      showGrid = true,
      smooth = true
    } = config;

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'left',
        textStyle: this.theme.title.textStyle,
        subtextStyle: this.theme.title.subtextStyle
      },
      tooltip: {
        trigger: 'axis',
        ...this.theme.tooltip
      },
      legend: {
        ...this.theme.legend,
        data: series.map(s => s.name)
      },
      grid: showGrid ? this.theme.grid : { show: false },
      xAxis: {
        type: 'category',
        data: xAxisData,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      series: series.map(s => ({
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: smooth,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: 4,
          shadowOffsetY: 2
        },
        areaStyle: s.areaStyle ? {
          opacity: 0.2
        } : undefined,
        emphasis: {
          focus: 'series',
          scale: true
        }
      }))
    };
  }

  /**
   * Create bar chart configuration
   */
  createBarChart(data, config = {}) {
    const {
      title = '',
      subtitle = '',
      xAxisData = [],
      series = [],
      horizontal = false,
      stack = false
    } = config;

    const axisConfig = horizontal ? {
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      }
    } : {
      xAxis: {
        type: 'category',
        data: xAxisData,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      }
    };

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'left',
        textStyle: this.theme.title.textStyle,
        subtextStyle: this.theme.title.subtextStyle
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        ...this.theme.tooltip
      },
      legend: {
        ...this.theme.legend,
        data: series.map(s => s.name)
      },
      grid: this.theme.grid,
      ...axisConfig,
      series: series.map(s => ({
        name: s.name,
        type: 'bar',
        data: s.data,
        stack: stack ? 'total' : undefined,
        barMaxWidth: 40,
        itemStyle: {
          borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0],
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowBlur: 4,
          shadowOffsetY: 2
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetY: 4
          }
        }
      }))
    };
  }

  /**
   * Create pie/donut chart configuration
   */
  createPieChart(data, config = {}) {
    const {
      title = '',
      subtitle = '',
      donut = true,
      showLabels = true,
      legendPosition = 'right'
    } = config;

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'left',
        textStyle: this.theme.title.textStyle,
        subtextStyle: this.theme.title.subtextStyle
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        ...this.theme.tooltip
      },
      legend: {
        orient: legendPosition === 'right' || legendPosition === 'left' ? 'vertical' : 'horizontal',
        [legendPosition]: legendPosition === 'right' || legendPosition === 'left' ? '5%' : 'center',
        top: legendPosition === 'bottom' ? 'bottom' : legendPosition === 'top' ? 'top' : 'middle',
        textStyle: this.theme.legend.textStyle
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: donut ? ['45%', '70%'] : '70%',
          center: ['50%', '50%'],
          data: data,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 3
          },
          label: {
            show: showLabels,
            fontSize: 13,
            fontWeight: 500,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 600
            }
          }
        }
      ]
    };
  }

  /**
   * Create gauge chart configuration
   */
  createGaugeChart(data, config = {}) {
    const {
      title = '',
      subtitle = '',
      max = 100,
      value = 0,
      unit = '%'
    } = config;

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'center',
        top: '75%',
        textStyle: this.theme.title.textStyle,
        subtextStyle: this.theme.title.subtextStyle
      },
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          center: ['50%', '60%'],
          radius: '90%',
          min: 0,
          max: max,
          splitNumber: 5,
          axisLine: {
            lineStyle: {
              width: 20,
              color: [
                [0.3, '#ef4444'],
                [0.7, '#f59e0b'],
                [1, '#10b981']
              ]
            }
          },
          pointer: {
            icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
            length: '75%',
            width: 12,
            offsetCenter: [0, '5%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 3
            }
          },
          axisLabel: {
            color: '#6b7280',
            fontSize: 12,
            distance: -50,
            formatter: function (value) {
              return value;
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 16,
            color: '#111827',
            fontWeight: 600
          },
          detail: {
            fontSize: 36,
            fontWeight: 700,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: function (value) {
              return value + unit;
            },
            color: 'auto'
          },
          data: [
            {
              value: value,
              name: ''
            }
          ]
        }
      ]
    };
  }

  /**
   * Create heatmap chart configuration
   */
  createHeatmapChart(data, config = {}) {
    const {
      title = '',
      subtitle = '',
      xAxisData = [],
      yAxisData = [],
      visualMin = 0,
      visualMax = 100
    } = config;

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'left',
        textStyle: this.theme.title.textStyle,
        subtextStyle: this.theme.title.subtextStyle
      },
      tooltip: {
        position: 'top',
        ...this.theme.tooltip
      },
      grid: {
        height: '70%',
        top: '15%',
        left: '3%',
        right: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxisData,
        splitArea: {
          show: true
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        splitArea: {
          show: true
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      visualMap: {
        min: visualMin,
        max: visualMax,
        calculable: true,
        orient: 'vertical',
        right: '0%',
        top: '15%',
        inRange: {
          color: ['#dcfce7', '#86efac', '#22c55e', '#15803d']
        },
        textStyle: {
          color: '#6b7280',
          fontSize: 12
        }
      },
      series: [
        {
          name: title,
          type: 'heatmap',
          data: data,
          label: {
            show: true,
            fontSize: 11,
            fontWeight: 500
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }
      ]
    };
  }

  /**
   * Create radar chart configuration
   */
  createRadarChart(data, config = {}) {
    const {
      title = '',
      subtitle = '',
      indicator = [],
      series = []
    } = config;

    return {
      title: {
        text: title,
        subtext: subtitle,
        left: 'left',
        textStyle: this.theme.title.textStyle,
        subtextStyle: this.theme.title.subtextStyle
      },
      tooltip: {
        ...this.theme.tooltip
      },
      legend: {
        ...this.theme.legend,
        data: series.map(s => s.name)
      },
      radar: {
        indicator: indicator,
        shape: 'polygon',
        splitNumber: 4,
        name: {
          textStyle: {
            color: '#6b7280',
            fontSize: 12,
            fontWeight: 500
          }
        },
        splitLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.1)', 'rgba(249, 250, 251, 0.5)']
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e5e7eb'
          }
        }
      },
      series: [
        {
          type: 'radar',
          data: series.map(s => ({
            value: s.data,
            name: s.name,
            lineStyle: {
              width: 3
            },
            areaStyle: {
              opacity: 0.2
            },
            emphasis: {
              lineStyle: {
                width: 4
              },
              areaStyle: {
                opacity: 0.4
              }
            }
          }))
        }
      ]
    };
  }

  /**
   * Resize all chart instances
   */
  resizeAll() {
    Object.values(this.instances).forEach(chart => {
      if (chart && !chart.isDisposed()) {
        chart.resize();
      }
    });
  }

  /**
   * Dispose all chart instances
   */
  disposeAll() {
    Object.values(this.instances).forEach(chart => {
      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
    });
    this.instances = {};
  }

  /**
   * Get chart instance by ID
   */
  getInstance(containerId) {
    return this.instances[containerId];
  }
}

// Create singleton instance
window.echartsEnhanced = new EChartsEnhanced();

// Auto-resize on window resize
window.addEventListener('resize', () => {
  window.echartsEnhanced?.resizeAll();
});
