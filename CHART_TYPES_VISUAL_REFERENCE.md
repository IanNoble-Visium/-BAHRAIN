# Chart Types Visual Reference

## 1. Executive Dashboard - Sunburst Chart ☀️

**Purpose**: Hierarchical system overview showing relationships between components

**Visual Structure**:
```
                    ┌─────────────────┐
                    │   TruContext    │
                    │   (Root)        │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼───┐            ┌───▼───┐           ┌───▼───┐
    │Security│        │Infrastructure│    │Operations│
    │  96%   │        │     88%      │    │   92%    │
    └───┬───┘        └───┬───┘           └───┬───┘
        │                │                    │
    ┌───┴───┬───┐    ┌───┴───┬───┐       ┌───┴───┬───┐
    │Network│Endpoints│Cloud  │Servers│Storage│Network│Monitoring│Alerting│Automation
    │ 45%  │ 35%  │ 16%  │ 40%  │ 35%  │ 13%  │ 50%  │ 30%  │ 12%
```

**Data Format**:
```javascript
{
  name: 'TruContext',
  children: [
    {
      name: 'Security',
      value: 96,
      children: [
        { name: 'Network', value: 45 },
        { name: 'Endpoints', value: 35 }
      ]
    }
  ]
}
```

**Interactions**: Click to drill down, hover for details

---

## 2. Cybersecurity - Sankey Diagram 🔀

**Purpose**: Visualize threat flow through security layers

**Visual Structure**:
```
External Threats ──100──┐
                        ├──85──→ IDS/IPS ──45──→ Quarantined
                        │                  └──40──→ Analyzed
                        └──15──→ Blocked
```

**Data Format**:
```javascript
{
  nodes: [
    { name: 'External Threats' },
    { name: 'Firewall' },
    { name: 'IDS/IPS' },
    { name: 'Blocked' },
    { name: 'Quarantined' },
    { name: 'Analyzed' }
  ],
  links: [
    { source: 0, target: 1, value: 100 },
    { source: 1, target: 2, value: 85 }
  ]
}
```

**Interactions**: Hover to highlight flow, see values

---

## 3. Traffic Analytics - Scatter Matrix 📍

**Purpose**: Analyze correlations between traffic metrics

**Visual Structure**:
```
Y-Axis (Congestion)
  100 │                    ●
      │              ●
   80 │         ●         ●
      │    ●
   60 │
      │
   40 │  ●
      │
   20 │
      └─────────────────────────── X-Axis (Volume)
        0    20    40    60    80   100
```

**Data Format**:
```javascript
[
  [65, 72, 'King Faisal Hwy'],
  [78, 85, 'Sheikh Khalifa Hwy'],
  [45, 52, 'Budaiya Hwy']
]
```

**Interactions**: Hover for location details, zoom/pan

---

## 4. Environment - Polar/Radar Chart 🎯

**Purpose**: Compare multiple pollutant levels across regions

**Visual Structure**:
```
                    PM2.5
                      ▲
                     /│\
                    / │ \
                   /  │  \
                  /   │   \
                 /    │    \
            SO₂ ◄─────●─────► NO₂
                 \    │    /
                  \   │   /
                   \  │  /
                    \ │ /
                     \│/
                      ▼
                    PM10
```

**Data Format**:
```javascript
{
  indicators: [
    { name: 'PM2.5', max: 100 },
    { name: 'PM10', max: 100 },
    { name: 'NO₂', max: 100 },
    { name: 'SO₂', max: 100 },
    { name: 'O₃', max: 100 }
  ],
  data: [
    { name: 'Manama', value: [78, 92, 54, 61, 30] },
    { name: 'Muharraq', value: [65, 78, 48, 52, 25] }
  ]
}
```

**Interactions**: Hover for values, legend toggle

---

## 5. Water Management - Treemap 📦

**Purpose**: Show hierarchical breakdown of water consumption

**Visual Structure**:
```
┌─────────────────────────────────────────┐
│         Water Usage (Total)             │
├──────────────────┬──────────────────────┤
│   Residential    │    Industrial        │
│   (180 units)    │    (220 units)       │
├────┬────┬────────┼──────────┬───────────┤
│Man │Muh │Other   │Desalin  │Manufact  │
│ 65 │ 55 │  60    │  140    │   80     │
└────┴────┴────────┴──────────┴───────────┘
```

