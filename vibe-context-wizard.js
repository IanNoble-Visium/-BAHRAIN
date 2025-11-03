// Vibe Context Creation Wizard
// Multi-step wizard for creating custom automations, agents, and dashboard functionality

(function() {
  'use strict';

  window.VibeContextWizard = {
    currentStep: 1,
    maxSteps: 5,
    wizardData: {
      type: null,
      name: '',
      description: '',
      apis: [],
      components: [],
      dataSources: [],
      config: {},
      preview: null
    },
    container: null,
    currentSuggestions: null,

    // Initialize wizard
    init: function() {
      this.container = document.getElementById('vibeContextView');
      if (!this.container) return;

      // Load saved progress if exists
      const savedProgress = window.VibeContextStorage.getWizardProgress();
      if (savedProgress) {
        this.currentStep = savedProgress.currentStep || 1;
        this.wizardData = { ...this.wizardData, ...savedProgress.data };
      }

      this.render();
      this.setupEventListeners();
    },

    // Render wizard
    render: function() {
      if (!this.container) return;

      this.container.innerHTML = `
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
            <button class="vc-tab" data-tab="marketplace">Marketplace</button>
            <button class="vc-tab active" data-tab="create">Create New</button>
          </div>

          <!-- Progress Indicator -->
          <div class="vc-wizard-progress">
            ${Array.from({ length: this.maxSteps }, (_, i) => i + 1).map(step => `
              <div class="vc-progress-step ${step <= this.currentStep ? 'active' : ''} ${step < this.currentStep ? 'completed' : ''}">
                <div class="vc-progress-circle">${step < this.currentStep ? '✓' : step}</div>
                <div class="vc-progress-label">Step ${step}</div>
                <div class="vc-progress-line"></div>
              </div>
            `).join('')}
          </div>

          <!-- Wizard Content -->
          <div class="vc-wizard-content">
            ${this.renderStep()}
          </div>

          <!-- Wizard Navigation -->
          <div class="vc-wizard-nav">
            <button class="vc-btn vc-btn-secondary" id="wizardBackBtn" ${this.currentStep === 1 ? 'disabled' : ''}>
              ← Back
            </button>
            <button class="vc-btn vc-btn-secondary" id="wizardCancelBtn">
              Cancel
            </button>
            <button class="vc-btn vc-btn-primary" id="wizardNextBtn">
              ${this.currentStep === this.maxSteps ? 'Deploy' : 'Next →'}
            </button>
          </div>
        </div>
      `;

      this.setupEventListeners();
      this.loadStepData();
    },

    // Render current step
    renderStep: function() {
      switch (this.currentStep) {
        case 1: return this.renderStep1();
        case 2: return this.renderStep2();
        case 3: return this.renderStep3();
        case 4: return this.renderStep4();
        case 5: return this.renderStep5();
        default: return this.renderStep1();
      }
    },

    // Step 1: Type Selection
    renderStep1: function() {
      const types = [
        { id: 'automation', icon: '⚙️', title: 'Automation', desc: 'Create automated workflows and triggers' },
        { id: 'agent', icon: '🤖', title: 'AI Agent', desc: 'Build intelligent monitoring and decision agents' },
        { id: 'visualization', icon: '📊', title: 'Visualization', desc: 'Design custom charts and dashboards' },
        { id: 'dashboard', icon: '🎯', title: 'Dashboard', desc: 'Build complete custom dashboard views' }
      ];

      return `
        <div class="vc-wizard-step" data-step="1">
          <h2 class="vc-step-title">What would you like to create?</h2>
          <p class="vc-step-subtitle">Select the type of functionality you want to build</p>
          <div class="vc-type-selector">
            ${types.map(type => `
              <div class="vc-type-card ${this.wizardData.type === type.id ? 'selected' : ''}" 
                   data-type="${type.id}">
                <div class="vc-type-icon">${type.icon}</div>
                <h3 class="vc-type-title">${type.title}</h3>
                <p class="vc-type-desc">${type.desc}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    },

    // Step 2: AI Suggestions
    renderStep2: function() {
      if (!this.wizardData.type) {
        return '<div class="vc-wizard-step">Please select a type first.</div>';
      }

      return `
        <div class="vc-wizard-step" data-step="2">
          <h2 class="vc-step-title">AI Analysis</h2>
          <p class="vc-step-subtitle">Our AI is analyzing your requirements and suggesting the best components...</p>
          
          <div id="aiThinkingIndicator" class="vc-ai-thinking">
            <div class="vc-thinking-dots">
              <span></span><span></span><span></span>
            </div>
            <p class="vc-thinking-text">Analyzing documentation...</p>
          </div>

          <div id="aiSuggestions" class="vc-ai-suggestions" style="display: none;">
            <div class="vc-suggestions-header">
              <h3 id="suggestionsIntro"></h3>
              <div class="vc-confidence-badge">
                <span>Confidence: </span><span id="confidenceScore"></span>%
              </div>
            </div>

            <div class="vc-suggestions-section">
              <h4>Recommended APIs</h4>
              <div id="suggestedAPIs" class="vc-suggestion-grid"></div>
            </div>

            <div class="vc-suggestions-section">
              <h4>Recommended Components</h4>
              <div id="suggestedComponents" class="vc-suggestion-grid"></div>
            </div>

            <div class="vc-suggestions-section">
              <h4>Data Sources</h4>
              <div id="suggestedDataSources" class="vc-suggestion-grid"></div>
            </div>
          </div>
        </div>
      `;
    },

    // Step 3: Configuration
    renderStep3: function() {
      return `
        <div class="vc-wizard-step" data-step="3">
          <h2 class="vc-step-title">Configure Your Creation</h2>
          <p class="vc-step-subtitle">Set up the details and parameters</p>

          <div class="vc-config-form">
            <div class="vc-form-group">
              <label for="creationName">Name *</label>
              <input type="text" id="creationName" class="vc-input" 
                     placeholder="My Custom ${this.wizardData.type || 'Creation'}" 
                     value="${this.wizardData.name || ''}">
            </div>

            <div class="vc-form-group">
              <label for="creationDescription">Description</label>
              <textarea id="creationDescription" class="vc-textarea" 
                        placeholder="Describe what this creation does...">${this.wizardData.description || ''}</textarea>
            </div>

            <div class="vc-form-group">
              <label>Selected Components</label>
              <div class="vc-selected-items">
                ${this.renderSelectedItems()}
              </div>
            </div>

            ${this.renderTypeSpecificConfig()}
          </div>
        </div>
      `;
    },

    // Step 4: Preview
    renderStep4: function() {
      return `
        <div class="vc-wizard-step" data-step="4">
          <h2 class="vc-step-title">Preview</h2>
          <p class="vc-step-subtitle">See how your creation will look and work</p>

          <div id="previewContainer" class="vc-preview-container">
            <div class="vc-preview-loading">
              <div class="vc-spinner-large"></div>
              <p>Generating preview...</p>
            </div>
          </div>
        </div>
      `;
    },

    // Step 5: Save & Deploy
    renderStep5: function() {
      return `
        <div class="vc-wizard-step" data-step="5">
          <h2 class="vc-step-title">Ready to Deploy</h2>
          <p class="vc-step-subtitle">Review your creation and deploy it to the dashboard</p>

          <div class="vc-deploy-summary">
            <div class="vc-summary-card">
              <h4>Creation Summary</h4>
              <div class="vc-summary-item">
                <span class="vc-summary-label">Type:</span>
                <span class="vc-summary-value">${this.wizardData.type || 'N/A'}</span>
              </div>
              <div class="vc-summary-item">
                <span class="vc-summary-label">Name:</span>
                <span class="vc-summary-value">${this.wizardData.name || 'Unnamed'}</span>
              </div>
              <div class="vc-summary-item">
                <span class="vc-summary-label">APIs:</span>
                <span class="vc-summary-value">${this.wizardData.apis.length} selected</span>
              </div>
              <div class="vc-summary-item">
                <span class="vc-summary-label">Components:</span>
                <span class="vc-summary-value">${this.wizardData.components.length} selected</span>
              </div>
            </div>

            <div class="vc-deploy-options">
              <label class="vc-checkbox-label">
                <input type="checkbox" id="deployEnabled" checked>
                <span>Enable immediately after deployment</span>
              </label>
            </div>
          </div>
        </div>
      `;
    },

    // Helper: Render selected items
    renderSelectedItems: function() {
      const allItems = [
        ...this.wizardData.apis.map(a => ({ ...a, type: 'api' })),
        ...this.wizardData.components.map(c => ({ ...c, type: 'component' })),
        ...this.wizardData.dataSources.map(d => ({ ...d, type: 'dataSource' }))
      ];

      if (allItems.length === 0) {
        return '<p class="vc-empty-state">No items selected yet. Go back to Step 2 to select components.</p>';
      }

      return allItems.map(item => `
        <div class="vc-selected-item">
          <span class="vc-item-icon">${item.type === 'api' ? '🔌' : item.type === 'component' ? '🧩' : '📊'}</span>
          <span class="vc-item-name">${item.name}</span>
          <button class="vc-item-remove" data-item-type="${item.type}" data-item-name="${item.name}">×</button>
        </div>
      `).join('');
    },

    // Helper: Render type-specific configuration
    renderTypeSpecificConfig: function() {
      const type = this.wizardData.type;
      if (!type) return '';

      const configs = {
        automation: `
          <div class="vc-form-group">
            <label for="triggerType">Trigger Type</label>
            <select id="triggerType" class="vc-select">
              <option value="threshold">Threshold</option>
              <option value="schedule">Schedule</option>
              <option value="event">Event</option>
            </select>
          </div>
        `,
        agent: `
          <div class="vc-form-group">
            <label for="agentFrequency">Monitoring Frequency</label>
            <select id="agentFrequency" class="vc-select">
              <option value="realtime">Real-time</option>
              <option value="1min">Every minute</option>
              <option value="5min">Every 5 minutes</option>
              <option value="15min">Every 15 minutes</option>
            </select>
          </div>
        `,
        visualization: `
          <div class="vc-form-group">
            <label for="chartType">Chart Type</label>
            <select id="chartType" class="vc-select">
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="area">Area Chart</option>
            </select>
          </div>
        `,
        dashboard: `
          <div class="vc-form-group">
            <label for="dashboardLayout">Layout Style</label>
            <select id="dashboardLayout" class="vc-select">
              <option value="grid">Grid</option>
              <option value="column">Columns</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        `
      };

      return configs[type] || '';
    },

    // Setup event listeners
    setupEventListeners: function() {
      // Navigation buttons
      const backBtn = document.getElementById('wizardBackBtn');
      const nextBtn = document.getElementById('wizardNextBtn');
      const cancelBtn = document.getElementById('wizardCancelBtn');

      if (backBtn) {
        backBtn.addEventListener('click', () => this.goToStep(this.currentStep - 1));
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.handleNext());
      }

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => this.cancelWizard());
      }

      // Tab switcher
      document.querySelectorAll('.vc-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          const tabName = e.target.dataset.tab;
          if (tabName === 'marketplace') {
            window.VibeContextMain.showMarketplace();
          }
        });
      });

      // Step-specific listeners
      if (this.currentStep === 1) {
        document.querySelectorAll('.vc-type-card').forEach(card => {
          card.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            this.wizardData.type = type;
            this.render();
          });
        });
      }

      if (this.currentStep === 2) {
        this.loadAISuggestions();
      }

      if (this.currentStep === 3) {
        const nameInput = document.getElementById('creationName');
        const descInput = document.getElementById('creationDescription');
        
        if (nameInput) {
          nameInput.addEventListener('input', (e) => {
            this.wizardData.name = e.target.value;
            this.saveProgress();
          });
        }

        if (descInput) {
          descInput.addEventListener('input', (e) => {
            this.wizardData.description = e.target.value;
            this.saveProgress();
          });
        }

        // Remove item buttons
        document.querySelectorAll('.vc-item-remove').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const itemType = e.target.dataset.itemType;
            const itemName = e.target.dataset.itemName;
            this.removeSelectedItem(itemType, itemName);
          });
        });
      }

      if (this.currentStep === 4) {
        this.generatePreview();
      }
    },

    // Handle next button
    handleNext: async function() {
      if (this.currentStep < this.maxSteps) {
        // Validate current step
        if (!this.validateStep()) {
          return;
        }

        if (this.currentStep === 2) {
          // Wait for AI suggestions to load
          await this.loadAISuggestions();
        }

        this.goToStep(this.currentStep + 1);
      } else {
        // Deploy
        this.deploy();
      }
    },

    // Go to specific step
    goToStep: function(step) {
      if (step < 1 || step > this.maxSteps) return;
      
      this.currentStep = step;
      this.render();
    },

    // Load AI suggestions (Step 2)
    loadAISuggestions: async function() {
      const thinkingIndicator = document.getElementById('aiThinkingIndicator');
      const suggestionsDiv = document.getElementById('aiSuggestions');

      if (!thinkingIndicator || !suggestionsDiv) return;

      // Show thinking animation
      thinkingIndicator.style.display = 'block';
      suggestionsDiv.style.display = 'none';

      // Generate suggestions
      const suggestions = await window.VibeContextAI.generateSuggestions(
        this.wizardData.type,
        this.wizardData.description
      );

      // Hide thinking, show suggestions
      setTimeout(() => {
        thinkingIndicator.style.display = 'none';
        suggestionsDiv.style.display = 'block';

        // Store suggestions for later lookup
        this.currentSuggestions = suggestions;

        // Populate suggestions
        document.getElementById('suggestionsIntro').textContent = suggestions.intro;
        document.getElementById('confidenceScore').textContent = suggestions.confidence;

        this.renderSuggestions('suggestedAPIs', suggestions.apis, 'api');
        this.renderSuggestions('suggestedComponents', suggestions.components, 'component');
        this.renderSuggestions('suggestedDataSources', suggestions.dataSources, 'dataSource');

        // Setup selection listeners
        this.setupSuggestionListeners();
      }, 2000);
    },

    // Render suggestion items
    renderSuggestions: function(containerId, items, type) {
      const container = document.getElementById(containerId);
      if (!container) return;

      container.innerHTML = items.map(item => `
        <div class="vc-suggestion-item" data-type="${type}" data-item-id="${item.name}">
          <input type="checkbox" id="check_${type}_${item.name.replace(/\s+/g, '_')}" 
                 ${this.isItemSelected(type, item.name) ? 'checked' : ''}>
          <label for="check_${type}_${item.name.replace(/\s+/g, '_')}">
            <div class="vc-suggestion-content">
              <h5>${item.name}</h5>
              <p>${item.description}</p>
            </div>
          </label>
        </div>
      `).join('');
    },

    // Setup suggestion selection listeners
    setupSuggestionListeners: function() {
      document.querySelectorAll('.vc-suggestion-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
          const item = e.target.closest('.vc-suggestion-item');
          const type = item.dataset.type;
          const itemId = item.dataset.itemId;
          const itemData = this.findSuggestionItem(type, itemId);

          if (e.target.checked) {
            this.addSelectedItem(type, itemData);
          } else {
            this.removeSelectedItem(type, itemId);
          }
        });
      });
    },

    // Helper: Find suggestion item
    findSuggestionItem: function(type, name) {
      // Use stored suggestions if available
      if (this.currentSuggestions) {
        let items = [];
        if (type === 'api') items = this.currentSuggestions.apis || [];
        else if (type === 'component') items = this.currentSuggestions.components || [];
        else if (type === 'dataSource') items = this.currentSuggestions.dataSources || [];
        
        const found = items.find(item => item.name === name);
        if (found) return found;
      }
      // Fallback
      return { name, type, description: 'Selected item', category: '' };
    },

    // Add selected item
    addSelectedItem: function(type, item) {
      const key = type === 'api' ? 'apis' : type === 'component' ? 'components' : 'dataSources';
      if (!this.wizardData[key].find(i => i.name === item.name)) {
        this.wizardData[key].push(item);
        this.saveProgress();
      }
    },

    // Remove selected item
    removeSelectedItem: function(type, name) {
      const key = type === 'api' ? 'apis' : type === 'component' ? 'components' : 'dataSources';
      this.wizardData[key] = this.wizardData[key].filter(i => i.name !== name);
      this.saveProgress();
      this.render();
    },

    // Check if item is selected
    isItemSelected: function(type, name) {
      const key = type === 'api' ? 'apis' : type === 'component' ? 'components' : 'dataSources';
      return this.wizardData[key].some(i => i.name === name);
    },

    // Generate preview (Step 4)
    generatePreview: async function() {
      const container = document.getElementById('previewContainer');
      if (!container) return;

      container.innerHTML = `
        <div class="vc-preview-loading">
          <div class="vc-spinner-large"></div>
          <p>Generating preview...</p>
        </div>
      `;

      // Generate preview using ECharts
      setTimeout(() => {
        container.innerHTML = `
          <div class="vc-preview-content">
            <div class="vc-preview-header">
              <h3>${this.wizardData.name || 'Preview'}</h3>
              <span class="vc-preview-type">${this.wizardData.type}</span>
            </div>
            <div id="previewChart" style="width: 100%; height: 400px;"></div>
            <div class="vc-preview-info">
              <p><strong>Type:</strong> ${this.wizardData.type}</p>
              <p><strong>Components:</strong> ${this.wizardData.components.length} selected</p>
              <p><strong>Data Sources:</strong> ${this.wizardData.dataSources.length} selected</p>
            </div>
          </div>
        `;

        // Render ECharts preview
        this.renderEChartsPreview();
      }, 1500);
    },

    // Render ECharts preview
    renderEChartsPreview: function() {
      const chartDom = document.getElementById('previewChart');
      if (!chartDom || !window.echarts) return;

      const chart = echarts.init(chartDom);
      const option = {
        title: { text: 'Preview Data', left: 'center' },
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        yAxis: { type: 'value' },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          itemStyle: { color: '#2563eb' }
        }]
      };
      chart.setOption(option);
    },

    // Validate current step
    validateStep: function() {
      if (this.currentStep === 1) {
        if (!this.wizardData.type) {
          alert('Please select a creation type.');
          return false;
        }
      }
      if (this.currentStep === 3) {
        if (!this.wizardData.name || this.wizardData.name.trim() === '') {
          alert('Please enter a name for your creation.');
          return false;
        }
      }
      return true;
    },

    // Load step data
    loadStepData: function() {
      // Load any step-specific data that was saved
      if (this.currentStep === 3) {
        // Already handled in render
      }
    },

    // Save progress
    saveProgress: function() {
      window.VibeContextStorage.saveWizardProgress(this.currentStep, this.wizardData);
    },

    // Cancel wizard
    cancelWizard: function() {
      if (confirm('Are you sure you want to cancel? Your progress will be saved.')) {
        window.VibeContextStorage.saveWizardProgress(this.currentStep, this.wizardData);
        // Switch to marketplace view
        window.VibeContextMarketplace.init();
      }
    },

    // Deploy creation
    deploy: function() {
      const creation = {
        id: 'creation_' + Date.now(),
        ...this.wizardData,
        createdAt: new Date().toISOString(),
        enabled: document.getElementById('deployEnabled')?.checked || false
      };

      window.VibeContextStorage.saveCreation(creation);
      window.VibeContextStorage.clearWizardProgress();

      // Show success animation
      this.showDeploySuccess();

      // Reset and return to marketplace
      setTimeout(() => {
        this.wizardData = {
          type: null,
          name: '',
          description: '',
          apis: [],
          components: [],
          dataSources: [],
          config: {},
          preview: null
        };
        this.currentStep = 1;
        window.VibeContextMarketplace.init();
      }, 2000);
    },

    // Show deploy success
    showDeploySuccess: function() {
      const successDiv = document.createElement('div');
      successDiv.className = 'vc-deploy-success';
      successDiv.innerHTML = `
        <div class="vc-success-content">
          <div class="vc-success-icon">✨</div>
          <h3>Deployed Successfully!</h3>
          <p>Your "${this.wizardData.name}" has been created and saved.</p>
        </div>
      `;
      document.body.appendChild(successDiv);

      setTimeout(() => {
        successDiv.classList.add('visible');
      }, 10);

      setTimeout(() => {
        successDiv.classList.remove('visible');
        setTimeout(() => successDiv.remove(), 500);
      }, 3000);
    }
  };

  console.log('✅ VibeContextWizard initialized');
})();

