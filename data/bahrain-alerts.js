// Bahrain Alerts Data for 3D Map Visualization

export const sectors = [
  { id: 'all', name: 'All Sectors', icon: '🌐', color: '#6b7280' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🛡️', color: '#f59e0b' },
  { id: 'traffic', name: 'Traffic', icon: '🚦', color: '#ef4444' },
  { id: 'environment', name: 'Environment', icon: '🌬️', color: '#10b981' },
  { id: 'water', name: 'Water Management', icon: '💧', color: '#3b82f6' },
  { id: 'energy', name: 'Energy & Renewables', icon: '⚡', color: '#8b5cf6' },
  { id: 'infrastructure', name: 'Infrastructure', icon: '🏗️', color: '#14b8a6' },
  { id: 'health', name: 'Health Monitoring', icon: '🏥', color: '#ec4899' }
];

// Severity colors mapping
const severityColors = {
  low: '#10b981',    // green
  medium: '#f59e0b', // amber
  high: '#ef4444'    // red
};

export function getSeverityColor(severity) {
  return severityColors[severity] || severityColors.low;
}

// Generate sample alerts for Bahrain locations
export function generateBahrainAlerts() {
  const alerts = [
    // Manama - Financial District
    {
      id: 'alert_manama_001',
      sector: 'cybersecurity',
      severity: 'high',
      location: {
        name: 'Financial District',
        lat: 26.2235,
        lon: 50.5876
      },
      message: 'Critical infrastructure incident detected - Cyber threat',
      description: 'Suspicious network activity in Financial District data center',
      timestamp: new Date(Date.now() - 15 * 60000),
      videoUrl: '/video-kpis/Usage Alert modal for critical infra incidents - Cybersecurity_prompt_soc_202508200431_h6ar5.mp4'
    },
    {
      id: 'alert_manama_002',
      sector: 'traffic',
      severity: 'medium',
      location: {
        name: 'King Faisal Highway',
        lat: 26.2280,
        lon: 50.5850
      },
      message: 'Traffic congestion detected - King Faisal Highway',
      description: 'Unusual traffic flow detected on main highway',
      timestamp: new Date(Date.now() - 10 * 60000),
      videoUrl: '/video-kpis/Usage Alert modal for congestionincident - Traffic__smart_202508200424_7ritq.mp4'
    },
    {
      id: 'alert_manama_003',
      sector: 'environment',
      severity: 'low',
      location: {
        name: 'Manama City Center',
        lat: 26.2200,
        lon: 50.5900
      },
      message: 'Air quality index increased',
      description: 'Elevated PM2.5 levels detected in city center',
      timestamp: new Date(Date.now() - 5 * 60000),
      videoUrl: '/video-kpis/Usage Alert modal for dustpollution events - Environment__air_202508200427_0tmxt.mp4'
    },
    
    // Muharraq
    {
      id: 'alert_muharraq_001',
      sector: 'health',
      severity: 'medium',
      location: {
        name: 'Salmaniya Hospital',
        lat: 26.2579,
        lon: 50.6119
      },
      message: 'Hospital capacity alert - ICU occupancy high',
      description: 'ICU beds occupancy reaching 85% capacity',
      timestamp: new Date(Date.now() - 8 * 60000),
      videoUrl: '/video-kpis/Usage Alert modal for capacity alerts -Healthcare_prompt_salmaniya_202508200430_7ml.mp4'
    },
    {
      id: 'alert_muharraq_002',
      sector: 'water',
      severity: 'low',
      location: {
        name: 'Muharraq Water Plant',
        lat: 26.2600,
        lon: 50.6100
      },
      message: 'Routine maintenance scheduled',
      description: 'Planned water system maintenance in progress',
      timestamp: new Date(Date.now() - 12 * 60000),
      videoUrl: '/video-kpis/Usage Alert modal for leak events - Water_management_prompt_202508200427_o0yt6.mp4'
    },
    
    // Riffa
    {
      id: 'alert_riffa_001',
      sector: 'energy',
      severity: 'medium',
      location: {
        name: 'Riffa Power Station',
        lat: 26.1290,
        lon: 50.5550
      },
      message: 'Grid load optimization in progress',
      description: 'Peak load management - renewable integration active',
      timestamp: new Date(Date.now() - 20 * 60000),
      videoUrl: '/videos/Real_Time_Grid_Strain_Dashboard.mp4'
    },
    
    // Isa Town
    {
      id: 'alert_isa_001',
      sector: 'infrastructure',
      severity: 'low',
      location: {
        name: 'Isa Town Development',
        lat: 26.1700,
        lon: 50.5000
      },
      message: 'Construction project on schedule',
      description: 'Metro extension project progressing normally',
      timestamp: new Date(Date.now() - 18 * 60000),
      videoUrl: '/videos/Smart_city_infrastructure_202508200300_y1fx5.mp4'
    },
    
    // Al Sitra
    {
      id: 'alert_sitra_001',
      sector: 'environment',
      severity: 'low',
      location: {
        name: 'Al Sitra Industrial Area',
        lat: 26.1600,
        lon: 50.4500
      },
      message: 'Environmental monitoring - Normal levels',
      description: 'Industrial emissions within acceptable limits',
      timestamp: new Date(Date.now() - 25 * 60000),
      videoUrl: '/videos/15_environmental_monitoring_202508200301_46l.mp4'
    }
  ];

  return alerts;
}

// Get alerts by sector
export function getAlertsBySector(sector) {
  const allAlerts = generateBahrainAlerts();
  return allAlerts.filter(alert => alert.sector === sector);
}

// Get alerts by severity
export function getAlertsBySeverity(severity) {
  const allAlerts = generateBahrainAlerts();
  return allAlerts.filter(alert => alert.severity === severity);
}

// Get alert statistics
export function getAlertStatistics() {
  const allAlerts = generateBahrainAlerts();

  const stats = {
    total: allAlerts.length,
    bySeverity: {
      low: allAlerts.filter(a => a.severity === 'low').length,
      medium: allAlerts.filter(a => a.severity === 'medium').length,
      high: allAlerts.filter(a => a.severity === 'high').length
    },
    bySector: {}
  };

  sectors.forEach(sector => {
    if (sector.id !== 'all') {
      stats.bySector[sector.id] = allAlerts.filter(a => a.sector === sector.id).length;
    }
  });

  return stats;
}

// Format alert for display
export function formatAlertForDisplay(alert) {
  const now = new Date();
  const elapsed = now - new Date(alert.timestamp);
  const minutes = Math.floor(elapsed / 60000);
  
  let timeStr;
  if (minutes < 1) {
    timeStr = 'just now';
  } else if (minutes < 60) {
    timeStr = `${minutes}m ago`;
  } else {
    const hours = Math.floor(minutes / 60);
    timeStr = `${hours}h ago`;
  }

  return {
    ...alert,
    timeString: timeStr,
    colorClass: `severity-${alert.severity}`
  };
}
