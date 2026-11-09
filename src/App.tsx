import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { SportProvider } from './context/SportContext';
import { GoalsProvider } from './context/GoalsContext'; // IFCM FS-013 / C09
import { AppShell } from './components/AppShell';
import { Disclaimer } from './components/Disclaimer';
import { SiteGate } from './components/SiteGate';
import { ScrollToTop } from './components/ScrollToTop';
import { OnboardingGate, RootRedirect } from './components/RouteGuards'; // IFCM FS-015 / C10: OnboardingGate
import { Onboarding } from './pages/Onboarding';
import { PlansOverview } from './pages/PlansOverview';
import { PlanForm } from './pages/PlanForm';
import { PlanDetail } from './pages/PlanDetail';
import { Exercises } from './pages/Exercises';
import { Settings } from './pages/Settings';
import { Statistics } from './pages/Statistics';
import { ServeTraining } from './pages/ServeTraining';
import { ExercisesArea, ServeTrainingGuard } from './pages/ExercisesArea'; // IFCM FS-003 / C04
import { CalendarPage } from './pages/CalendarPage'; // IFCM FS-004 / C05
import { StopwatchPage } from './pages/StopwatchPage'; // IFCM FS-019 / C13

export default function App() {
  return (
    <SportProvider>
      <SiteGate>
        <AppDataProvider>
          {/* IFCM FS-013 / C09: Kernziele je Sportart */}
          <GoalsProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* IFCM FS-015 / C10: neue Einführung einmalig auch für bestehende Nutzer:innen */}
              <Route
                element={
                  <OnboardingGate>
                    <AppShell />
                  </OnboardingGate>
                }
              >
                <Route path="/plaene" element={<PlansOverview />} />
                <Route path="/plaene/neu" element={<PlanForm />} />
                <Route path="/plaene/:id" element={<PlanDetail />} />
                <Route path="/plaene/:id/bearbeiten" element={<PlanForm />} />
                {/* IFCM FS-003 / C04: Übungsbereich mit Unterseiten; Aufschlagtraining nur bei Tischtennis */}
                <Route path="/uebungen" element={<ExercisesArea />}>
                  <Route index element={<Exercises />} />
                  {/* IFCM FS-020 / C13a: Stoppuhr ist jetzt ein eigener Menüpunkt (/stoppuhr) – alte Adresse leitet weiter */}
                  <Route path="stoppuhr" element={<Navigate to="/stoppuhr" replace />} />
                  <Route
                    path="aufschlagtraining"
                    element={
                      <ServeTrainingGuard>
                        <ServeTraining />
                      </ServeTrainingGuard>
                    }
                  />
                </Route>
                <Route path="/statistiken" element={<Statistics />} />
                {/* IFCM FS-020 / C13a: Stoppuhr in der Hauptnavigation, für alle Sportarten */}
                <Route path="/stoppuhr" element={<StopwatchPage />} />
                {/* IFCM FS-004 / C05: Kalender mit Monatsansicht */}
                <Route path="/kalender" element={<CalendarPage />} />
                {/* IFCM FS-003 / C04: alte Adresse (Lesezeichen/Links) leitet in den Übungsbereich weiter */}
                <Route path="/aufschlagtraining" element={<Navigate to="/uebungen/aufschlagtraining" replace />} />
                <Route path="/einstellungen" element={<Settings />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          </GoalsProvider>
        </AppDataProvider>
      </SiteGate>
      <Disclaimer />
    </SportProvider>
  );
}
