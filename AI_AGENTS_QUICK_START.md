# AI Agents Dashboard - Quick Start Guide

## Accessing the Dashboard

### Step 1: Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5173`

### Step 2: Navigate to Dashboard
1. Open `http://localhost:5173/dashboard.html` in your browser
2. You'll be redirected to login if not authenticated
3. Select a role to access the dashboard

### Step 3: Select AI Agents View
1. In the "View" dropdown at the top, select **"🤖 AI Agents"**
2. The AI Agents Dashboard will load with real-time data

## Dashboard Overview

### Top Section: KPI Cards
Four key performance indicators:
- **Active Agents**: Number of agents currently active
- **Threats Detected (24h)**: Total security findings
- **Avg Response Time**: Average response time in milliseconds
- **Agent Efficiency**: Overall performance percentage

### Left Panel: Agent Status Panel
- **Grid of 40 AI Agents** with:
  - Agent ID and status badge
  - Nickname and role
  - Sector and location
  - Current task
  - Model information
  - Performance indicator (🟢 High, 🟡 Average, 🔴 Needs Attention)
  - Efficiency percentage

### Filtering Agents
1. **Search**: Type agent nickname or role in search box
2. **Status Filter**: Select from Active, Idle, Investigating, Responding
3. **Sector Filter**: Select from Cybersecurity, Infrastructure, Environment, Health, etc.
4. **Clear Filters**: Click "Clear Filters" button to reset

### Middle Panel: Performance Metrics
Real-time performance visualization:
- **Average Efficiency**: Percentage bar chart
- **Average Accuracy**: Percentage bar chart
- **Active Agents**: Ratio of active to total agents

### Right Panel: Live Activity Feed
Real-time activity stream showing:
- **Severity Level**: Color-coded (Red, Orange, Yellow, Blue)
- **Agent Name**: Which agent performed the action
- **Action**: What the agent did
- **Sector & Location**: Where the action occurred
- **Time**: Relative time (e.g., "5m ago")

## Viewing Agent Details

### To View Full Agent Information:
1. Click on any **Agent Card** in the grid
2. A modal will open showing:
   - Overview (ID, status, role, sector, location)
   - Performance Metrics (efficiency, accuracy, response time)
   - Model & Configuration (model, provider, token usage)
   - Resource Usage (current task, priority, type)
   - Integrations (connected systems)
   - Prompt Template (agent instructions)
   - Collaboration metrics

### To Close the Modal:
- Click the **×** button in the top-right corner
- Or click outside the modal on the overlay

## Real-time Updates

The dashboard updates automatically every 3 seconds:
- Agent metrics change dynamically
- New activities appear in the feed
- KPI values recalculate
- Performance indicators update

## Bahrain Theme

The dashboard uses Bahrain's national colors:
- **Primary Red**: #CE1126 (Bahrain Red)
- **White**: #FFFFFF (Secondary)
- **Dark Background**: #1a1a1a

### Visual Elements with Bahrain Theme:
- Red accent lines on panel titles
- Red borders on agent cards
- Red status badges
- Red buttons with hover effects
- Red modal header border
- Red focus states on inputs

## Testing the Dashboard

### Run the Test Suite:
1. Navigate to `http://localhost:5173/test-ai-agents.html`
2. View test results for:
   - Vue.js framework
   - Data generation
   - Vue components
   - Bahrain theme styling
   - Dashboard integration

### Manual Testing Checklist:
- [ ] Dashboard loads with 40 agents
- [ ] KPI cards display correct values
- [ ] Agent grid shows all agents
- [ ] Search filtering works
- [ ] Status filtering works
- [ ] Sector filtering works
- [ ] Clear filters button works
- [ ] Performance metrics update
- [ ] Activity feed shows new items
- [ ] Clicking agent opens detail modal
- [ ] Modal displays all information
- [ ] Modal closes properly
- [ ] Real-time updates occur every 3 seconds
- [ ] Bahrain red theme visible throughout
- [ ] Responsive design works on mobile

## Keyboard Shortcuts

- **Esc**: Close agent detail modal
- **Enter**: Submit search query

## Troubleshooting

### Dashboard Not Loading
1. Check browser console for errors (F12)
2. Verify server is running (`npm run dev`)
3. Clear browser cache and reload
4. Check that all component files exist in `/components` folder

### No Agents Showing
1. Verify `ai-agents-data.js` is loaded
2. Check browser console for JavaScript errors
3. Ensure Vue.js CDN is accessible
4. Try refreshing the page

### Styling Issues
1. Verify `ai-agents-styles.css` is linked in HTML
2. Check that `styles.css` is also loaded
3. Clear browser cache
4. Check for CSS conflicts in browser DevTools

### Real-time Updates Not Working
1. Check browser console for errors
2. Verify JavaScript is enabled
3. Check that Vue app is mounted correctly
4. Try refreshing the page

## Performance Tips

- The dashboard is optimized for modern browsers
- Real-time updates use efficient Vue reactivity
- Agent grid is virtualized for smooth scrolling
- Styles are optimized for fast rendering

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Next Steps

1. **Explore Agent Data**: Click through different agents to understand their roles
2. **Monitor Activity**: Watch the activity feed for real-time events
3. **Analyze Metrics**: Review performance metrics to identify trends
4. **Filter & Search**: Use filters to find specific agents or sectors

## Support

For issues or questions:
1. Check the test suite at `test-ai-agents.html`
2. Review browser console for error messages
3. Check `AI_AGENTS_IMPLEMENTATION_SUMMARY.md` for technical details
4. Verify all files are in correct locations

---

**Last Updated**: November 2, 2025
**Status**: ✅ Ready for Production

