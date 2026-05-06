// Routes configuration
import React from 'react';
import HomePage from '../pages/HomePage';
import DestinationDetailPage from '../pages/DestinationDetailPage';

/**
 * Application routes
 */
export const routes = [
  {
    path: '/',
    element: <HomePage />,
    name: 'home',
    label: 'Beranda',
  },
  {
    path: '/destination/:id',
    element: <DestinationDetailPage />,
    name: 'detail',
    label: 'Detail Destinasi',
  },
  {
    path: '/directory',
    element: <HomePage />, // TODO: Create DirectoryPage
    name: 'directory',
    label: 'Direktori Destinasi',
  },
  {
    path: '/planner',
    element: <HomePage />, // TODO: Create PlannerPage
    name: 'planner',
    label: 'Perencana Rute',
  },
  {
    path: '/about',
    element: <HomePage />, // TODO: Create AboutPage
    name: 'about',
    label: 'Tentang',
  },
];

export default routes;
