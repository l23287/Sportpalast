import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { AppShell } from './components/AppShell';
import { PlansOverview } from './pages/PlansOverview';
import { PlanForm } from './pages/PlanForm';
import { PlanDetail } from './pages/PlanDetail';
import { Exercises } from './pages/Exercises';
import { Settings } from './pages/Settings';
import { Statistics } from './pages/Statistics';

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/plaene" replace />} />
            <Route path="/plaene" element={<PlansOverview />} />
            <Route path="/plaene/neu" element={<PlanForm />} />
            <Route path="/plaene/:id" element={<PlanDetail />} />
            <Route path="/plaene/:id/bearbeiten" element={<PlanForm />} />
            <Route path="/uebungen" element={<Exercises />} />
            <Route path="/einstellungen" element={<Settings />} />
            <Route path="/statistiken" element={<Statistics />} />
            <Route path="*" element={<Navigate to="/plaene" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppDataProvider>
  );
}
