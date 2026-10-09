import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/tokens.css';
import routes from './config/routes';
import { DrawerProvider } from './context/DrawerContext';
import MobileDrawer from './components/layout/MobileDrawer';
import MobileBottomNav from './components/layout/MobileBottomNav';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  name: string;
  label: string;
}

const PageFallback: React.FC = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      background: 'var(--bg, #FBF6EC)',
      color: 'var(--ink-3, #877a6c)',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        border: '3px solid rgba(42, 102, 80, 0.2)',
        borderTopColor: '#2A6650',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>Memuat halaman...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <DrawerProvider>
        <React.Suspense fallback={<PageFallback />}>
          <Routes>
            {routes.map((route: RouteConfig) => (
              <Route
                key={route.name}
                path={route.path}
                element={route.element as React.ReactElement}
              />
            ))}
          </Routes>
        </React.Suspense>
        {/* Global Mobile Navigation Layer */}
        <MobileDrawer />
        <MobileBottomNav />
      </DrawerProvider>
    </Router>
  );
};

export default App;
