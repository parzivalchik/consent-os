const CATEGORY_PATTERNS = {
  search: ['google.kz', 'yandex.kz', 'yandex.ru', 'mail.ru', 'rambler.ru', 'meta.ua', 'tut.by', 'google.com', 'yahoo.com', 'yahoo.co.jp', '2ip.ru', '2ip.io', 'bing.com', 'duckduckgo.com', 'brave.com', 'startpage.com'],
  social: ['vk.com', 'ok.ru', 'moi-mir.ru', 'yappy.media', 'discord.gg', 'pixilart.com', 'roblox.com', 'facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'tiktok.com', 'snapchat.com', 'reddit.com', 'pinterest.com', 'threads.net', 'mastodon.social'],
  shopping: ['kaspi.kz', 'wildberries.kz', 'ozon.ru', 'chocofood.kz', 'satu.kz', 'olx.kz', 'market.kz', 'technodom.kz', 'sulpak.kz', 'stemshop.kz', 'playerok.com', 'steamshop.kz', 'store.steampowered.com', 'amazon.com', 'ebay.com', 'etsy.com', 'walmart.com', 'target.com', 'aliexpress.com', 'shopify.com', 'bestbuy.com', 'shein.com', 'temu.com'],
  entertainment: ['megogo.net', 'ivi.ru', 'kinopoisk.ru', 'aitube.kz', 'qazaqstan.tv', 'amediateka.ru', 'teads.tv', 'connatix.com', 'youtube.com', 'affec.tv', 'ispot.tv', 'itorrents-igruha.org', 'primis.tech', 'vidazoo.com', 'netflix.com', 'twitch.tv', 'spotify.com', 'disney.com', 'hbomax.com', 'primevideo.com', 'soundcloud.com', 'bandcamp.com'],
  developer: ['habr.com', 'tproger.ru', 'dou.ua', 'kolesa.group', 'github.com', 'claudecodeapi.com', 'anthropic.com', 'manus.im', 'resend.com', 'stackoverflow.com', 'gitlab.com', 'bitbucket.org', 'npmjs.com', 'dev.to', 'medium.com', 'codepen.io', 'vercel.com', 'netlify.com', 'cloudflare.com', 'docker.com', 'heroku.com', 'digitalocean.com'],
  finance: ['kaspi.kz', 'halykbank.kz', 'forte.kz', 'bcc.kz', 'jusan.kz', 'qiwi.com', 'profinance.kz', 'mastercard.com', 'paypal.com', 'chase.com', 'bankofamerica.com', 'wellsfargo.com', 'citi.com', 'capitalone.com', 'venmo.com', 'coinbase.com', 'binance.com', 'kraken.com', 'stripe.com'],
  education: ['bilimal.kz', 'kundelik.kz', 'stepik.org', 'skyeng.ru', 'otyk.kz', 'it-university.kz', 'savemyexams.com', 'tetrika-school.ru', 'deutschonline.ru', 'studygerman.ru', 'talkpal.ai', 'praktika.ai', 'researchgate.net', 'cvut.cz', 'fsv.cvut.cz', 'educationindex.ru', 'fut.ru', 'chinesescholarshipcouncil.com', 'campuschina.org', 'trincoll.edu', 'coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org', 'skillshare.com', 'duolingo.com', 'quizlet.com', 'chegg.com'],
  news: ['tengrinews.kz', 'zakon.kz', 'inform.kz', 'nur.kz', 'kapital.kz', 'rbc.ru', 'kommersant.ru', 'ria.ru', 'nydailynews.com', 'pcmag.com', 'mediatoday.ru', 'cnn.com', 'bbc.com', 'nytimes.com', 'washingtonpost.com', 'theguardian.com', 'foxnews.com', 'reuters.com', 'apnews.com', 'npr.org'],
  travel: ['aviata.kz', 'tickets.kz', 'chocotravel.com', 'rzd.ru', '2gis.kz', '2gis.ru', '2gis.com', 'indriver.com', 'airbnb.com', 'booking.com', 'expedia.com', 'tripadvisor.com', 'uber.com', 'lyft.com', 'delta.com', 'united.com', 'southwest.com', 'marriott.com', 'hilton.com'],
  email: ['mail.ru', 'yandex.ru', 'list.ru', 'inbox.ru', 'bk.ru', 'mail.google.com', 'gmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'aol.com', 'zoho.com'],
  productivity: ['bitrix24.kz', 'megaplan.ru', 'my.gov.kz', 'tribune.blueconic.net', '123apps.com', '11zon.com', 'pdf24.org', 'smallpdf.com', 'iloveimg.com', 'tinyjpg.com', 'freepdfconvert.com', 'gitmind.com', 'coggle.it', 'visme.co', 'adobe.com', 'crazyrouter.com', 'quillbot.com', 'remove.bg', 'png2jpg.com', 'ffont.ru', 'textdrom.com', 'zoom.sjv.io', 'clarity.ms', 'zoom.us', 'notion.so', 'trello.com', 'asana.com', 'monday.com', 'dropbox.com', 'drive.google.com', 'figma.com', 'miro.com', 'linear.app', 'airtable.com'],
  government: ['.gov.kz', '.gov.ru', '.gov.by', '.gov.uz', '.gov.kg', '.gov.az', '.gov.am', '.gov.ge', '.gov.md', '.gov.tj', '.gov.tm', '.gov', 'europa.eu'],
  education2: ['.edu.kz', '.edu.ru', '.edu.by', '.edu.ua', '.edu.az', '.edu.ge', '.edu.cn', '.edu', 'my.uofminn.org'],
  health: ['103.kz', 'idoctor.kz', 'healthline.com', 'webmd.com', 'drugs.com', 'mayoclinic.org', 'nih.gov', 'medlineplus.gov', 'clevelandclinic.org'],
  ad_tech: ['1rx.io', '360yield.com', '3lift.com', '4dex.io', '6sc.co', 'a-mo.net', 'a-mx.com', 'adentifi.com', 'adform.net', 'adition.com', 'adkernel.com', 'admanmedia.com', 'admaster.cc', 'admatic.de', 'admixer.net', 'adnxs.com', 'adotmob.com', 'adroll.com', 'ads-tinyorbit.com', 'adscale.de', 'adsrvr.org', 'adswizz.com', 'adtarget.biz', 'adtdp.com', 'adtelligent.com', 'adtonos.com', 'advolve.io', 'company-target.com', 'googleadservices.com', 'gsspat.jp', 'resetdigital.co', 'technoratimedia.com', 'yellowblue.io', 'yieldmo.com', 'ymmobi.com', 'zdbb.net', 'zeotap.com', 'zucks.net', 'taboola.com', 'revcontent.com', 'ccgateway.net', 'acint.net', 'ad-m.asia', 'ad-stir.com', 'adfox.ru', 'adgrx.com', '33across.com', 'kimberlite.io', 'catsnetwork.ru', 'semasio.net', 'pubmatic.com', 'giraff.io', 'adx.com.ru', 'w55c.net', 'visx.net', 'bidswitch.net', 'nexx360.io', 'igaw.io', 'rlcdn.com', 'bedrockplatform.bid', 'serving-sys.ru', 'monwave.ru', 'hgrtb.com', 'yastatic.net', 'media.net', '3000.win', 'ladsp.com', 'presage.io', 'sharethis.com', 'tns-counter.ru', 'weborama.com', 'seedtag.com', 'nextmillmedia.com', 'sonobi.com', 'trustedstack.com', 'bricks-co.com', 'sparteo.com', 'myweb3id.io', 'base44.com', 'doubleclick.net', 'googlesyndication.com', 'facebook.net', 'criteo.com', 'openx.net'],
  telecom: ['mts.ru', 'beeline.ru', 'megafon.ru', 'tele2.ru', 'verizon.com', 'att.com', 't-mobile.com', 'sprint.com', 'comcast.com', 'spectrum.com'],
  misc_tools: ['messletters.com', 'aoscdn.com', 'in-contri.ru', 'tvoyamatritsa.ru', 'ailynx.ru'],
  security: ['recaptcha.net'],
  gaming: ['steampowered.com', 'epicgames.com', 'xbox.com', 'playstation.com', 'nintendo.com', 'ea.com', 'ubisoft.com', 'discord.com', 'roblox.com', 'itch.io', 'gog.com', 'origin.com', 'battle.net'],
  food: ['doordash.com', 'ubereats.com', 'grubhub.com', 'instacart.com', 'postmates.com', 'seamless.com', 'chocofood.kz', 'yandexeda.ru', ' delivery.com'],
  crypto: ['coinbase.com', 'binance.com', 'kraken.com', 'crypto.com', 'blockfi.com', 'nexo.io', 'blockchain.com', 'bitstamp.net', 'gemini.com', 'coinmama.com'],
  dating: ['match.com', 'tinder.com', 'bumble.com', 'hinge.co', 'okcupid.com', 'plentyoffish.com', 'zoosk.com', 'eharmony.com'],
  streaming: ['hulu.com', 'disney.com', 'hbomax.com', 'peacocktv.com', 'paramountplus.com', 'appletv.com', 'crunchyroll.com', 'funimation.com', 'polygon.com'],
  insurance: ['geico.com', 'progressive.com', 'statefarm.com', 'allstate.com', 'usaa.com', 'libertymutual.com', 'farmers.com', 'nationwide.com'],
  utilities: ['conedison.com', 'pge.com', 'duke-energy.com', 'exxonmobil.com', 'chevron.com'],
  cdn: ['cloudflare.com', 'akamai.com', 'fastly.net', 'jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com', 'stackpath.com', 'incapsula.com', 'maxcdn.com', 'cloudfront.net'],
  tracking: ['google-analytics.com', 'segment.com', 'mixpanel.com', 'hotjar.com', 'fullstory.com', 'heap.io', 'amplitude.com', 'mouseflow.com', 'crazyegg.com', 'luckyorange.com'],
  cloud: ['aws.amazon.com', 'azure.com', 'gcp.googleapis.com', 'linode.com', 'vultr.com', 'digitalocean.com', 'heroku.com'],
  fonts: ['fonts.googleapis.com', 'fonts.gstatic.com', 'typekit.net'],
  newsletter: ['mailchimp.com', 'convertkit.com', 'substack.com', 'beehiiv.com', 'buttondown.com', 'mailerlite.com', 'sendinblue.com', 'activecampaign.com']
};

const CATEGORY_LOGOS = {
  search: '🔍',
  social: '👥',
  shopping: '🛒',
  entertainment: '🎬',
  developer: '💻',
  finance: '🏦',
  education: '🎓',
  news: '📰',
  travel: '✈️',
  email: '📧',
  productivity: '📊',
  government: '🏛️',
  other: '🌐'
};

const RISK_WEIGHTS = {
  cookies: 10,
  geolocation_permission: 15,
  camera_permission: 15,
  microphone_permission: 15,
  notifications_permission: 8,
  clipboard_read_permission: 12,
  clipboard_write_permission: 8,
  history: 5,
  bookmarks: 3,
  downloads: 3,
  topSites: 4
};

const LEGAL_SUMMARIES = {
  'google.com': {
    legalText: 'We collect location, search history, browsing activity, device info, and may share with advertisers for personalized ads.',
    simplifiedSummary: 'Google uses your search history and location to show personalized ads. Your data helps improve their services.',
    whatTheyGet: ['Search history', 'Location data', 'Device info', 'Browsing activity'],
    whatYouGet: ['Search results', 'Personalized recommendations', 'Sync across devices', 'Smarter suggestions'],
    dataRetention: 'Up to 18 months for search activity',
    thirdPartySharing: 'Advertisers, analytics partners'
  },
  'facebook.com': {
    legalText: 'We collect profile info, contacts, messages, location, browsing history across websites, and share with third parties for advertising.',
    simplifiedSummary: 'Facebook tracks your activity on and off their platform to show targeted ads and improve their algorithms.',
    whatTheyGet: ['Profile data', 'Messages', 'Location', 'Off-site activity', 'Contacts'],
    whatYouGet: ['Social connection', 'Targeted content', 'Ad-free experience (paid)', 'Event invitations'],
    dataRetention: 'Until you delete your account',
    thirdPartySharing: 'Advertisers, app developers, research partners'
  },
  'amazon.com': {
    legalText: 'We collect purchase history, browsing history, location, device info, and voice recordings from Alexa for advertising and product recommendations.',
    simplifiedSummary: 'Amazon uses your shopping history and browsing to recommend products and show personalized ads.',
    whatTheyGet: ['Purchase history', 'Browsing history', 'Location', 'Voice recordings', 'Payment info'],
    whatYouGet: ['Fast checkout', 'Product recommendations', 'Package tracking', 'Prime benefits'],
    dataRetention: 'Indefinite for account data',
    thirdPartySharing: 'Sellers, advertisers, analytics'
  },
  'youtube.com': {
    legalText: 'We collect watch history, search history, location, device info, and interactions for personalized video recommendations and ads.',
    simplifiedSummary: 'YouTube tracks what you watch to recommend videos and show ads based on your interests.',
    whatTheyGet: ['Watch history', 'Search history', 'Location', 'Device info', 'Interactions'],
    whatYouGet: ['Video recommendations', 'Subscriptions', 'Watch history sync', 'Personalized feeds'],
    dataRetention: 'Up to 36 months for watch history',
    thirdPartySharing: 'Advertisers, content creators'
  },
  'twitter.com': {
    legalText: 'We collect tweets, DMs, location, device info, and browsing history to personalize content and ads.',
    simplifiedSummary: 'Twitter uses your tweets and activity to personalize your feed and show relevant ads.',
    whatTheyGet: ['Tweets', 'DMs', 'Location', 'Device info', 'Contacts'],
    whatYouGet: ['Timeline curation', 'Trending topics', 'Ad-free experience (paid)', 'Analytics'],
    dataRetention: 'Until account deletion',
    thirdPartySharing: 'Advertisers, research partners'
  },
  'instagram.com': {
    legalText: 'We collect photos, messages, location, device info, and browsing activity for content and ad personalization.',
    simplifiedSummary: 'Instagram uses your posts, messages, and activity to show personalized content and ads.',
    whatTheyGet: ['Photos', 'Messages', 'Location', 'Device info', 'Off-site activity'],
    whatYouGet: ['Feed customization', 'Story features', 'Reels recommendations', 'Shop suggestions'],
    dataRetention: 'Until you delete content or account',
    thirdPartySharing: 'Advertisers, Meta companies'
  },
  'netflix.com': {
    legalText: 'We collect viewing history, preferences, device info, and interactions to recommend content and improve streaming.',
    simplifiedSummary: 'Netflix uses what you watch to recommend shows and movies tailored to your tastes.',
    whatTheyGet: ['Viewing history', 'Preferences', 'Device info', 'Interactions'],
    whatYouGet: ['Personalized recommendations', 'Continue watching', 'Multiple profiles', 'Offline downloads'],
    dataRetention: 'Indefinite for viewing history',
    thirdPartySharing: 'Content providers, ISPs'
  },
  'linkedin.com': {
    legalText: 'We collect profile info, connections, messages, activity, and professional data for job recommendations and advertising.',
    simplifiedSummary: 'LinkedIn uses your professional profile and activity to connect you with jobs and show relevant ads.',
    whatTheyGet: ['Profile data', 'Connections', 'Messages', 'Work history', 'Activity'],
    whatYouGet: ['Job recommendations', 'Network growth', 'Skill endorsements', 'Learning insights'],
    dataRetention: 'Until account deletion',
    thirdPartySharing: 'Advertisers, employers'
  },
  'github.com': {
    legalText: 'We collect code, commits, issues, and activity data for code hosting and collaboration features.',
    simplifiedSummary: 'GitHub hosts your code and tracks contributions for collaboration and version control.',
    whatTheyGet: ['Code repositories', 'Commits', 'Issues', 'Activity data'],
    whatYouGet: ['Version control', 'Collaboration tools', 'CI/CD', 'Community features'],
    dataRetention: 'Until account deletion',
    thirdPartySharing: 'None for free accounts'
  },
  'microsoft.com': {
    legalText: 'We collect browsing, search, location, device data, and content of communications for Windows, Office, and Azure services.',
    simplifiedSummary: 'Microsoft uses your activity across Windows, Office, and their services to improve products and show ads.',
    whatTheyGet: ['Device data', 'Search history', 'Location', 'Product usage', 'Communications'],
    whatYouGet: ['Productivity tools', 'Cloud storage', 'Security features', 'Cross-device sync'],
    dataRetention: 'Varies by service',
    thirdPartySharing: 'Advertisers, enterprise customers'
  },
  'apple.com': {
    legalText: 'We collect device usage, Apple ID activity, and data from services like iCloud, App Store for functionality and improvements.',
    simplifiedSummary: 'Apple collects device and service usage data to power iCloud, App Store, and improve your experience.',
    whatTheyGet: ['Device usage', 'Apple ID activity', 'Service usage', 'Device health data'],
    whatYouGet: ['iCloud sync', 'App Store recommendations', 'Find My features', 'Software updates'],
    dataRetention: ['Data tied to your account'],
    thirdPartySharing: 'Minimal - privacy-focused'
  },
  'default': {
    legalText: 'This service collects various data types including browsing activity, personal information, and device data.',
    simplifiedSummary: 'This service collects data to provide and improve their services, often including for advertising.',
    whatTheyGet: ['Personal information', 'Usage data', 'Device information', 'Activity logs'],
    whatYouGet: ['Service functionality', 'Personalized experience', 'Account features'],
    dataRetention: 'Varies - check privacy policy',
    thirdPartySharing: 'Check privacy policy'
  }
};

function getLegalSummary(domain, dataTypes = []) {
  // First check for predefined summaries
  const domainKey = Object.keys(LEGAL_SUMMARIES).find(key => 
    key !== 'default' && domain.includes(key)
  );
  
  if (domainKey) {
    return LEGAL_SUMMARIES[domainKey];
  }
  
  // DYNAMIC GENERATION - for unknown domains, generate based on actual data collected
  const hasCookies = dataTypes.includes('cookies');
  const hasHistory = dataTypes.includes('history');
  const hasLocation = dataTypes.includes('location_permission') || dataTypes.includes('location');
  const hasFinancial = dataTypes.includes('financial');
  const hasBookmarks = dataTypes.includes('bookmarks');
  const hasDownloads = dataTypes.includes('downloads');
  const hasTopSites = dataTypes.includes('topSites');
  
  const whatTheyGet = [];
  const whatYouGet = [];
  
  if (hasCookies) {
    whatTheyGet.push('Cookies & tracking identifiers');
    whatYouGet.push('Personalized experience');
  }
  if (hasHistory) {
    whatTheyGet.push('Browsing history');
    whatYouGet.push('Better recommendations');
  }
  if (hasLocation) {
    whatTheyGet.push('Location data');
    whatYouGet.push('Localized content & delivery');
  }
  if (hasFinancial) {
    whatTheyGet.push('Payment information');
    whatYouGet.push('Faster checkout');
  }
  if (hasBookmarks) {
    whatTheyGet.push('Saved bookmarks');
    whatYouGet.push('Access across devices');
  }
  if (hasDownloads) {
    whatTheyGet.push('Download history');
    whatYouGet.push('Resume downloads');
  }
  if (hasTopSites) {
    whatTheyGet.push('Frequent visited sites');
    whatYouGet.push('Quick access to favorites');
  }
  
  // Fallback if nothing detected
  if (whatTheyGet.length === 0) {
    whatTheyGet.push('Basic usage data');
    whatYouGet.push('Service functionality');
  }
  
  return {
    legalText: `Data collected: ${whatTheyGet.join(', ')}. Used for service improvement and personalization.`,
    simplifiedSummary: `${domain} collects ${whatTheyGet.length} type(s) of data to provide services and improve your experience. This includes: ${whatTheyGet.slice(0, 2).join(' and ')}${whatTheyGet.length > 2 ? ' and more' : ''}.`,
    whatTheyGet,
    whatYouGet: whatYouGet.length > 0 ? whatYouGet : ['Service functionality', 'Basic account features'],
    dataRetention: 'Varies by data type - typically until you delete your account or request removal',
    thirdPartySharing: 'May share with analytics providers and advertising partners'
  };
}

function calculateClarityScore(service) {
  const dataTypes = service.dataTypes || [];
  const riskLevel = service.riskLevel || 'low';
  
  let score = 100;
  
  // Penalize for high-risk data types
  if (dataTypes.includes('financial')) score -= 20;
  if (dataTypes.includes('location') || dataTypes.includes('location_permission')) score -= 15;
  if (dataTypes.includes('cookies') && dataTypes.length > 2) score -= 15;
  
  // Penalize for risk level
  if (riskLevel === 'high') score -= 25;
  else if (riskLevel === 'medium') score -= 10;
  
  // Bonus for transparency (having more data types listed = more transparent)
  if (dataTypes.length >= 3) score += 5;
  
  score = Math.max(0, Math.min(100, score));
  
  let grade;
  if (score >= 90) grade = 'A';
  else if (score >= 80) grade = 'B';
  else if (score >= 70) grade = 'C';
  else if (score >= 60) grade = 'D';
  else grade = 'F';
  
  let color;
  if (grade === 'A') color = '#22c55e';
  else if (grade === 'B') color = '#84cc16';
  else if (grade === 'C') color = '#eab308';
  else if (grade === 'D') color = '#f97316';
  else color = '#ef4444';
  
  return {
    score,
    grade,
    color,
    label: grade === 'A' ? 'Excellent Transparency' : 
           grade === 'B' ? 'Good Transparency' : 
           grade === 'C' ? 'Moderate Transparency' : 
           grade === 'D' ? 'Poor Transparency' : 'Critical Transparency'
};
 }
 
 function getPSLData() {
   return {
    "com": true, "co.uk": true, "co.jp": true, "com.br": true, "com.au": true, "de": true, "fr": true, "es": true, "it": true, "ru": true, "cn": true, "in": true, "nz": true, "ca": true, "nl": true, "se": true, "ch": true, "be": true, "at": true, "dk": true, "fi": true, "no": true, "pl": true, "cz": true, "hu": true, "pt": true, "ro": true, "gr": true, "sk": true, "ie": true, "cl": true, "pe": true, "co.nz": true, "org.uk": true, "ac.uk": true, "gov.uk": true, "nhs.uk": true, "ac.jp": true, "ne.jp": true, "or.jp": true, "go.jp": true, "ao": true, "af": true, "ag": true, "ai": true, "al": true, "am": true, "an": true, "ao": true, "aq": true, "ar": true, "as": true, "au": true, "aw": true, "ax": true, "az": true, "ba": true, "bb": true, "bd": true, "bf": true, "bg": true, "bh": true, "bi": true, "bj": true, "bm": true, "bn": true, "bo": true, "br": true, "bs": true, "bt": true, "bv": true, "bw": true, "by": true, "bz": true, "cd": true, "cf": true, "cg": true, "ci": true, "ck": true, "cm": true, "co": true, "cr": true, "cu": true, "cv": true, "cw": true, "cy": true, "dj": true, "dm": true, "do": true, "dz": true, "ec": true, "ee": true, "eg": true, "er": true, "et": true, "eu": true, "ga": true, "ge": true, "gf": true, "gg": true, "gh": true, "gm": true, "gn": true, "gp": true, "gq": true, "gs": true, "gt": true, "gu": true, "gw": true, "gy": true, "hk": true, "hm": true, "hn": true, "hr": true, "ht": true, "id": true, "il": true, "im": true, "io": true, "iq": true, "ir": true, "is": true, "je": true, "jm": true, "jo": true, "jp": true, "ke": true, "kg": true, "kh": true, "ki": true, "km": true, "kn": true, "kp": true, "kr": true, "kw": true, "ky": true, "kz": true, "la": true, "lb": true, "lc": true, "li": true, "lk": true, "lr": true, "ls": true, "lt": true, "lu": true, "lv": true, "ly": true, "ma": true, "mc": true, "md": true, "me": true, "mg": true, "mh": true, "mk": true, "ml": true, "mm": true, "mn": true, "mo": true, "mp": true, "mq": true, "mr": true, "ms": true, "mt": true, "mu": true, "mv": true, "mw": true, "my": true, "mz": true, "na": true, "nc": true, "ne": true, "nf": true, "ng": true, "ni": true, "np": true, "nr": true, "nu": true, "om": true, "pa": true, "pf": true, "pg": true, "ph": true, "pk": true, "pl": true, "pm": true, "pn": true, "pr": true, "ps": true, "pt": true, "pw": true, "py": true, "qa": true, "re": true, "rs": true, "ru": true, "rw": true, "sa": true, "sb": true, "sc": true, "sd": true, "sg": true, "sh": true, "si": true, "sj": true, "sk": true, "sl": true, "sm": true, "sn": true, "so": true, "sr": true, "ss": true, "st": true, "su": true, "sv": true, "sx": true, "sy": true, "sz": true, "tc": true, "td": true, "tf": true, "tg": true, "th": true, "tj": true, "tk": true, "tl": true, "tm": true, "tn": true, "to": true, "tr": true, "tt": true, "tv": true, "tw": true, "tz": true, "ua": true, "ug": true, "uk": true, "us": true, "uy": true, "uz": true, "va": true, "vc": true, "ve": true, "vg": true, "vi": true, "vn": true, "vu": true, "wf": true, "ws": true, "ye": true, "yt": true, "za": true, "zm": true, "zw": true
  };
}

function getRegisteredDomain(hostname) {
  const parts = hostname.split('.');
  if (parts.length < 2) return hostname;
  
  const psl = getPSLData();
  
  for (let i = parts.length - 2; i >= 0; i--) {
    const suffix = parts.slice(i).join('.');
    if (psl[suffix]) {
      if (i === parts.length - 2) return hostname;
      return parts.slice(i - 1).join('.');
    }
  }
  
  if (parts.length >= 3) {
    return parts.slice(-2).join('.');
  }
  return hostname;
}

function categorizeDomain(domain) {
  const lower = domain.toLowerCase();
  
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.startsWith('.')) {
        if (lower.endsWith(pattern)) return category;
      } else if (lower === pattern || lower.includes('.' + pattern)) {
        return category;
      }
    }
  }
  
  return 'other';
}

