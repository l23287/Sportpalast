import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { AuthProvider } from './context/AuthContext';
import { SportProvider } from './context/SportContext';
import { AppShell } from './components/AppShell';
import { ScrollToTop } from './components/ScrollToTop';
import { RedirectIfAuthenticated, RequireAuth, RootRedirect } from './components/RouteGuards';
import { Onboarding } from './pages/Onboarding';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PlansOverview } from './pages/PlansOverview';
import { PlanForm } from './pages/PlanForm';
import { PlanDetail } from './pages/PlanDetail';
import { Exercises } from './pages/Exercises';
import { Settings } from './pages/Settings';
import { Statistics } from './pages/Statistics';
import { ServeTraining } from './pages/ServeTraining';
import { Impressum } from './pages/Impressum';
import { Datenschutz } from './pages/Datenschutz';

export default function App() {
  return (
    <SportProvider>
      <AuthProvider>
        <AppDataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />

              <Route element={<RedirectIfAuthenticated />}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/anmelden" element={<Login />} />
                <Route path="/registrieren" element={<Register />} />
              </Route>

              <Route element={<RequireAuth />}>
                <Route element={<AppShell />}>
                  <Route path="/plaene" element={<PlansOverview />} />
                  <Route path="/plaene/neu" element={<PlanForm />} />
                  <Route path="/plaene/:id" element={<PlanDetail />} />
                  <Route path="/plaene/:id/bearbeiten" element={<PlanForm />} />
                  <Route path="/uebungen" element={<Exercises />} />
                  <Route path="/statistiken" element={<Statistics />} />
                  <Route path="/aufschlagtraining" element={<ServeTraining />} />
                  <Route path="/einstellungen" element={<Settings />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppDataProvider>
      </AuthProvider>
    </SportProvider>
  );
}
