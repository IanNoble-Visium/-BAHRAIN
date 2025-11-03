// Vibe Context Marketplace
// Displays pre-built creations that users can browse and install

(function() {
  'use strict';

  const MARKETPLACE_ITEMS = [
    {
      id: 'threat-detection-agent',
      name: 'Real-time Threat Detection Agent',
      description: 'AI-powered agent that continuously monitors network traffic, identifies anomalies, and automatically triggers security responses. Uses machine learning to detect zero-day threats.',
      category: 'Security Automation',
      icon: '🛡️',
      features: [
        'Real-time network monitoring',
        'ML-based anomaly detection',
        'Automated threat response',
        'Integration with alert system'
      ],
      config: {
        monitoringInterval: '30s',
        sensitivity: 'high',
        autoResponse: true
      },
      createdBy: 'TruContext Team',
      preview: 'Shows real-time threat analysis dashboard with live alerts'
    },
    {
      id: 'traffic-flow-optimizer',
      name: 'Traffic Flow Optimizer',
      description: 'Intelligent traffic management system that analyzes real-time traffic patterns, predicts congestion, and suggests optimal routing strategies. Reduces travel time by up to 25%.',
      category: 'Traffic Agent',
      icon: '🚦',
      features: [
        'Real-time traffic analysis',
        'Congestion prediction',
        'Route optimization',
        'Integration with traffic signals'
      ],
      config: {
        updateFrequency: '5min',
        predictionHorizon: '1hour',
        optimizationMode: 'balanced'
      },
      createdBy: 'TruContext Team',
      preview: 'Interactive traffic flow visualization with optimization suggestions'
    },
    {
      id: 'kpi-dashboard-builder',
      name: 'Custom KPI Dashboard Builder',
      description: 'Drag-and-drop dashboard builder that lets you create custom KPI visualizations from any data source. Pre-configured widgets for common metrics.',
      category: 'Custom Visualization',
      icon: '📊',
      features: [
        'Drag-and-drop interface',
        'Multiple chart types',
        'Real-time data binding',
        'Export and sharing'
      ],
      config: {
        widgetTypes: ['kpi', 'chart', 'table', 'map'],
        refreshRate: '30s',
        maxWidgets: 20
      },
      createdBy: 'TruContext Team',
      preview: 'Custom dashboard with multiple KPI cards and visualizations'
    },
    {
      id: 'alert-automation-workflow',
      name: 'Alert Automation Workflow',
      description: 'Configure complex alert workflows with conditional logic, escalations, and integrations. Automatically route alerts to the right teams based on severity and type.',
      category: 'Alert Automation',
      icon: '🚨',
      features: [
        'Conditional alert routing',
        'Multi-channel notifications',
        'Escalation rules',
        'Integration APIs'
      ],
      config: {
        notificationChannels: ['email', 'sms', 'slack', 'webhook'],
        escalationRules: true,
        deduplication: true
      },
      createdBy: 'TruContext Team',
      preview: 'Workflow diagram showing alert routing and escalation paths'
    },
    {
      id: 'predictive-analytics-agent',
      name: 'Predictive Analytics Agent',
      description: 'Advanced AI agent that uses historical data to predict future trends, forecast demand, and identify potential issues before they occur. Perfect for capacity planning.',
      category: 'Predictive Agent',
      icon: '🔮',
      features: [
        'Time-series forecasting',
        'Anomaly prediction',
        'Trend analysis',
        'Automated reporting'
      ],
      config: {
        forecastHorizon: '7days',
        modelType: 'LSTM',
        confidenceThreshold: 0.85
      },
      createdBy: 'TruContext Team',
      preview: 'Forecast charts showing predicted trends with confidence intervals'
    },
    {
      id: 'smart-grid-monitor',
      name: 'Smart Grid Monitor',
      description: 'Comprehensive energy grid monitoring system with real-time consumption tracking, load balancing recommendations, and renewable energy integration insights.',
      category: 'Energy Monitoring',
      icon: '⚡',
      features: [
        'Real-time grid monitoring',
        'Load balancing insights',
        'Renewable energy tracking',
        'Outage prediction'
      ],
      config: {
        monitoringPoints: 'all',
        updateInterval: '1min',
        alertThreshold: '90%'
      },
      createdBy: 'TruContext Team',
      preview: 'Energy grid visualization with consumption metrics and alerts'
    },
    {
      id: 'health-crisis-predictor',
      name: 'Health Crisis Predictor',
      description: 'AI agent that analyzes health indicators, population trends, and environmental factors to predict potential health crises. Enables proactive resource allocation.',
      category: 'Health Agent',
      icon: '🏥',
      features: [
        'Health indicator analysis',
        'Crisis prediction models',
        'Resource allocation recommendations',
        'Integration with health systems'
      ],
      config: {
        indicators: ['er_demand', 'population_density', 'environmental_factors'],
        predictionWindow: '14days',
        alertLevel: 'moderate'
      },
      createdBy: 'TruContext Team',
      preview: 'Health trend charts with prediction indicators and risk zones'
    },
    {
      id: 'infrastructure-health-checker',
      name: 'Infrastructure Health Checker',
      description: 'Automated system that continuously monitors infrastructure assets, tracks maintenance schedules, and predicts failures. Ensures optimal infrastructure uptime.',
      category: 'Infrastructure Automation',
      icon: '🏗️',
      features: [
        'Asset monitoring',
        'Maintenance scheduling',
        'Failure prediction',
        'Performance tracking'
      ],
      config: {
        assetTypes: ['bridges', 'roads', 'buildings', 'utilities'],
        checkInterval: '1hour',
        predictiveMaintenance: true
      },
      createdBy: 'TruContext Team',
      preview: 'Infrastructure map with health status indicators and maintenance alerts'
    }
  ];

  window.VibeContextMarketplace = {
    items: MARKETPLACE_ITEMS,
    selectedItem: null,
    modal: null,

    // Initialize marketplace view
    init: function() {
      this.render();
      this.setupEventListeners();
    },

    // Render marketplace grid
    render: function() {
      const container = document.getElementById('vibeContextView');
      if (!container) return;

      const installedItems = window.VibeContextStorage.getInstalledItems();

      container.innerHTML = `
        <div class="vibe-context-container">
          <div class="vc-header">
            <div class="vc-header-content">
              <h1 class="vc-title">
                <span class="vc-title-icon">✨</span>
                Vibe Context
              </h1>
              <p class="vc-subtitle">Build custom automations, agents, and dashboard functionality with AI assistance</p>
            </div>
          </div>

          <div class="vc-tab-switcher">
            <button class="vc-tab active" data-tab="marketplace">Marketplace</button>
            <button class="vc-tab" data-tab="create">Create New</button>
          </div>

          <div class="vc-marketplace-grid" id="marketplaceGrid">
            ${MARKETPLACE_ITEMS.map(item => this.renderItemCard(item, installedItems.includes(item.id))).join('')}
          </div>
        </div>

        <!-- Marketplace Item Modal -->
        <div id="marketplaceModal" class="vc-modal" style="display: none;">
          <div class="vc-modal-overlay"></div>
          <div class="vc-modal-content">
            ${this.renderModalContent()}
          </div>
        </div>
      `;

      // Re-query for event listeners
      this.setupEventListeners();
    },

    // Render a single marketplace item card
    renderItemCard: function(item, isInstalled) {
      return `
        <div class="vc-marketplace-card" data-item-id="${item.id}">
          <div class="vc-card-header">
            <div class="vc-card-icon">${item.icon}</div>
            <div class="vc-card-badge ${item.category.toLowerCase().replace(/\s+/g, '-')}">${item.category}</div>
          </div>
          <div class="vc-card-body">
            <h3 class="vc-card-title">${item.name}</h3>
            <p class="vc-card-description">${item.description}</p>
            <div class="vc-card-features">
              ${item.features.slice(0, 3).map(f => `<span class="vc-feature-tag">${f}</span>`).join('')}
            </div>
          </div>
          <div class="vc-card-footer">
            <button class="vc-btn vc-btn-primary vc-btn-use" data-item-id="${item.id}">
              ${isInstalled ? '✓ Installed' : 'Use This'}
            </button>
            ${isInstalled ? '<button class="vc-btn vc-btn-secondary vc-btn-uninstall" data-item-id="' + item.id + '">Uninstall</button>' : ''}
          </div>
        </div>
      `;
    },

    // Render modal content
    renderModalContent: function() {
      if (!this.selectedItem) return '';

      const item = this.selectedItem;
      const isInstalled = window.VibeContextStorage.isInstalled(item.id);

      return `
        <button class="vc-modal-close" id="modalCloseBtn">×</button>
        <div class="vc-modal-header">
          <div class="vc-modal-icon">${item.icon}</div>
          <div>
            <h2 class="vc-modal-title">${item.name}</h2>
            <span class="vc-modal-category">${item.category}</span>
          </div>
        </div>
        <div class="vc-modal-body">
          <p class="vc-modal-description">${item.description}</p>
          
          <div class="vc-modal-section">
            <h4>Key Features</h4>
            <ul class="vc-feature-list">
              ${item.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          <div class="vc-modal-section">
            <h4>Configuration</h4>
            <div class="vc-config-preview">
              ${Object.entries(item.config).map(([key, value]) => 
                `<div class="vc-config-item">
                  <span class="vc-config-key">${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                  <span class="vc-config-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
                </div>`
              ).join('')}
            </div>
          </div>

          <div class="vc-modal-section">
            <h4>Created By</h4>
            <p class="vc-created-by">${item.createdBy}</p>
          </div>
        </div>
        <div class="vc-modal-footer">
          ${!isInstalled ? 
            `<button class="vc-btn vc-btn-primary vc-btn-install" data-item-id="${item.id}">
              <span>✨</span> Install Now
            </button>` :
            `<button class="vc-btn vc-btn-success" disabled>
              <span>✓</span> Installed
            </button>
            <button class="vc-btn vc-btn-secondary vc-btn-uninstall-modal" data-item-id="${item.id}">
              Uninstall
            </button>`
          }
        </div>
      `;
    },

    // Setup event listeners
    setupEventListeners: function() {
      // Tab switcher
      document.querySelectorAll('.vc-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          const tabName = e.target.dataset.tab;
          if (tabName === 'create') {
            window.VibeContextMain.showWizard();
          } else {
            // Already on marketplace
            document.querySelectorAll('.vc-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
          }
        });
      });

      // "Use This" buttons
      document.querySelectorAll('.vc-btn-use').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const itemId = e.target.closest('[data-item-id]').dataset.itemId;
          this.showModal(itemId);
        });
      });

      // Modal close
      const modal = document.getElementById('marketplaceModal');
      if (modal) {
        const closeBtn = modal.querySelector('#modalCloseBtn');
        const overlay = modal.querySelector('.vc-modal-overlay');
        
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.hideModal());
        }
        if (overlay) {
          overlay.addEventListener('click', () => this.hideModal());
        }
      }

      // Install buttons
      document.querySelectorAll('.vc-btn-install, .vc-btn-install-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const itemId = e.target.closest('[data-item-id]').dataset.itemId;
          this.installItem(itemId);
        });
      });

      // Uninstall buttons
      document.querySelectorAll('.vc-btn-uninstall, .vc-btn-uninstall-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const itemId = e.target.closest('[data-item-id]').dataset.itemId;
          this.uninstallItem(itemId);
        });
      });
    },

    // Show modal for an item
    showModal: function(itemId) {
      this.selectedItem = MARKETPLACE_ITEMS.find(item => item.id === itemId);
      if (!this.selectedItem) return;

      const modal = document.getElementById('marketplaceModal');
      if (modal) {
        modal.style.display = 'flex';
        const content = modal.querySelector('.vc-modal-content');
        if (content) {
          content.innerHTML = this.renderModalContent();
          this.setupEventListeners(); // Re-setup for new buttons
          
          // Animate in
          setTimeout(() => {
            content.classList.add('vc-modal-visible');
          }, 10);
        }
      }
    },

    // Hide modal
    hideModal: function() {
      const modal = document.getElementById('marketplaceModal');
      if (modal) {
        const content = modal.querySelector('.vc-modal-content');
        if (content) {
          content.classList.remove('vc-modal-visible');
        }
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    },

    // Install a marketplace item
    installItem: function(itemId) {
      const item = MARKETPLACE_ITEMS.find(i => i.id === itemId);
      if (!item) return;

      // Show installation animation
      const installBtn = document.querySelector(`.vc-btn-install[data-item-id="${itemId}"]`);
      if (installBtn) {
        installBtn.disabled = true;
        installBtn.innerHTML = '<span class="vc-spinner"></span> Installing...';
      }

      // Simulate installation
      setTimeout(() => {
        window.VibeContextStorage.installMarketplaceItem(itemId);
        
        // Show success animation
        this.showInstallSuccess(itemId);
        
        // Update UI
        this.render();
      }, 1500);
    },

    // Uninstall an item
    uninstallItem: function(itemId) {
      if (confirm('Are you sure you want to uninstall this item?')) {
        window.VibeContextStorage.uninstallItem(itemId);
        this.render();
        if (this.selectedItem && this.selectedItem.id === itemId) {
          this.hideModal();
        }
      }
    },

    // Show installation success animation
    showInstallSuccess: function(itemId) {
      // Create celebration element
      const celebration = document.createElement('div');
      celebration.className = 'vc-celebration';
      celebration.innerHTML = '✨ Installed Successfully!';
      document.body.appendChild(celebration);

      setTimeout(() => {
        celebration.classList.add('vc-celebration-visible');
      }, 10);

      setTimeout(() => {
        celebration.classList.remove('vc-celebration-visible');
        setTimeout(() => celebration.remove(), 500);
      }, 2000);
    }
  };

  console.log('✅ VibeContextMarketplace initialized');
})();

