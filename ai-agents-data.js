// AI Agents Mock Data Generator for Bahrain Smart City TruContext Platform
// Powered by Visium Technologies

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - random(0, daysAgo));
  date.setHours(random(0, 23), random(0, 59), random(0, 59));
  return date;
};

// AI Models (TruContext-powered)
const aiModels = [
  { id: 'trucontext-v2', name: 'TruContext AI v2', provider: 'Visium Technologies', cost: 0.02 },
  { id: 'trucontext-lite', name: 'TruContext Lite', provider: 'Visium Technologies', cost: 0.005 },
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', cost: 0.03 },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', cost: 0.015 },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', cost: 0.00025 }
];

// Agent types for Bahrain Smart City
const agentTypes = [
  'infrastructure-monitor',
  'system-analyzer', 
  'pattern-detector',
  'response-coordinator'
];

// Bahrain sectors
const sectors = [
  'cybersecurity',
  'traffic',
  'environment',
  'water',
  'energy',
  'health',
  'infrastructure'
];

// Agent roles specific to Bahrain Smart City
const agentRoles = [
  'Traffic Flow Optimizer',
  'Water Quality Monitor',
  'Energy Grid Analyzer',
  'Healthcare Alert Specialist',
  'Environmental Sensor Monitor',
  'Cybersecurity Guardian',
  'Infrastructure Project Tracker',
  'Public Safety Coordinator',
  'Smart Building Manager',
  'Emergency Response Analyst'
];

const agentNicknames = [
  'Sentinel', 'Guardian', 'Watcher', 'Analyzer', 'Monitor',
  'Detector', 'Protector', 'Tracker', 'Scout', 'Observer'
];

// Activity types for Bahrain sectors
const activityActions = {
  cybersecurity: [
    'detected network intrusion attempt',
    'blocked malicious traffic',
    'identified security vulnerability',
    'mitigated DDoS attack'
  ],
  traffic: [
    'optimized signal timing',
    'detected congestion pattern',
    'rerouted traffic flow',
    'identified parking violation'
  ],
  environment: [
    'detected air quality anomaly',
    'monitored dust storm risk',
    'tracked pollution levels',
    'analyzed weather patterns'
  ],
  water: [
    'detected pipe leak',
    'monitored water quality',
    'optimized distribution',
    'identified consumption spike'
  ],
  energy: [
    'balanced grid load',
    'optimized solar generation',
    'detected power anomaly',
    'managed peak demand'
  ],
  health: [
    'monitored ICU capacity',
    'detected health alert',
    'optimized resource allocation',
    'tracked outbreak patterns'
  ],
  infrastructure: [
    'monitored project progress',
    'detected structural anomaly',
    'optimized maintenance schedule',
    'tracked contractor performance'
  ]
};

const activityCategories = [
  'Alert',
  'Optimization',
  'Detection',
  'Prevention',
  'Analysis',
  'Response'
];

const severityLevels = ['low', 'medium', 'high', 'critical'];

// Bahrain locations
const locations = [
  'Manama', 'Muharraq', 'Riffa', 'Hamad Town', 'Isa Town',
  'Sitra', 'Budaiya', 'Juffair', 'Adliya', 'Seef'
];

