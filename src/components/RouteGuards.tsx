import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasSeenOnboarding } from '../lib/onboarding';

export function RootRedirect() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/plaene" replace />;
  return <Navigate to={hasSeenOnboarding() ? '/anmelden' : '/onboarding'} replace />;
}

export function RequireAuth() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/anmelden" replace />;
  return <Outlet />;
}

export function RedirectIfAuthenticated() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/plaene" replace />;
  return <Outlet />;
}
