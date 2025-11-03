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

