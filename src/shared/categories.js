const CATEGORY_PATTERNS = {
  essential: [
    'mail.google.com', 'gmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'mail.ru', 'yandex.ru',
    'drive.google.com', 'dropbox.com', 'onedrive.com',
    'notion.so', 'trello.com', 'asana.com', 'monday.com', 'linear.app', 'airtable.com',
    'bitrix24.kz', 'megaplan.ru',
    'zoom.us', 'zoom.sjv.io',
    'github.com', 'gitlab.com', 'bitbucket.org',
  ],
  analytical: [
    'google-analytics.com', 'segment.com', 'mixpanel.com', 'hotjar.com', 'fullstory.com',
    'heap.io', 'amplitude.com', 'mouseflow.com', 'crazyegg.com', 'luckyorange.com',
    'fonts.googleapis.com', 'fonts.gstatic.com', 'typekit.net',
    'cloudflare.com', 'akamai.com', 'fastly.net', 'cloudfront.net', 'jsdelivr.net', 'unpkg.com',
    'cdnjs.cloudflare.com',
  ],
  intrusive: [
    'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
    'facebook.net', 'criteo.com', 'openx.net', 'taboola.com', 'revcontent.com',
    'adnxs.com', 'adroll.com', 'ads-tinyorbit.com', 'adscale.de',
    'facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com', 'snapchat.com',
    'linkedin.com', 'reddit.com', 'pinterest.com', 'threads.net',
    'match.com', 'tinder.com', 'bumble.com', 'hinge.co',
    'coinbase.com', 'binance.com', 'kraken.com', 'crypto.com',
  ],
};

const OLD_CATEGORIES = {
  essential: ['search', 'email', 'productivity', 'developer', 'cloud', 'government', 'education', 'education2'],
  analytical: ['tracking', 'cdn', 'fonts', 'news', 'travel', 'telecom', 'utilities'],
  intrusive: ['social', 'shopping', 'ad_tech', 'dating', 'crypto', 'gaming', 'streaming', 'entertainment'],
};

function categorizeService(serviceName) {
  const name = serviceName.toLowerCase();

  for (const pattern of CATEGORY_PATTERNS.intrusive) {
    if (name.includes(pattern)) return 'intrusive';
  }
  for (const pattern of CATEGORY_PATTERNS.analytical) {
    if (name.includes(pattern)) return 'analytical';
  }
  for (const pattern of CATEGORY_PATTERNS.essential) {
    if (name.includes(pattern)) return 'essential';
  }

  return 'analytical';
}

function countByCategory(services) {
  const counts = { essential: 0, analytical: 0, intrusive: 0 };
  for (const service of services) {
    const cat = categorizeService(service.name || service.domain);
    counts[cat]++;
  }
  return counts;
}

function filterByCategory(services, category) {
  return services.filter(s => categorizeService(s.name || s.domain) === category);
}

function calculateRiskLevel(service) {
  const category = categorizeService(service.name || service.domain);
  const cookieCount = service.cookieCount || 0;

  if (category === 'intrusive' || cookieCount > 100) return 'high';
  if (category === 'analytical' || cookieCount > 50) return 'medium';
  return 'low';
}

export {
  CATEGORY_PATTERNS,
  categorizeService,
  categorizeService as getCategory,
  countByCategory,
  filterByCategory,
  calculateRiskLevel,
  OLD_CATEGORIES,
};