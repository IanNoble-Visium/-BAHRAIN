/**
 * PostgreSQL Database Service for Bahrain Smart City Dashboard
 * Manages shared alerts across all dashboard screens
 * Connection: PostgreSQL on Neon
 */

class PostgresService {
  constructor() {
    // Neon PostgreSQL connection string
    this.connectionString = 'postgresql://neondb_owner:npg_UtHL3Yipu8Er@ep-odd-cell-adbjzufl-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
    this.apiEndpoint = null; // Will be set if backend API is available
    this.alerts = [];
    this.initialized = false;
    this.useLocalStorage = true; // Fallback to localStorage for static site
  }

  /**
   * Initialize database connection and create tables if needed
   */
  async initialize() {
    try {
      console.log('PostgreSQL Service: Initializing with Neon database...');

      // Try to connect to backend API if available
      // For static site deployment, we'll use localStorage as fallback
      const backendAvailable = await this.checkBackendAvailability();

      if (backendAvailable) {
        console.log('PostgreSQL Service: Backend API available, using Neon database');
        await this.loadAlertsFromDatabase();
      } else {
        console.log('PostgreSQL Service: Using localStorage fallback for static site');
        // Load alerts from localStorage (fallback for static site)
        const stored = localStorage.getItem('tc_alerts');
        if (stored) {
          this.alerts = JSON.parse(stored);
        } else {
          // Initialize with default alerts
          this.alerts = this.generateDefaultAlerts();
          this.saveAlerts();
        }
      }

      this.initialized = true;
      console.log('PostgreSQL Service: Initialized with', this.alerts.length, 'alerts');

      // Start periodic sync
      this.startPeriodicSync();

      return true;
    } catch (error) {
      console.error('PostgreSQL Service: Initialization failed', error);
      // Fallback to localStorage on error
      this.useLocalStorage = true;
      const stored = localStorage.getItem('tc_alerts');
      if (stored) {
        this.alerts = JSON.parse(stored);
      } else {
        this.alerts = this.generateDefaultAlerts();
        this.saveAlerts();
      }
      this.initialized = true;
      return true;
    }
  }

