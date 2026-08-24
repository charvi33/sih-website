import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import LandingPage from '@/components/landing/LandingPage';
import AuthPage from '@/components/auth/AuthPage';
import Dashboard from '@/components/dashboard/Dashboard';

function AppRoutes() {
  const { session, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black" />
    );
  }

  if (session) {
    return <Dashboard />;
  }

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  return <LandingPage onGetStarted={() => setShowAuth(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
