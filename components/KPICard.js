/**
 * KPI Card Component (Vue 3)
 * Displays key performance indicators with Bahrain theme
 */

const KPICard = {
  template: `
    <div class="kpi-card" :class="'kpi-' + color">
      <div class="kpi-icon">{{ icon }}</div>
      <div class="kpi-content">
        <div class="kpi-title">{{ title }}</div>
        <div class="kpi-value">{{ value }}</div>
        <div class="kpi-footer">
          <span class="kpi-subtitle">{{ subtitle }}</span>
          <span class="kpi-trend" :class="trendClass">{{ trend }}</span>
        </div>
      </div>
    </div>
  `,

  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    trend: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: '📊'
    },
    color: {
      type: String,
      default: 'green',
      validator: (value) => ['green', 'red', 'blue', 'purple'].includes(value)
    }
  },

  computed: {
    trendClass() {
      if (!this.trend) return '';
      return this.trend.startsWith('+') ? 'positive' : 'negative';
    }
  }
};