function getDomainLogo(category) {
  return CATEGORY_LOGOS[category] || CATEGORY_LOGOS.other;
}

function calculateRiskScore(dataTypes, permissions) {
  let score = 0;
  
  for (const dt of dataTypes) {
    score += RISK_WEIGHTS[dt] || 0;
  }
  
  for (const perm of permissions || []) {
    const permKey = perm + '_permission';
    score += RISK_WEIGHTS[permKey] || 0;
  }
  
  if (score >= 15) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

function getRiskLevel(score) {
  if (score >= 15) return { id: 'high', label: 'High Risk', color: '#ef4444' };
  if (score >= 5) return { id: 'medium', label: 'Medium Risk', color: '#eab308' };
  return { id: 'low', label: 'Low Risk', color: '#22c55e' };
}

function getStorage(key) {
  return new Promise(resolve => {
    chrome.storage.local.get(key, r => resolve(r[key] || null));
  });
}

function setStorage(key, value) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, () => resolve(true));
  });
}

async function collectCookies() {
  try {
    const cookies = await chrome.cookies.getAll({});
    const domainMap = {};
    
    for (const cookie of cookies) {
      const domain = cookie.domain.replace(/^\./, '');
      const registered = getRegisteredDomain(domain);
      
      if (!domainMap[registered]) {
        domainMap[registered] = { count: 0, firstSeen: null, lastSeen: null };
      }
      
      domainMap[registered].count++;
      
      if (cookie.creationDate) {
        const created = new Date(parseInt(cookie.creationDate) * 1000);
        if (!domainMap[registered].firstSeen || created < domainMap[registered].firstSeen) {
          domainMap[registered].firstSeen = created;
        }
      }
      
      const accessed = new Date(cookie.lastAccessed || Date.now());
      if (!domainMap[registered].lastSeen || accessed > domainMap[registered].lastSeen) {
        domainMap[registered].lastSeen = accessed;
      }
    }
    
    return domainMap;
  } catch (e) {
    console.error('Error collecting cookies:', e);
    return {};
  }
}

