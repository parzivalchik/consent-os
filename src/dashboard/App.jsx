import { useState, useEffect } from 'react';
import Header from './components/Header';
import ScoreBanner from './components/ScoreBanner';
import TabNav from './components/TabNav';
import KillSwitch from './components/KillSwitch';
import OverviewTab from './components/tabs/OverviewTab';
import CookiesTab from './components/tabs/CookiesTab';
import TimelineTab from './components/tabs/TimelineTab';
import AnalysisTab from './components/tabs/AnalysisTab';
import RecommendationsTab from './components/tabs/RecommendationsTab';
import Toast from './components/Toast';
import { getCategory, calculateRiskLevel } from '../shared/categories';

function sendMessage(message) {
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

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [cookies, setCookies] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [stats, setStats] = useState({
    totalCookies: 0,
    totalDomains: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isPurging, setIsPurging] = useState(false);
  const [isProcessingRecommendations, setIsProcessingRecommendations] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Try chrome.storage.local first (shared across contexts)
    try {
      chrome.storage.local.get('consent-os-theme', (result) => {
        if (result['consent-os-theme']) {
          setTheme(result['consent-os-theme']);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
          setTheme('light');
        }
      });
    } catch (e) {
      // Fallback to localStorage
      const saved = localStorage.getItem('consent-os-theme');
      if (saved) setTheme(saved);
      else if (window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
    }

    // Listen for real-time changes from popup
    const handleStorageChange = (changes, areaName) => {
      if (areaName === 'local' && changes['consent-os-theme']) {
        setTheme(changes['consent-os-theme'].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  function toggleTheme() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      chrome.storage.local.set({ 'consent-os-theme': newTheme });
    } catch (e) {
      localStorage.setItem('consent-os-theme', newTheme);
    }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [servicesData, cookiesData, historyData, statsData] = await Promise.all([
        sendMessage({ type: 'GET_SERVICES' }).catch(() => []),
        sendMessage({ type: 'GET_ALL_COOKIES' }).catch(() => []),
        sendMessage({ type: 'GET_HISTORY' }).catch(() => []),
        sendMessage({ type: 'GET_STATS' }).catch(() => ({})),
      ]);

      setServices(servicesData || []);
      setCookies(cookiesData || []);
      setTimeline(historyData || []);

      const svcs = servicesData || [];
      const cks = cookiesData || [];

      let highRisk = 0, mediumRisk = 0, lowRisk = 0;
      svcs.forEach(s => {
        const risk = calculateRiskLevel(s);
        if (risk === 'high') highRisk++;
        else if (risk === 'medium') mediumRisk++;
        else lowRisk++;
      });

      setStats({
        totalCookies: cks.length,
        totalDomains: svcs.length,
        highRisk,
        mediumRisk,
        lowRisk,
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load data:', error);
      showToast('FAILED TO LOAD DATA', 'error');
    } finally {
      setLoading(false);
    }
  }

  const privacyScore = calculatePrivacyScore(services);
  const categoryCounts = {
    essential: services.filter(s => getCategory(s.name || s.domain) === 'essential').length,
    analytical: services.filter(s => getCategory(s.name || s.domain) === 'analytical').length,
    intrusive: services.filter(s => getCategory(s.name || s.domain) === 'intrusive').length,
  };

  function calculatePrivacyScore(svcs) {
    if (svcs.length === 0) return 100;
    let score = 100;
    for (const service of svcs) {
      const risk = calculateRiskLevel(service);
      const cookieCount = service.cookieCount || 0;
      if (risk === 'high') score -= 15;
      else if (risk === 'medium') score -= 5;
      if (cookieCount > 50) score -= 2;
      else if (cookieCount > 10) score -= 1;
    }
    return Math.max(0, Math.min(100, score));
  }

  async function handleKillSwitch() {
    if (!confirm('CONFIRM: Purge all tracked services? This cannot be undone.')) return;

    setIsPurging(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const service of services) {
        try {
          const result = await sendMessage({ type: 'REVOKE_SERVICE', payload: { id: service.id } });
          if (result?.success) successCount++;
          else failCount++;
        } catch (e) {
          failCount++;
        }
      }

      await loadData();

      if (failCount === 0) {
        showToast(`PURGED ${successCount} SERVICES`);
      } else {
        showToast(`${successCount} PURGED, ${failCount} FAILED`, 'error');
      }
    } catch (error) {
      showToast('KILL SWITCH FAILED', 'error');
    } finally {
      setIsPurging(false);
    }
  }

  async function handleRevokeService(serviceId) {
    try {
      await sendMessage({ type: 'REVOKE_SERVICE', payload: { id: serviceId } });
      showToast('SERVICE REVOKED');
      await loadData();
    } catch (error) {
      showToast('REVOKE FAILED', 'error');
    }
  }

  async function handleApplyAllRecommendations(serviceIds) {
    setIsProcessingRecommendations(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const id of serviceIds) {
        try {
          await sendMessage({ type: 'REVOKE_SERVICE', payload: { id } });
          successCount++;
        } catch (e) {
          failCount++;
        }
      }

      await loadData();

      if (failCount === 0) {
        showToast(`REVOKED ${successCount} SERVICES`);
      } else {
        showToast(`${successCount} REVOKED, ${failCount} FAILED`, 'error');
      }
    } catch (error) {
      showToast('FAILED TO APPLY RECOMMENDATIONS', 'error');
    } finally {
      setIsProcessingRecommendations(false);
    }
  }

  async function handleClearCookie(cookie) {
    try {
      await new Promise((resolve, reject) => {
        chrome.cookies.remove({
          url: (cookie.secure ? 'https://' : 'http://') + cookie.domain + cookie.path,
          name: cookie.name
        }, (result) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        });
      });
      showToast('COOKIE CLEARED');
      await loadData();
    } catch (error) {
      showToast('CLEAR FAILED', 'error');
    }
  }

  async function handleExport(format) {
    try {
      const data = { services, cookies, stats, exportedAt: new Date().toISOString() };
      let blob, filename;

      if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = 'consent-os-export.json';
      } else if (format === 'csv') {
        const csv = ['domain,category,cookies,risk'];
        services.forEach(s => {
          csv.push(`${s.domain || s.name},${getCategory(s.name || s.domain)},${s.cookieCount || 0},${calculateRiskLevel(s)}`);
        });
        blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        filename = 'consent-os-export.csv';
      } else {
        showToast('PDF EXPORT NOT YET IMPLEMENTED', 'error');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`EXPORTED AS ${format.toUpperCase()}`);
    } catch (error) {
      showToast('EXPORT FAILED', 'error');
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'cookies', label: 'Cookies' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'analysis', label: 'Analysis' },
    { id: 'recommendations', label: 'Recommendations' },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-tac-light-bg' : 'bg-tac-black'}`}>
        <div className={`font-mono text-lg animate-pulse ${theme === 'light' ? 'text-tac-light-magenta' : 'text-tac-magenta'}`}>INITIALIZING TACTICAL INTERFACE...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-tac-light-bg' : 'bg-tac-black'}`}>
      <Header
        score={privacyScore}
        onRefresh={loadData}
        onExport={handleExport}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <ScoreBanner
        score={privacyScore}
        stats={stats}
        categoryCounts={categoryCounts}
        theme={theme}
      />

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} theme={theme} />

      <main className="flex-1 p-4 overflow-auto">
        {activeTab === 'overview' && (
          <OverviewTab
            services={services}
            cookies={cookies}
            categoryCounts={categoryCounts}
            timeline={timeline}
            onRevoke={handleRevokeService}
            theme={theme}
          />
        )}
        {activeTab === 'cookies' && (
          <CookiesTab
            cookies={cookies}
            services={services}
            onClear={handleClearCookie}
            theme={theme}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab events={timeline} theme={theme} />
        )}
        {activeTab === 'analysis' && (
          <AnalysisTab
            services={services}
            cookies={cookies}
            categoryCounts={categoryCounts}
            theme={theme}
          />
        )}
        {activeTab === 'recommendations' && (
          <RecommendationsTab
            services={services}
            stats={stats}
            onApplyRecommendation={handleRevokeService}
            onApplyAll={handleApplyAllRecommendations}
            isProcessing={isProcessingRecommendations}
            theme={theme}
          />
        )}
      </main>

      <KillSwitch
        onActivate={handleKillSwitch}
        disabled={isPurging}
        serviceCount={services.length}
        theme={theme}
      />

      {lastUpdated && (
        <footer className={`border-t px-4 py-2 text-xs font-mono ${theme === 'light' ? 'border-tac-light-border text-tac-light-dim' : 'border-tac-border text-tac-gray'}`}>
          Last updated: {lastUpdated.toLocaleString()} | CONSENT-OS 2.0 TACTICAL v1.0.0
        </footer>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
    </div>
  );
}