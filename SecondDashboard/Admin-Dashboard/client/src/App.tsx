import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EcommerceDashboard from "@/pages/ecommerce";
import MarketingDashboard from "@/pages/marketing";
import AnalyticsDashboard from "@/pages/analytics";
import CRMDashboard from "@/pages/crm";
import StocksDashboard from "@/pages/stocks";
import CalendarPage from "@/pages/calendar";
import ProfilePage from "@/pages/profile";
import PlaceholderPage from "@/pages/placeholder";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={EcommerceDashboard} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/marketing" component={MarketingDashboard} />
        <Route path="/crm" component={CRMDashboard} />
        <Route path="/stocks" component={StocksDashboard} />
        <Route path="/calendar" component={CalendarPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/tasks" component={PlaceholderPage} />
        <Route path="/tasks/:sub" component={PlaceholderPage} />
        <Route path="/forms/:sub" component={PlaceholderPage} />
        <Route path="/tables/:sub" component={PlaceholderPage} />
        <Route path="/settings" component={PlaceholderPage} />
        <Route path="/chat" component={PlaceholderPage} />
        <Route path="/support" component={PlaceholderPage} />
        <Route path="/email" component={PlaceholderPage} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
