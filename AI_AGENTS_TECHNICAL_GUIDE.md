# AI Agents Dashboard - Technical Guide

## Architecture Overview

### Technology Stack
- **Framework**: Vue.js 3 (via CDN)
- **Styling**: CSS3 with Bahrain theme
- **Data**: Mock data generation (ai-agents-data.js)
- **Build**: Vite (existing setup)
- **Browser**: Modern browsers with ES6+ support

### Component Hierarchy
```
AIAgentDashboard (root)
├── KPICard (×4)
├── AgentCard (×40)
├── ActivityFeed
├── AgentDetailModal
└── Performance Metrics (inline)
```

## Component Details

### AIAgentDashboard.js
**Purpose**: Main dashboard container and state management

**Key Methods**:
- `initializeDashboard()`: Load initial data
- `updateData()`: Update metrics every 3 seconds
- `selectAgent(agent)`: Open detail modal
- `clearFilters()`: Reset all filters

**Computed Properties**:
- `filteredAgents`: Filter agents by search/status/sector
- `hasFilters`: Check if any filters active
- `kpiCards`: Format KPI data for display
- `recentActivities`: Get last 10 activities
- `avgEfficiency`: Calculate average efficiency
- `avgAccuracy`: Calculate average accuracy
- `activeAgentCount`: Count active agents

**Data Properties**:
- `agents`: Array of 40 agents
- `activities`: Array of activities
- `kpis`: KPI metrics object
- `searchQuery`: Search input value
- `filterStatus`: Status filter value
- `filterSector`: Sector filter value
- `selectedAgent`: Currently selected agent
- `updateInterval`: Interval ID for updates

### KPICard.js
**Purpose**: Display key performance indicator

**Props**:
- `title` (String): Card title
- `value` (String|Number): Main value
- `subtitle` (String): Subtitle text
- `trend` (String): Trend indicator (+12%, -15%)
- `icon` (String): Emoji icon
- `color` (String): Color variant (green, red, blue, purple)

**Computed Properties**:
- `trendClass`: Determine if trend is positive/negative

### AgentCard.js
**Purpose**: Display individual agent information

**Props**:
- `agent` (Object): Agent data object

**Computed Properties**:
- `performanceLevel`: Determine performance level
- `performanceLabel`: Format performance label

**Events**:
- `@click`: Emit click event to parent

### ActivityFeed.js
**Purpose**: Display real-time activity stream

**Props**:
- `activities` (Array): Array of activity objects

**Methods**:
- `formatTime(timestamp)`: Format relative time

### AgentDetailModal.js
**Purpose**: Display comprehensive agent information

**Props**:
- `agent` (Object): Agent data object

**Events**:
- `@close`: Emit close event to parent

**Methods**:
- `formatDate(date)`: Format date string

## Data Structure

### Agent Object
```javascript
{
  id: "agent-1",
  name: "Agent-1",
  nickname: "Sentinel-1",
  status: "active", // idle, investigating, responding
  model: "trucontext-v2",
  modelName: "TruContext AI v2",
  modelProvider: "Visium Technologies",
  role: "Traffic Flow Optimizer",
  sector: "traffic",
  location: "Manama",
  purpose: "Specialized in traffic monitoring...",
  currentTask: "optimized signal timing",
  type: "infrastructure-monitor",
  priority: "high",
  
  // Performance metrics
  findings: 45,
  alertsRaised: 12,
  efficiency: 87,
  accuracy: 92,
  responseTime: 1200,
  falsePositiveRate: 3,
  
  // Resource usage
  tokenUsage: 25000,
  maxTokens: 100000,
  tokenCost: 2.50,
  
  // Timestamps
  createdAt: Date,
  lastActive: Date,
  
  // Configuration
  promptTemplate: "You are a Traffic Flow Optimizer...",
  integrations: ["Neo4j", "TruContext"],
  
  // Collaboration
  avgRating: 4.5,
  collaborationCount: 8
}
```

### Activity Object
```javascript
{
  id: "activity-1234567890-5678",
  timestamp: Date,
  agentId: "agent-1",
  agentName: "Agent-1",
  action: "optimized signal timing",
  sector: "traffic",
  location: "Manama",
  target: "Traffic-Node-123",
  severity: "info", // critical, warning, info
  category: "optimization",
  details: "optimized signal timing in Manama - info severity optimization"
}
```

### KPI Object
```javascript
{
  activeAgents: 28,
  threatsDetected24h: 1245,
  avgResponseTime: 1850,
  avgEfficiency: 85,
  totalAgents: 40,
  idleAgents: 12
}
```

## Styling System

### CSS Variables (Bahrain Theme)
```css
--bahrain-red: #CE1126
--bahrain-white: #ffffff
--bahrain-dark: #1a1a1a
```

