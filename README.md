# TruContext Bahrain Interactive Smart City Demo

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-2.1-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

## 🏙️ Project Overview

The **TruContext Bahrain Interactive Smart City Demo** is a comprehensive web-based demonstration platform showcasing advanced smart city analytics and monitoring capabilities for the Kingdom of Bahrain. This interactive dashboard provides real-time insights across multiple urban sectors including cybersecurity, traffic management, environmental monitoring, water systems, energy infrastructure, healthcare, and more.

### Purpose & Target Audience
- **Government Officials**: Strategic decision-making support
- **Urban Planners**: Infrastructure development insights
- **Technology Partners**: Integration capabilities demonstration
- **Stakeholders**: Comprehensive smart city vision presentation

### Key Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Visualization**: Chart.js, Leaflet Maps, Cytoscape.js
- **Authentication**: Role-based access control
- **Deployment**: Vercel platform
- **Media**: Video integration with fallback systems

## ✨ Features Documentation

### Dashboard Views
- **📊 Executive Dashboard**: High-level KPIs and strategic metrics
- **🛡️ Cybersecurity Overview**: Network security monitoring and threat analysis
- **🚦 Traffic Analytics**: Real-time traffic flow and congestion management
- **🌬️ Environment & Air Quality**: Environmental monitoring and pollution tracking
- **💧 Water Management**: Water consumption, leak detection, and quality metrics
- **⚡ Energy & Renewables**: Power grid monitoring and renewable energy tracking
- **🏗️ Infrastructure Projects**: Construction and development progress
- **🏥 Health Monitoring**: Healthcare system performance and public health metrics
- **🤖 AI Agents**: Real-time monitoring and management of AI-powered agents
- **✨ Vibe Context**: AI-assisted creation wizard for custom automations, agents, and dashboard components

### Interactive Components
- **Real-time Data Simulation**: Dynamic KPI updates with contextual factors
- **Interactive Maps**: Bahrain geographical visualization with heatmaps
- **Network Topology**: Cytoscape-powered relationship mapping
- **Video Feeds**: Integrated dashboard and alert video content
- **Search Functionality**: Global asset and location search
- **Alert Management**: Real-time alert system with severity filtering
- **Time Range Controls**: 24h, 7d, 30d data views
- **Role-based Authentication**: Secure access with user role management
- **Vibe Context Marketplace**: Browse and install pre-built automations and agents
- **AI-Assisted Creation Wizard**: Build custom dashboard functionality without coding

## 🚀 Recent Updates & Fixes

### ✨ Vibe Context Feature (v2.1) - NEW!
A groundbreaking AI-assisted platform that allows users to create custom automations, agents, and dashboard functionality without coding. This innovative feature sets TruContext apart from competitors.

**Key Features:**
- 🎯 **Marketplace**: Browse 8+ pre-built automations and agents ready to install
  - Real-time Threat Detection Agent
  - Traffic Flow Optimizer
  - Custom KPI Dashboard Builder
  - Alert Automation Workflow
  - Predictive Analytics Agent
  - Smart Grid Monitor
  - Health Crisis Predictor
  - Infrastructure Health Checker

- 🤖 **AI-Assisted Creation Wizard**: 5-step guided process
  1. Type Selection (Automation, Agent, Visualization, Dashboard)
  2. AI-Powered Suggestions with documentation context awareness
  3. Configuration with type-specific options
  4. Live Preview using ECharts
  5. Deploy & Save with progress persistence

- 💾 **LocalStorage Integration**: Save creations, workspace state, and installed items
- 🎨 **Modern UI**: Glassmorphism effects, smooth animations, and responsive design
- ⚡ **Performance**: Optimized loading, intelligent caching, and smooth transitions

**Technical Highlights:**
- Simulated AI intelligence with realistic thinking animations
- Documentation-aware suggestions (reads from `/docs` directory)
- Component-based architecture for easy extensibility
- Error handling and graceful degradation
- Production-ready with comprehensive error checking

### Layout Optimization (v2.0)
- ✅ **Single Viewport Design**: Optimized for 1920x1080 screens without vertical scrolling
- ✅ **Compact Grid Layout**: 4-column responsive grid with smart card spanning
- ✅ **Component Sizing**: Reduced chart/video heights from 200px to 120px
- ✅ **Spacing Optimization**: Reduced gaps and padding for maximum screen utilization

