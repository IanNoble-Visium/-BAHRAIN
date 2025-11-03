/**
 * AI Agent Dashboard Component (Vue 3)
 * Bahrain Smart City - Real-time Agent Monitoring
 */

const AIAgentDashboard = {
  template: `
    <div class="ai-agents-container">
      <!-- Header -->
      <div class="ai-agents-header">
        <div class="header-left">
          <h1 class="dashboard-title">
            <svg class="title-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            AI Agents Dashboard
          </h1>
          <p class="dashboard-subtitle">
            Real-time monitoring of {{ agents.length }} AI agents for Bahrain Smart City
          </p>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-cards-grid">
        <kpi-card 
          v-for="kpi in kpiCards" 
          :key="kpi.id"
          :title="kpi.title"
          :value="kpi.value"
          :subtitle="kpi.subtitle"
          :trend="kpi.trend"
          :icon="kpi.icon"
          :color="kpi.color"
        />
      </div>

      <!-- Main Grid -->
      <div class="ai-agents-main-grid">
        <!-- Left Column: Agent Grid -->
        <div class="agents-panel">
          <div class="panel-card">
            <div class="panel-header">
              <h2 class="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Agent Status Panel
              </h2>
            </div>

            <!-- Filters -->
            <div class="filters-section">
              <div class="filters-grid">
                <div class="filter-search-wrapper">
                  <input 
                    v-model="searchQuery"
                    type="text" 
                    class="filter-input" 
                    placeholder="Search agents..."
                  >
                </div>
                <select v-model="filterStatus" class="filter-select">
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="investigating">Investigating</option>
                  <option value="responding">Responding</option>
                </select>
                <select v-model="filterSector" class="filter-select">
                  <option value="">All Sectors</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="environment">Environment</option>
                  <option value="health">Health</option>
                </select>
              </div>
              <div class="filter-results">
                <strong>{{ filteredAgents.length }}</strong> agents found
                <button v-if="hasFilters" @click="clearFilters" class="clear-filters-btn">Clear Filters</button>
              </div>
            </div>

            <!-- Agent Grid -->
            <div class="agents-grid">
              <agent-card 
                v-for="agent in filteredAgents" 
                :key="agent.id"
                :agent="agent"
                @click="selectAgent(agent)"
              />
              <div v-if="filteredAgents.length === 0" class="no-agents">
                <p>No agents found matching your filters</p>
                <button @click="clearFilters" class="btn-secondary">Reset Filters</button>
              </div>
            </div>
          </div>

          <!-- Performance Metrics -->
          <div class="panel-card">
            <h2 class="panel-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 17"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              Performance Metrics
            </h2>
            <div class="metrics-bars">
              <div class="metric-bar">
                <div class="metric-bar-header">
                  <span class="metric-label">Average Efficiency</span>
                  <span class="metric-value">{{ avgEfficiency }}%</span>
                </div>
                <div class="metric-bar-track">
                  <div class="metric-bar-fill metric-green" :style="{ width: avgEfficiency + '%' }"></div>
                </div>
              </div>
              <div class="metric-bar">
                <div class="metric-bar-header">
                  <span class="metric-label">Average Accuracy</span>
                  <span class="metric-value">{{ avgAccuracy }}%</span>
                </div>
                <div class="metric-bar-track">
                  <div class="metric-bar-fill metric-blue" :style="{ width: avgAccuracy + '%' }"></div>
                </div>
              </div>
              <div class="metric-bar">
                <div class="metric-bar-header">
                  <span class="metric-label">Active Agents</span>
                  <span class="metric-value">{{ activeAgentCount }}/{{ agents.length }}</span>
                </div>
                <div class="metric-bar-track">
                  <div class="metric-bar-fill metric-purple" :style="{ width: (activeAgentCount / agents.length * 100) + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Activity Feed -->
        <div class="activity-panel">
          <div class="panel-card">
            <h2 class="panel-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Live Activity Feed
            </h2>
            <activity-feed :activities="recentActivities" />
          </div>
        </div>
      </div>

      <!-- Agent Detail Modal -->
      <agent-detail-modal 
        v-if="selectedAgent"
        :agent="selectedAgent"
        @close="selectedAgent = null"
      />
    </div>
  `,

  components: {
    'kpi-card': KPICard,
    'agent-card': AgentCard,
    'activity-feed': ActivityFeed,
    'agent-detail-modal': AgentDetailModal
  },

  data() {
    return {
      agents: [],
      activities: [],
      kpis: {},
      searchQuery: '',
      filterStatus: '',
      filterSector: '',
      selectedAgent: null,
      updateInterval: null
    };
  },

  computed: {
    filteredAgents() {
      return this.agents.filter(agent => {
        const matchesSearch = agent.nickname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            agent.role.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesStatus = !this.filterStatus || agent.status === this.filterStatus;
        const matchesSector = !this.filterSector || agent.sector === this.filterSector;
        return matchesSearch && matchesStatus && matchesSector;
      });
    },

    hasFilters() {
      return this.searchQuery || this.filterStatus || this.filterSector;
    },

    kpiCards() {
      return [
        {
          id: 'active-agents',
          title: 'Active Agents',
          value: this.kpis.activeAgents || 0,
          subtitle: `${this.kpis.idleAgents || 0} idle agents`,
          trend: '+12%',
          icon: '🤖',
          color: 'green'
        },
        {
          id: 'threats',
          title: 'Threats Detected (24h)',
          value: this.kpis.threatsDetected24h || 0,
          subtitle: 'Critical incidents',
          trend: '+8%',
          icon: '⚠️',
          color: 'red'
        },
        {
          id: 'response-time',
          title: 'Avg Response Time',
          value: `${this.kpis.avgResponseTime || 0}ms`,
          subtitle: '2.3s average',
          trend: '-15%',
          icon: '⏱️',
          color: 'blue'
        },
        {
          id: 'efficiency',
          title: 'Agent Efficiency',
          value: `${this.kpis.avgEfficiency || 0}%`,
          subtitle: 'Overall performance',
          trend: '+5%',
          icon: '⚡',
          color: 'purple'
        }
      ];
    },

    recentActivities() {
      return this.activities.slice(0, 10);
    },

    avgEfficiency() {
      if (this.agents.length === 0) return 0;
      const sum = this.agents.reduce((acc, agent) => acc + agent.efficiency, 0);
      return Math.round(sum / this.agents.length);
    },

    avgAccuracy() {
      if (this.agents.length === 0) return 0;
      const sum = this.agents.reduce((acc, agent) => acc + agent.accuracy, 0);
      return Math.round(sum / this.agents.length);
    },

    activeAgentCount() {
      return this.agents.filter(a => a.status === 'active').length;
    }
  },

  methods: {
    initializeDashboard() {
      if (window.AIAgentsData) {
        this.agents = window.AIAgentsData.generateAgents(40);
        this.activities = window.AIAgentsData.generateActivityStream(50);
        this.kpis = window.AIAgentsData.generateAgentKPIs(this.agents);
      }
    },

    updateData() {
      if (window.AIAgentsData) {
        // Update agent metrics
        this.agents.forEach(agent => {
          agent.efficiency = Math.max(60, Math.min(99, agent.efficiency + (Math.random() - 0.5) * 5));
          agent.accuracy = Math.max(75, Math.min(99, agent.accuracy + (Math.random() - 0.5) * 3));
          agent.responseTime = Math.max(500, Math.min(5000, agent.responseTime + (Math.random() - 0.5) * 200));
        });

        // Add new activity
        const newActivity = window.AIAgentsData.generateActivity();
        this.activities.unshift(newActivity);
        if (this.activities.length > 50) {
          this.activities.pop();
        }

        // Update KPIs
        this.kpis = window.AIAgentsData.generateAgentKPIs(this.agents);
      }
    },

    selectAgent(agent) {
      this.selectedAgent = agent;
    },

    clearFilters() {
      this.searchQuery = '';
      this.filterStatus = '';
      this.filterSector = '';
    }
  },

  mounted() {
    this.initializeDashboard();
    // Update data every 3 seconds
    this.updateInterval = setInterval(() => {
      this.updateData();
    }, 3000);
  },

  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
};

