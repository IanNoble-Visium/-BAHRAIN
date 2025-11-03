/**
 * Agent Detail Modal Component (Vue 3)
 * Displays comprehensive agent information
 */

const AgentDetailModal = {
  template: `
    <div class="modal" @click.self="$emit('close')">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ agent.nickname }} - Agent Details</h2>
          <button class="modal-close" @click="$emit('close')">×</button>
        </div>

        <div class="modal-body">
          <div class="agent-detail-grid">
            <!-- Overview Section -->
            <div class="detail-section">
              <h3>Overview</h3>
              <div class="detail-row">
                <strong>Agent ID:</strong>
                <span>{{ agent.id }}</span>
              </div>
              <div class="detail-row">
                <strong>Status:</strong>
                <span class="agent-status" :class="'status-' + agent.status">{{ agent.status }}</span>
              </div>
              <div class="detail-row">
                <strong>Role:</strong>
                <span>{{ agent.role }}</span>
              </div>
              <div class="detail-row">
                <strong>Sector:</strong>
                <span>{{ agent.sector }}</span>
              </div>
              <div class="detail-row">
                <strong>Location:</strong>
                <span>{{ agent.location }}</span>
              </div>
              <div class="detail-row">
                <strong>Created:</strong>
                <span>{{ formatDate(agent.createdAt) }}</span>
              </div>
            </div>

            <!-- Performance Section -->
            <div class="detail-section">
              <h3>Performance Metrics</h3>
              <div class="detail-row">
                <strong>Efficiency:</strong>
                <span>{{ agent.efficiency }}%</span>
              </div>
              <div class="detail-row">
                <strong>Accuracy:</strong>
                <span>{{ agent.accuracy }}%</span>
              </div>
              <div class="detail-row">
                <strong>Response Time:</strong>
                <span>{{ agent.responseTime }}ms</span>
              </div>
              <div class="detail-row">
                <strong>False Positive Rate:</strong>
                <span>{{ agent.falsePositiveRate }}%</span>
              </div>
              <div class="detail-row">
                <strong>Findings:</strong>
                <span>{{ agent.findings }}</span>
              </div>
              <div class="detail-row">
                <strong>Alerts Raised:</strong>
                <span>{{ agent.alertsRaised }}</span>
              </div>
            </div>

            <!-- Model & Configuration Section -->
            <div class="detail-section">
              <h3>Model & Configuration</h3>
              <div class="detail-row">
                <strong>Model:</strong>
                <span>{{ agent.modelName }}</span>
              </div>
              <div class="detail-row">
                <strong>Provider:</strong>
                <span>{{ agent.modelProvider }}</span>
              </div>
              <div class="detail-row">
                <strong>Token Usage:</strong>
                <span>{{ agent.tokenUsage }} / {{ agent.maxTokens }}</span>
              </div>
              <div class="detail-row">
                <strong>Token Cost:</strong>
                <span>$ {{ agent.tokenCost }}</span>
              </div>
            </div>

            <!-- Resource Usage Section -->
            <div class="detail-section">
              <h3>Resource Usage</h3>
              <div class="detail-row">
                <strong>Current Task:</strong>
                <span>{{ agent.currentTask }}</span>
              </div>
              <div class="detail-row">
                <strong>Last Active:</strong>
                <span>{{ formatDate(agent.lastActive) }}</span>
              </div>
              <div class="detail-row">
                <strong>Priority:</strong>
                <span>{{ agent.priority }}</span>
              </div>
              <div class="detail-row">
                <strong>Type:</strong>
                <span>{{ agent.type }}</span>
              </div>
            </div>

            <!-- Integrations Section -->
            <div class="detail-section full-width">
              <h3>Integrations</h3>
              <div class="integration-tags">
                <span v-for="integration in agent.integrations" :key="integration" class="integration-tag">
                  {{ integration }}
                </span>
              </div>
            </div>

            <!-- Prompt Template Section -->
            <div class="detail-section full-width">
              <h3>Prompt Template</h3>
              <p>{{ agent.promptTemplate }}</p>
            </div>

            <!-- Collaboration Section -->
            <div class="detail-section full-width">
              <h3>Collaboration</h3>
              <div class="detail-row">
                <strong>Average Rating:</strong>
                <span>{{ agent.avgRating }}/5.0</span>
              </div>
              <div class="detail-row">
                <strong>Collaboration Count:</strong>
                <span>{{ agent.collaborationCount }} agents</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  props: {
    agent: {
      type: Object,
      required: true
    }
  },

  methods: {
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    }
  }
};

