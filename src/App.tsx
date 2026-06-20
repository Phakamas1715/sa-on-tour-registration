import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Public pages — direct imports (small, always needed)
import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import PackagesPage from "./pages/PackagesPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Admin pages — lazy loaded (heavy: recharts, admin logic)
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AnalyticsPage = lazy(() => import("./pages/admin/AnalyticsPage"));
const TourProgramsPage = lazy(() => import("./pages/admin/TourProgramsPage"));
const QuotationsListPage = lazy(() => import("./pages/admin/QuotationsListPage"));
const QuotationPreviewPage = lazy(() => import("./pages/admin/QuotationPreviewPage"));
const AdminCheckinPage = lazy(() => import("./pages/admin/AdminCheckinPage"));

// Customer pages — lazy loaded
const CustomerDashboardPage = lazy(() => import("./pages/customer/CustomerDashboardPage"));

// Other lazy pages
const ItineraryPage = lazy(() => import("./pages/ItineraryPage"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />

              {/* Admin routes — lazy + protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requireAdmin>
                    <AnalyticsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/programs"
                element={
                  <ProtectedRoute requireAdmin>
                    <TourProgramsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quotations"
                element={
                  <ProtectedRoute requireAdmin>
                    <QuotationsListPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/quotations/:id"
                element={
                  <ProtectedRoute requireAdmin>
                    <QuotationPreviewPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/checkin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCheckinPage />
                  </ProtectedRoute>
                }
              />

              {/* Customer routes — lazy + protected */}
              <Route
                path="/customer"
                element={
                  <ProtectedRoute>
                    <CustomerDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
