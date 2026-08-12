import { Navigate } from 'react-router-dom';
import { hasSeenOnboarding } from '../lib/onboarding';

export function RootRedirect() {
  return <Navigate to={hasSeenOnboarding() ? '/plaene' : '/onboarding'} replace />;
}
