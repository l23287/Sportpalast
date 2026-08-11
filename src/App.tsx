import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { SportProvider } from './context/SportContext';
import { AppShell } from './components/AppShell';
import { Disclaimer } from './components/Disclaimer';
import { SiteGate } from './components/SiteGate';
import { ScrollToTop } from './components/ScrollToTop';
import { RootRedirect } from './components/RouteGuards';
import { Onboarding } from './pages/Onboarding';
import { PlansOverview } from './pages/PlansOverview';
import { PlanForm } from './pages/PlanForm';
import { PlanDetail } from './pages/PlanDetail';
import { Exercises } from './pages/Exercises';
import { Settings } from './pages/Settings';
import { Statistics } from './pages/Statistics';
import { ServeTraining } from './pages/ServeTraining';

export default function App() {
  return (
    <SportProvider>
      <SiteGate>
        <AppDataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/onboarding" element={<Onboarding />} />

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

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AppDataProvider>
      </SiteGate>
      <Disclaimer />
    </SportProvider>
  );
}
