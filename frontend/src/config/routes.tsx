import React from 'react';
import HomePage from '../pages/HomePage';
import DestinationDetailPage from '../pages/DestinationDetailPage';
import DirectoryPage from '../pages/DirectoryPage';
import PlannerPage from '../pages/PlannerPage';
import AboutPage from '../pages/AboutPage';
import ExperiencesPage from '../pages/ExperiencesPage';
import JournalPage from '../pages/JournalPage';

export interface Route {
  path: string;
  element: React.ReactNode;
  name: string;
  label: string;
}

/**
 * Application routes
 */
export const routes: Route[] = [
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
    element: <DirectoryPage />,
    name: 'directory',
    label: 'Direktori Destinasi',
  },
  {
    path: '/planner',
    element: <PlannerPage />,
    name: 'planner',
    label: 'Perencana Rute',
  },
  {
    path: '/about',
    element: <AboutPage />,
    name: 'about',
    label: 'Tentang',
  },
  {
    path: '/experiences',
    element: <ExperiencesPage />,
    name: 'experiences',
    label: 'Pengalaman',
  },
  {
    path: '/journal',
    element: <JournalPage />,
    name: 'journal',
    label: 'Jurnal',
  },
];

export default routes;
