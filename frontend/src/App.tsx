import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PasswordProvider } from './contexts/PasswordContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Loading } from './components/Loading';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>(
    isAuthenticated ? 'dashboard' : 'landing'
  );

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading SecureVault..." />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'dashboard':
        return isAuthenticated ? <Dashboard /> : <Landing onNavigate={handleNavigate} />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Landing onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PasswordProvider>
        <AppContent />
      </PasswordProvider>
    </AuthProvider>
  );
}

export default App;