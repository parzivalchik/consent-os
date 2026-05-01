# Consent-os

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Chrome-brightgreen)
![Manifest](https://img.shields.io/badge/manifest-V3-purple)

**Minimalist Tactical Privacy Dashboard for Chrome**

</div>

---

## Overview

Consent-os is a Chrome extension that provides a comprehensive privacy management dashboard. It scans your browser to identify domains with active data collection (cookies, history, bookmarks, downloads), categorizes them by type, assesses risk levels, and provides tools to manage and revoke permissions.

### Key Capabilities

- **Automatic Domain Scanning**: Discovers all domains with browser data access
- **Risk Assessment**: Assigns High/Medium/Low risk scores based on data types
- **Privacy Grading**: Provides A-F transparency scores for each service
- **Permission Management**: Bulk revoke cookies and permissions for any domain
- **Real-time Monitoring**: Tracks cookie creation/deletion events
- **Timeline History**: Complete audit log of all privacy actions
- **Export Options**: Export data as JSON, CSV, or PDF report

---

## Installation

### From Source

```bash
# Clone the repository
git clone https://github.com/parzivalchik/consent-os.git
cd consent-os

# Install dependencies
npm install

# Build the extension
npm run build
```

### Load into Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `dist` folder (after running `npm run build`)

---

## Features

### Privacy Dashboard

- **Privacy Score**: Aggregate score (0-100) based on data exposure
- **Statistics**: Total domains, cookies, history entries tracked
- **Category Breakdown**: Visual pie chart of data by category (Shopping, Social, Finance, etc.)
- **Risk Distribution**: High/Medium/Low risk breakdown with counts

### Domain Management

- **Service List**: All tracked domains with risk indicators
- **Detail View**: Full breakdown of data types collected per domain
- **Risk Assessment**: Weighted scoring based on cookie count, permissions, history
- **Legal Summaries**: Pre-defined privacy policy summaries for major sites (Google, Facebook, Amazon, etc.)
- **Transparency Grades**: A-F grading based on data collection practices

### Permission Controls

- **Bulk Selection**: Select multiple domains for batch operations
- **One-Click Revoke**: Remove all cookies and permissions for selected domains
- **Clear All Cookies**: Global cookie clearing with domain filtering
- **Selective Revocation**: Target specific domains for granular control

### Analysis Tools

- **Third-Party Connections**: Identify tracking domains across multiple sites
- **Data Type Distribution**: Breakdown of what data types are collected (cookies, history, bookmarks, etc.)
- **Recommendations**: AI-generated privacy improvement suggestions

### Additional Features

- **Dark/Light Theme**: Toggle between light and dark modes
- **Timeline View**: Chronological history of all privacy events
- **Search & Filter**: Search domains, filter by category/risk
- **Export**: Generate JSON, CSV, or PDF reports
- **Real-time Updates**: Live cookie monitoring with instant updates

---

## Architecture

```
consent-os/
├── core/                        # Core business logic
│   ├── storage.js              # Chrome Storage abstraction
│   ├── services.js             # Data models & service management
│   └── messaging.js            # Inter-component message passing
├── background/
│   └── service_worker.js       # Main extension logic & data collection
├── popup/                       # Browser action popup (lightweight UI)
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/                     # Full settings/dashboard page
│   ├── options.html
│   ├── options.js
│   └── options.css
├── src/                         # Source files for build (Vite)
├── images/                      # Extension icons
├── _locales/                    # Internationalization
├── dist/                        # Built output
├── manifest.json                # Extension manifest (V3)
├── package.json                 # Dependencies & scripts
├── vite.config.js              # Build configuration
├── tailwind.config.js          # Tailwind CSS config
└── postcss.config.js           # PostCSS config
```

### Core Modules

| Module | Purpose |
|--------|---------|
| `storage.js` | Abstracts Chrome `storage.local` API for persistent data |
| `services.js` | Manages service CRUD, risk levels, categories, stats |
| `messaging.js` | Handles message passing between popup, options, and background |
| `service_worker.js` | Main logic: data collection, domain categorization, risk calculation, event listeners |

### Data Flow

```
Browser Data Sources          Processing Pipeline           UI Display
─────────────────────         ───────────────────          ──────────
Cookies ─────────────────┐
                         │
History ────────────────┼──► collectAllData() ──────────► Service Model
                         │        │                           │
Bookmarks ──────────────┤        ▼                           │
                         │   categorizeDomain()            ▼
Downloads ──────────────┤   calculateRiskScore()         Dashboard UI
                         │   getLegalSummary()
TopSites ───────────────┘   calculateClarityScore()      (Popup/Options)
```

---

## Permissions

The extension requires the following Chrome permissions:

| Permission | Purpose |
|------------|---------|
| `cookies` | Read and remove cookies for tracked domains |
| `history` | Scan browsing history to identify visited domains |
| `bookmarks` | Analyze bookmarked domains |
| `downloads` | Track download history by domain |
| `storage` | Persist service data and settings locally |
| `topSites` | Access most visited sites for risk assessment |
| `tabs` | Read tab information for domain association |
| `<all_urls>` | Analyze cookies and data from any website |

---

## Risk Assessment

The extension calculates risk using weighted scoring:

| Data Type | Weight | Risk Contribution |
|-----------|--------|-------------------|
| Geolocation | 15 | High |
| Camera | 15 | High |
| Microphone | 15 | High |
| Clipboard Read | 12 | Medium-High |
| Cookies | 10 | Medium |
| Clipboard Write | 8 | Medium |
| Notifications | 8 | Low-Medium |
| History | 5 | Low |
| Bookmarks | 3 | Low |
| Downloads | 3 | Low |
| TopSites | 4 | Low |

### Risk Levels

- **High**: Score ≥ 15 (e.g., location tracking, financial data)
- **Medium**: Score ≥ 5 (e.g., cookies, notifications)
- **Low**: Score < 5 (e.g., bookmarks, downloads)

---

## Tech Stack

- **Build Tool**: [Vite](https://vitejs.dev/) - Fast frontend tooling
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Framework**: [React](https://react.dev/) - Component-based UI (optional, for advanced features)
- **Browser API**: Chrome Extension Manifest V3
- **Storage**: Chrome `chrome.storage.local`

---

## Development

### Available Scripts

```bash
# Development mode (watch + rebuild)
npm run dev

# Production build
npm run build

# Preview built extension
npm run preview
```

### Adding New Features

1. **New Category**: Add domain patterns to `CATEGORY_PATTERNS` in `service_worker.js`
2. **New Risk Weight**: Add entry to `RISK_WEIGHTS` object
3. **New Legal Summary**: Add domain entry to `LEGAL_SUMMARIES` object
4. **New UI Tab**: Add section to `options/options.html` and corresponding handler in `options.js`

---

## Screenshots

> _Add screenshots of the popup dashboard and full options page here_

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Acknowledgments

- Inspired by privacy-first design principles
- Built with modern Chrome Extension APIs
