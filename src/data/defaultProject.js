export const defaultProject = {
  name: 'CivicAsset',
  description: 'Civic Infrastructure Management & Work Order Tracking Platform',
  targetHours: 120,
  tasks: [
    {
      id: 'task-1',
      title: 'Database Schema & Auth Setup',
      description: 'Design relational schema for municipal assets, JWT/OAuth auth flows and RBAC.',
      priority: 'high',
      estimatedMinutes: 90,
      status: 'completed',
      order: 1
    },
    {
      id: 'task-2',
      title: 'Complete Work Order API',
      description: 'Implement CRUD endpoints for maintenance requests, severity levels, and SLA timers.',
      priority: 'high',
      estimatedMinutes: 90,
      status: 'in_progress',
      order: 2
    },
    {
      id: 'task-3',
      title: 'Asset Inventory Management UI',
      description: 'Build interactive data table with server-side pagination, filters, and batch editing.',
      priority: 'high',
      estimatedMinutes: 90,
      status: 'todo',
      order: 3
    },
    {
      id: 'task-4',
      title: 'Geospatial Maps Integration',
      description: 'Integrate Mapbox / Leaflet to visualize infrastructure geo-tags and cluster markers.',
      priority: 'medium',
      estimatedMinutes: 120,
      status: 'todo',
      order: 4
    },
    {
      id: 'task-5',
      title: 'Push Notifications & Webhooks',
      description: 'Real-time alert dispatching when citizen requests are escalated or resolved.',
      priority: 'medium',
      estimatedMinutes: 60,
      status: 'todo',
      order: 5
    },
    {
      id: 'task-6',
      title: 'City Analytics Dashboard',
      description: 'Compute mean time to repair (MTTR), department resolution rates and heatmaps.',
      priority: 'high',
      estimatedMinutes: 90,
      status: 'todo',
      order: 6
    },
    {
      id: 'task-7',
      title: 'AI Damage Classification (USP Feature)',
      description: 'Vision API integration for automatic pothole and road crack severity grading.',
      priority: 'high',
      estimatedMinutes: 120,
      status: 'todo',
      order: 7
    },
    {
      id: 'task-8',
      title: 'End-to-End Testing & Security Audit',
      description: 'Cypress E2E test suite, input validation sanitization, and rate limiting.',
      priority: 'medium',
      estimatedMinutes: 90,
      status: 'todo',
      order: 8
    },
    {
      id: 'task-9',
      title: 'Dockerization & CI/CD Pipeline',
      description: 'Multi-stage Docker builds, GitHub Actions CI workflow, and cloud deployment.',
      priority: 'high',
      estimatedMinutes: 60,
      status: 'todo',
      order: 9
    }
  ]
};
