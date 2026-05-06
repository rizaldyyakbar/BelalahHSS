import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/tokens.css';
import routes from './config/routes';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  name: string;
  label: string;
}

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {routes.map((route: RouteConfig) => (
          <Route
            key={route.name}
            path={route.path}
            element={route.element as React.ReactElement}
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