async function collectPermissions() {
  return {};
}

async function collectHistory() {
  try {
    const history = await chrome.history.search({ text: '', maxResults: 500, startTime: Date.now() - 90 * 24 * 60 * 60 * 1000 });
    const domainMap = {};
    
    for (const item of history) {
      try {
        const url = new URL(item.url);
        const domain = getRegisteredDomain(url.hostname);
        
        if (!domainMap[domain]) {
          domainMap[domain] = { count: 0, lastVisit: null };
        }
        
        domainMap[domain].count++;
        
        if (!domainMap[domain].lastVisit || new Date(item.lastVisitTime) > domainMap[domain].lastVisit) {
          domainMap[domain].lastVisit = new Date(item.lastVisitTime);
        }
      } catch (e) {}
    }
    
    return domainMap;
  } catch (e) {
    console.error('Error collecting history:', e);
    return {};
  }
}

async function collectBookmarks() {
  try {
    const tree = await chrome.bookmarks.getTree();
    const domainMap = {};
    
    function traverse(nodes) {
      for (const node of nodes) {
        if (node.url) {
          try {
            const url = new URL(node.url);
            const domain = getRegisteredDomain(url.hostname);
            
            if (!domainMap[domain]) {
              domainMap[domain] = { count: 0 };
            }
            domainMap[domain].count++;
          } catch (e) {}
        }
        if (node.children) traverse(node.children);
      }
    }
    
    traverse(tree);
    return domainMap;
  } catch (e) {
    console.error('Error collecting bookmarks:', e);
    return {};
  }
}