### Critical Bug Fixes
- ✅ **KPI Data Display**: Fixed "—" placeholder issue, now shows real data on load
- ✅ **Documentation Links**: Corrected URL path from `publc/docs/` to `public/docs/`
- ✅ **Responsive Design**: Enhanced mobile layout with single-column fallback
- ✅ **Script Loading**: Added error handling for missing dependencies
- ✅ **Vue Initialization**: Improved AI Agents dashboard initialization with dependency checks

### Visual Design Improvements
- ✅ **Professional Styling**: Enhanced status indicators with visual dots
- ✅ **Improved Typography**: Optimized font hierarchy and sizing
- ✅ **Better Controls**: Styled demo controls with background and borders
- ✅ **Trend Indicators**: Added color-coded positive/negative trend styling
- ✅ **Vibe Context UI**: Modern design with celebration animations and loading states

## 🛠️ Installation & Setup

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Local web server (Python, Node.js, or similar)
- Git for version control

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/IanNoble-Visium/-BAHRAIN.git
   cd -BAHRAIN
   ```

2. **Start Development Server**
   
   **Option A: Python**
   ```bash
   python -m http.server 8000
   ```
   
   **Option B: Node.js**
   ```bash
   npx serve . -p 8000
   ```
   
   **Option C: PHP**
   ```bash
   php -S localhost:8000
   ```

3. **Access the Application**
   - Open browser to `http://localhost:8000`
   - Navigate to dashboard: `http://localhost:8000/dashboard.html`
   - View documentation: `http://localhost:8000/docs.html`

### Browser Compatibility
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer not supported

## 🔧 Development Workflow

### Understanding Development vs Production Builds

This project uses **Vite** as its build tool, which provides two distinct modes for development and production. Understanding the difference is critical to avoid confusion when testing changes locally.

#### Development Server (`npm run dev`)
- **Port**: `http://localhost:5173/`
- **Purpose**: Fast development with hot module replacement (HMR)
- **How it works**:
  - Serves files on-the-fly without bundling
  - May serve files from the `public/` directory directly
  - Changes to source files auto-reload in the browser
  - Faster startup time but may not reflect production behavior
- **When to use**: Rapid development and testing of individual features

#### Production Preview (`npm run build && npm run preview`)
- **Port**: `http://localhost:4173/`
- **Purpose**: Test the exact production build before deploying
- **How it works**:
  - Runs full Vite build process (bundles, optimizes, minifies)
  - Processes root HTML files (`dashboard.html`, `index.html`)
  - Copies files from `public/` to `dist/` directory
  - Serves the optimized production bundle
- **When to use**: Final testing before deploying to Vercel

#### Why Changes Appear on Vercel but Not Locally

**Common Scenario**: You deploy to Vercel and see your changes, but running `npm run dev` locally doesn't show them.

**Root Cause**:
- Vercel runs `npm run build` which processes files from the **root directory**
- The dev server (`npm run dev`) may serve cached files from the **`public/` directory**
- If you edited root files but the `public/` copies are outdated, dev server shows old versions

**Solution**: Always test with production preview before deploying:
```bash
npm run build && npm run preview
```

---

### Source of Truth: Which Files to Edit

Understanding the file hierarchy is crucial to avoid editing the wrong files and losing work.

#### ✅ **EDIT THESE FILES** (Source of Truth)

These are the **primary source files** that should be edited:

```
📁 Root Directory (Source Files)
├── dashboard.html          ← EDIT THIS (main dashboard HTML)
├── index.html              ← EDIT THIS (landing page HTML)
├── main.js                 ← EDIT THIS (core application logic)
├── styles.css              ← EDIT THIS (main stylesheet)
├── echarts-enhanced.js     ← EDIT THIS (chart utilities)
├── alert-manager.js        ← EDIT THIS (alert system)
├── ai-agents-*.js          ← EDIT THIS (AI agents modules)
├── vibe-context-*.js       ← EDIT THIS (Vibe Context modules)
├── components/
│   ├── Map3D.js            ← EDIT THIS (3D map component)
│   ├── Map3DUI.js          ← EDIT THIS (3D map UI controls)
│   ├── KPICard.js          ← EDIT THIS (KPI components)
│   └── ...                 ← EDIT THIS (other components)
└── data/
    └── bahrain-alerts.js   ← EDIT THIS (alert data)
```

#### ❌ **DO NOT EDIT THESE FILES** (Generated/Copied)

These files are **automatically generated** or **copied** during the build process:

