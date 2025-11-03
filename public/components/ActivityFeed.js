/**
 * Activity Feed Component (Vue 3)
 * Displays real-time activity stream from AI agents
 */

const ActivityFeed = {
  template: `
    <div class="activity-feed">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-header">
          <span class="activity-severity" :class="'severity-' + activity.severity">
            {{ activity.severity }}
          </span>
          <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
        </div>

        <div class="activity-content">
          <div class="activity-agent">{{ activity.agentName }}</div>
          <div class="activity-action">{{ activity.action }}</div>
          <div class="activity-meta">
            <span class="activity-sector">{{ activity.sector }}</span>
            <span class="activity-location">{{ activity.location }}</span>
          </div>
        </div>
      </div>

      <div v-if="activities.length === 0" style="text-align: center; padding: 20px; color: #9ca3af;">
        No recent activities
      </div>
    </div>
  `,

  props: {
    activities: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      return date.toLocaleDateString();
    }
  }
};