async function collectDownloads() {
  try {
    const downloads = await chrome.downloads.search({});
    const domainMap = {};
    
    for (const d of downloads) {
      if (d.url) {
        try {
          const url = new URL(d.url);
          const domain = getRegisteredDomain(url.hostname);
          
          if (!domainMap[domain]) {
            domainMap[domain] = { count: 0 };
          }
          domainMap[domain].count++;
        } catch (e) {}
      }
    }
    
    return domainMap;
  } catch (e) {
    console.error('Error collecting downloads:', e);
    return {};
  }
}

async function collectTopSites() {
  try {
    const sites = await chrome.topSites.get();
    const domainMap = {};
    
    for (const site of sites) {
      try {
        const url = new URL(site.url);
        const domain = getRegisteredDomain(url.hostname);
        
        if (!domainMap[domain]) {
          domainMap[domain] = { count: 0 };
        }
        domainMap[domain].count++;
      } catch (e) {}
    }
    
    return domainMap;
  } catch (e) {
    console.error('Error collecting top sites:', e);
    return {};
  }
}

async function collectAllData() {
  console.log('Collecting browser data...');
  
  const [cookies, permissions, history, bookmarks, downloads, topSites] = await Promise.all([
    collectCookies(),
    collectPermissions(),
    collectHistory(),
    collectBookmarks(),
    collectDownloads(),
    collectTopSites()
  ]);
  
  const domainData = {};
  
  function addData(domain, type, data) {
    if (!domainData[domain]) {
      domainData[domain] = {
        id: domain,
        name: domain,
        displayName: domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1),
        category: categorizeDomain(domain),
        dataTypes: new Set(),
        cookieCount: 0,
        historyCount: 0,
        bookmarkCount: 0,
        downloadCount: 0,
        permissions: new Set(),
        firstSeen: null,
        lastSeen: null,
        active: true
      };
    }
    
    if (type === 'cookies') {
      domainData[domain].cookieCount += data.count;
      if (data.firstSeen && (!domainData[domain].firstSeen || data.firstSeen < domainData[domain].firstSeen)) {
        domainData[domain].firstSeen = data.firstSeen;
      }
      if (data.lastSeen && (!domainData[domain].lastSeen || data.lastSeen > domainData[domain].lastSeen)) {
        domainData[domain].lastSeen = data.lastSeen;
      }
      if (data.count > 0) {
        domainData[domain].dataTypes.add('cookies');
      }
    }
    
    if (type === 'history') {
      domainData[domain].historyCount += data.count;
      if (data.lastVisit && (!domainData[domain].lastSeen || data.lastVisit > domainData[domain].lastSeen)) {
        domainData[domain].lastSeen = data.lastVisit;
      }
      if (data.count > 0) {
        domainData[domain].dataTypes.add('history');
      }
    }
    
    if (type === 'bookmarks') {
      domainData[domain].bookmarkCount += data.count;
      if (data.count > 0) {
        domainData[domain].dataTypes.add('bookmarks');
      }
    }
    
    if (type === 'downloads') {
      domainData[domain].downloadCount += data.count;
      if (data.count > 0) {
        domainData[domain].dataTypes.add('downloads');
      }
    }
    
    if (type === 'topSites') {
      domainData[domain].dataTypes.add('topSites');
    }
    
    if (type === 'permissions' && data) {
      for (const perm of data) {
        domainData[domain].permissions.add(perm);
        domainData[domain].dataTypes.add(perm + '_permission');
      }
    }
  }
  
  for (const [domain, data] of Object.entries(cookies)) {
    addData(domain, 'cookies', data);
  }
  
  for (const [domain, data] of Object.entries(history)) {
    addData(domain, 'history', data);
  }
  
  for (const [domain, data] of Object.entries(bookmarks)) {
    addData(domain, 'bookmarks', data);
  }
  
  for (const [domain, data] of Object.entries(downloads)) {
    addData(domain, 'downloads', data);
  }
  
  for (const [domain, data] of Object.entries(topSites)) {
    addData(domain, 'topSites', data);
  }
  
  const filteredDomains = {};
  
  for (const [domain, data] of Object.entries(domainData)) {
    const hasCookies = data.cookieCount > 0;
    const hasPermissions = data.permissions.size > 0;
    const hasSignificantData = hasCookies || hasPermissions || data.historyCount > 10 || data.bookmarkCount > 0;
    
    if (hasSignificantData || (data.historyCount > 5 && data.cookieCount > 0)) {
      data.logo = getDomainLogo(data.category);
      data.riskLevel = calculateRiskScore(Array.from(data.dataTypes), Array.from(data.permissions));
      data.riskInfo = getRiskLevel(data.riskLevel === 'high' ? 20 : data.riskLevel === 'medium' ? 10 : 3);
      data.dataTypes = Array.from(data.dataTypes);
      data.permissions = Array.from(data.permissions);
      data.firstSeen = data.firstSeen ? data.firstSeen.toISOString() : null;
      data.lastSeen = data.lastSeen ? data.lastSeen.toISOString() : new Date().toISOString();
      
      const legalSummary = getLegalSummary(domain, data.dataTypes);
      data.legalSummary = legalSummary;
      data.clarityScore = calculateClarityScore({ ...data, name: domain });
      
      filteredDomains[domain] = data;
    }
  }
  
  console.log('Collected data for', Object.keys(filteredDomains).length, 'domains');
  
  const oldServices = await getStorage('consent_os_services') || {};
  const oldDomains = new Set(Object.keys(oldServices));
  for (const domain of Object.keys(filteredDomains)) {
    if (!oldDomains.has(domain)) {
      await addHistoryEvent('domain_added', domain, domain, filteredDomains[domain].dataTypes, filteredDomains[domain].category, { cookieCount: filteredDomains[domain].cookieCount });
    }
  }
  
  return filteredDomains;
}

