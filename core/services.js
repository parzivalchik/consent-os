const DATA_TYPES = {
  IDENTITY: { id: 'identity', name: 'Identity', icon: 'user', description: 'Personal identifying information' },
  LOCATION: { id: 'location', name: 'Location', icon: 'map-pin', description: 'Geographic position and movement' },
  ACTIVITY: { id: 'activity', name: 'Activity History', icon: 'clock', description: 'Browsing and usage patterns' },
  FINANCIAL: { id: 'financial', name: 'Financial', icon: 'credit-card', description: 'Payment and transaction data' },
  EDUCATIONAL: { id: 'educational', name: 'Educational', icon: 'book-open', description: 'Academic records and progress' },
  CONTACT: { id: 'contact', name: 'Contact', icon: 'users', description: 'Friends and communication contacts' },
  DEVICE: { id: 'device', name: 'Device', icon: 'smartphone', description: 'Device information and identifiers' }
};

const CATEGORIES = {
  EDUCATIONAL: { id: 'educational', name: 'Educational', color: '#8b5cf6' },
  GOVERNMENT: { id: 'government', name: 'Government', color: '#3b82f6' },
  DELIVERY: { id: 'delivery', name: 'Delivery', color: '#f97316' },
  SOCIAL: { id: 'social', name: 'Social', color: '#ec4899' },
  FINANCE: { id: 'finance', name: 'Finance', color: '#22c55e' },
  SHOPPING: { id: 'shopping', name: 'Shopping', color: '#eab308' }
};

const RISK_LEVELS = {
  LOW: { id: 'low', label: 'Low Risk', color: '#22c55e' },
  MEDIUM: { id: 'medium', label: 'Medium Risk', color: '#eab308' },
  HIGH: { id: 'high', label: 'High Risk', color: '#ef4444' }
};

const DEFAULT_SERVICES = [
  {
    id: 'canvas-lms',
    name: 'Canvas LMS',
    category: 'educational',
    logo: '🎓',
    description: 'Learning Management System for academic institutions',
    dataTypes: ['educational', 'contact', 'activity'],
    riskLevel: 'medium',
    grantedAt: '2024-09-01T10:00:00Z',
    lastAccessed: '2026-04-20T14:30:00Z',
    reason: 'Required for course access and grade submission',
    privacyUrl: 'https://www.instructure.com/privacy',
    active: true
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    category: 'educational',
    logo: '📚',
    description: 'Google\'s classroom management platform',
    dataTypes: ['educational', 'identity', 'contact'],
    riskLevel: 'low',
    grantedAt: '2024-08-15T09:00:00Z',
    lastAccessed: '2026-04-21T08:15:00Z',
    reason: 'School-issued account for assignments and communication',
    privacyUrl: 'https://policies.google.com/privacy',
    active: true
  },
  {
    id: 'state-portal',
    name: 'State Services Portal',
    category: 'government',
    logo: '🏛️',
    description: 'Official state government services portal',
    dataTypes: ['identity', 'financial', 'location', 'device'],
    riskLevel: 'high',
    grantedAt: '2023-11-20T11:00:00Z',
    lastAccessed: '2026-04-19T16:45:00Z',
    reason: 'Required for state benefits and tax filing',
    privacyUrl: 'https://www.state.gov/privacy',
    active: true
  },
  {
    id: 'dmv-online',
    name: 'DMV Online',
    category: 'government',
    logo: '🚗',
    description: 'Department of Motor Vehicles online services',
    dataTypes: ['identity', 'location', 'device'],
    riskLevel: 'medium',
    grantedAt: '2024-03-10T14:00:00Z',
    lastAccessed: '2026-04-15T10:20:00Z',
    reason: 'License renewal and vehicle registration',
    privacyUrl: 'https://www.dmv.org/privacy',
    active: true
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    category: 'delivery',
    logo: '🍔',
    description: 'Food delivery service',
    dataTypes: ['location', 'financial', 'contact', 'activity'],
    riskLevel: 'high',
    grantedAt: '2025-01-05T18:00:00Z',
    lastAccessed: '2026-04-21T12:00:00Z',
    reason: 'Order delivery and payment processing',
    privacyUrl: 'https://www.doordash.com/privacy',
    active: true
  },
  {
    id: 'uber-eats',
    name: 'Uber Eats',
    category: 'delivery',
    logo: '🛵',
    description: 'Food and grocery delivery platform',
    dataTypes: ['location', 'financial', 'contact', 'activity'],
    riskLevel: 'high',
    grantedAt: '2024-06-12T19:30:00Z',
    lastAccessed: '2026-04-20T20:15:00Z',
    reason: 'Food delivery and address verification',
    privacyUrl: 'https://www.uber.com/privacy',
    active: true
  }
];

