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

class ConsentOSOptions {
  constructor() {
    this.services = [];
    this.allServices = [];
    this.cookies = [];
    this.history = [];
    this.stats = {};
    this.expandedId = null;
    this.searchQuery = '';
    this.categoryFilter = null;
    this.init();
  }

  async init() {
    this.initTheme();
    await this.loadData();
    this.bindEvents();
    this.render();
    this.updateSearchClear();
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
      const [services, stats, cookies, history] = await Promise.all([
        this.sendMessage({ type: 'GET_SERVICES' }),
        this.sendMessage({ type: 'GET_STATS' }),
        this.sendMessage({ type: 'GET_ALL_COOKIES' }),
        this.sendMessage({ type: 'GET_HISTORY' })
      ]);
      this.allServices = services || [];
      this.services = services || [];
      this.stats = stats || {};
      this.cookies = cookies || [];
      this.history = history || [];
      this.filterServices();
    } catch (e) {
      console.error('Load error:', e);
      this.showToast('Failed to load data', 'error');
    }
  }

  filterServices() {
    if (!this.searchQuery) {
      this.services = this.allServices;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.services = this.allServices.filter(s => {
        const name = (s.displayName || s.name || '').toLowerCase();
        const category = (s.category || '').toLowerCase();
        return name.includes(query) || category.includes(query);
      });
    }
  }

  sendMessage(msg) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, (r) => {
        if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
        else if (r && r.success) resolve(r.data);
        else reject(new Error(r?.error || 'Error'));
      });
    });
  }

  bindEvents() {
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    document.getElementById('refresh-btn').addEventListener('click', () => this.refresh());
    document.getElementById('export-btn').addEventListener('click', () => this.toggleExportMenu());
    document.querySelectorAll('#export-menu button').forEach(btn => {
      btn.addEventListener('click', () => this.exportAs(btn.dataset.format));
    });

    document.getElementById('cookie-search').addEventListener('input', (e) => this.filterCookies(e.target.value));
    document.getElementById('cookie-domain-filter').addEventListener('change', (e) => this.filterCookies());
    document.getElementById('clear-all-cookies').addEventListener('click', () => this.clearAllCookies());
    document.getElementById('close-cookie-modal').addEventListener('click', () => this.closeCookieModal());
    document.getElementById('cookie-modal').addEventListener('click', (e) => {
      if (e.target.id === 'cookie-modal') this.closeCookieModal();
    });
    
    document.getElementById('apply-recs').addEventListener('click', () => this.applyRecommendations());

    document.getElementById('domain-search').addEventListener('input', (e) => this.onSearch(e.target.value));
    document.getElementById('search-clear').addEventListener('click', () => this.clearSearch());

    document.getElementById('timeline-filter').addEventListener('change', () => this.renderTimeline());
    document.getElementById('timeline-range').addEventListener('change', () => this.renderTimeline());

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.getElementById('export-menu')?.classList.remove('open');
      }
    });
  }

  onSearch(value) {
    this.searchQuery = value.trim();
    this.filterServices();
    this.renderTopDomains();
    this.updateSearchClear();
  }

  clearSearch() {
    document.getElementById('domain-search').value = '';
    this.searchQuery = '';
    this.categoryFilter = null;
    this.filterServices();
    this.renderTopDomains();
    this.updateSearchClear();
  }

  updateSearchClear() {
    const clearBtn = document.getElementById('search-clear');
    clearBtn.style.display = (this.searchQuery || this.categoryFilter) ? 'flex' : 'none';
  }

  switchTab(tabId) {
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === `${tabId}-tab`));
  }

  async refresh() {
    const btn = document.getElementById('refresh-btn');
    btn.classList.add('spinning');
    btn.disabled = true;
    
    try {
      await this.sendMessage({ type: 'REFRESH_DATA' });
      await this.loadData();
      this.render();
      this.showToast('Data refreshed', 'success');
    } catch (e) {
      this.showToast('Failed to refresh', 'error');
    }
    
    btn.classList.remove('spinning');
    btn.disabled = false;
  }

  toggleExportMenu() {
    document.getElementById('export-menu').classList.toggle('open');
  }

  exportAs(format) {
    const data = { exportDate: new Date().toISOString(), services: this.services, cookies: this.cookies, history: this.history, stats: this.stats };
    
    if (format === 'json') {
      this.downloadJSON(data);
    } else if (format === 'csv') {
      this.downloadCSV();
    } else if (format === 'pdf') {
      this.showToast('PDF export coming soon', 'success');
    }
    document.getElementById('export-menu').classList.remove('open');
  }

  downloadJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, `consent-os-${new Date().toISOString().split('T')[0]}.json`);
  }

  downloadCSV() {
    const rows = [['Domain', 'Cookie Name', 'Value', 'Expires', 'Secure', 'HttpOnly', 'Path', 'DomainOnly']];
    for (const c of this.cookies) {
      rows.push([c.domain, c.name, c.value, c.expirationDate, c.secure, c.httpOnly, c.path, c.hostOnly]);
    }
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    this.downloadBlob(blob, `consent-os-cookies-${new Date().toISOString().split('T')[0]}.csv`);
  }

  downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast(`Exported as ${name}`, 'success');
  }

  filterCookies(search = '') {
    const domain = document.getElementById('cookie-domain-filter').value;
    const secure = document.getElementById('cookie-secure-filter').value;
    const searchTerm = search || document.getElementById('cookie-search').value.toLowerCase();
    
    let filtered = this.cookies;
    if (searchTerm) filtered = filtered.filter(c => c.name.toLowerCase().includes(searchTerm) || c.domain.includes(searchTerm));
    if (domain) filtered = filtered.filter(c => c.domain === domain);
    if (secure) filtered = filtered.filter(c => String(c.secure) === secure);
    
    this.renderCookies(filtered);
  }

  renderCookies(list = this.cookies) {
    const tbody = document.getElementById('cookies-table');
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="loading">No cookies found</td></tr>';
      return;
    }
    
    tbody.innerHTML = list.slice(0, 500).map(c => `
      <tr>
        <td>${c.domain || '(empty)'}</td>
        <td class="cookie-name">${c.name}</td>
        <td class="cookie-value">${c.value ? c.value.substring(0, 30) + (c.value.length > 30 ? '...' : '') : '(session)'}</td>
        <td>${c.expirationDate ? new Date(c.expirationDate * 1000).toLocaleDateString() : 'Session'}</td>
        <td>${c.secure ? '<span class="secure-badge">✓</span>' : '-'}</td>
        <td>${c.httpOnly ? 'Yes' : '-'}</td>
        <td><button class="action-btn" data-cookie='${JSON.stringify(c)}'>View</button></td>
      </tr>
    `).join('');
    
    tbody.querySelectorAll('.action-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showCookieDetail(JSON.parse(btn.dataset.cookie)));
    });
  }

  showCookieDetail(cookie) {
    document.getElementById('cookie-detail-body').innerHTML = `
      <div class="detail-row"><span class="detail-label">Domain</span><span class="detail-value">${cookie.domain}</span></div>
      <div class="detail-row"><span class="detail-label">Name</span><span class="detail-value mono">${cookie.name}</span></div>
      <div class="detail-row"><span class="detail-label">Value</span><span class="detail-value mono">${cookie.value || '(session)'}</span></div>
      <div class="detail-row"><span class="detail-label">Expires</span><span class="detail-value">${cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : 'Session'}</span></div>
      <div class="detail-row"><span class="detail-label">Path</span><span class="detail-value">${cookie.path}</span></div>
      <div class="detail-row"><span class="detail-label">Secure</span><span class="detail-value">${cookie.secure}</span></div>
      <div class="detail-row"><span class="detail-label">HttpOnly</span><span class="detail-value">${cookie.httpOnly}</span></div>
      <div class="detail-row"><span class="detail-label">SameSite</span><span class="detail-value">${cookie.sameSite}</span></div>
      <div class="detail-row"><span class="detail-label">Store ID</span><span class="detail-value">${cookie.storeId}</span></div>
    `;
    document.getElementById('cookie-modal').classList.add('open');
  }

  closeCookieModal() {
    document.getElementById('cookie-modal').classList.remove('open');
  }

  async clearAllCookies() {
    if (!confirm('Clear ALL cookies? This cannot be undone.')) return;
    for (const c of this.cookies) {
      try {
        await chrome.cookies.remove({ url: `https://${c.domain}`, name: c.name });
      } catch (e) {}
    }
    await this.loadData();
    this.render();
    this.showToast('All cookies cleared', 'success');
  }

  render() {
    this.renderScore();
    this.renderStats();
    this.renderCharts();
    this.renderTopDomains();
    this.renderRecentActivity();
    this.renderCookies();
    this.renderTimeline();
    this.renderAnalysis();
    this.renderRecommendations();
    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    
    this.populateCookieFilter();
  }

  renderScore() {
    const score = this.calculateScore();
    const el = document.getElementById('privacy-score');
    const fill = document.getElementById('score-bar-fill');
    el.textContent = score;
    fill.style.width = score + '%';
    el.style.color = score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444';
  }

  calculateScore() {
    if (!this.services.length) return 100;
    let score = 100;
    for (const s of this.services) {
      const risk = s.riskLevel || 'low', cookies = s.cookieCount || 0;
      if (risk === 'high') score -= 15; else if (risk === 'medium') score -= 5;
      if (cookies > 50) score -= 2; else if (cookies > 10) score -= 1;
    }
    if (this.stats.totalHistory > 100) score -= 10;
    if (this.stats.totalDownloads > 10) score -= 10;
    return Math.max(0, Math.min(100, score));
  }

  renderStats() {
    document.getElementById('stat-cookies').textContent = this.formatNum(this.cookies.length);
    document.getElementById('stat-domains').textContent = this.services.length;
    document.getElementById('stat-high').textContent = this.stats.highRisk || 0;
    document.getElementById('stat-medium').textContent = this.stats.mediumRisk || 0;
    document.getElementById('stat-low').textContent = this.stats.lowRisk || 0;
  }

  formatNum(n) {
    if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n/1000).toFixed(1) + 'K';
    return n.toString();
  }

  renderCharts() {
    const catData = {};
    for (const s of this.services) {
      const cat = s.category?.id || s.category || 'other';
      catData[cat] = (catData[cat] || 0) + 1;
    }
    
    const container = document.getElementById('category-chart');
    const total = Object.values(catData).reduce((a,b) => a+b, 0);
    if (total === 0) { container.innerHTML = '<text x="100" y="100" text-anchor="middle" fill="var(--text-muted)">No data</text>'; return; }
    
    const sortedCats = Object.entries(catData).sort((a, b) => b[1] - a[1]);
    let legend = '';
    let currentAngle = -90;
    let slices = '';
    
    sortedCats.forEach(([cat, count]) => {
      const color = CATEGORY_COLORS[cat] || CATEGORY_COLORS.other;
      const logo = CATEGORY_LOGOS[cat] || CATEGORY_LOGOS.other;
      const pct = (count / total) * 100;
      const angle = (count / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;
      
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const largeArc = angle > 180 ? 1 : 0;
      
      const x1 = 250 + 200 * Math.cos(startRad);
      const y1 = 250 + 200 * Math.sin(startRad);
      const x2 = 250 + 200 * Math.cos(endRad);
      const y2 = 250 + 200 * Math.sin(endRad);
      
      const midAngle = (startAngle + endAngle) / 2;
      const midRad = (midAngle * Math.PI) / 180;
      const labelX = 250 + 140 * Math.cos(midRad);
      const labelY = 250 + 140 * Math.sin(midRad);
      
      slices += `
        <path class="pie-slice" data-category="${cat}" data-count="${count}" 
              d="M250,250 L${x1},${y1} A200,200 0 ${largeArc},1 ${x2},${y2} Z"
              fill="${color}" stroke="var(--bg-secondary)" stroke-width="3"/>
      `;
      
      if (pct >= 5) {
        const textX = 250 + 130 * Math.cos(midRad);
        const textY = 250 + 130 * Math.sin(midRad);
        slices += `
          <text x="${textX}" y="${textY}" text-anchor="middle" dominant-baseline="central" 
                fill="var(--text-primary)" font-size="20" font-weight="600">${Math.round(pct)}%</text>
        `;
      }
      
      legend += `
        <div class="legend-item" data-category="${cat}">
          <span class="legend-dot" style="background:${color}"></span>
          <span class="legend-logo">${logo}</span>
          <span class="legend-name">${cat}</span>
          <span class="legend-count">(${count})</span>
        </div>
      `;
    });
    
    slices += `<circle cx="250" cy="250" r="100" fill="var(--bg-secondary)"/>`;
    slices += `<text x="250" y="240" text-anchor="middle" fill="var(--text-primary)" font-size="40" font-weight="700">${total}</text>`;
    slices += `<text x="250" y="275" text-anchor="middle" fill="var(--text-muted)" font-size="18">total</text>`;
    
    container.innerHTML = slices;
    document.getElementById('category-legend').innerHTML = legend;
    
    container.querySelectorAll('.pie-slice').forEach(slice => {
      slice.addEventListener('mouseenter', (e) => this.highlightCategory(e.target.dataset.category, true));
      slice.addEventListener('mouseleave', () => this.highlightCategory(null, false));
      slice.addEventListener('click', () => this.filterByCategory(slice.dataset.category));
    });
    
    document.querySelectorAll('.legend-item').forEach(item => {
      item.addEventListener('mouseenter', () => this.highlightCategory(item.dataset.category, true));
      item.addEventListener('mouseleave', () => this.highlightCategory(null, false));
      item.addEventListener('click', () => this.filterByCategory(item.dataset.category));
    });
  }

  highlightCategory(category, highlight) {
    const tooltip = document.getElementById('pie-tooltip');
    const svg = document.getElementById('category-chart');
    
    if (!highlight || !category) {
      tooltip.style.display = 'none';
      svg.querySelectorAll('.pie-slice').forEach(s => s.style.opacity = '1');
      svg.querySelectorAll('.legend-item').forEach(l => l.classList.remove('highlighted'));
      return;
    }
    
    const catData = {};
    for (const s of this.services) {
      const cat = s.category?.id || s.category || 'other';
      catData[cat] = (catData[cat] || 0) + 1;
    }
    const count = catData[category] || 0;
    const total = Object.values(catData).reduce((a,b) => a+b, 0);
    const logo = CATEGORY_LOGOS[category] || CATEGORY_LOGOS.other;
    const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;
    
    tooltip.innerHTML = `<span class="tooltip-logo">${logo}</span><span class="tooltip-name">${category}</span><span class="tooltip-count">${count} (${Math.round((count/total)*100)}%)</span>`;
    tooltip.style.display = 'flex';
    tooltip.style.borderColor = color;
    
    svg.querySelectorAll('.pie-slice').forEach(s => {
      s.style.opacity = s.dataset.category === category ? '1' : '0.3';
    });
    svg.querySelectorAll('.legend-item').forEach(l => {
      l.classList.toggle('highlighted', l.dataset.category === category);
    });
  }

  filterByCategory(category) {
    if (this.categoryFilter === category) {
      this.categoryFilter = null;
      this.filterServices();
      this.renderTopDomains();
      return;
    }
    this.categoryFilter = category;
    this.filterServices();
    this.renderTopDomains();
  }

  filterServices() {
    if (!this.categoryFilter && !this.searchQuery) {
      this.services = this.allServices;
    } else {
      let filtered = this.allServices;
      if (this.categoryFilter) {
        filtered = filtered.filter(s => (s.category?.id || s.category || 'other') === this.categoryFilter);
      }
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(s => {
          const name = (s.displayName || s.name || '').toLowerCase();
          return name.includes(query);
        });
      }
      this.services = filtered;
    }
  }

  renderTopDomains() {
    const sorted = [...this.services].sort((a,b) => (b.cookieCount||0) - (a.cookieCount||0));
    
    if (this.searchQuery && sorted.length === 0) {
      document.getElementById('top-domains').innerHTML = `
        <div class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <h3>No domains found</h3>
          <p>No domains match "${this.searchQuery}"</p>
        </div>
      `;
      return;
    }
    
    document.getElementById('top-domains').innerHTML = sorted.map((s, i) => {
      const clarity = s.clarityScore || { grade: '?', color: '#6b7280' };
      const isExpanded = this.expandedId === s.id;
      const legal = s.legalSummary || {};
      const whatTheyGet = legal.whatTheyGet || [];
      const whatYouGet = legal.whatYouGet || [];
      
      const legalSectionHtml = legal.simplifiedSummary ? `
        <div class="domain-legal-section" style="${isExpanded ? 'display:block' : 'display:none'}">
          <div class="legal-content">
            <div class="legal-header">
              <div class="legal-title">📋 TL;DR - Transparency Summary</div>
              <div class="clarity-score" style="background: ${clarity.color}20; color: ${clarity.color};">
                Clarity: ${clarity.grade} (${clarity.label || 'Unknown'})
              </div>
            </div>
            <div class="legal-summary">
              <strong>What this means:</strong> ${legal.simplifiedSummary || 'No summary available'}
            </div>
            <div class="legal-columns">
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
        <div class="domain-row ${isExpanded ? 'expanded' : ''}" data-domain-id="${s.id}">
          <div class="rank ${i<3?'top':''}">${i+1}</div>
          <div class="info">
            <div class="name">${s.displayName || s.name}</div>
            <div class="category">${s.category}</div>
          </div>
          <div class="count">${s.cookieCount || 0}</div>
          <div class="expand-icon ${isExpanded ? 'expanded' : ''}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <button class="btn btn-sm btn-danger revoke-btn" data-id="${s.id}" title="Revoke access">Revoke</button>
          ${legalSectionHtml}
        </div>
      `;
    }).join('');
    
    document.querySelectorAll('.domain-row').forEach(row => {
      row.addEventListener('click', (e) => {
        this.toggleExpand(row.dataset.domainId);
      });
    });
    
    document.querySelectorAll('.revoke-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.revokeDomain(btn.dataset.id);
      });
    });
  }
  
  toggleExpand(domainId) {
    if (this.expandedId === domainId) {
      this.expandedId = null;
    } else {
      this.expandedId = domainId;
    }
    this.renderTopDomains();
  }

  renderRecentActivity() {
    const recent = this.history.slice(0, 10);
    if (!recent.length) { document.getElementById('recent-activity').innerHTML = '<div class="loading">No recent activity</div>'; return; }
    document.getElementById('recent-activity').innerHTML = recent.map(h => {
      const icon = h.type === 'revoke' ? '🗑️' : h.type === 'cleared' ? '🧹' : '📍';
      const title = h.type === 'revoke' ? 'Revoked access for ' + h.serviceName : h.type === 'cleared' ? 'Cleared cookies for ' + h.serviceName : 'Activity for ' + h.serviceName;
      return `
      <div class="activity-item">
        <div class="activity-icon ${h.type}">${icon}</div>
        <div class="activity-content">
          <div class="activity-title">${title}</div>
          <div class="activity-time">${this.formatTime(h.timestamp)}</div>
        </div>
      </div>
    `; }).join('');
  }

  renderTimeline() {
    const filter = document.getElementById('timeline-filter').value;
    const days = parseInt(document.getElementById('timeline-range').value);
    const cutoff = days === 'all' ? 0 : Date.now() - days * 24*60*60*1000;
    
    let events = this.history.filter(h => !cutoff || new Date(h.timestamp).getTime() > cutoff);
    if (filter) events = events.filter(h => h.type === filter);
    
    if (!events.length) { document.getElementById('timeline').innerHTML = '<div class="loading">No events</div>'; return; }
    
    const grouped = {};
    events.forEach(e => {
      const date = new Date(e.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(e);
    });
    
    const getEventIcon = (type) => {
      if (type === 'revoke') return '🗑️';
      if (type === 'cleared' || type === 'cookie_deleted') return '🧹';
      if (type === 'cookie_created') return '🍪';
      if (type === 'domain_added') return '🌐';
      return '📍';
    };
    
    const getEventTitle = (type) => {
      if (type === 'revoke') return 'Revoked access';
      if (type === 'cleared') return 'Cleared cookies';
      if (type === 'cookie_created') return 'Cookie created';
      if (type === 'cookie_deleted') return 'Cookie deleted';
      if (type === 'domain_added') return 'New domain detected';
      return 'Activity';
    };
    
    document.getElementById('timeline').innerHTML = Object.entries(grouped).map(([date, items]) => `
      <div class="timeline-day"><h4>${date}</h4>${items.map(h => `
        <div class="timeline-item">
          <div class="timeline-icon ${h.type}">${getEventIcon(h.type)}</div>
          <div class="timeline-content">
            <div class="timeline-title">${getEventTitle(h.type)} for ${h.serviceName}</div>
            <div class="timeline-desc">${h.dataTypes?.length || 0} data types</div>
          </div>
        </div>
      `).join('')}</div>
    `).join('');
  }

  renderAnalysis() {
    const cookieDomains = {};
    for (const c of this.cookies) {
      const d = c.domain.replace(/^\./, '');
      cookieDomains[d] = (cookieDomains[d] || 0) + 1;
    }
    
    const trackers = Object.entries(cookieDomains).filter(([,c]) => c > 5).sort((a,b) => b[1] - a[1]).slice(0, 10);
    document.getElementById('tracker-list').innerHTML = trackers.length ? trackers.map(([d, c]) => `
      <div class="tracker-item">
        <div class="tracker-icon">🕸️</div>
        <div class="tracker-info"><div class="tracker-name">${d}</div><div class="tracker-count">${c} cookies across sites</div></div>
      </div>
    `).join('') : '<div class="loading">No trackers detected</div>';
    
    const typeCounts = { identity: 0, location: 0, financial: 0, activity: 0, other: 0 };
    for (const s of this.services) {
      for (const dt of (s.dataTypes || [])) {
        if (dt.includes('identity')) typeCounts.identity++;
        else if (dt.includes('location')) typeCounts.location++;
        else if (dt.includes('financial')) typeCounts.financial++;
        else if (dt.includes('history')) typeCounts.activity++;
        else typeCounts.other++;
      }
    }
    const totalTypes = Object.values(typeCounts).reduce((a,b) => a+b, 1);
    
    document.getElementById('data-distribution').innerHTML = Object.entries(typeCounts).map(([type, count]) => `
      <div class="data-type-bar">
        <span class="label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
        <div class="bar"><div class="fill" style="width:${(count/totalTypes)*100}%;background:${type==='identity'?'#8b5cf6':type==='location'?'#3b82f6':type==='financial'?'#22c55e':type==='activity'?'#f97316':'#64748b'}"></div></div>
        <span class="value">${count}</span>
      </div>
    `).join('');
  }

  renderRecommendations() {
    const high = this.services.filter(s => s.riskLevel === 'high').slice(0, 5);
    const medium = this.services.filter(s => s.riskLevel === 'medium').slice(0, 10);
    const completed = [];
    
    if (!this.services.filter(s => s.category === 'government').length) completed.push('No government domains with data');
    const oldCookies = this.cookies.filter(c => c.expirationDate && c.expirationDate < Date.now()/1000 - 90*24*60*60);
    if (oldCookies.length) completed.push(`${oldCookies.length} old cookies can be cleaned`);
    
    document.getElementById('rec-high').innerHTML = high.length ? high.map(s => `
      <div class="rec-item"><input type="checkbox" checked><div class="rec-content"><div class="revoke" data-id="${s.id}">Revoke access for ${s.displayName}</div><div class="rec-domain">${s.cookieCount} cookies • ${s.riskLevel} risk</div></div></div>
    `).join('') : '<div class="loading">No high-risk issues</div>';
    
    document.getElementById('rec-medium').innerHTML = medium.length ? medium.map(s => `
      <div class="rec-item"><input type="checkbox"><div class="rec-content"><div class="review" data-id="${s.id}">Review ${s.displayName}</div><div class="rec-domain">${s.cookieCount} cookies</div></div></div>
    `).join('') : '<div class="loading">No medium-risk issues</div>';
    
document.getElementById('rec-completed').innerHTML = completed.length ? completed.map(c => `
      <div class="rec-item"><span>✓</span><span>${c}</span></div>
    `).join('') : '<div class="loading">No completed items</div>';
    
    document.querySelectorAll('.rec-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('.revoke') || e.target.closest('.review')) {
          return;
        }
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
        }
      });
    });
  }
  
  populateCookieFilter() {
    const domains = [...new Set(this.cookies.map(c => c.domain))].sort();
    document.getElementById('cookie-domain-filter').innerHTML = '<option value="">All Domains</option>' + 
      domains.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  formatTime(ts) {
    const d = new Date(ts), now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
    return d.toLocaleDateString();
  }

  showToast(msg, type = 'success') {
    const c = document.getElementById('toast-container');
    const t = document.createElement('div');
    t.className = `toast toast-${type}`;
    t.innerHTML = `<span class="toast-icon">${type==='success'?'✓':'⚠'}</span><span class="toast-message">${msg}</span>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
  }

  async applyRecommendations() {
    const highRiskCheckboxes = document.querySelectorAll('#rec-high input[type="checkbox"]:checked');
    const toRevoke = Array.from(highRiskCheckboxes).map(cb => cb.closest('.rec-item').querySelector('.revoke').dataset.id);
    
    if (toRevoke.length === 0) {
      this.showToast('No domains selected to revoke', 'error');
      return;
    }
    
    let successCount = 0;
    for (const id of toRevoke) {
      try {
        await this.sendMessage({ type: 'REVOKE_SERVICE', payload: { id } });
        successCount++;
      } catch (e) {
        console.error('Failed to revoke:', id, e);
      }
    }
    
    await this.loadData();
    this.render();
    this.showToast(`Revoked access for ${successCount} domain(s)`, 'success');
  }

  async revokeDomain(domainId) {
    if (!confirm('Revoke all access for this domain? This will clear cookies.')) return;
    
    try {
      await this.sendMessage({ type: 'REVOKE_SERVICE', payload: { id: domainId } });
      await this.loadData();
      this.render();
      this.showToast('Access revoked successfully', 'success');
    } catch (e) {
      this.showToast('Failed to revoke access', 'error');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new ConsentOSOptions());