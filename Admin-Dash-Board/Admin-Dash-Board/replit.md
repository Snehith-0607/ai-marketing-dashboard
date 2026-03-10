# InsightAI - Conversational AI for Business Intelligence

## Overview
A modern AI-powered Business Intelligence web application that allows non-technical users to generate interactive data dashboards using natural language prompts. Combines a ChatGPT-like interface with BI tool visualizations.

## Tech Stack
- **Frontend**: React with TypeScript, TailwindCSS, Recharts, Framer Motion
- **Backend**: Express.js (Node.js)
- **Routing**: wouter
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui
- **Charts**: Recharts

## Pages
1. **Landing Page** (`/`) - SaaS marketing page with hero, features, tech stack, CTA
2. **Chat Interface** (`/chat`) - ChatGPT-style AI chat with dashboard generation
3. **Dashboard** (`/dashboard`) - Full analytics dashboard with KPI cards and charts
4. **Upload** (`/upload`) - CSV file upload with drag & drop

## Project Structure
```
client/src/
  components/
    layout/        - AppLayout, Sidebar, Header
    charts/        - RevenueChart, MonthlySalesChart, CategoryChart, TargetChart
    dashboard/     - MetricCard, DashboardPreview
    chat/          - (chat components inline in page)
    ui/            - shadcn components
  pages/
    landing.tsx    - Landing/marketing page
    chat.tsx       - AI chat interface
    dashboard.tsx  - Full dashboard view
    upload.tsx     - CSV upload page
  hooks/
  lib/
server/
  routes.ts        - API endpoints
  storage.ts       - In-memory storage layer
shared/
  schema.ts        - Data models and types
```

## API Endpoints
- `GET /api/chat-sessions` - List chat sessions
- `POST /api/chat-sessions` - Create chat session
- `GET /api/chat-sessions/:id/messages` - Get messages for session
- `POST /api/chat-messages` - Create chat message
- `GET /api/datasets` - List datasets
- `POST /api/datasets` - Create dataset

## Design
- Modern SaaS aesthetic with blue (#465FFF) primary color
- Inter font family
- Rounded cards with soft borders (#E2E8F0)
- Gradient accents and smooth animations
- Responsive layout with collapsible sidebar
