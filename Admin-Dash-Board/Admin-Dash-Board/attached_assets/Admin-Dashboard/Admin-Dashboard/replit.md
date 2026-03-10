# NykaaAdmin - Marketing Analytics Dashboard

## Overview
A comprehensive admin dashboard inspired by TailAdmin/NextAdmin designs. Features multiple dashboard views (eCommerce, Analytics, Marketing, CRM, Stocks), a full calendar, profile page, and interactive charts with a world map.

## Tech Stack
- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion, Recharts
- **Backend**: Express.js (Node.js)
- **Routing**: Wouter
- **Icons**: Lucide React, React Icons
- **UI Components**: Shadcn/ui
- **State Management**: TanStack React Query

## Project Structure
```
client/src/
├── components/
│   ├── layout/          # Sidebar, Header, DashboardLayout
│   ├── dashboard/       # MetricCard, RecentOrders, TopChannels, etc.
│   ├── charts/          # MonthlySalesChart, StatisticsChart, WorldMap, etc.
│   └── ui/              # Shadcn components
├── pages/
│   ├── ecommerce.tsx    # Main dashboard (/)
│   ├── analytics.tsx    # Analytics dashboard (/analytics)
│   ├── marketing.tsx    # Marketing dashboard (/marketing)
│   ├── crm.tsx          # CRM dashboard (/crm)
│   ├── stocks.tsx       # Stocks dashboard (/stocks)
│   ├── calendar.tsx     # Calendar page (/calendar)
│   ├── profile.tsx      # User profile (/profile)
│   ├── placeholder.tsx  # Placeholder for future pages
│   └── not-found.tsx    # 404 page
└── App.tsx              # Root app with routing
```

## Routes
- `/` - Ecommerce Dashboard (metrics, sales chart, target, statistics, world map, orders)
- `/analytics` - Analytics Dashboard (KPIs, trends, channel distribution, audience segments)
- `/marketing` - Marketing Dashboard (highlights, external links, campaign visitors, top channels, campaigns, feedback)
- `/crm` - CRM Dashboard (leads, deals, pipeline, contacts)
- `/stocks` - Stocks Dashboard (portfolio, holdings, sector allocation)
- `/calendar` - Calendar (monthly view with events, upcoming events sidebar)
- `/profile` - User Profile

## Design System
- Primary: #465FFF (Blue)
- Background: #F1F5F9 (Light gray-blue)
- Card: White with #E2E8F0 borders
- Text Primary: #1C2434
- Text Secondary: #64748B
- Muted: #94A3B8
- Font: Inter
- Border Radius: rounded-2xl for cards, rounded-lg for buttons
