# TruContext Bahrain Interactive Smart City Demo

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Version](https://img.shields.io/badge/Version-2.0-blue)
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

### Interactive Components
- **Real-time Data Simulation**: Dynamic KPI updates with contextual factors
- **Interactive Maps**: Bahrain geographical visualization with heatmaps
- **Network Topology**: Cytoscape-powered relationship mapping
- **Video Feeds**: Integrated dashboard and alert video content
- **Search Functionality**: Global asset and location search
- **Alert Management**: Real-time alert system with severity filtering
- **Time Range Controls**: 24h, 7d, 30d data views
- **Role-based Authentication**: Secure access with user role management

## 🚀 Recent Updates & Fixes

### Layout Optimization (v2.0)
- ✅ **Single Viewport Design**: Optimized for 1920x1080 screens without vertical scrolling
- ✅ **Compact Grid Layout**: 4-column responsive grid with smart card spanning
- ✅ **Component Sizing**: Reduced chart/video heights from 200px to 120px
- ✅ **Spacing Optimization**: Reduced gaps and padding for maximum screen utilization

### Critical Bug Fixes
- ✅ **KPI Data Display**: Fixed "—" placeholder issue, now shows real data on load
- ✅ **Documentation Links**: Corrected URL path from `publc/docs/` to `public/docs/`
- ✅ **Responsive Design**: Enhanced mobile layout with single-column fallback

### Visual Design Improvements
- ✅ **Professional Styling**: Enhanced status indicators with visual dots
- ✅ **Improved Typography**: Optimized font hierarchy and sizing
- ✅ **Better Controls**: Styled demo controls with background and borders
- ✅ **Trend Indicators**: Added color-coded positive/negative trend styling

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
- **Real API Integration**: Connect to actual Bahrain city data sources
- **Advanced Analytics**: Machine learning-powered insights
- **Mobile App**: Native mobile application development
- **Multi-language Support**: Arabic and English localization

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
