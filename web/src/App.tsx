import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminVerifications from "@/pages/admin/Verifications";
import AdminUsers from "@/pages/admin/Users";
import { AdminAuthProvider, RequireAdmin } from "@/lib/admin-auth";
import { AppAuthProvider, RequireUser } from "@/lib/app-auth";
import AuthPage from "@/pages/auth/AuthPage";
import AppLayout from "@/components/app/AppLayout";
import UserDashboard from "@/pages/app/Dashboard";
import Discover from "@/pages/app/Discover";
import Profile from "@/pages/app/Profile";
import Interests from "@/pages/app/Interests";
import Settings from "@/pages/app/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppAuthProvider><AdminAuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/app" element={<RequireUser><AppLayout /></RequireUser>}>
              <Route index element={<UserDashboard />} />
              <Route path="discover" element={<Discover />} />
              <Route path="interests" element={<Interests />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="verifications" element={<AdminVerifications />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminAuthProvider></AppAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