```
📁 public/ Directory (Build Copies)
├── main.js                 ❌ DO NOT EDIT (copied from root)
├── styles.css              ❌ DO NOT EDIT (copied from root)
├── components/             ❌ DO NOT EDIT (copied from root)
├── db/                     ❌ DO NOT EDIT (copied from root)
└── ...                     ❌ DO NOT EDIT (all copied files)

📁 dist/ Directory (Production Build Output)
├── dashboard.html          ❌ DO NOT EDIT (generated by Vite)
├── index.html              ❌ DO NOT EDIT (generated by Vite)
├── assets/                 ❌ DO NOT EDIT (bundled/minified files)
│   ├── main-[hash].js      ❌ DO NOT EDIT (bundled JavaScript)
│   ├── main-[hash].css     ❌ DO NOT EDIT (bundled CSS)
│   └── ...                 ❌ DO NOT EDIT (all generated files)
└── ...                     ❌ DO NOT EDIT (all build output)
```

#### Why This Matters

**The `public/` directory** contains copies of source files that Vite includes in the build "as-is" without processing. These files are copied to `dist/` during `npm run build`.

**The `dist/` directory** is the final production build output that gets deployed to Vercel.

**Critical Rule**:
- ✅ **Always edit files in the root directory**
- ❌ **Never edit files in `public/` or `dist/`**
- 🔄 **After editing root files, copy them to `public/` if needed**

---

### Correct Development Workflow

Follow this workflow to ensure your changes work correctly both locally and in production:

#### Step 1: Make Changes to Source Files

Edit files in the **root directory** (see "Source of Truth" section above):

```bash
# Example: Edit the main dashboard
code dashboard.html

# Example: Edit the 3D map component
code components/Map3DUI.js

# Example: Edit core application logic
code main.js
```

#### Step 2: Copy Updated Files to `public/` Directory

After editing source files, copy them to `public/` so they're included in the build:

```powershell
# PowerShell (Windows)
Copy-Item -Path "main.js" -Destination "public/main.js" -Force
Copy-Item -Path "styles.css" -Destination "public/styles.css" -Force
Copy-Item -Path "components/Map3DUI.js" -Destination "public/components/Map3DUI.js" -Force
```

```bash
# Bash (macOS/Linux)
cp main.js public/main.js
cp styles.css public/styles.css
cp components/Map3DUI.js public/components/Map3DUI.js
```

#### Step 3: Build the Production Bundle

Run the build command to create the optimized production bundle:

```bash
npm run build
```

**Expected Output**:
```
✓ built in 4.21s
dist/dashboard.html                 15.55 kB │ gzip:  3.68 kB
dist/assets/main-[hash].css         39.80 kB │ gzip:  7.57 kB
dist/assets/dashboard-[hash].css    53.11 kB │ gzip:  9.30 kB
dist/assets/main-[hash].js          58.35 kB │ gzip: 17.65 kB
```

#### Step 4: Preview the Production Build Locally

Start the preview server to test the production build:

```bash
npm run preview
```

**Access the preview**:
- 🌐 Dashboard: `http://localhost:4173/dashboard.html`
- 🌐 Landing Page: `http://localhost:4173/`

#### Step 5: Test Your Changes

Thoroughly test all functionality in the production preview:

- ✅ Verify UI elements appear correctly
- ✅ Test interactive features (buttons, sliders, controls)
- ✅ Check console for errors
- ✅ Test different dashboard views
- ✅ Verify responsive design on different screen sizes

#### Step 6: Deploy to Vercel

Once testing is complete, commit and push your changes:

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Fix: Updated camera tilt control and network graph display"

# Push to main branch (triggers Vercel deployment)
git push origin main
```

**Vercel will automatically**:
1. Detect the push to `main` branch
2. Run `npm run build`
3. Deploy the `dist/` directory to production
4. Provide a deployment URL

---

### Quick Reference Commands

#### Development Commands

```bash
# Install dependencies (first time setup)
npm install

# Start development server (port 5173)
npm run dev

# Build production bundle
npm run build

# Preview production build locally (port 4173)
npm run preview

# Build and preview in one command
npm run build && npm run preview
```

#### File Management Commands

```powershell
# Copy updated files to public/ (PowerShell - Windows)
Copy-Item -Path "main.js" -Destination "public/main.js" -Force
Copy-Item -Path "components/Map3DUI.js" -Destination "public/components/Map3DUI.js" -Force

# Copy multiple files at once
$files = @("main.js", "styles.css", "alert-manager.js")
foreach ($file in $files) {
    Copy-Item -Path $file -Destination "public/$file" -Force
}
```

```bash
# Copy updated files to public/ (Bash - macOS/Linux)
cp main.js public/main.js
cp components/Map3DUI.js public/components/Map3DUI.js

