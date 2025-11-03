/**
 * Alert Manager Module
 * Integrates PostgreSQL service with dashboard alert display
 * Provides real-time alert updates across all dashboard views
 */

class AlertManager {
  constructor() {
    this.currentView = 'executive';
    this.currentSeverityFilter = 'all';
    this.refreshInterval = null;
  }

  /**
   * Initialize alert manager
   */
  async initialize() {
    console.log('Alert Manager: Initializing...');
    
    // Wait for database service to be ready
    if (window.postgresService) {
      await window.postgresService.initialize();
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initial render
    await this.refreshAlerts();
    
    // Start periodic refresh
    this.startPeriodicRefresh();
    
    console.log('Alert Manager: Initialized');
  }

  /**
   * Setup event listeners for alert interactions and updates
   */
  setupEventListeners() {
    // Listen for severity filter changes
    const severityFilter = document.getElementById('alertSeverityFilter');
    if (severityFilter) {
      severityFilter.addEventListener('change', (e) => {
        this.currentSeverityFilter = e.target.value;
        this.refreshAlerts();
      });
    }

    // Listen for view changes
    const viewSelect = document.getElementById('demo-view');
    if (viewSelect) {
      viewSelect.addEventListener('change', (e) => {
        this.currentView = e.target.value;
        this.refreshAlerts();
      });
    }

    // Listen for custom events from database service
    window.addEventListener('tc:alert:new', (e) => {
      this.handleNewAlert(e.detail);
    });

    window.addEventListener('tc:alert:updated', () => {
      this.refreshAlerts();
    });

    window.addEventListener('tc:alert:deleted', () => {
      this.refreshAlerts();
    });

    window.addEventListener('tc:alerts:refresh', () => {
      this.updateAlertTimes();
    });

    // Set up alert action listeners (delegate to parent)
    const alertList = document.getElementById('alertList');
    if (alertList) {
      alertList.addEventListener('click', (e) => {
        this.handleAlertAction(e);
      });
    }
  }

  /**
   * Handle alert action clicks (acknowledge, resolve)
   */
  async handleAlertAction(e) {
    const target = e.target;
    
    if (target.classList.contains('ack-btn')) {
      const alertItem = target.closest('.alert-item');
      const alertId = alertItem?.dataset.alertId;
      if (alertId && window.postgresService) {
        await window.postgresService.acknowledgeAlert(alertId);
        alertItem.classList.add('acknowledged');
      }
    }
    
    if (target.classList.contains('resolve-btn')) {
      const alertItem = target.closest('.alert-item');
      const alertId = alertItem?.dataset.alertId;
      if (alertId && window.postgresService) {
        await window.postgresService.resolveAlert(alertId);
        alertItem.classList.add('resolved');
        setTimeout(() => {
          this.refreshAlerts();
        }, 500);
      }
    }
  }

  /**
   * Handle new alert notification
   */
  handleNewAlert(alert) {
    console.log('New alert received:', alert);
    
    // Show notification if browser supports it
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TruContext Alert', {
        body: alert.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: alert.id
      });
    }
    
    // Refresh alerts list
    this.refreshAlerts();
  }

  /**
   * Refresh alerts display
   */
  async refreshAlerts() {
    if (!window.postgresService || !window.postgresService.initialized) {
      return;
    }

    try {
      // Get alerts based on current view
      let alerts = [];
      
      if (this.currentView === 'executive' || this.currentView === 'aiagents' || this.currentView === '3dmap') {
        // Show all alerts for executive view
        alerts = await window.postgresService.getActiveAlerts();
      } else {
        // Show sector-specific alerts
        alerts = await window.postgresService.getAlertsBySector(this.currentView);
        // Also include executive/general alerts
        const executiveAlerts = await window.postgresService.getAlertsBySector('executive');
        alerts = [...alerts, ...executiveAlerts];
      }

      // Apply severity filter
      if (this.currentSeverityFilter !== 'all') {
        alerts = alerts.filter(alert => alert.severity === this.currentSeverityFilter);
      }

      // Sort by timestamp (newest first)
      alerts.sort((a, b) => b.timestamp - a.timestamp);

      // Limit to 10 most recent
      alerts = alerts.slice(0, 10);

      // Render alerts
      this.renderAlerts(alerts);
      
      // Update summary counts
      this.updateAlertSummary();
    } catch (error) {
      console.error('Alert Manager: Failed to refresh alerts', error);
    }
  }

  /**
   * Render alerts to DOM
   */
  renderAlerts(alerts) {
    const alertList = document.getElementById('alertList');
    if (!alertList) return;

    if (alerts.length === 0) {
      alertList.innerHTML = `
        <div class="alert-item unified" style="border-left-color: var(--color-success); justify-content: center;">
          <span class="alert-message unified" style="text-align: center;">
            ✓ No active alerts for this view
          </span>
        </div>
      `;
      return;
    }

    alertList.innerHTML = alerts.map(alert => {
      const timeAgo = window.postgresService?.getTimeAgo(alert.timestamp) || 'now';
      const severityClass = alert.severity || 'low';
      const acknowledgedClass = alert.acknowledged ? ' acknowledged' : '';
      const resolvedClass = alert.status === 'resolved' ? ' resolved' : '';
      
      return `
        <div class="alert-item unified ${severityClass}${acknowledgedClass}${resolvedClass}" 
             data-alert-id="${alert.id}" 
             data-severity="${alert.severity}">
          <span class="alert-time unified">${timeAgo}</span>
          <span class="alert-message unified">
            ${alert.acknowledged ? '✓ ' : ''}${alert.message}
            ${alert.location ? ` (${alert.location})` : ''}
          </span>
          <div class="alert-actions unified">
            ${!alert.acknowledged ? '<button class="alert-btn unified ack-btn">Acknowledge</button>' : ''}
            ${alert.status !== 'resolved' ? '<button class="alert-btn unified resolve-btn">Resolve</button>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Update alert summary counts
   */
  async updateAlertSummary() {
    if (!window.postgresService || !window.postgresService.initialized) {
      return;
    }

    try {
      const summary = await window.postgresService.getAlertSummary();
      
      // Update KPI if displaying executive dashboard
      if (this.currentView === 'executive') {
        const kpiRow = document.getElementById('kpiRow');
        if (kpiRow && kpiRow.children.length >= 4) {
          // Update 4th KPI with live alert count
          const alertKpi = kpiRow.children[3];
          const valueEl = alertKpi.querySelector('.kpi-value');
          if (valueEl) {
            valueEl.innerHTML = `
              <span class="kpi-value unified">${summary.active}</span>
              ${summary.critical > 0 ? `<span class="kpi-trend unified negative">${summary.critical} critical</span>` : ''}
            `;
          }
          const labelEl = alertKpi.querySelector('.kpi-label');
          if (labelEl) {
            labelEl.textContent = 'Live Alerts';
          }
        }
      }
    } catch (error) {
      console.error('Alert Manager: Failed to update summary', error);
    }
  }

  /**
   * Update time ago labels for all alerts
   */
  updateAlertTimes() {
    const alertItems = document.querySelectorAll('.alert-item[data-alert-id]');
    alertItems.forEach(item => {
      const alertId = item.dataset.alertId;
      const alert = window.postgresService?.alerts.find(a => a.id === alertId);
      if (alert) {
        const timeEl = item.querySelector('.alert-time');
        if (timeEl) {
          timeEl.textContent = window.postgresService.getTimeAgo(alert.timestamp);
        }
      }
    });
  }

  /**
   * Start periodic refresh of alerts
   */
  startPeriodicRefresh() {
    // Refresh every 5 seconds
    this.refreshInterval = setInterval(() => {
      this.refreshAlerts();
    }, 5000);
  }

  /**
   * Stop periodic refresh
   */
  stopPeriodicRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  /**
   * Set current view (called externally when view changes)
   */
  setView(view) {
    this.currentView = view;
    this.refreshAlerts();
  }

  /**
   * Get alert statistics for executive dashboard
   */
  async getAlertStatistics() {
    if (!window.postgresService || !window.postgresService.initialized) {
      return null;
    }

    const summary = await window.postgresService.getAlertSummary();
    return {
      total: summary.total,
      active: summary.active,
      critical: summary.critical,
      high: summary.high,
      medium: summary.medium,
      low: summary.low,
      bySector: summary.bySector,
      recentCritical: summary.recent.filter(a => a.severity === 'critical'),
      trend: this.calculateAlertTrend()
    };
  }

  /**
   * Calculate alert trend (for trend indicators)
   */
  calculateAlertTrend() {
    // Simple trend calculation based on recent alerts
    // In a real system, this would compare current vs. previous time period
    const recentAlerts = window.postgresService?.alerts || [];
    const last24h = recentAlerts.filter(a => (Date.now() - a.timestamp) < 24 * 60 * 60 * 1000);
    const last48h = recentAlerts.filter(a => (Date.now() - a.timestamp) < 48 * 60 * 60 * 1000);
    
    const current = last24h.length;
    const previous = last48h.length - current;
    
    if (previous === 0) return { direction: 'neutral', value: 0 };
    
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change > 0 ? 'up' : (change < 0 ? 'down' : 'neutral'),
      value: Math.abs(Math.round(change))
    };
  }

  /**
   * Export alerts (for reporting)
   */
  async exportAlerts(format = 'json') {
    if (!window.postgresService || !window.postgresService.initialized) {
      return null;
    }

    const alerts = await window.postgresService.getAllAlerts();
    
    if (format === 'json') {
      return JSON.stringify(alerts, null, 2);
    } else if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'Sector', 'Severity', 'Message', 'Location', 'Status', 'Acknowledged'];
      const rows = alerts.map(a => [
        a.id,
        new Date(a.timestamp).toISOString(),
        a.sector,
        a.severity,
        a.message,
        a.location || '',
        a.status,
        a.acknowledged ? 'Yes' : 'No'
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return null;
  }
}

// Create singleton instance
window.alertManager = new AlertManager();

// Auto-initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.alertManager.initialize();
  });
} else {
  window.alertManager.initialize();
}