**Data Format**:
```javascript
{
  name: 'Water Usage',
  children: [
    {
      name: 'Residential',
      value: 180,
      children: [
        { name: 'Manama', value: 65 }
      ]
    }
  ]
}
```

**Interactions**: Click to drill down, hover for details

---

## 6. Energy - Gauge Chart ⚡

**Purpose**: Display grid load percentage in real-time

**Visual Structure**:
```
        Grid Load Status
              78%

        ╭─────────────╮
       ╱               ╲
      │                 │
      │      ◆ 78%      │
      │                 │
       ╲               ╱
        ╰─────────────╯

    0%    25%    50%    75%   100%
    ├─────┼─────┼─────┼─────┤
    GREEN YELLOW ORANGE RED
```

**Data Format**:
```javascript
{
  value: 78,
  min: 0,
  max: 100,
  title: 'Grid Load Status'
}
```

**Interactions**: Real-time updates, color zones

---

## 7. Infrastructure - Timeline/Gantt 📈

**Purpose**: Show project progress and completion status

**Visual Structure**:
```
Project                Progress
─────────────────────────────────
Airport Expansion      ████████░░ 78%
Metro System           █████░░░░░ 55%
Port Development       ████░░░░░░ 42%
Road Network           █████████░ 88%
Smart City Hub         ██████░░░░ 65%
```

**Data Format**:
```javascript
[
  { name: 'Airport Expansion', value: 78 },
  { name: 'Metro System', value: 55 },
  { name: 'Port Development', value: 42 }
]
```

**Interactions**: Hover for details, see percentages

---

## 8. Health - Bubble Chart 🏥

**Purpose**: Analyze hospital capacity with three dimensions

**Visual Structure**:
```
Occupancy
  100% │
       │        ●(Bahrain Defence)
   80% │    ●(American Mission)
       │
   60% │  ●(Royal Bahrain)
       │
   40% │
       │
   20% │
       │
    0% └─────────────────────────
       0%    25%    50%    75%   100%
              Efficiency

       Bubble Size = Hospital Capacity
```

**Data Format**:
```javascript
[
  [65, 68, 450, 'Salmaniya'],
  [72, 62, 380, 'Royal Bahrain'],
  [58, 75, 320, 'American Mission']
]
```

**Interactions**: Hover for hospital details, zoom/pan

---

## 9. 3D Map View - CesiumJS 🌍

**Purpose**: Interactive 3D map with alert visualization

**Visual Structure**:
```
┌─────────────────────────────────┐
│  3D Map of Bahrain              │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    🌍 Bahrain Terrain     │  │
│  │    ▲ High Severity        │  │
│  │    ● Medium Severity      │  │
│  │    ○ Low Severity         │  │
│  │                           │  │
│  └───────────────────────────┘  │
│  [Ultra] [High-Performance]     │
│  [All Sectors] [Traffic] [...]  │
└─────────────────────────────────┘
```

**Features**:
- Terrain visualization
- Alert markers by severity
- Interactive camera controls
- Sector filtering
- Performance modes

---

## Color Palette

```
Primary Colors (8-color palette):
┌─────────────────────────────────┐
│ #3b82f6 Blue      (Primary)     │
│ #ef4444 Red       (Danger)      │
│ #10b981 Green     (Success)     │
│ #f59e0b Amber     (Warning)     │
│ #8b5cf6 Purple    (Info)        │
│ #ec4899 Pink      (Secondary)   │
│ #14b8a6 Teal      (Tertiary)    │
│ #f97316 Orange    (Accent)      │
└─────────────────────────────────┘
```

---

## Responsive Behavior

All charts automatically:
- Resize on window change
- Adapt to mobile screens
- Maintain aspect ratio
- Preserve interactivity
- Optimize for touch

---

## Animation Effects

- **Entrance**: Smooth fade-in on chart load
- **Data Update**: Smooth transition on value change
- **Hover**: Highlight and tooltip on mouse over
- **Click**: Drill-down with animation (Sunburst, Treemap)
- **Resize**: Smooth re-layout on window resize

---

**Last Updated**: 2025-11-02
**Status**: ✅ COMPLETE