# Copy multiple files at once
for file in main.js styles.css alert-manager.js; do
    cp $file public/$file
done
```

---

### Common Pitfalls & Solutions

#### ❌ Pitfall 1: Editing Files in `public/` Directory

**Problem**: You edit `public/main.js` directly, and changes work locally but disappear after the next build.

**Why**: The build process copies files FROM root TO `public/`, overwriting your changes.

**Solution**: Always edit the root `main.js`, then copy to `public/main.js`.

---

#### ❌ Pitfall 2: Changes Work on Vercel but Not Locally

**Problem**: You push changes to GitHub, Vercel deploys successfully and shows your updates, but `npm run dev` doesn't show them.

**Why**:
- Vercel runs `npm run build` which processes root files
- Dev server may serve cached files from `public/`
- Root files are updated but `public/` copies are outdated

**Solution**:
1. Copy updated files to `public/`
2. Run `npm run build && npm run preview` to test production build
3. Never rely solely on `npm run dev` for final testing

---

#### ❌ Pitfall 3: Forgetting to Build Before Testing

**Problem**: You make changes to root files but don't see them in the preview.

**Why**: The preview server (`npm run preview`) serves the `dist/` directory, which is only updated when you run `npm run build`.

**Solution**: Always run `npm run build` before `npm run preview`:
```bash
npm run build && npm run preview
```

---

#### ❌ Pitfall 4: Editing Generated Files in `dist/`

**Problem**: You edit `dist/dashboard.html` or `dist/assets/main-[hash].js` and changes disappear.

**Why**: The `dist/` directory is completely regenerated on every build, deleting all manual changes.

**Solution**: Never edit files in `dist/`. Always edit source files in the root directory.

---

### Best Practices Summary

✅ **DO**:
- Edit files in the root directory
- Copy updated files to `public/` after editing
- Run `npm run build && npm run preview` before deploying
- Test in production preview (port 4173) before pushing to Vercel
- Commit both root files and their `public/` copies to Git
- Use descriptive commit messages

❌ **DON'T**:
- Edit files in `public/` or `dist/` directories
- Rely solely on `npm run dev` for testing
- Deploy without testing the production build locally
- Forget to copy updated files to `public/`
- Edit generated files with `[hash]` in their names

---

### Troubleshooting

#### Issue: "My changes don't appear in production preview"

**Checklist**:
1. ✅ Did you edit the root file (not `public/` or `dist/`)?
2. ✅ Did you copy the updated file to `public/`?
3. ✅ Did you run `npm run build`?
4. ✅ Did you restart the preview server (`npm run preview`)?
5. ✅ Did you hard-refresh the browser (Ctrl+Shift+R)?

#### Issue: "Console shows 404 errors for JavaScript files"

**Cause**: Files exist in root but weren't copied to `public/`, so they're missing from the build.

**Solution**:
```powershell
# Copy missing files to public/
Copy-Item -Path "missing-file.js" -Destination "public/missing-file.js" -Force

# Rebuild
npm run build
```

#### Issue: "Changes work locally but not on Vercel"

**Cause**: You tested with `npm run dev` but didn't test the production build.

**Solution**:
1. Run `npm run build && npm run preview`
2. Test at `http://localhost:4173/`
3. If it works there, it will work on Vercel
4. If it doesn't work, check the build output for errors

---

## 📖 Usage Guide

### Authentication System
1. **Access Control**: Dashboard requires role-based authentication
2. **Role Assignment**: Stored in localStorage as `tc_role`
3. **Available Roles**: `admin`, `operator`, `analyst`, `viewer`
4. **Auto-redirect**: Unauthorized users redirected to main site

### Navigation
- **Main Site**: Landing page with project overview
- **Interactive Demo**: Full dashboard experience
- **Documentation**: Project documents and resources

### Dashboard Controls
- **View Selector**: Switch between 8 different sector dashboards
- **Time Range**: Toggle between 24h, 7d, and 30d data views
- **Search**: Global search across assets, alerts, and locations
- **Alert Filtering**: Filter alerts by severity (Low, Medium, High)
- **Map Controls**: Toggle traffic heatmap overlay

## 🏗️ Technical Architecture