async function getServices() {
  let services = await getStorage('consent_os_services');
  const lastCollect = await getStorage('consent_os_last_collect') || 0;
  const now = Date.now();
  
  if (!services || (now - lastCollect) > 60000) {
    services = await collectAllData();
    await setStorage('consent_os_services', services);
    await setStorage('consent_os_last_collect', now);
  }
  
  return Object.values(services).filter(s => s.active);
}

async function getServiceDetail(id) {
  const services = await getStorage('consent_os_services') || {};
  const service = services[id];
  
  if (!service) return null;
  
  return {
    ...service,
    category: { id: service.category, name: service.category.charAt(0).toUpperCase() + service.category.slice(1) },
    riskLevel: getRiskLevel(service.riskLevel === 'high' ? 20 : service.riskLevel === 'medium' ? 10 : 3)
  };
}

async function revokeService(id) {
  const services = await getStorage('consent_os_services') || {};
  const service = services[id];
  
  if (!service) {
    return { success: false, error: 'Service not found' };
  }
  
  let cookiesRemoved = 0;
  let permissionsRemoved = false;
  
  try {
    const cookies = await chrome.cookies.getAll({ domain: '.' + id });
    for (const cookie of cookies) {
      await chrome.cookies.remove({ url: 'https://' + id + cookie.path, name: cookie.name });
      cookiesRemoved++;
    }
    
    const httpCookies = await chrome.cookies.getAll({ domain: id });
    for (const cookie of httpCookies) {
      await chrome.cookies.remove({ url: 'http://' + id + cookie.path, name: cookie.name });
      cookiesRemoved++;
    }
  } catch (e) {
    console.error('Error removing cookies:', e);
  }
  
  try {
    const allPerms = await chrome.permissions.getAll();
    for (const origin of allPerms.origins || []) {
      if (origin.includes(id)) {
        try {
          await chrome.permissions.remove({ origins: [origin] });
          permissionsRemoved = true;
        } catch (e) {
          console.log('Could not remove permission:', origin);
        }
      }
    }
  } catch (e) {
    console.log('Permissions API not available:', e.message);
  }
  
  services[id] = { ...service, active: false, revokedAt: new Date().toISOString() };
  await setStorage('consent_os_services', services);
  
  const history = await getStorage('consent_os_history') || [];
  history.unshift({
    id: 'revoke-' + Date.now(),
    type: 'revoke',
    serviceId: id,
    serviceName: id,
    timestamp: new Date().toISOString(),
    dataTypes: service.dataTypes,
    category: service.category,
    details: { cookiesRemoved, permissionsRemoved }
  });
  await setStorage('consent_os_history', history);
  
  return { 
    success: true, 
    message: `Revoked access for ${id} (${cookiesRemoved} cookies cleared)`
  };
}

