import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { hasSeenOnboarding } from '../lib/onboarding';

export function RootRedirect() {
  return <Navigate to={hasSeenOnboarding() ? '/plaene' : '/onboarding'} replace />;
}

// IFCM FS-015 / C10: Wer die neue Einführung (Version 2) noch nicht gesehen hat, wird auch beim direkten Aufruf
// einer App-Seite (Lesezeichen, z. B. /plaene) einmalig zur Einführung geleitet – nicht nur über die Startadresse.
export function OnboardingGate({ children }: { children: ReactNode }) {
  if (!hasSeenOnboarding()) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}
