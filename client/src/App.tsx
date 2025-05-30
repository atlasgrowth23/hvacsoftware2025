import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import Equipment from "@/pages/equipment";
import ServiceCalls from "@/pages/service-calls";
import Schedule from "@/pages/schedule";
import Calendar from "@/pages/calendar";
import Reports from "@/pages/reports";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import Header from "@/components/layout/header";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 lg:pl-64">
        <Header />
        <main className="flex-1 overflow-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/customers" component={Customers} />
            <Route path="/equipment" component={Equipment} />
            <Route path="/service-calls" component={ServiceCalls} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/reports" component={Reports} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <MobileNav />
    </div>
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
