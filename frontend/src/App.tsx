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

const App: React.FC = () => {
  return (
    <Router>
      <DrawerProvider>
        <Routes>
          {routes.map((route: RouteConfig) => (
            <Route
              key={route.name}
              path={route.path}
              element={route.element as React.ReactElement}
            />
          ))}
        </Routes>
        {/* Global Mobile Navigation Layer */}
        <MobileDrawer />
        <MobileBottomNav />
      </DrawerProvider>
    </Router>
  );
};

export default App;