async function getStats() {
  const services = await getServices();
  const highRisk = services.filter(s => s.riskLevel === 'high' || s.riskInfo?.id === 'high').length;
  const mediumRisk = services.filter(s => s.riskLevel === 'medium' || s.riskInfo?.id === 'medium').length;
  const lowRisk = services.filter(s => s.riskLevel === 'low' || s.riskInfo?.id === 'low').length;
  
  const categoryCount = {};
  for (const s of services) {
    categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
  }
  
  const totalCookies = services.reduce((sum, s) => sum + (s.cookieCount || 0), 0);
  const totalHistory = services.reduce((sum, s) => sum + (s.historyCount || 0), 0);
  const totalDownloads = services.reduce((sum, s) => sum + (s.downloadCount || 0), 0);
  
  return {
    totalServices: services.length,
    highRisk,
    mediumRisk,
    lowRisk,
    categoryCount,
    totalCookies,
    totalHistory,
    totalDownloads,
    dataTypesCount: [...new Set(services.flatMap(s => s.dataTypes))].length
  };
}

async function getHistory() {
  return await getStorage('consent_os_history') || [];
}

async function addHistoryEvent(type, serviceId, serviceName, dataTypes, category, details = {}) {
  const history = await getStorage('consent_os_history') || [];
  history.unshift({
    id: `${type}-${Date.now()}`,
    type,
    serviceId,
    serviceName,
    timestamp: new Date().toISOString(),
    dataTypes: dataTypes || [],
    category: category || 'other',
    details
  });
  await setStorage('consent_os_history', history);
}

