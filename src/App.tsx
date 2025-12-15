import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { FloatingSOSButton } from "@/components/ui/FloatingSOSButton";
import Index from "./pages/Index";
import Donate from "./pages/Donate";
import Request from "./pages/Request";
import BloodBanks from "./pages/BloodBanks";
import Register from "./pages/Register";
import Login from "./pages/Login";
import About from "./pages/About";
import Education from "./pages/Education";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/request" element={<Request />} />
              <Route path="/blood-banks" element={<BloodBanks />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/education" element={<Education />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <FloatingSOSButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