export class Services {
  constructor(storage) {
    this.storage = storage;
    this.dataTypes = DATA_TYPES;
    this.categories = CATEGORIES;
    this.riskLevels = RISK_LEVELS;
  }

  getDataTypes() {
    return Object.values(this.dataTypes);
  }

  getCategories() {
    return Object.values(this.categories);
  }

  getRiskLevels() {
    return Object.values(this.riskLevels);
  }

  async initializeDefaults() {
    const initialized = await this.storage.get('consent_os_initialized');
    if (!initialized) {
      await this.storage.set('consent_os_services', DEFAULT_SERVICES);
      await this.storage.set('consent_os_history', []);
      await this.storage.set('consent_os_initialized', true);
    }
  }

  async getServices() {
    const services = await this.storage.get('consent_os_services') || [];
    return services.filter(s => s.active);
  }

  async getAllServices() {
    return await this.storage.get('consent_os_services') || [];
  }

  async getServiceDetail(id) {
    const services = await this.storage.get('consent_os_services') || [];
    const service = services.find(s => s.id === id);
    if (!service) return null;

    const dataTypes = service.dataTypes.map(dt => this.dataTypes[dt.toUpperCase()] || { id: dt, name: dt, description: '' });
    const category = this.categories[service.category.toUpperCase()] || { id: service.category, name: service.category };
    const riskLevel = this.riskLevels[service.riskLevel.toUpperCase()] || { id: 'unknown', label: 'Unknown', color: '#6b7280' };

    return { ...service, dataTypes, category, riskLevel };
  }

  async revokeService(id) {
    const services = await this.storage.get('consent_os_services') || [];
    const serviceIndex = services.findIndex(s => s.id === id);
    
    if (serviceIndex === -1) {
      return { success: false, error: 'Service not found' };
    }

    const service = services[serviceIndex];
    services[serviceIndex] = { ...service, active: false, revokedAt: new Date().toISOString() };
    
    await this.storage.set('consent_os_services', services);

    const history = await this.storage.get('consent_os_history') || [];
    history.unshift({
      id: `revoke-${Date.now()}`,
      type: 'revoke',
      serviceId: service.id,
      serviceName: service.name,
      timestamp: new Date().toISOString(),
      dataTypes: service.dataTypes,
      category: service.category
    });
    await this.storage.set('consent_os_history', history);

    return { success: true, message: `${service.name} access has been revoked` };
  }

  async getHistory() {
    return await this.storage.get('consent_os_history') || [];
  }

  async getStats() {
    const services = await this.getServices();
    const highRisk = services.filter(s => s.riskLevel === 'high').length;
    const mediumRisk = services.filter(s => s.riskLevel === 'medium').length;
    const lowRisk = services.filter(s => s.riskLevel === 'low').length;

    const categoryCount = {};
    services.forEach(s => {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
    });

    return {
      totalServices: services.length,
      highRisk,
      mediumRisk,
      lowRisk,
      categoryCount,
      dataTypesCount: [...new Set(services.flatMap(s => s.dataTypes))].length
    };
  }
}