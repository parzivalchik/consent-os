const DATA_TYPE_ICONS = {
  cookies: '🍪',
  history: '📜',
  bookmarks: '🔖',
  downloads: '⬇️',
  topSites: '⭐'
};

const DATA_TYPE_LABELS = {
  cookies: 'Cookies',
  history: 'Browsing History',
  bookmarks: 'Bookmarks',
  downloads: 'Downloads',
  topSites: 'Top Sites'
};

const CATEGORY_COLORS = {
  search: '#00D8FF', social: '#A855F7', shopping: '#FF3366',
  entertainment: '#FF3366', developer: '#00D8FF', finance: '#00FF94',
  education: '#A855F7', news: '#8B949E', travel: '#00D8FF',
  email: '#00D8FF', productivity: '#00FF94', government: '#6E7681',
  health: '#00FF94', gaming: '#A855F7', food: '#FFB800',
  crypto: '#FFB800', dating: '#FF3366', streaming: '#FF3366',
  telecom: '#00D8FF', insurance: '#00FF94', utilities: '#FFB800',
  ad_tech: '#FF3366', cdn: '#A855F7', tracking: '#FF3366',
  fonts: '#00D8FF', cloud: '#00D8FF', newsletter: '#FFB800',
  misc_tools: '#8B949E', security: '#8B949E',
  other: '#6E7681', education2: '#A855F7'
};

const CATEGORY_LOGOS = {
  search: '🔍', social: '👥', shopping: '🛒',
  entertainment: '🎬', developer: '💻', finance: '🏦',
  education: '🎓', news: '📰', travel: '✈️',
  email: '📧', productivity: '📊', government: '🏛️',
  health: '🏥', gaming: '🎮', food: '🍔',
  crypto: '💰', dating: '💕', streaming: '📺',
  telecom: '📱', insurance: '🛡️', utilities: '⚡',
  ad_tech: '📢', cdn: '🔄', tracking: '🖱️',
  fonts: '🔤', cloud: '☁️', newsletter: '📬',
  misc_tools: '🔧', security: '🔒',
  other: '🌐', education2: '🎓'
};

const RISK_COLORS = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#22c55e'
};

class ConsentOSDashboard {
  constructor() {
    this.services = [];
    this.selectedIds = new Set();
    this.expandedId = null;
    
    this.init();
  }