### File Structure
```
├── index.html              # Main landing page
├── dashboard.html           # Interactive dashboard
├── docs.html               # Documentation page
├── main.js                 # Core application logic
├── styles.css              # Comprehensive styling
├── vercel.json             # Deployment configuration
├── components/             # Vue.js components
│   ├── AIAgentDashboard.js
│   ├── AgentCard.js
│   ├── KPICard.js
│   └── Map3D.js
├── vibe-context-*.js       # Vibe Context feature modules
│   ├── vibe-context-storage.js
│   ├── vibe-context-ai.js
│   ├── vibe-context-marketplace.js
│   ├── vibe-context-wizard.js
│   ├── vibe-context-main.js
│   └── vibe-context-styles.css
├── ai-agents-*.js          # AI Agents dashboard modules
├── echarts-*.js            # ECharts visualization utilities
├── public/
│   ├── docs/               # Project documentation files
│   ├── images/             # Logo and visual assets
│   ├── videos/             # Dashboard and alert videos
│   └── video-kpis/         # Sector-specific video content
└── README.md               # This file
```

### Key JavaScript Modules
- **`window.tcUtils`**: Utility functions for data processing
- **`window.tcData`**: Sector-specific datasets and KPIs
- **`window.tcState`**: Application state management
- **Chart Initialization**: Chart.js setup and configuration
- **Map Integration**: Leaflet map with Bahrain geography
- **Network Visualization**: Cytoscape.js graph rendering
- **`window.VibeContextStorage`**: LocalStorage wrapper for creations and workspace state
- **`window.VibeContextAI`**: AI simulation engine with knowledge base and intelligent suggestions
- **`window.VibeContextMarketplace`**: Marketplace grid with pre-built examples
- **`window.VibeContextWizard`**: Multi-step creation wizard with AI assistance
- **`window.VibeContextMain`**: Main controller for view switching

### CSS Organization
- **Reset & Base**: Foundational styles and typography
- **Layout System**: Flexbox and Grid-based responsive design
- **Component Styles**: Modular styling for dashboard cards
- **Interactive Elements**: Hover states and transitions
- **Responsive Design**: Mobile-first approach with breakpoints

### Data Flow
1. **Initialization**: State setup and data loading
2. **View Changes**: Dynamic content updates based on selection
3. **Real-time Updates**: Simulated live data with 5-second intervals
4. **Cross-sector Influences**: Realistic data relationships between sectors

## 🚀 Deployment

### Vercel Configuration
The project includes `vercel.json` for seamless deployment:
- **Static Site**: Optimized for static hosting
- **Route Handling**: Proper routing for SPA behavior
- **Asset Optimization**: Automatic compression and caching

### Production Deployment
1. **Connect Repository**: Link GitHub repo to Vercel
2. **Auto-deployment**: Pushes to main branch trigger deployments
3. **Environment Variables**: Configure any required environment settings
4. **Custom Domain**: Optional custom domain configuration

### Performance Considerations
- **Asset Optimization**: Compressed images and videos
- **Lazy Loading**: Deferred loading of non-critical resources
- **Caching Strategy**: Proper cache headers for static assets
- **CDN Integration**: Leverages Vercel's global CDN

## 🔮 Suggested Next Steps

### Feature Enhancements
- **Vibe Context AI Integration**: Connect to OpenAI API for real AI-powered suggestions
- **Real API Integration**: Connect to actual Bahrain city data sources
- **Advanced Analytics**: Machine learning-powered insights
- **Mobile App**: Native mobile application development
- **Multi-language Support**: Arabic and English localization
- **Vibe Context Sharing**: Export/import creations and share marketplace items
- **Advanced Wizard Features**: Custom templates and workflow builder

### Performance Improvements
- **Code Splitting**: Lazy load dashboard components
- **Service Workers**: Offline functionality and caching
- **WebSocket Integration**: True real-time data streaming
- **Progressive Web App**: PWA capabilities for mobile experience

### Additional Integrations
- **IoT Sensors**: Direct sensor data integration
- **Social Media**: Public sentiment analysis
- **Weather APIs**: Real-time weather data integration
- **Traffic APIs**: Live traffic data from local authorities

### Scalability Considerations
- **Microservices Architecture**: Backend service decomposition
- **Database Integration**: Persistent data storage solutions
- **User Management**: Comprehensive authentication system
- **API Gateway**: Centralized API management and security

---

**Developed by**: Visium Technologies  
**Contact**: [ian@noblevision.com](mailto:ian@noblevision.com)  
**Project Repository**: [GitHub](https://github.com/IanNoble-Visium/-BAHRAIN)  
**Live Demo**: [Vercel Deployment](https://bahrain-demo.vercel.app)

*This project demonstrates the future of smart city management through innovative technology and data-driven insights.*
