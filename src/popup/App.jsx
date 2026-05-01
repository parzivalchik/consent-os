import { useState, useEffect } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import CategorySection from './components/CategorySection';
import KillSwitch from './components/KillSwitch';
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
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [isPurging, setIsPurging] = useState(false);
  const [toast, setToast] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('intrusive');
  const [purgedCategories, setPurgedCategories] = useState({ essential: false, analytical: false, intrusive: false });

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [servicesData, statsData] = await Promise.all([
        sendMessage({ type: 'GET_SERVICES' }),
        sendMessage({ type: 'GET_STATS' })
      ]);
      setServices(servicesData || []);
      setStats(statsData || {});
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const groupedServices = {
    essential: services.filter(s => getCategory(s.name || s.domain) === 'essential'),
    analytical: services.filter(s => getCategory(s.name || s.domain) === 'analytical'),
    intrusive: services.filter(s => getCategory(s.name || s.domain) === 'intrusive'),
  };

  const categoryCounts = {
    essential: groupedServices.essential.length,
    analytical: groupedServices.analytical.length,
    intrusive: groupedServices.intrusive.length,
  };

  const privacyScore = calculatePrivacyScore(services, stats);

  function calculatePrivacyScore(svcs, st) {
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

  function handlePurgeToggle(category) {
    const newPurged = { ...purgedCategories, [category]: !purgedCategories[category] };
    setPurgedCategories(newPurged);

    if (!purgedCategories[category]) {
      const servicesToPurge = groupedServices[category];
      servicesToPurge.forEach(async (service) => {
        try {
          await sendMessage({ type: 'REVOKE_SERVICE', payload: { id: service.id } });
        } catch (e) {
          console.error('Failed to revoke:', service.id, e);
        }
      });
      loadData();
    }
  }

  async function handleKillSwitch() {
    console.log('handleKillSwitch called');
    console.log('groupedServices:', groupedServices);
    
    setIsPurging(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const allCategories = ['essential', 'analytical', 'intrusive'];
      
      // Count total services
      let totalServices = 0;
      for (const category of allCategories) {
        const servicesToPurge = groupedServices[category];
        console.log(`Category ${category}:`, servicesToPurge?.length, 'services');
        totalServices += servicesToPurge?.length || 0;
      }
      
      console.log('Total services to purge:', totalServices);
      
      if (totalServices === 0) {
        showToast('No services to purge', 'error');
        setIsPurging(false);
        return;
      }
      
      for (const category of allCategories) {
        const servicesToPurge = groupedServices[category];
        for (const service of servicesToPurge) {
          console.log('Revoking service:', service.id);
          try {
            const result = await sendMessage({ type: 'REVOKE_SERVICE', payload: { id: service.id } });
            console.log('Revoke result:', result);
            if (result?.success) {
              successCount++;
            } else {
              failCount++;
              console.log('Revoke failed:', result);
            }
          } catch (e) {
            console.error('Failed to revoke:', service.id, e);
            failCount++;
          }
        }
      }
      
      await loadData();
      
      console.log('Purging complete. Success:', successCount, 'Failed:', failCount);
      
      if (failCount === 0) {
        showToast(`Successfully purged ${successCount} services`);
      } else {
        showToast(`Purged ${successCount} services, ${failCount} failed`, 'error');
      }
    } catch (error) {
      console.error('Kill switch error:', error);
      showToast('Failed to execute kill switch', 'error');
    } finally {
      setIsPurging(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-base-lighter border-t-[#FF00FF] animate-spin" />
          <span className="text-ghost-meta text-xs font-mono">SCANNING...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-base overflow-hidden">
      <Header score={privacyScore} servicesCount={services.length} />

      <main className="flex-1 overflow-y-auto px-3 py-2">
        <Timeline services={services} />
      </main>

      <CategorySection
        groupedServices={groupedServices}
        categoryCounts={categoryCounts}
        expandedCategory={expandedCategory}
        setExpandedCategory={setExpandedCategory}
        purgedCategories={purgedCategories}
        onPurgeToggle={handlePurgeToggle}
      />

      <KillSwitch
        onActivate={handleKillSwitch}
        active={purgedCategories.essential && purgedCategories.analytical && purgedCategories.intrusive}
        disabled={isPurging}
      />

      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 text-xs font-mono ${
          toast.type === 'error' ? 'bg-red-600 text-white border border-red-600' : 'bg-[#FF00FF] text-[#121212] border border-[#FF00FF]'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}