  async init() {
    this.initTheme();
    await this.loadData();
    this.bindEvents();
    this.render();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('consent-os-theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    }
    
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const isLight = document.documentElement.classList.toggle('light-mode');
    localStorage.setItem('consent-os-theme', isLight ? 'light' : 'dark');
  }

  async loadData() {
    try {
      const [services, stats] = await Promise.all([
        this.sendMessage({ type: 'GET_SERVICES' }),
        this.sendMessage({ type: 'GET_STATS' })
      ]);

      this.services = services || [];
      this.stats = stats || {};
    } catch (error) {
      console.error('Failed to load data:', error);
      this.showToast('Failed to load data', 'error');
    }
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.success) {
          resolve(response.data);
        } else {
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    });
  }

  bindEvents() {
    document.getElementById('open-dashboard-btn')?.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
    document.getElementById('refresh-btn').addEventListener('click', () => this.refresh());
    document.getElementById('back-btn').addEventListener('click', () => this.closeDetailPanel());
    document.getElementById('select-all').addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
    document.getElementById('export-btn').addEventListener('click', () => this.exportData());
    document.getElementById('revoke-all-btn').addEventListener('click', () => this.revokeSelected());
    
    document.getElementById('modal-close').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-cancel').addEventListener('click', () => this.closeModal());
    document.getElementById('modal-confirm').addEventListener('click', () => this.confirmModalAction());
    
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });
  }

  async refresh() {
    const btn = document.getElementById('refresh-btn');
    btn.classList.add('spinning');
    
    try {
      await this.sendMessage({ type: 'REFRESH_DATA' });
      await this.loadData();
      this.render();
      this.showToast('Data refreshed', 'success');
    } catch (error) {
      this.showToast('Failed to refresh', 'error');
    }
    
    btn.classList.remove('spinning');
  }

  toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.service-checkbox input');
    checkboxes.forEach(cb => {
      cb.checked = checked;
      const card = cb.closest('.service-card');
      if (checked) {
        this.selectedIds.add(card.dataset.serviceId);
        card.classList.add('selected');
      } else {
        this.selectedIds.delete(card.dataset.serviceId);
        card.classList.remove('selected');
      }
    });
    this.updateBulkActions();
  }

  toggleSelect(serviceId, checked) {
    if (checked) {
      this.selectedIds.add(serviceId);
    } else {
      this.selectedIds.delete(serviceId);
    }
    this.updateBulkActions();
  }

  updateBulkActions() {
    const btn = document.getElementById('revoke-all-btn');
    btn.disabled = this.selectedIds.size === 0;
    
    const selectAll = document.getElementById('select-all');
    selectAll.checked = this.selectedIds.size === this.services.length && this.services.length > 0;
    selectAll.indeterminate = this.selectedIds.size > 0 && this.selectedIds.size < this.services.length;
  }

  exportData() {
    const data = {
      exportDate: new Date().toISOString(),
      privacyScore: this.calculatePrivacyScore(),
      stats: this.stats,
      services: this.services
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consent-os-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    this.showToast('Report exported', 'success');
  }

  async revokeSelected() {
    if (this.selectedIds.size === 0) return;

    const count = this.selectedIds.size;
    this.showModal({
      title: 'Revoke Selected Access',
      message: `Are you sure you want to revoke access for <strong>${count} domain${count > 1 ? 's' : ''}</strong>?`,
      submessage: 'This will clear all cookies and data for the selected domains. This action cannot be undone.',
      icon: 'warning',
      confirmText: 'Revoke All',
      onConfirm: async () => {
        let successCount = 0;
        for (const id of this.selectedIds) {
          try {
            await this.sendMessage({ type: 'REVOKE_SERVICE', payload: { id } });
            successCount++;
          } catch (e) {
            console.error('Failed to revoke:', id, e);
          }
        }
        
        this.closeModal();
        this.showToast(`Revoked access for ${successCount} domain${successCount > 1 ? 's' : ''}`, 'success');
        
        this.selectedIds.clear();
        await this.loadData();
        this.render();
      }
    });
  }

  showModal(options) {
    document.getElementById('modal-title').textContent = options.title;
    document.getElementById('modal-message').innerHTML = options.message;
    document.getElementById('modal-submessage').textContent = options.submessage;
    document.getElementById('modal-confirm').textContent = options.confirmText || 'Confirm';
    
    const iconEl = document.getElementById('modal-icon');
    iconEl.className = 'modal-icon ' + (options.icon || 'warning');
    iconEl.innerHTML = options.icon === 'success' 
      ? '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
      : '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    
    this.modalCallback = options.onConfirm;
    document.getElementById('modal-overlay').classList.add('open');
  }

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    this.modalCallback = null;
  }

  confirmModalAction() {
    if (this.modalCallback) {
      this.modalCallback();
    }
  }

  render() {
    this.renderPrivacyScore();
    this.renderStats();
    this.renderCharts();
    this.renderServices();
  }

  calculatePrivacyScore() {
    if (this.services.length === 0) return 100;
    
    let score = 100;
    
    for (const service of this.services) {
      const risk = service.riskLevel || 'low';
      const cookieCount = service.cookieCount || 0;
      
      if (risk === 'high') score -= 15;
      else if (risk === 'medium') score -= 5;
      
      if (cookieCount > 50) score -= 2;
      else if (cookieCount > 10) score -= 1;
    }
    
    if (this.stats.totalHistory > 100) score -= 10;
    if (this.stats.totalDownloads > 10) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  renderPrivacyScore() {
    const score = this.calculatePrivacyScore();
    const scoreEl = document.getElementById('privacy-score');
    const fillEl = document.getElementById('score-bar-fill');
    
    scoreEl.textContent = score;
    fillEl.style.width = score + '%';
    
    if (score >= 70) {
      scoreEl.style.color = '#22c55e';
    } else if (score >= 40) {
      scoreEl.style.color = '#eab308';
    } else {
      scoreEl.style.color = '#ef4444';
    }
  }

  renderStats() {
    document.getElementById('stat-domains').textContent = this.services.length;
    document.getElementById('stat-cookies').textContent = this.formatNumber(this.stats.totalCookies || 0);
    document.getElementById('stat-history').textContent = this.formatNumber(this.stats.totalHistory || 0);
    
    document.getElementById('risk-high-count').textContent = this.stats.highRisk || 0;
    document.getElementById('risk-medium-count').textContent = this.stats.mediumRisk || 0;
    document.getElementById('risk-low-count').textContent = this.stats.lowRisk || 0;
    
    document.getElementById('permissions-count').textContent = 
      `${this.services.length} service${this.services.length !== 1 ? 's' : ''}`;
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  renderCharts() {
    this.renderCategoryChart();
    this.renderRiskChart();
  }

  renderCategoryChart() {
    const categoryData = {};
    for (const service of this.services) {
      const cat = service.category || 'other';
      categoryData[cat] = (categoryData[cat] || 0) + 1;
    }

    const container = document.getElementById('category-chart');
    if (!container) return;

    const entries = Object.entries(categoryData);
    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    
    if (total === 0) {
      container.innerHTML = '<div class="chart-empty">No data</div>';
      return;
    }

    let gradientParts = [];
    let currentDeg = 0;
    let legendHtml = '';

    entries.forEach(([cat, count], i) => {
      const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
      const percent = (count / total) * 100;
      const deg = (percent / 100) * 360;
      const logo = CATEGORY_LOGOS[cat] || CATEGORY_LOGOS.other;
      
      gradientParts.push(`${color} ${currentDeg}deg ${currentDeg + deg}deg`);
      currentDeg += deg;
      
      legendHtml += `
        <div class="legend-item">
          <span class="legend-dot" style="background: ${color}"></span>
          <span>${logo} ${cat}</span>
        </div>
      `;
    });

    container.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    container.style.borderRadius = '50%';
    container.style.width = '90px';
    container.style.height = '90px';
    container.style.margin = '0 auto';
    
    const legendContainer = document.getElementById('category-legend');
    if (legendContainer) {
      legendContainer.innerHTML = legendHtml;
    }
  }

  renderRiskChart() {
    const high = this.stats.highRisk || 0;
    const medium = this.stats.mediumRisk || 0;
    const low = this.stats.lowRisk || 0;
    const total = high + medium + low;

    const container = document.getElementById('risk-chart');
    if (!container) return;

    if (total === 0) {
      container.innerHTML = '<div class="chart-empty">No data</div>';
      return;
    }

    const maxValue = Math.max(high, medium, low, 1);
    
    const bar = (value, color, label) => {
      const height = maxValue > 0 ? (value / maxValue) * 70 : 0;
      return `
        <div class="bar-container">
          <div class="bar-value">${value}</div>
          <div class="bar-visual">
            <div class="bar-fill ${label.toLowerCase()}" style="height: ${height}px"></div>
          </div>
          <div class="bar-label">${label}</div>
        </div>
      `;
    };

    container.innerHTML = `
      <div class="bar-chart">
        ${bar(high, RISK_COLORS.high, 'High')}
        ${bar(medium, RISK_COLORS.medium, 'Med')}
        ${bar(low, RISK_COLORS.low, 'Low')}
      </div>
    `;
  }

  renderServices() {
    const container = document.getElementById('services-list');
    
    if (!this.services || this.services.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <h3>No Active Permissions</h3>
          <p>No websites have access to your data</p>
        </div>
      `;
      return;
    }

    const sorted = [...this.services].sort((a, b) => {
      const riskOrder = { high: 0, medium: 1, low: 2 };
      const aRisk = riskOrder[a.riskLevel] ?? 3;
      const bRisk = riskOrder[b.riskLevel] ?? 3;
      if (aRisk !== bRisk) return aRisk - bRisk;
      return (b.cookieCount || 0) - (a.cookieCount || 0);
    });

    container.innerHTML = sorted.map(service => {
      const risk = service.riskLevel || 'low';
      const riskLabel = risk === 'high' ? 'High' : risk === 'medium' ? 'Med' : 'Low';
      const clarity = service.clarityScore || { grade: '?', color: '#6b7280' };
      const isExpanded = this.expandedId === service.id;
      const legal = service.legalSummary || {};
      const whatTheyGet = legal.whatTheyGet || [];
      const whatYouGet = legal.whatYouGet || [];
      
      const legalSectionHtml = legal.simplifiedSummary ? `
        <div class="legal-section-wrapper">
          <div class="legal-section">
            <div class="legal-header">
              <div class="detail-section-title">📋 TL;DR - Transparency Summary</div>
              <div class="clarity-score" style="background: ${clarity.color}20; color: ${clarity.color};">
                Clarity: ${clarity.grade} (${clarity.label || 'Unknown'})
              </div>
            </div>
            <div class="legal-summary">
              <strong>What this means:</strong> ${legal.simplifiedSummary || 'No summary available'}
            </div>
            <div class="legal-details">
              <div class="legal-column">
                <div class="legal-label">📤 What THEY get:</div>
                <ul class="legal-list">
                  ${whatTheyGet.length > 0 ? whatTheyGet.map(item => `<li>${item}</li>`).join('') : '<li>Unknown</li>'}
                </ul>
              </div>
              <div class="legal-column">
                <div class="legal-label">📥 What YOU get:</div>
                <ul class="legal-list">
                  ${whatYouGet.length > 0 ? whatYouGet.map(item => `<li>${item}</li>`).join('') : '<li>Unknown</li>'}
                </ul>
              </div>
            </div>
            ${legal.dataRetention ? `<div class="legal-retention"><strong>Data kept:</strong> ${legal.dataRetention}</div>` : ''}
            ${legal.thirdPartySharing ? `<div class="legal-sharing"><strong>Shared with:</strong> ${legal.thirdPartySharing}</div>` : ''}
          </div>
        </div>
      ` : '';
      
      return `
        <div class="service-card ${risk === 'high' ? 'high-risk' : ''} ${isExpanded ? 'expanded' : ''}" data-service-id="${service.id}">
          <div class="service-checkbox">
            <input type="checkbox" ${this.selectedIds.has(service.id) ? 'checked' : ''}>
          </div>
          <div class="service-logo">${service.logo || '🌐'}</div>
          <div class="service-info">
            <div class="service-name">${service.displayName || service.name}</div>
            <div class="service-meta">
              <span>${service.category}</span>
            </div>
          </div>
          <div class="service-stats">
            <div class="service-cookies">${service.cookieCount || 0} cookies</div>
            <div class="service-risk">
              <span class="badge badge-${risk}">${riskLabel}</span>
              <span class="clarity-badge" title="Clarity Score: ${clarity.label || 'Unknown'}" style="background: ${clarity.color}20; color: ${clarity.color};">${clarity.grade}</span>
            </div>
          </div>
          <div class="service-card-expand ${isExpanded ? 'expanded' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          ${legalSectionHtml}
        </div>
      `;
    }).join('');

    container.querySelectorAll('.service-card').forEach(card => {
      const checkbox = card.querySelector('input');
      const serviceId = card.dataset.serviceId;
      
      card.addEventListener('click', (e) => {
        if (e.target !== checkbox && e.target.closest('.service-checkbox')) {
          // Clicked checkbox area - do nothing, let checkbox handler deal with it
        } else if (e.target !== checkbox) {
          this.toggleExpand(serviceId);
        }
      });
      
      checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        card.classList.toggle('selected', e.target.checked);
        this.toggleSelect(serviceId, e.target.checked);
      });
    });
  }
  
  toggleExpand(serviceId) {
    if (this.expandedId === serviceId) {
      this.expandedId = null;
    } else {
      this.expandedId = serviceId;
    }
    this.render();
  }

  async openServiceDetail(serviceId) {
    try {
      const service = await this.sendMessage({ type: 'GET_SERVICE_DETAIL', payload: { id: serviceId } });
      if (!service) return;

      const headerContent = document.getElementById('detail-header-content');
      headerContent.innerHTML = `
        <div class="detail-header-title">
          <span>${service.logo || '🌐'}</span>
          <span>${service.displayName || service.name}</span>
        </div>
        <div class="detail-header-subtitle">${service.category}</div>
      `;

      const bodyContent = document.getElementById('detail-body');
      const dataTypesHtml = (service.dataTypes || []).map(dt => `
        <div class="data-type-item">
          <span class="data-type-icon">${DATA_TYPE_ICONS[dt] || '📁'}</span>
          <span>${DATA_TYPE_LABELS[dt] || dt}</span>
        </div>
      `).join('');

      const clarity = service.clarityScore || { grade: '?', color: '#6b7280', label: 'Unknown' };
      const legal = service.legalSummary || {};
      const whatTheyGet = legal.whatTheyGet || [];
      const whatYouGet = legal.whatYouGet || [];
      
      const legalSectionHtml = legal.simplifiedSummary ? `
        <div class="detail-section legal-section">
          <div class="legal-header">
            <div class="detail-section-title">📋 TL;DR - Transparency Summary</div>
            <div class="clarity-score" style="background: ${clarity.color}20; color: ${clarity.color};">
              Clarity: ${clarity.grade} (${clarity.label || 'Unknown'})
            </div>
          </div>
          <div class="legal-summary">
            <strong>What this means:</strong> ${legal.simplifiedSummary || 'No summary available'}
          </div>
          <div class="legal-details">
            <div class="legal-column">
              <div class="legal-label">📤 What THEY get:</div>
              <ul class="legal-list">
                ${whatTheyGet.length > 0 ? whatTheyGet.map(item => `<li>${item}</li>`).join('') : '<li>Unknown</li>'}
              </ul>
            </div>
            <div class="legal-column">
              <div class="legal-label">📥 What YOU get:</div>
              <ul class="legal-list">
                ${whatYouGet.length > 0 ? whatYouGet.map(item => `<li>${item}</li>`).join('') : '<li>Unknown</li>'}
              </ul>
            </div>
          </div>
          ${legal.dataRetention ? `<div class="legal-retention"><strong>Data kept:</strong> ${legal.dataRetention}</div>` : ''}
          ${legal.thirdPartySharing ? `<div class="legal-sharing"><strong>Shared with:</strong> ${legal.thirdPartySharing}</div>` : ''}
        </div>
      ` : '';

      bodyContent.innerHTML = `
        <div class="detail-section">
          <div class="detail-section-title">Data Access</div>
          <div class="data-type-list">
            ${dataTypesHtml}
          </div>
        </div>
        
        ${legalSectionHtml}
        
        <div class="detail-section">
          <div class="detail-section-title">Statistics</div>
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <div class="detail-info-label">Cookies</div>
              <div class="detail-info-value">${service.cookieCount || 0}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">History</div>
              <div class="detail-info-value">${service.historyCount || 0} pages</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Bookmarks</div>
              <div class="detail-info-value">${service.bookmarkCount || 0}</div>
            </div>
            <div class="detail-info-item">
              <div class="detail-info-label">Risk Level</div>
              <div class="detail-info-value">
                <div class="risk-indicator">
                  <span class="risk-dot-indicator" style="background: ${service.riskLevel?.color || RISK_COLORS.low}"></span>
                  <span>${service.riskLevel?.label || 'Low Risk'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">First Seen</div>
          <div class="detail-description">${service.firstSeen ? this.formatDate(service.firstSeen) : 'Unknown'}</div>
        </div>

        <div class="detail-section">
          <div class="detail-section-title">Last Activity</div>
          <div class="detail-description">${service.lastSeen ? this.formatDate(service.lastSeen) : 'Unknown'}</div>
        </div>
      `;

      const footerContent = document.getElementById('detail-footer');
      footerContent.innerHTML = `
        <button class="btn btn-danger btn-revoke" data-service-id="${service.id}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          Revoke Access
        </button>
      `;

      footerContent.querySelector('.btn-revoke').addEventListener('click', () => this.revokeSingle(service));

      document.getElementById('detail-panel').classList.add('open');
    } catch (error) {
      console.error('Failed to load service detail:', error);
      this.showToast('Failed to load details', 'error');
    }
  }

  async revokeSingle(service) {
    this.showModal({
      title: 'Revoke Access',
      message: `Are you sure you want to revoke access for <strong>${service.displayName || service.name}</strong>?`,
      submessage: 'This will clear all cookies for this domain. This action cannot be undone.',
      icon: 'warning',
      confirmText: 'Revoke',
      onConfirm: async () => {
        try {
          const result = await this.sendMessage({ type: 'REVOKE_SERVICE', payload: { id: service.id } });
          
          this.closeModal();
          this.closeDetailPanel();
          this.showToast(result.message || 'Access revoked', 'success');
          
          await this.loadData();
          this.render();
        } catch (error) {
          this.showToast('Failed to revoke access', 'error');
        }
      }
    });
  }

  closeDetailPanel() {
    document.getElementById('detail-panel').classList.remove('open');
  }

  formatDate(dateString) {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">
        ${type === 'success' 
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>'
        }
      </span>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ConsentOSDashboard();
});