// Generate a single agent
const generateAgent = (id) => {
  const model = aiModels[random(0, aiModels.length - 1)];
  const type = agentTypes[random(0, agentTypes.length - 1)];
  const sector = sectors[random(0, sectors.length - 1)];
  const role = agentRoles[random(0, agentRoles.length - 1)];
  const nickname = agentNicknames[random(0, agentNicknames.length - 1)];
  const efficiency = random(60, 99);
  const accuracy = random(75, 99);
  const falsePositiveRate = random(1, 12);
  const location = locations[random(0, locations.length - 1)];
  
  const actions = activityActions[sector];
  const currentTask = actions[random(0, actions.length - 1)];
  
  return {
    id: `agent-${id}`,
    name: `Agent-${id}`,
    nickname: `${nickname}-${id}`,
    status: ['idle', 'active', 'investigating', 'responding'][random(0, 3)],
    model: model.id,
    modelName: model.name,
    modelProvider: model.provider,
    role,
    sector,
    location,
    purpose: `Specialized in ${sector} monitoring for Bahrain Smart City infrastructure`,
    currentTask,
    type,
    priority: ['low', 'medium', 'high', 'critical'][random(0, 3)],
    
    // Performance metrics
    findings: random(10, 200),
    alertsRaised: random(5, 50),
    efficiency,
    accuracy,
    responseTime: random(500, 4000), // milliseconds
    falsePositiveRate,
    
    // Resource usage
    tokenUsage: random(5000, 50000),
    maxTokens: 100000,
    tokenCost: parseFloat((random(10, 500) / 10).toFixed(2)),
    
    // Timestamps
    createdAt: randomDate(30),
    lastActive: randomDate(1),
    
    // Configuration
    promptTemplate: `You are monitoring ${sector} systems in ${location}, Bahrain. Your role is ${role}. Focus on ${currentTask}.`,
    integrations: ['Neo4j', 'TruContext', 'Smart Sensors'].slice(0, random(1, 3)),
    
    // Collaboration
    avgRating: parseFloat((random(35, 50) / 10).toFixed(1)),
    collaborationCount: random(0, 15)
  };
};

// Generate multiple agents
const generateAgents = (count = 40) => {
  return Array.from({ length: count }, (_, i) => generateAgent(i + 1));
};

// Generate activity log entry
const generateActivity = () => {
  const agentId = random(1, 40);
  const sector = sectors[random(0, sectors.length - 1)];
  const actions = activityActions[sector];
  const action = actions[random(0, actions.length - 1)];
  const category = activityCategories[random(0, activityCategories.length - 1)];
  const severity = severityLevels[random(0, 3)];
  const location = locations[random(0, locations.length - 1)];
  
  return {
    id: `activity-${Date.now()}-${random(1000, 9999)}`,
    timestamp: new Date(),
    agentId: `agent-${agentId}`,
    agentName: `Agent-${agentId}`,
    action,
    sector,
    location,
    target: `${sector.charAt(0).toUpperCase() + sector.slice(1)}-Node-${random(1, 500)}`,
    severity,
    category,
    details: `${action} in ${location} - ${severity} severity ${category.toLowerCase()}`
  };
};

// Generate activity stream
const generateActivityStream = (count = 50) => {
  return Array.from({ length: count }, () => generateActivity())
    .sort((a, b) => b.timestamp - a.timestamp);
};

// Generate KPI metrics
const generateAgentKPIs = (agents) => {
  const activeAgents = agents.filter(a => a.status !== 'idle').length;
  const totalFindings = agents.reduce((sum, a) => sum + a.findings, 0);
  const avgResponseTime = Math.floor(
    agents.reduce((sum, a) => sum + a.responseTime, 0) / agents.length
  );
  const avgEfficiency = Math.floor(
    agents.reduce((sum, a) => sum + a.efficiency, 0) / agents.length
  );
  
  return {
    activeAgents,
    threatsDetected24h: totalFindings,
    avgResponseTime,
    avgEfficiency,
    totalAgents: agents.length,
    idleAgents: agents.length - activeAgents
  };
};

// Get performance level for an agent
const getPerformanceLevel = (agent) => {
  if (agent.efficiency > 80 && agent.falsePositiveRate < 5) return 'high';
  if (agent.efficiency < 60 || agent.falsePositiveRate > 10) return 'needs-attention';
  return 'average';
};

// Export for global use
if (typeof window !== 'undefined') {
  window.AIAgentsData = {
    generateAgent,
    generateAgents,
    generateActivity,
    generateActivityStream,
    generateAgentKPIs,
    getPerformanceLevel,
    aiModels,
    sectors,
    agentTypes
  };
}
