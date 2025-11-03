// Vibe Context Storage Manager
// Handles localStorage persistence for user creations, wizard progress, and marketplace items

(function() {
  'use strict';

  const STORAGE_KEYS = {
    CREATIONS: 'vibe_context_creations',
    WIZARD_PROGRESS: 'vibe_context_wizard_progress',
    INSTALLED_ITEMS: 'vibe_context_installed_items',
    WORKSPACE_STATE: 'vibe_context_workspace'
  };

  window.VibeContextStorage = {
    // Save a user creation
    saveCreation: function(creation) {
      try {
        const creations = this.getCreations();
        creation.id = creation.id || 'creation_' + Date.now();
        creation.createdAt = creation.createdAt || new Date().toISOString();
        creation.updatedAt = new Date().toISOString();
        
        const index = creations.findIndex(c => c.id === creation.id);
        if (index >= 0) {
          creations[index] = creation;
        } else {
          creations.push(creation);
        }
        
        localStorage.setItem(STORAGE_KEYS.CREATIONS, JSON.stringify(creations));
        return creation;
      } catch (e) {
        console.error('Error saving creation:', e);
        return null;
      }
    },

    // Get all user creations
    getCreations: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.CREATIONS);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Error reading creations:', e);
        return [];
      }
    },

    // Get a specific creation by ID
    getCreation: function(id) {
      const creations = this.getCreations();
      return creations.find(c => c.id === id) || null;
    },

    // Delete a creation
    deleteCreation: function(id) {
      try {
        const creations = this.getCreations();
        const filtered = creations.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEYS.CREATIONS, JSON.stringify(filtered));
        return true;
      } catch (e) {
        console.error('Error deleting creation:', e);
        return false;
      }
    },

    // Save wizard progress
    saveWizardProgress: function(step, data) {
      try {
        const progress = {
          currentStep: step,
          data: data,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.WIZARD_PROGRESS, JSON.stringify(progress));
        return progress;
      } catch (e) {
        console.error('Error saving wizard progress:', e);
        return null;
      }
    },

    // Get wizard progress
    getWizardProgress: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.WIZARD_PROGRESS);
        return data ? JSON.parse(data) : null;
      } catch (e) {
        console.error('Error reading wizard progress:', e);
        return null;
      }
    },

    // Clear wizard progress
    clearWizardProgress: function() {
      try {
        localStorage.removeItem(STORAGE_KEYS.WIZARD_PROGRESS);
        return true;
      } catch (e) {
        console.error('Error clearing wizard progress:', e);
        return false;
      }
    },

    // Mark marketplace item as installed
    installMarketplaceItem: function(itemId) {
      try {
        const installed = this.getInstalledItems();
        if (!installed.includes(itemId)) {
          installed.push(itemId);
          localStorage.setItem(STORAGE_KEYS.INSTALLED_ITEMS, JSON.stringify(installed));
        }
        return true;
      } catch (e) {
        console.error('Error installing marketplace item:', e);
        return false;
      }
    },

    // Get installed marketplace items
    getInstalledItems: function() {
      try {
        const data = localStorage.getItem(STORAGE_KEYS.INSTALLED_ITEMS);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        console.error('Error reading installed items:', e);
        return [];
      }
    },

    // Check if item is installed
    isInstalled: function(itemId) {
      const installed = this.getInstalledItems();
      return installed.includes(itemId);
    },

    // Uninstall marketplace item
    uninstallItem: function(itemId) {
      try {
        const installed = this.getInstalledItems();
        const filtered = installed.filter(id => id !== itemId);
        localStorage.setItem(STORAGE_KEYS.INSTALLED_ITEMS, JSON.stringify(filtered));
        return true;
      } catch (e) {
        console.error('Error uninstalling item:', e);
        return false;
      }
    },

    // Export all data (for demo purposes)
    exportData: function() {
      return {
        creations: this.getCreations(),
        installedItems: this.getInstalledItems(),
        wizardProgress: this.getWizardProgress(),
        exportedAt: new Date().toISOString()
      };
    },

    // Import data (for demo purposes)
    importData: function(data) {
      try {
        if (data.creations) {
          localStorage.setItem(STORAGE_KEYS.CREATIONS, JSON.stringify(data.creations));
        }
        if (data.installedItems) {
          localStorage.setItem(STORAGE_KEYS.INSTALLED_ITEMS, JSON.stringify(data.installedItems));
        }
        if (data.wizardProgress) {
          localStorage.setItem(STORAGE_KEYS.WIZARD_PROGRESS, JSON.stringify(data.wizardProgress));
        }
        return true;
      } catch (e) {
        console.error('Error importing data:', e);
        return false;
      }
    },

    // Clear all data (reset)
    clearAll: function() {
      try {
        Object.values(STORAGE_KEYS).forEach(key => {
          localStorage.removeItem(key);
        });
        return true;
      } catch (e) {
        console.error('Error clearing all data:', e);
        return false;
      }
    }
  };

  console.log('✅ VibeContextStorage initialized');
})();

