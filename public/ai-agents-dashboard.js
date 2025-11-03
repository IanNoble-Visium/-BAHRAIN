// AI Agents Dashboard Logic for Bahrain Smart City TruContext Platform
// Powered by Visium Technologies

(function() {
  'use strict';

  // Dashboard state
  window.AIAgentsDashboard = {
    agents: [],
    activities: [],
    kpis: {},
    selectedAgent: null,
    
    // Search and filters
    searchQuery: '',
    statusFilter: 'all',
    typeFilter: 'all',
    sectorFilter: 'all',
    perfFilter: 'all',
    
    // Update intervals
    activityInterval: null,
    metricsInterval: null,
    
    // Initialize dashboard
    init: function() {
      console.log('Initializing AI Agents Dashboard...');
      
      // Generate initial data
      this.agents = window.AIAgentsData.generateAgents(40);
      this.activities = window.AIAgentsData.generateActivityStream(50);
      this.kpis = window.AIAgentsData.generateAgentKPIs(this.agents);
      
      // Render dashboard
      this.render();
      
      // Start real-time updates
      this.startUpdates();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      console.log('AI Agents Dashboard initialized with', this.agents.length, 'agents');
    },
    
    // Render the entire dashboard
    render: function() {
      const container = document.getElementById('ai-agents-dashboard');
      if (!container) {
        console.error('AI Agents Dashboard container not found');
        return;
      }
      
      container.innerHTML = `
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
                Real-time monitoring of ${this.agents.length} AI agents for Bahrain Smart City
              </p>
            </div>
          </div>
          
          <!-- KPI Cards -->
          <div id="ai-agents-kpis" class="kpi-cards-grid"></div>
          
          <!-- Main Content -->
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
                  <div class="performance-badges">
                    <span class="perf-badge high">🟢 ${this.agents.filter(a => window.AIAgentsData.getPerformanceLevel(a) === 'high').length} High</span>
                    <span class="perf-badge needs-attention">🔴 ${this.agents.filter(a => window.AIAgentsData.getPerformanceLevel(a) === 'needs-attention').length} Needs Attention</span>
                  </div>
                </div>
                
                <!-- Search and Filters -->
                <div id="ai-agents-filters" class="filters-section"></div>
                
                <!-- Agent Grid -->
                <div id="ai-agents-grid" class="agents-grid"></div>
              </div>
              
              <!-- Performance Metrics -->
              <div class="panel-card mt-6">
                <h2 class="panel-title">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  Performance Metrics
                </h2>
                <div id="ai-agents-metrics" class="metrics-bars"></div>
              </div>
            </div>
            
            <!-- Right Column: Activity Feed & Collaboration -->
            <div class="activity-panel">
              <div id="ai-agents-activity" class="panel-card"></div>
              
              <!-- Agent Collaboration -->
              <div class="panel-card mt-6">
                <h2 class="panel-title">Agent Collaboration</h2>
                <div class="collaboration-section">
                  <button class="collab-btn">Delegate: Infrastructure → Traffic</button>
                  <button class="collab-btn">Task Transfer: Cybersecurity → Response</button>
                  <button class="collab-btn">Joint Investigation: Multi-Agent Analysis</button>
                  <div class="collab-divider"></div>
                  <p class="collab-subtitle">Active Collaborations:</p>
                  <div class="collab-list">
                    <p>• Agent-7 ↔ Agent-12 (pattern correlation)</p>
                    <p>• Agent-3 → Agent-15 (data sharing)</p>
                    <p>• Agent-9 → Agent-22 (trend analysis)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Agent Detail Modal -->
        <div id="agent-detail-modal" class="modal hidden"></div>
      `;
      
      // Render child components
      this.renderKPIs();
      this.renderFilters();
      this.renderAgentGrid();
      this.renderMetrics();
      this.renderActivityFeed();
    },
    
    // Render KPI cards
    renderKPIs: function() {
      const container = document.getElementById('ai-agents-kpis');
      if (!container) return;
      
      const kpis = [
        {
          title: 'Active Agents',
          value: this.kpis.activeAgents || 0,
          subtitle: `${this.kpis.idleAgents || 0} idle agents`,
          trend: '+12%',
          icon: '🤖',
          color: 'green'
        },
        {
          title: 'Alerts Detected (24h)',
          value: this.kpis.threatsDetected24h || 0,
          subtitle: 'Critical incidents',
          trend: '+8%',
          icon: '⚠️',
          color: 'red'
        },
        {
          title: 'Avg Response Time',
          value: `${this.kpis.avgResponseTime || 0}ms`,
          subtitle: '2.3s average',
          trend: '-15%',
          icon: '⏱️',
          color: 'blue'
        },
        {
          title: 'Agent Efficiency',
          value: `${this.kpis.avgEfficiency || 0}%`,
          subtitle: 'Overall performance',
          trend: '+5%',
          icon: '⚡',
          color: 'purple'
        }
      ];
      
      container.innerHTML = kpis.map(kpi => `
        <div class="kpi-card kpi-${kpi.color}">
          <div class="kpi-icon">${kpi.icon}</div>
          <div class="kpi-content">
            <div class="kpi-title">${kpi.title}</div>
            <div class="kpi-value">${kpi.value}</div>
            <div class="kpi-footer">
              <span class="kpi-subtitle">${kpi.subtitle}</span>
              <span class="kpi-trend ${kpi.trend.startsWith('+') ? 'positive' : 'negative'}">${kpi.trend}</span>
            </div>
          </div>
        </div>
      `).join('');
    },
    
    // Render search and filters
    renderFilters: function() {
      const container = document.getElementById('ai-agents-filters');
      if (!container) return;
      
      const activeFilterCount = [
        this.searchQuery && 'search',
        this.statusFilter !== 'all' && 'status',
        this.typeFilter !== 'all' && 'type',
        this.sectorFilter !== 'all' && 'sector',
        this.perfFilter !== 'all' && 'perf'
      ].filter(Boolean).length;
      
      const types = [...new Set(this.agents.map(a => a.type))].sort();
      const sectors = [...new Set(this.agents.map(a => a.sector))].sort();
      
      container.innerHTML = `
        <div class="filters-grid">
          <div class="filter-search-wrapper">
            <input 
              type="text" 
              id="agent-search" 
              class="filter-input" 
              placeholder="Search agents (Ctrl+K)..."
              value="${this.searchQuery}"
            />
            ${activeFilterCount > 0 ? `
              <div class="filter-badge">
                ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active
              </div>
            ` : ''}
          </div>
          
          <select id="status-filter" class="filter-select">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="idle">Idle</option>
            <option value="investigating">Investigating</option>
            <option value="responding">Responding</option>
          </select>
          
          <select id="type-filter" class="filter-select">
            <option value="all">All Types</option>
            ${types.map(t => `<option value="${t}">${t.replace(/-/g, ' ')}</option>`).join('')}
          </select>
          
          <select id="sector-filter" class="filter-select">
            <option value="all">All Sectors</option>
            ${sectors.map(s => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
          </select>
          
          <select id="perf-filter" class="filter-select">
            <option value="all">All Performance</option>
            <option value="high">High</option>
            <option value="average">Average</option>
            <option value="needs-attention">Needs Attention</option>
          </select>
        </div>
        
        <div class="filter-results">
          Showing <strong>${this.getFilteredAgents().length}</strong> of ${this.agents.length} agents
          ${activeFilterCount > 0 ? `<button id="clear-filters" class="clear-filters-btn">Clear Filters</button>` : ''}
        </div>
      `;
      
      // Setup event listeners
      this.setupFilterListeners();
    },
    
    // Get filtered agents based on current filters
    getFilteredAgents: function() {
      return this.agents.filter(agent => {
        const matchesSearch = !this.searchQuery || 
          [agent.id, agent.name, agent.nickname, agent.role, agent.type, agent.modelName, agent.sector]
            .some(v => String(v).toLowerCase().includes(this.searchQuery.toLowerCase()));
        
        const matchesStatus = this.statusFilter === 'all' || agent.status === this.statusFilter;
        const matchesType = this.typeFilter === 'all' || agent.type === this.typeFilter;
        const matchesSector = this.sectorFilter === 'all' || agent.sector === this.sectorFilter;
        const matchesPerf = this.perfFilter === 'all' || 
          window.AIAgentsData.getPerformanceLevel(agent) === this.perfFilter;
        
        return matchesSearch && matchesStatus && matchesType && matchesSector && matchesPerf;
      });
    },
    
    // Render agent grid
    renderAgentGrid: function() {
      const container = document.getElementById('ai-agents-grid');
      if (!container) return;
      
      const filteredAgents = this.getFilteredAgents();
      
      if (filteredAgents.length === 0) {
        container.innerHTML = `
          <div class="no-agents">
            <p>No agents match your filters</p>
            <button id="clear-filters-empty" class="btn-secondary">Clear Filters</button>
          </div>
        `;
        document.getElementById('clear-filters-empty')?.addEventListener('click', () => this.clearFilters());
        return;
      }
      
      container.innerHTML = filteredAgents.map(agent => {
        const perfLevel = window.AIAgentsData.getPerformanceLevel(agent);
        const statusEmoji = {
          'active': '🟢',
          'idle': '⚪',
          'investigating': '🟡',
          'responding': '🔴'
        }[agent.status];
        
        const perfEmoji = {
          'high': '🟢',
          'average': '🟡',
          'needs-attention': '🔴'
        }[perfLevel];
        
        return `
          <div class="agent-card" data-agent-id="${agent.id}">
            <div class="agent-card-header">
              <div class="agent-id">${agent.name}</div>
              <span class="agent-status status-${agent.status}">${statusEmoji} ${agent.status}</span>
            </div>
            <div class="agent-nickname">${agent.nickname}</div>
            <div class="agent-role">${agent.role}</div>
            <div class="agent-meta">
              <span class="agent-sector sector-${agent.sector}">${agent.sector}</span>
              <span class="agent-location">📍 ${agent.location}</span>
            </div>
            <div class="agent-task">${agent.currentTask}</div>
            <div class="agent-model">${agent.modelName}</div>
            <div class="agent-performance">
              <span class="perf-indicator perf-${perfLevel}">${perfEmoji} ${perfLevel}</span>
              <span class="efficiency-value">${agent.efficiency}% efficiency</span>
            </div>
            <button class="agent-view-btn" data-agent-id="${agent.id}">View Details</button>
          </div>
        `;
      }).join('');
      
      // Setup click listeners
      container.querySelectorAll('.agent-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const agentId = e.target.getAttribute('data-agent-id');
          this.showAgentDetail(agentId);
        });
      });
    },
    
    // Render performance metrics
    renderMetrics: function() {
      const container = document.getElementById('ai-agents-metrics');
      if (!container) return;
      
      const metrics = [
        { label: 'Detection Speed', value: '2.3s avg', percent: 85, color: 'green' },
        { label: 'False Positive Rate', value: '3.2%', percent: 12, color: 'blue' },
        { label: 'System Uptime', value: '99.8%', percent: 99.8, color: 'purple' },
        { label: 'Agent Utilization', value: '87%', percent: 87, color: 'orange' }
      ];
      
      container.innerHTML = metrics.map(metric => `
        <div class="metric-bar">
          <div class="metric-bar-header">
            <span class="metric-label">${metric.label}</span>
            <span class="metric-value">${metric.value}</span>
          </div>
          <div class="metric-bar-track">
            <div class="metric-bar-fill metric-${metric.color}" style="width: ${metric.percent}%"></div>
          </div>
        </div>
      `).join('');
    },
    
    // Render activity feed
    renderActivityFeed: function() {
      const container = document.getElementById('ai-agents-activity');
      if (!container) return;
      
      const recentActivities = this.activities.slice(0, 20);
      
      container.innerHTML = `
        <h2 class="panel-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          Live Activity Feed
        </h2>
        <div class="activity-feed">
          ${recentActivities.map(activity => {
            const timeAgo = this.getTimeAgo(activity.timestamp);
            const severityColor = {
              'critical': 'red',
              'high': 'orange',
              'medium': 'yellow',
              'low': 'blue'
            }[activity.severity];
            
            return `
              <div class="activity-item">
                <div class="activity-header">
                  <span class="activity-severity severity-${severityColor}">${activity.severity.toUpperCase()}</span>
                  <span class="activity-time">${timeAgo}</span>
                </div>
                <div class="activity-content">
                  <div class="activity-agent">${activity.agentName}</div>
                  <div class="activity-action">${activity.action}</div>
                  <div class="activity-meta">
                    <span class="activity-sector">${activity.sector}</span>
                    <span class="activity-location">📍 ${activity.location}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },
    
    // Show agent detail modal
    showAgentDetail: function(agentId) {
      const agent = this.agents.find(a => a.id === agentId);
      if (!agent) return;
      
      this.selectedAgent = agent;
      const modal = document.getElementById('agent-detail-modal');
      if (!modal) return;
      
      const perfLevel = window.AIAgentsData.getPerformanceLevel(agent);
      
      modal.innerHTML = `
        <div class="modal-overlay" id="modal-overlay"></div>
        <div class="modal-content agent-detail">
          <div class="modal-header">
            <h2>${agent.nickname}</h2>
            <button class="modal-close" id="close-agent-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="agent-detail-grid">
              <div class="detail-section">
                <h3>Overview</h3>
                <div class="detail-row"><strong>ID:</strong> ${agent.id}</div>
                <div class="detail-row"><strong>Name:</strong> ${agent.name}</div>
                <div class="detail-row"><strong>Role:</strong> ${agent.role}</div>
                <div class="detail-row"><strong>Sector:</strong> ${agent.sector}</div>
                <div class="detail-row"><strong>Location:</strong> ${agent.location}</div>
                <div class="detail-row"><strong>Status:</strong> <span class="status-${agent.status}">${agent.status}</span></div>
                <div class="detail-row"><strong>Type:</strong> ${agent.type}</div>
              </div>
              
              <div class="detail-section">
                <h3>Performance</h3>
                <div class="detail-row"><strong>Level:</strong> <span class="perf-${perfLevel}">${perfLevel}</span></div>
                <div class="detail-row"><strong>Efficiency:</strong> ${agent.efficiency}%</div>
                <div class="detail-row"><strong>Accuracy:</strong> ${agent.accuracy}%</div>
                <div class="detail-row"><strong>Response Time:</strong> ${agent.responseTime}ms</div>
                <div class="detail-row"><strong>False Positives:</strong> ${agent.falsePositiveRate}%</div>
                <div class="detail-row"><strong>Findings:</strong> ${agent.findings}</div>
                <div class="detail-row"><strong>Alerts Raised:</strong> ${agent.alertsRaised}</div>
              </div>
              
              <div class="detail-section">
                <h3>Configuration</h3>
                <div class="detail-row"><strong>Model:</strong> ${agent.modelName}</div>
                <div class="detail-row"><strong>Provider:</strong> ${agent.modelProvider}</div>
                <div class="detail-row"><strong>Priority:</strong> ${agent.priority}</div>
                <div class="detail-row"><strong>Token Usage:</strong> ${agent.tokenUsage.toLocaleString()} / ${agent.maxTokens.toLocaleString()}</div>
                <div class="detail-row"><strong>Cost:</strong> $${agent.tokenCost}</div>
                <div class="detail-row"><strong>Created:</strong> ${agent.createdAt.toLocaleDateString()}</div>
                <div class="detail-row"><strong>Last Active:</strong> ${this.getTimeAgo(agent.lastActive)}</div>
              </div>
              
              <div class="detail-section full-width">
                <h3>Current Task</h3>
                <p>${agent.currentTask}</p>
                <h3>Purpose</h3>
                <p>${agent.purpose}</p>
                <h3>Integrations</h3>
                <div class="integration-tags">
                  ${agent.integrations.map(i => `<span class="integration-tag">${i}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      modal.classList.remove('hidden');
      
      // Setup close listeners
      document.getElementById('close-agent-modal').addEventListener('click', () => this.closeAgentDetail());
      document.getElementById('modal-overlay').addEventListener('click', () => this.closeAgentDetail());
    },
    
    closeAgentDetail: function() {
      const modal = document.getElementById('agent-detail-modal');
      if (modal) {
        modal.classList.add('hidden');
        this.selectedAgent = null;
      }
    },
    
    // Setup filter event listeners
    setupFilterListeners: function() {
      const searchInput = document.getElementById('agent-search');
      const statusFilter = document.getElementById('status-filter');
      const typeFilter = document.getElementById('type-filter');
      const sectorFilter = document.getElementById('sector-filter');
      const perfFilter = document.getElementById('perf-filter');
      const clearBtn = document.getElementById('clear-filters');
      
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          this.updateFilters();
        });
      }
      
      if (statusFilter) {
        statusFilter.value = this.statusFilter;
        statusFilter.addEventListener('change', (e) => {
          this.statusFilter = e.target.value;
          this.updateFilters();
        });
      }
      
      if (typeFilter) {
        typeFilter.value = this.typeFilter;
        typeFilter.addEventListener('change', (e) => {
          this.typeFilter = e.target.value;
          this.updateFilters();
        });
      }
      
      if (sectorFilter) {
        sectorFilter.value = this.sectorFilter;
        sectorFilter.addEventListener('change', (e) => {
          this.sectorFilter = e.target.value;
          this.updateFilters();
        });
      }
      
      if (perfFilter) {
        perfFilter.value = this.perfFilter;
        perfFilter.addEventListener('change', (e) => {
          this.perfFilter = e.target.value;
          this.updateFilters();
        });
      }
      
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearFilters());
      }
    },
    
    // Update filters and re-render
    updateFilters: function() {
      this.renderFilters();
      this.renderAgentGrid();
    },
    
    // Clear all filters
    clearFilters: function() {
      this.searchQuery = '';
      this.statusFilter = 'all';
      this.typeFilter = 'all';
      this.sectorFilter = 'all';
      this.perfFilter = 'all';
      this.updateFilters();
    },
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts: function() {
      document.addEventListener('keydown', (e) => {
        // Ctrl+K or Cmd+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          const searchInput = document.getElementById('agent-search');
          if (searchInput) searchInput.focus();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
          this.closeAgentDetail();
        }
      });
    },
    
    // Start real-time updates
    startUpdates: function() {
      // Activity feed updates every 3 seconds
      this.activityInterval = setInterval(() => {
        const newActivity = window.AIAgentsData.generateActivity();
        this.activities = [newActivity, ...this.activities.slice(0, 99)];
        this.renderActivityFeed();
        
        // Random agent metric updates
        this.agents = this.agents.map(agent => {
          if (Math.random() > 0.8) {
            return {
              ...agent,
              findings: agent.findings + Math.floor(Math.random() * 3),
              alertsRaised: agent.alertsRaised + (Math.random() > 0.9 ? 1 : 0),
              lastActive: new Date()
            };
          }
          return agent;
        });
        
        // Update KPIs
        this.kpis = window.AIAgentsData.generateAgentKPIs(this.agents);
        this.renderKPIs();
      }, 3000);
    },
    
    // Stop updates
    stopUpdates: function() {
      if (this.activityInterval) {
        clearInterval(this.activityInterval);
        this.activityInterval = null;
      }
      if (this.metricsInterval) {
        clearInterval(this.metricsInterval);
        this.metricsInterval = null;
      }
    },
    
    // Destroy dashboard
    destroy: function() {
      this.stopUpdates();
      const container = document.getElementById('ai-agents-dashboard');
      if (container) {
        container.innerHTML = '';
      }
    },
    
    // Helper: Get time ago string
    getTimeAgo: function(date) {
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };
})();
