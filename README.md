# 🛡️ LogSentinel — SOC Log Analyzer & Incident Detector

> Enterprise-grade Security Operations Center dashboard for real-time log analysis and automated incident detection — **runs entirely in the browser, no backend required.**

![Tech Stack](https://img.shields.io/badge/React-18-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

## ✨ Features

- **📂 Drag & Drop Log Upload** — `.log`, `.txt`, `.csv` parsed instantly in-browser
- **🔍 Multi-Format Log Parsing** — Apache, Nginx, Syslog, Log4j, generic ISO timestamps
- **🚨 8 Incident Detection Rules** — Brute force, SQL injection, OOM, port scanning, suspicious file access & more
- **📊 Analytics Dashboard** — Area charts, Pie charts, Radar charts, Bar charts via Recharts
- **📋 Advanced Log Viewer** — Search, filter by level/source, paginated (100 per page)
- **💾 Full Persistence** — LocalStorage keeps data across page refreshes
- **⚡ Sample Log File** — One-click demo data for immediate exploration
- **🎨 SOC-Themed UI** — Dark dashboard, neon accents, scan lines, glow effects

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3 + shadcn/ui primitives |
| Charts | Recharts (Area, Pie, Bar, Radar) |
| Animation | Framer Motion |
| Icons | Lucide React |
| Storage | LocalStorage only |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui base components
│   ├── Topbar.tsx       # SOC header with live clock
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── DashboardOverview.tsx  # Main dashboard with charts
│   ├── UploadZone.tsx   # Drag & drop file upload
│   ├── IncidentPanel.tsx # Incident cards display
│   ├── LogViewer.tsx    # Searchable/filterable log table
│   ├── AnalyticsView.tsx # Advanced charts page
│   ├── StatCard.tsx     # Metric cards
│   └── EmptyState.tsx   # Welcome screen
├── lib/
│   ├── logParser.ts     # Multi-format log parser
│   ├── incidentDetector.ts  # 8 detection rules
│   ├── analytics.ts     # Metrics computation
│   ├── storage.ts       # LocalStorage wrapper
│   └── sampleLogs.ts    # Demo SOC log data
└── types/
    └── index.ts         # TypeScript interfaces
```

## 🔒 Detection Rules

| Rule ID | Name | Severity |
|---------|------|----------|
| R001 | Multiple Authentication Failures | HIGH |
| R002 | Critical System Error Burst | CRITICAL |
| R003 | SQL Injection Attempt | HIGH |
| R004 | High Error Rate (>20%) | MEDIUM |
| R005 | Service Crash / OOM Killer | CRITICAL |
| R006 | Suspicious File Access | HIGH |
| R007 | Network Port Scan | MEDIUM |
| R008 | Repeated 5xx HTTP Errors | MEDIUM |

## 🎨 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Matam-Rohith/log-analyzer-incident-detector)

---

**Built by [Matam Rohith](https://rohith-portfolio-six.vercel.app/) — Portfolio Project**
