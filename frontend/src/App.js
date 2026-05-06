import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles/tokens.css';
import routes from './config/routes';

function App() {
  return (
    <Router>
      <Routes>
        {routes.map(route => (
          <Route
            key={route.name}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
