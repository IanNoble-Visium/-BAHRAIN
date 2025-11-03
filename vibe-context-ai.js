// Vibe Context AI Simulator
// Provides intelligent suggestions based on documentation and user input
// Simulates AI behavior with realistic delays and contextual responses

(function() {
  'use strict';

  // Knowledge base of APIs, components, and capabilities
  const KNOWLEDGE_BASE = {
    apis: [
      { name: 'Graph Analytics API', category: 'core', description: 'Query relationship graphs and network topologies' },
      { name: 'Threat Detection API', category: 'security', description: 'Real-time anomaly detection and threat analysis' },
      { name: 'Traffic Flow API', category: 'traffic', description: 'Real-time traffic patterns and congestion data' },
      { name: 'KPI Metrics API', category: 'analytics', description: 'Access to all dashboard KPIs and metrics' },
      { name: 'Alert Management API', category: 'monitoring', description: 'Create and manage alerts and notifications' },
      { name: 'Geospatial API', category: 'location', description: 'Coordinate mapping and geographic data' },
      { name: 'Data Export API', category: 'core', description: 'Export graph data and analytics' },
      { name: 'Real-time Stream API', category: 'core', description: 'Subscribe to live data streams' }
    ],
    components: [
      { name: 'ECharts Visualizations', category: 'visualization', description: 'Advanced charts and graphs' },
      { name: 'Network Graph', category: 'visualization', description: 'Interactive network topology viewer' },
      { name: 'Heat Map', category: 'visualization', description: 'Geographic heat map visualization' },
      { name: 'KPI Card', category: 'widget', description: 'Reusable KPI metric display' },
      { name: 'Alert Feed', category: 'widget', description: 'Real-time alert streaming component' },
      { name: 'Data Table', category: 'widget', description: 'Sortable, filterable data table' },
      { name: 'Time Series Chart', category: 'visualization', description: 'Historical trend analysis' }
    ],
    dataSources: [
      { name: 'Network Entities', category: 'infrastructure', description: 'All monitored network devices and assets' },
      { name: 'Security Events', category: 'security', description: 'Cybersecurity alerts and incidents' },
      { name: 'Traffic Patterns', category: 'traffic', description: 'Real-time and historical traffic data' },
      { name: 'Environmental Sensors', category: 'environment', description: 'Air quality, weather, and sensor data' },
      { name: 'Health Metrics', category: 'health', description: 'Public health indicators and trends' },
      { name: 'Energy Consumption', category: 'energy', description: 'Power grid and renewable energy data' },
      { name: 'Water Management', category: 'water', description: 'Water usage and infrastructure data' }
    ]
  };

  // Pre-scripted response templates based on creation type
  const RESPONSE_TEMPLATES = {
    automation: {
      intro: 'I\'ll help you create an automation workflow. Based on your requirements, here are the best components:',
      suggestions: [
        'Alert Management API - Perfect for triggering actions based on events',
        'Real-time Stream API - Monitor data changes in real-time',
        'KPI Metrics API - Track metrics and trigger when thresholds are met'
      ]
    },
    agent: {
      intro: 'For an AI agent, you\'ll want intelligent monitoring and decision-making capabilities:',
      suggestions: [
        'Threat Detection API - Provides AI-powered anomaly detection',
        'Graph Analytics API - Analyze relationships and patterns',
        'Real-time Stream API - Process live data streams'
      ]
    },
    visualization: {
      intro: 'Creating a custom visualization? These components will make it stunning:',
      suggestions: [
        'ECharts Visualizations - Flexible and powerful charting library',
        'Network Graph - Show relationships and connections',
        'Heat Map - Geographic and data density visualizations'
      ]
    },
    dashboard: {
      intro: 'Building a custom dashboard? Here\'s what you\'ll need:',
      suggestions: [
        'KPI Card - Display key metrics prominently',
        'Data Table - Show detailed information',
        'Time Series Chart - Track trends over time'
      ]
    }
  };

  window.VibeContextAI = {
    // Read documentation files (simulated)
    async readDocumentation() {
      try {
        // In a real implementation, this would fetch from /docs
        // For demo, we'll simulate reading file names
        const docFiles = [
          'Bahrain Presentation 2025 v1.txt',
          'Bahrain Unified Analytics.pdf',
          'Bahrain use cases.pdf',
          'TruContext - Bahrain Services.txt'
        ];
        
        // Simulate reading process
        await this.delay(500);
        return {
          files: docFiles,
          context: 'TruContext platform integrates graph analytics, real-time monitoring, AI agents, and unified dashboards for Bahrain\'s smart city infrastructure.',
          keywords: ['graph', 'analytics', 'real-time', 'AI', 'dashboard', 'monitoring', 'security', 'traffic', 'infrastructure']
        };
      } catch (e) {
        console.error('Error reading documentation:', e);
        return { files: [], context: '', keywords: [] };
      }
    },

    // Extract keywords from user input
    extractKeywords(input) {
      const commonWords = ['a', 'an', 'the', 'is', 'are', 'for', 'to', 'with', 'and', 'or', 'but'];
      const words = input.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !commonWords.includes(word));
      return [...new Set(words)];
    },

    // Generate AI suggestions based on creation type and user input
    async generateSuggestions(creationType, userInput = '') {
      // Show thinking animation
      const keywords = this.extractKeywords(userInput);
      const docs = await this.readDocumentation();
      
      // Simulate AI thinking time
      await this.delay(1500 + Math.random() * 1000);
      
      const template = RESPONSE_TEMPLATES[creationType] || RESPONSE_TEMPLATES.automation;
      
      // Filter APIs and components based on keywords and type
      const relevantAPIs = this.filterByContext(KNOWLEDGE_BASE.apis, keywords, creationType);
      const relevantComponents = this.filterByContext(KNOWLEDGE_BASE.components, keywords, creationType);
      const relevantDataSources = this.filterByContext(KNOWLEDGE_BASE.dataSources, keywords, creationType);
      
      return {
        intro: template.intro,
        apis: relevantAPIs.slice(0, 5),
        components: relevantComponents.slice(0, 4),
        dataSources: relevantDataSources.slice(0, 4),
        documentation: {
          filesFound: docs.files.length,
          context: docs.context,
          relevantKeywords: keywords.slice(0, 5)
        },
        confidence: Math.min(95, 70 + keywords.length * 5)
      };
    },

    // Filter items by context (keywords and creation type)
    filterByContext(items, keywords, creationType) {
      return items
        .map(item => {
          let score = 0;
          const itemText = (item.name + ' ' + item.description + ' ' + item.category).toLowerCase();
          
          // Boost score for category match
          if (item.category === creationType || 
              (creationType === 'automation' && item.category === 'monitoring') ||
              (creationType === 'agent' && item.category === 'security')) {
            score += 3;
          }
          
          // Boost score for keyword matches
          keywords.forEach(keyword => {
            if (itemText.includes(keyword)) {
              score += 2;
            }
          });
          
          return { ...item, score };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ score, ...item }) => item);
    },

    // Generate configuration hints for a step
    getConfigurationHints(step, selections = {}) {
      const hints = {
        step2: 'Select the APIs and data sources you want to integrate. The AI has selected the most relevant options based on your requirements.',
        step3: {
          automation: 'Configure trigger conditions and actions. Set thresholds, schedules, or event patterns.',
          agent: 'Define the agent\'s monitoring scope and decision rules. Specify which data sources to analyze.',
          visualization: 'Choose chart type, color scheme, and data refresh interval. Configure axis labels and tooltips.',
          dashboard: 'Arrange widgets and set their data sources. Configure layout and refresh rates.'
        }
      };
      
      if (step === 3 && selections.type) {
        return hints.step3[selections.type] || hints.step3.automation;
      }
      
      return hints[step] || 'Configure the settings based on your selected components.';
    },

    // Generate code preview (simulated)
    async generateCodePreview(selections) {
      await this.delay(800);
      
      const type = selections.type || 'automation';
      const apiNames = (selections.apis || []).map(a => a.name).join(', ');
      
      return {
        type: type,
        code: `// ${type} configuration
{
  "name": "${selections.name || 'Custom Creation'}",
  "type": "${type}",
  "apis": [${apiNames.split(', ').map(n => `"${n}"`).join(', ')}],
  "dataSources": ${JSON.stringify(selections.dataSources || [])},
  "config": ${JSON.stringify(selections.config || {})},
  "schedule": "${selections.schedule || 'real-time'}",
  "enabled": true
}`,
        preview: 'Preview will render based on your selections...'
      };
    },

    // Utility: delay function
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Simulate AI "thinking" with realistic messages
    async showThinkingAnimation(callback, duration = 2000) {
      const messages = [
        'Analyzing requirements...',
        'Reviewing documentation...',
        'Identifying relevant APIs...',
        'Matching components...',
        'Optimizing configuration...'
      ];
      
      let currentMessage = 0;
      const interval = setInterval(() => {
        if (callback && currentMessage < messages.length) {
          callback(messages[currentMessage]);
          currentMessage++;
        }
      }, duration / messages.length);
      
      await this.delay(duration);
      clearInterval(interval);
      
      if (callback) {
        callback('Analysis complete!');
      }
    }
  };

  console.log('✅ VibeContextAI initialized');
})();

