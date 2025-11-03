// Vibe Context Main Controller
// Handles initialization and switching between Wizard and Marketplace views

(function() {
  'use strict';

  window.VibeContextMain = {
    currentView: 'marketplace', // 'marketplace' or 'wizard'
    container: null,

    // Initialize Vibe Context view
    init: function(view = 'marketplace') {
      this.container = document.getElementById('vibeContextView');
      if (!this.container) {
        console.error('Vibe Context container not found');
        return;
      }

      // Check if required modules are loaded
      if (!window.VibeContextStorage) {
        console.error('VibeContextStorage not loaded. Please check script loading.');
        this.container.innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ Scripts Loading</h3><p>Please wait for all scripts to load...</p></div>';
        // Retry after a delay
        setTimeout(() => this.init(view), 1000);
        return;
      }

      if (!window.VibeContextMarketplace && view === 'marketplace') {
        console.error('VibeContextMarketplace not loaded. Please check script loading.');
        this.container.innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ Scripts Loading</h3><p>Please wait for all scripts to load...</p></div>';
        setTimeout(() => this.init(view), 1000);
        return;
      }

      if (!window.VibeContextWizard && view === 'wizard') {
        console.error('VibeContextWizard not loaded. Please check script loading.');
        this.container.innerHTML = '<div style="padding: 40px; text-align: center;"><h3>⚠️ Scripts Loading</h3><p>Please wait for all scripts to load...</p></div>';
        setTimeout(() => this.init(view), 1000);
        return;
      }

      this.currentView = view;
      this.showView(view);
    },

    // Show a specific view
    showView: function(view) {
      if (!this.container) return;

      this.currentView = view;

      if (view === 'marketplace') {
        window.VibeContextMarketplace.init();
      } else if (view === 'wizard') {
        window.VibeContextWizard.init();
      }
    },

    // Show wizard (called from marketplace "Create New" button)
    showWizard: function() {
      this.showView('wizard');
    },

    // Show marketplace (called from wizard cancel/complete)
    showMarketplace: function() {
      this.showView('marketplace');
    }
  };

  console.log('✅ VibeContextMain initialized');
})();