### Color Palette
- **Primary**: #CE1126 (Bahrain Red)
- **Success**: #10b981 (Green)
- **Warning**: #fbbf24 (Yellow)
- **Error**: #ef4444 (Red)
- **Info**: #3b82f6 (Blue)
- **Background**: #1a1a1a (Dark)
- **Surface**: #0a0a0a (Darker)
- **Text**: #ffffff (White)
- **Muted**: #9ca3af (Gray)

### CSS Classes

#### Layout
- `.ai-agents-container`: Main container
- `.ai-agents-main-grid`: 2-column layout
- `.agents-panel`: Left column
- `.activity-panel`: Right column

#### Cards
- `.panel-card`: Card container
- `.agent-card`: Individual agent card
- `.kpi-card`: KPI card

#### Status Badges
- `.status-active`: Green badge
- `.status-idle`: Gray badge
- `.status-investigating`: Yellow badge
- `.status-responding`: Red badge

#### Performance Indicators
- `.perf-high`: Green indicator
- `.perf-average`: Yellow indicator
- `.perf-needs-attention`: Red indicator

## Real-time Update System

### Update Cycle (3 seconds)
1. Update agent metrics (efficiency, accuracy, response time)
2. Generate new activity
3. Recalculate KPI values
4. Vue reactivity triggers re-render

### Update Logic
```javascript
updateInterval = setInterval(() => {
  // Update agent metrics with random variation
  this.agents.forEach(agent => {
    agent.efficiency = Math.max(60, Math.min(99, 
      agent.efficiency + (Math.random() - 0.5) * 5
    ));
    // ... similar for accuracy and responseTime
  });
  
  // Add new activity
  const newActivity = window.AIAgentsData.generateActivity();
  this.activities.unshift(newActivity);
  if (this.activities.length > 50) {
    this.activities.pop();
  }
  
  // Recalculate KPIs
  this.kpis = window.AIAgentsData.generateAgentKPIs(this.agents);
}, 3000);
```

## Integration Points

### With Existing Dashboard
1. **View Selector**: Detects "aiagents" view selection
2. **Container**: Uses `#ai-agents-app` div
3. **Styling**: Inherits from `styles.css` and `ai-agents-styles.css`
4. **Data**: Uses `ai-agents-data.js` for mock data

### With Vue.js
1. **CDN Loading**: Vue loaded from unpkg CDN
2. **App Initialization**: Triggered on DOMContentLoaded
3. **Component Registration**: All components registered globally
4. **Mounting**: App mounted to `#ai-agents-app` container

## Performance Considerations

### Optimization Techniques
1. **Computed Properties**: Cached calculations
2. **Event Delegation**: Single event listener for grid
3. **Efficient Filtering**: Array filter methods
4. **CSS Transitions**: GPU-accelerated animations
5. **Lazy Loading**: Components loaded on demand

### Bundle Size
- Vue.js 3: ~34KB (gzipped)
- Components: ~15KB (total)
- Styles: ~50KB (total)
- **Total**: ~99KB (minimal impact)

## Browser Compatibility

### Supported Browsers
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+
- Mobile browsers (iOS Safari 10+, Chrome Mobile)

### Required Features
- ES6+ support
- CSS Grid
- CSS Flexbox
- CSS Custom Properties
- Promise support

## Development Workflow

### Adding New Features
1. Create new component in `/components` folder
2. Export component as global object
3. Import in `dashboard.html`
4. Register in AIAgentDashboard component
5. Add to template

### Modifying Styles
1. Update `ai-agents-styles.css` for AI Agents specific
2. Update `styles.css` for global dashboard
3. Use Bahrain theme colors (#CE1126)
4. Test on multiple browsers

### Testing Changes
1. Run `npm run dev`
2. Open `http://localhost:5173/test-ai-agents.html`
3. Verify all tests pass
4. Test in dashboard.html with "AI Agents" view

## Debugging

### Browser DevTools
1. **Console**: Check for JavaScript errors
2. **Network**: Verify all files load
3. **Elements**: Inspect component structure
4. **Vue DevTools**: Install Vue 3 extension

### Common Issues
- Vue not loading: Check CDN URL
- Components not found: Verify script order
- Styling not applied: Check CSS specificity
- Updates not working: Check interval ID

## Future Enhancements

### Planned Features
1. Agent creation wizard
2. Agent marketplace
3. Advanced collaboration UI
4. Training scenarios
5. Neo4j database integration
6. Real AI model integration
7. Agent-to-agent communication
8. Machine learning optimization

### Extension Points
- Custom agent types
- Additional metrics
- New visualization types
- Integration with external APIs
- Real-time WebSocket updates

---

**Last Updated**: November 2, 2025
**Version**: 1.0
**Status**: Production Ready