try {
  if (typeof chrome.cookies?.onCreated?.addListener === 'function') {
    chrome.cookies.onCreated.addListener(async (cookie) => {
      try {
        const domain = cookie.domain?.replace(/^\./, '') || 'unknown';
        const registered = getRegisteredDomain(domain);
        await addHistoryEvent('cookie_created', registered, registered, ['cookies'], categorizeDomain(registered), { name: cookie.name });
      } catch (e) {
        console.error('Cookie created listener error:', e);
      }
    });
  }
} catch (e) {
  console.log('Cookie onCreated listener not available:', e.message);
}

try {
  if (typeof chrome.cookies?.onDeleted?.addListener === 'function') {
    chrome.cookies.onDeleted.addListener(async (deleteInfo) => {
      try {
        const domain = deleteInfo.domain?.replace(/^\./, '') || 'unknown';
        if (domain && domain !== 'unknown') {
          await addHistoryEvent('cookie_deleted', domain, domain, ['cookies'], categorizeDomain(domain), { name: deleteInfo.name });
        }
      } catch (e) {
        console.error('Cookie deleted listener error:', e);
      }
    });
  }
} catch (e) {
  console.log('Cookie onDeleted listener not available:', e.message);
}

async function refreshData() {
  const services = await collectAllData();
  await setStorage('consent_os_services', services);
  await setStorage('consent_os_last_collect', Date.now());
  return services;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('Consent-os2.0 installed');
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Consent-os2.0 started');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg).then(sendResponse);
  return true;
});

async function handleMessage(msg) {
  if (!msg || !msg.type) return { success: false, error: 'No message type' };
  
  console.log('Handling message:', msg.type);
  
  try {
    switch (msg.type) {
      case 'GET_SERVICES': {
        const services = await getServices();
        return { success: true, data: services };
      }
      
      case 'GET_STATS': {
        const stats = await getStats();
        return { success: true, data: stats };
      }
      
      case 'GET_HISTORY': {
        const history = await getHistory();
        return { success: true, data: history };
      }
      
      case 'GET_ALL_COOKIES': {
        const cookies = await chrome.cookies.getAll({});
        return { success: true, data: cookies };
      }
      
      case 'GET_SERVICE_DETAIL': {
        const detail = await getServiceDetail(msg.payload?.id);
        return { success: true, data: detail };
      }
      
      case 'REVOKE_SERVICE': {
        const result = await revokeService(msg.payload?.id);
        return { success: true, data: result };
      }
      
      case 'REFRESH_DATA': {
        const services = await refreshData();
        return { success: true, data: Object.values(services).filter(s => s.active) };
      }
      
      default:
        return { success: false, error: 'Unknown type' };
    }
  } catch (e) {
    console.error('Error handling message:', e);
    return { success: false, error: e.message };
  }
}