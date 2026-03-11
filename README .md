<div align="center">

```
█████╗ ██████╗ ████████╗██╗  ██╗ █████╗ 
██╔══██╗██╔══██╗╚══██╔══╝██║  ██║██╔══██╗
███████║██████╔╝   ██║   ███████║███████║
██╔══██║██╔══██╗   ██║   ██╔══██║██╔══██║
██║  ██║██║  ██║   ██║   ██║  ██║██║  ██║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
```

### ⚡ *Find Meaning in Your Data. Instantly.* ⚡

<br/>

[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20FastAPI-465FFF?style=for-the-badge)](#)
[![AI Powered](https://img.shields.io/badge/AI-GPT--4o%20Powered-10b981?style=for-the-badge&logo=openai)](#)
[![Dataset](https://img.shields.io/badge/Dataset-55%2C555%20Records-f59e0b?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-Live%20%26%20Working-brightgreen?style=for-the-badge)](#)

<br/>

> *"Don't wait 2 days for your data analyst. Ask Artha. Get answers in 2 seconds."*

<br/>

---

</div>

## 🌌 What is Artha?

**Artha** (अर्थ) means *meaning* and *wealth* in Sanskrit — and that is exactly what this platform delivers.

Artha is a **conversational AI Business Intelligence platform** that eliminates the bottleneck between business questions and data answers. No SQL. No BI tools. No waiting for a data analyst.

A non-technical marketing executive types a plain English question — Artha fetches real data, selects the right chart, generates an AI insight, and renders a fully interactive dashboard in under 2 seconds.

Built for the real world. Powered by real data. Honest about what it knows and what it doesn't.

<br/>

---

## 🚀 The Problem We Solved

> *Every company has data. Almost nobody can access it.*

| 😓 Before Artha | ⚡ After Artha |
|----------------|--------------|
| Write SQL queries manually | Type in plain English |
| Wait 2 days for analyst | Get answers in 2 seconds |
| Static Excel reports | Interactive live dashboards |
| Only technical users | Anyone in the company |
| No follow-up possible | Conversational — ask follow-ups |
| Guessing what to analyze | AI proactively finds insights |

<br/>

---

## 🧠 Core Feature Suite

### `01` — 💬 Artha Lens — Natural Language to Dashboard

> *"Ask anything. Get a dashboard. No SQL required."*

- Type any business question in plain English
- Smart SQL engine detects column names dynamically
- Correct chart type selected automatically — bar, line, pie, donut
- GPT-4o generates a 2-sentence human insight from real numbers
- Works for **any CSV dataset** — zero hardcoding

```
User types:  "Which channel has the highest ROI?"
              ↓
SQL Engine:  SELECT Channel_Used, AVG(ROI) FROM marketing
             GROUP BY Channel_Used ORDER BY avg_roi DESC
              ↓
Chart:       Bar chart with real data
              ↓
Insight:     "Instagram leads with 3.2x ROI, 40% above average..."
```

---

### `02` — 🔮 What-If Simulator — Predictive Intelligence

> *"Don't just analyze the past. Predict the future."*

- Type a hypothetical scenario in plain English
- AI calculates predicted outcomes using **real database numbers**
- Shows Current vs Predicted with percentage change
- Breakdown bars show impact across categories
- Confidence score — High / Medium / Low
- Risk analysis and one actionable recommendation

```
"What if we double the Instagram budget?"

Current Revenue:   ₹2865.6Cr
Predicted Revenue: ₹3891.4Cr  ▲ 35.8%
Confidence:        High
```

**No other team built predictive analytics. Everyone else showed past data. We showed the future.**

---

### `03` — 🚨 Anomaly Detective — Proactive AI Intelligence

> *"Stop waiting to be asked. Start finding what matters."*

- Automatically scans entire dataset on load — **without being asked**
- Surfaces 3 critical insights: WINNER, ALERT, OPPORTUNITY, ANOMALY
- Uses real statistical analysis — variance, std deviation, top/bottom gap
- Every card is clickable — triggers deep analysis instantly
- Rescan button for fresh detection after new data upload

```
⚡ AI AUTO-DETECTED INSIGHTS                         3 found

WINNER      Influencer Campaign Leads Revenue    ₹576Cr    Scale →
ALERT       Instagram Dominates Impressions      174M      Investigate →
OPPORTUNITY Capitalize High-ROI Email Channel    4.23x     Capitalize →
```

---

### `04` — 📄 Executive Report Generator

> *"Board-ready reports in seconds, not days."*

- One click generates a full executive report
- Sections: Summary, Highlights, Top Performers, Concerns, Recommendations
- Uses **only real data** — zero hallucinated numbers
- Markdown rendered with clean formatting
- Download as .txt file instantly

---

### `05` — 📊 Multi-Chart Full Analysis

> *"One prompt. Three charts. Complete picture."*

- Type "give me full analysis" — generates 3 charts simultaneously
- Parallel API calls for speed
- GPT-4o generates one executive summary across all 3 charts
- Works dynamically for any uploaded dataset

---

### `06` — 🔍 Follow-up Filter Queries — Conversational BI

> *"The dashboard remembers context. Just like a real analyst."*

- After any chart, say "now filter to only Email"
- AI filters the existing chart data — no new database query needed
- "Show top 3 only" — "exclude Facebook" — "sort by highest"
- Updates previous chart with filtered view
- Maintains conversation context across messages

---

### `07` — 📈 Live Dashboard — Artha Dashboard

> *"Real-time KPIs. Auto-refreshing. Always live."*

- Fetches real data from backend every 30 seconds
- KPI cards: Total Revenue, Impressions, Avg ROI, Top Channel
- Charts: Revenue by Campaign, ROI by Channel, Monthly Trend, Engagement by Segment
- Sidebar shows actual column names from uploaded dataset
- Export PDF button
- Dataset health score with quality badges

---

### `08` — ⬆ Upload Any Dataset

> *"Not just Nykaa. Any business. Any CSV. Instantly."*

- Upload any CSV file — drag and drop
- Auto-detects encoding: UTF-8, Latin-1, CP1252
- Detects column types: numeric, text, date
- Stores in SQLite with cleaned headers
- Every feature immediately adapts to new columns
- Zero reconfiguration required

---

### `09` — ⚡ Confidence Meter + Hallucination Handling

> *"Honest AI. Not just impressive AI."*

- Every chart shows a confidence score bar
- Calculated from: data points count, variance, statistical distribution
- Out-of-scope questions get explicit refusal with helpful suggestions
- Empty query results trigger AI-generated guidance — not empty charts
- System never invents data

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  High Confidence · 94%   10 data points
```

<br/>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ARTHA PLATFORM                             │
├──────────────────────┬──────────────────────┬───────────────────────┤
│    FRONTEND LAYER    │    BACKEND LAYER     │      AI LAYER         │
│                      │                      │                       │
│  • Artha Lens Chat   │  • FastAPI Server    │  • Puter.js GPT-4o   │
│  • Dashboard Mirror  │  • Smart SQL Engine  │  • Insight Generator │
│  • Landing Page      │  • /query endpoint   │  • What-If Predictor │
│  • Upload Page       │  • /analysis KPIs    │  • Anomaly Detector  │
│  • Report Modal      │  • /summary schema   │  • Report Writer     │
│  • What-If UI        │  • Rate Limiter      │  • Filter Engine     │
│  • Anomaly Cards     │  • Query Cache       │  • Hallucination Guard│
└──────────────────────┴──────────────────────┴───────────────────────┘
```

### The 3-Layer Pipeline:

```
User Question (Plain English)
         ↓
┌─────────────────────────┐
│   SMART SQL ENGINE      │  → Detects columns dynamically
│   (Zero Hallucination)  │  → Builds verified SQL query
│   Keyword → Column Map  │  → Runs on real SQLite data
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│   FASTAPI BACKEND       │  → Executes SQL query
│   + Query Cache         │  → Normalizes to {name, value}
│   + Rate Limiter        │  → Returns chart type + data
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│   PUTER.JS GPT-4o       │  → Receives ONLY real numbers
│   Insight Generator     │  → Generates 2-sentence insight
│   Strict JSON Output    │  → Suggests follow-up queries
└─────────────────────────┘
         ↓
   Interactive Chart + AI Insight  (under 2 seconds)
```

<br/>

---

## 🛠️ Technology Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Visualization-FF6B6B?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-Data-150458?style=for-the-badge&logo=pandas&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

### AI Layer
![Puter](https://img.shields.io/badge/Puter.js-GPT--4o-10b981?style=for-the-badge)
![OpenAI](https://img.shields.io/badge/GPT--4o-Intelligence-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

<br/>

---

## 📦 Feature Map

```
Artha Platform
│
├── 💬 Artha Lens              → NL to SQL → Chart → AI Insight
├── 🔮 What-If Simulator       → Predictive scenario analysis
├── 🚨 Anomaly Detective       → Proactive auto-scan intelligence
├── 📄 Executive Report        → AI-written board-ready reports
├── 📊 Multi-Chart Analysis    → 3 charts from one prompt
├── 🔍 Follow-up Filters       → Conversational chart refinement
├── 🎤 Voice Input             → Speak your questions
├── ⚡ Confidence Meter        → Statistical reliability score
├── 🛡️ Hallucination Guard     → Honest refusal for out-of-scope
├── ⬆ CSV Upload Engine        → Any dataset, instant analytics
├── 📈 Live Dashboard          → Auto-refreshing KPI dashboard
└── 🕐 Query History           → Timestamped conversation memory
```

---

## 💼 Real-World Impact

> Built on Nykaa Digital Marketing dataset — 55,555 records across 16 columns.

| 🎯 Executive Need | ✅ Artha Solution |
|------------------|-----------------|
| "Which campaign has best ROI?" | Instant bar chart + AI insight |
| "What if we shift budget to Instagram?" | What-If Simulator with prediction |
| "Are we missing any opportunities?" | Anomaly Detective auto-detects |
| "I need a report for the board meeting" | Executive Report in one click |
| "Show me only Email performance" | Follow-up filter in plain English |
| "We have a new dataset to analyze" | Upload CSV — works instantly |

<br/>

---

## 📊 Dataset

```
Domain:   Digital Marketing — Nykaa Beauty and Lifestyle
Records:  55,555 campaign performance logs
Columns:  16

Campaign_Type     Channel_Used      Revenue        ROI
Impressions       Clicks            Leads          Conversions
Acquisition_Cost  Engagement_Score  Language       Customer_Segment
Date              Duration          Campaign_ID    Target_Audience
```

---

## ⚙️ Getting Started

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Start Backend (Port 8000)
cd ai-marketing-dashboard/backend
pip install -r requirements.txt
uvicorn api:app --host 0.0.0.0 --port 8000 --reload

# 3. Start Artha Lens — Chat Interface (Port 3000)
cd Admin-Dash-Board/Admin-Dash-Board
npm install
npm run dev

# 4. Start Artha Dashboard — Live KPIs (Port 5000)
cd Dashboard-Mirror
npm install
npm run dev

# 5. Open in browser
# Artha Lens      → http://localhost:3000
# Artha Dashboard → http://localhost:5000
```

---

## 🔮 What Makes Artha Different

```
Every other team:   User asks question → System shows chart

Artha:              System ALREADY FOUND 3 insights before you asked
                    System PREDICTS what happens if you change strategy
                    System TELLS YOU when it does not know something
                    System WORKS for any CSV you upload
```

| Feature | Other Teams | Artha |
|---------|------------|-------|
| Natural Language Queries | ✅ | ✅ |
| Any CSV Upload | ❌ | ✅ |
| Predictive What-If Simulator | ❌ | ✅ |
| Proactive Anomaly Detection | ❌ | ✅ |
| Hallucination Handling | ❌ | ✅ |
| Confidence Scoring | ❌ | ✅ |
| Executive Report Generation | ❌ | ✅ |
| Follow-up Conversational Filters | ❌ | ✅ |

<br/>

---

## 🗂️ Project Structure

```
artha/
│
├── 📁 ai-marketing-dashboard/
│   └── backend/
│       ├── api.py              # FastAPI — all endpoints
│       ├── data_engine.py      # SQLite data layer
│       └── requirements.txt    # Python dependencies
│
├── 📁 Admin-Dash-Board/        # Artha Lens — Chat Interface
│   └── client/src/
│       ├── pages/
│       │   ├── chat.tsx        # Main chat + all AI features
│       │   ├── upload.tsx      # CSV upload page
│       │   └── home.tsx        # Landing page
│       └── components/
│           └── DashboardPreview.tsx
│
└── 📁 Dashboard-Mirror/        # Artha Dashboard — Live KPIs
    └── client/src/
        └── pages/
            └── dashboard.tsx   # Real-time KPI dashboard
```

---

<div align="center">

---

### ✦ Built with purpose. Powered by real data. Honest by design. ✦

*Artha — Because your data deserves to speak for itself.*

---

![Python](https://img.shields.io/badge/Python-FastAPI-blue?style=flat-square)
![React](https://img.shields.io/badge/React-TypeScript-blue?style=flat-square)
![AI](https://img.shields.io/badge/AI-GPT--4o-green?style=flat-square)
![Dataset](https://img.shields.io/badge/Dataset-Nykaa%2055K%20Records-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>