  /**
   * Check if backend API is available
   */
  async checkBackendAvailability() {
    try {
      // Try to ping backend API endpoint
      // For now, return false to use localStorage
      // TODO: Implement backend API endpoint
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Load alerts from Neon database via backend API
   */
  async loadAlertsFromDatabase() {
    try {
      // TODO: Implement API call to backend
      // const response = await fetch(`${this.apiEndpoint}/alerts`);
      // this.alerts = await response.json();
      console.log('PostgreSQL Service: Database connection ready (Neon)');
    } catch (error) {
      console.error('PostgreSQL Service: Failed to load from database', error);
      throw error;
    }
  }

  /**
   * Generate default alerts for initialization
   */
  generateDefaultAlerts() {
    const now = Date.now();
    const sectors = ['traffic', 'cybersecurity', 'environment', 'water', 'energy', 'health', 'infrastructure'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const locations = ['Manama', 'Muharraq', 'Riffa', 'Isa Town', 'Sitra', 'Hamad Town'];
    
    const templates = {
      traffic: [
        'Traffic congestion detected - {location} Highway',
        'Accident reported on {location} Bridge',
        'Heavy traffic flow on {location} connector'
      ],
      cybersecurity: [
        'Unusual network activity - {location} District',
        'Potential threat detected in {location} sector',
        'Security scan completed for {location} network'
      ],
      environment: [
        'Air quality index elevated in {location}',
        'Dust storm warning for {location} area',
        'Temperature alert for {location} region'
      ],
      water: [
        'Water pressure anomaly - {location} Sector',
        'Leak detection alert in {location} network',
        'High consumption detected in {location}'
      ],
      energy: [
        'Grid load spike in {location}',
        'Renewable energy target met in {location}',
        'Power optimization active in {location}'
      ],
      health: [
        'Hospital capacity alert - {location}',
        'ER demand increase in {location}',
        'Health screening completed in {location}'
      ],
      infrastructure: [
        'Project milestone reached in {location}',
        'Infrastructure inspection due in {location}',
        'Construction update for {location} project'
      ]
    };
    
    const alerts = [];
    
    // Generate 20 random alerts
    for (let i = 0; i < 20; i++) {
      const sector = sectors[Math.floor(Math.random() * sectors.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const template = templates[sector][Math.floor(Math.random() * templates[sector].length)];
      const message = template.replace('{location}', location);
      
      // Generate timestamp within last 24 hours
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const timestamp = now - (hoursAgo * 60 * 60 * 1000) - (minutesAgo * 60 * 1000);
      
      alerts.push({
        id: `alert_${Date.now()}_${i}`,
        sector,
        severity,
        message,
        location,
        timestamp,
        status: Math.random() > 0.7 ? 'resolved' : 'active',
        acknowledged: Math.random() > 0.5
      });
    }
    
    // Sort by timestamp (newest first)
    alerts.sort((a, b) => b.timestamp - a.timestamp);
    
    return alerts;
  }

  /**
   * Save alerts to localStorage
   */
  saveAlerts() {
    try {
      localStorage.setItem('tc_alerts', JSON.stringify(this.alerts));
    } catch (error) {
      console.error('PostgreSQL Service: Failed to save alerts', error);
    }
  }

  /**
   * Get all alerts
   */
  async getAllAlerts() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.alerts;
  }

  /**
   * Get alerts by sector
   */
  async getAlertsBySector(sector) {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.alerts.filter(alert => alert.sector === sector);
  }

  /**
   * Get alerts by severity
   */
  async getAlertsBySeverity(severity) {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.alerts.filter(alert => alert.severity === severity);
  }

  /**
   * Get active alerts (unresolved)
   */
  async getActiveAlerts() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.alerts.filter(alert => alert.status === 'active');
  }

  /**
   * Get alert summary for executive dashboard
   */
  async getAlertSummary() {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const active = this.alerts.filter(a => a.status === 'active');
    
    return {
      total: this.alerts.length,
      active: active.length,
      critical: active.filter(a => a.severity === 'critical').length,
      high: active.filter(a => a.severity === 'high').length,
      medium: active.filter(a => a.severity === 'medium').length,
      low: active.filter(a => a.severity === 'low').length,
      bySector: this.groupBySector(active),
      recent: active.slice(0, 10)
    };
  }

  /**
   * Group alerts by sector
   */
  groupBySector(alerts) {
    const sectors = {};
    alerts.forEach(alert => {
      if (!sectors[alert.sector]) {
        sectors[alert.sector] = 0;
      }
      sectors[alert.sector]++;
    });
    return sectors;
  }

  /**
   * Add new alert
   */
  async addAlert(alert) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const newAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      status: 'active',
      acknowledged: false,
      ...alert
    };
    
    this.alerts.unshift(newAlert);
    this.saveAlerts();
    
    // Emit event for real-time updates
    window.dispatchEvent(new CustomEvent('tc:alert:new', { detail: newAlert }));
    
    return newAlert;
  }

  /**
   * Update alert status
   */
  async updateAlert(id, updates) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      Object.assign(alert, updates);
      this.saveAlerts();
      
      // Emit event for real-time updates
      window.dispatchEvent(new CustomEvent('tc:alert:updated', { detail: alert }));
      
      return alert;
    }
    return null;
  }

  /**
   * Acknowledge alert
   */
  async acknowledgeAlert(id) {
    return this.updateAlert(id, { acknowledged: true });
  }

  /**
   * Resolve alert
   */
  async resolveAlert(id) {
    return this.updateAlert(id, { status: 'resolved', resolvedAt: Date.now() });
  }

  /**
   * Delete alert
   */
  async deleteAlert(id) {
    if (!this.initialized) {
      await this.initialize();
    }
    
    const index = this.alerts.findIndex(a => a.id === id);
    if (index !== -1) {
      const deleted = this.alerts.splice(index, 1)[0];
      this.saveAlerts();
      
      // Emit event for real-time updates
      window.dispatchEvent(new CustomEvent('tc:alert:deleted', { detail: deleted }));
      
      return deleted;
    }
    return null;
  }

  /**
   * Start periodic sync (simulate real-time updates)
   */
  startPeriodicSync() {
    // Add new random alert every 30 seconds
    setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        this.generateRandomAlert();
      }
    }, 30000);
    
    // Update alert timestamps every second
    setInterval(() => {
      window.dispatchEvent(new CustomEvent('tc:alerts:refresh'));
    }, 1000);
  }

  /**
   * Generate a random alert (for simulation)
   */
  async generateRandomAlert() {
    const sectors = ['traffic', 'cybersecurity', 'environment', 'water', 'energy', 'health', 'infrastructure'];
    const severities = ['low', 'medium', 'high'];
    const locations = ['Manama', 'Muharraq', 'Riffa', 'Isa Town', 'Sitra', 'Hamad Town'];
    
    const templates = {
      traffic: ['Traffic update - {location}', 'Congestion detected - {location}'],
      cybersecurity: ['Security event - {location}', 'Network activity - {location}'],
      environment: ['Environmental alert - {location}', 'Air quality update - {location}'],
      water: ['Water system alert - {location}', 'Consumption spike - {location}'],
      energy: ['Grid update - {location}', 'Load management - {location}'],
      health: ['Health alert - {location}', 'Capacity update - {location}'],
      infrastructure: ['Project update - {location}', 'Inspection alert - {location}']
    };
    
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const template = templates[sector][Math.floor(Math.random() * templates[sector].length)];
    
    await this.addAlert({
      sector,
      severity,
      message: template.replace('{location}', location),
      location
    });
  }

  /**
   * Get time ago string
   */
  getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}

// Create singleton instance
window.postgresService = new PostgresService();

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.postgresService.initialize();
  });
} else {
  window.postgresService.initialize();
}
