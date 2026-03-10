# TrendTide - Social Media Analytics Platform

## Overview
A social media analytics SaaS landing page and dashboard application inspired by TrendTide and Catalyst designs.

## Architecture
- **Frontend**: React + TypeScript + Vite + TailwindCSS + Framer Motion + Recharts
- **Backend**: Express.js (minimal, serving frontend)
- **Routing**: wouter (client-side)

## Pages
- `/` - Landing page (TrendTide marketing site)
- `/dashboard` - Dashboard with sidebar navigation (Catalyst-style)

## Dashboard Sub-Pages (client-side state)
- Overview: KPI cards, sales charts, visitor channels, retention heatmap, radar chart
- Analytics: Revenue/expenses charts, product categories pie chart, top products table
- Products: Product listing with search and status
- Orders: Order management table
- Discounts: Discount codes management
- Apps: Third-party app integrations

## Key Dependencies
- framer-motion: Page animations and transitions
- recharts: Charts (Area, Line, Bar, Radar, Pie)
- lucide-react: Icons
- wouter: Client-side routing
- shadcn/ui: UI components (Button, Card)

## Color Palette
- Primary Blue: #3B82F6 (HSL 221 83% 53%)
- Dashboard Accent: Orange (#F97316)
- Background: White/Gray-50
- Text: Gray-900/Gray-600/Gray-400

## Font
- Inter (via Google Fonts)
