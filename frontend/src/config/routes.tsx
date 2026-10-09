import React, { lazy } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const DestinationDetailPage = lazy(() => import('../pages/DestinationDetailPage'));
const DirectoryPage = lazy(() => import('../pages/DirectoryPage'));
const PlannerPage = lazy(() => import('../pages/PlannerPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ExperiencesPage = lazy(() => import('../pages/ExperiencesPage'));
const JournalPage = lazy(() => import('../pages/JournalPage'));

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
