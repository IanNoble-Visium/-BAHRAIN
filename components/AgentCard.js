/**
 * Agent Card Component (Vue 3)
 * Displays individual agent information with status and performance metrics
 */

const AgentCard = {
  template: `
    <div class="agent-card" @click="$emit('click')">
      <div class="agent-card-header">
        <span class="agent-id">{{ agent.id }}</span>
        <span class="agent-status" :class="'status-' + agent.status">{{ agent.status }}</span>
      </div>

      <div class="agent-nickname">{{ agent.nickname }}</div>
      <div class="agent-role">{{ agent.role }}</div>

      <div class="agent-meta">
        <span class="agent-sector">{{ agent.sector }}</span>
        <span class="agent-location">📍 {{ agent.location }}</span>
      </div>

      <div class="agent-task">{{ agent.currentTask }}</div>

      <div class="agent-model">
        <strong>Model:</strong> {{ agent.modelName }}
      </div>

      <div class="agent-performance">
        <span class="perf-indicator" :class="'perf-' + performanceLevel">
          {{ performanceLabel }}
        </span>
        <span class="efficiency-value">{{ agent.efficiency }}% eff.</span>
      </div>

      <button class="agent-view-btn">View Details</button>
    </div>
  `,

  props: {
    agent: {
      type: Object,
      required: true
    }
  },

  computed: {
    performanceLevel() {
      if (this.agent.efficiency > 80 && this.agent.falsePositiveRate < 5) {
        return 'high';
      } else if (this.agent.efficiency > 70) {
        return 'average';
      } else {
        return 'needs-attention';
      }
    },

    performanceLabel() {
      const level = this.performanceLevel;
      if (level === 'high') return '🟢 High';
      if (level === 'average') return '🟡 Average';
      return '🔴 Needs Attention';
    }
  }
};

