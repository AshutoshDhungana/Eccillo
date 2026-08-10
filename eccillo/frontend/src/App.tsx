import { Navigate, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./context/AuthContext";
import { Loading } from "./components/ui";
import { planningApi } from "./api/planning";
import { PlanningPage } from "./pages/CorePages";
import { NewEventPage } from "./pages/NewEventPage";
import { CopilotPage } from "./pages/CopilotPage";
import { ConversationalIntake } from "./pages/ConversationalIntake";
import { VendorSuggestionsPage } from "./pages/VendorSuggestionsPage";
import DesignedLandingPage from "./designed/app/pages/LandingPage";
import DesignedLoginPage from "./designed/app/pages/Login";
import DesignedSignupPage from "./designed/app/pages/Signup";
import DesignedDashboardPage from "./designed/app/pages/Dashboard";
import DesignedEventsPage from "./designed/app/pages/Events";

function ProtectedRoute() {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return <Loading label="Restoring your session…" />;
  return user ? <Outlet /> : <Navigate to={"/login?next=" + encodeURIComponent(location.pathname + location.search)} replace />;
}

function LegacyPlanningRedirect() {
  const { tab = "timeline" } = useParams();
  const events = useQuery({ queryKey: ["events"], queryFn: planningApi.listEvents });
  if (events.isLoading) return <Loading label="Opening planning…" />;
  if (!events.data?.length) return <Navigate to="/events" replace />;
  return <Navigate to={"/events/" + events.data[0].id + "/planning/" + tab} replace />;
}

export default function App() {
  return <Routes>
    <Route path="/" element={<DesignedLandingPage />} />
    <Route path="/login" element={<DesignedLoginPage />} />
    <Route path="/signup" element={<DesignedSignupPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<DesignedDashboardPage />} />
      <Route path="/events" element={<DesignedEventsPage />} />
      <Route path="/events/new" element={<ConversationalIntake />} />
      <Route path="/events/new/manual" element={<NewEventPage />} />
      <Route path="/events/new/brief" element={<Navigate to="/events/new" replace />} />
      <Route path="/events/:eventId/copilot" element={<CopilotPage />} />
      <Route path="/events/:eventId/vendors" element={<VendorSuggestionsPage />} />
      <Route path="/events/:eventId/planning/:tab" element={<PlanningPage />} />
      <Route path="/planning/:tab" element={<LegacyPlanningRedirect />} />
      <Route path="/brief" element={<Navigate to="/events/new" replace />} />
      <Route path="/blueprint" element={<Navigate to="/events" replace />} />
      <Route path="/workspace/*" element={<Navigate to="/events" replace />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
