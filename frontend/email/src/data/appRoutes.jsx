import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/layouts/DashboardLayout';
import AlertDashboard from '../pages/AlertDashboard';
import RMATracker from '../pages/RMATracker';
import Reports from '../pages/Reports';
import P1P2_Tick from '../pages/P1P2_Tick';
import TOTAL from '../pages/TOTAL';
import License from '../pages/License';
import MainContext from '../pages/MainContext';

export const appRoutes = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '', element: <AlertDashboard /> },
      { path: 'email', element: <MainContext /> }, 
      { path: 'rma', element: <RMATracker /> },
      { path: 'reports', element: <Reports /> },
      { path: 'p1p2', element: <P1P2_Tick /> },
      { path: 'total', element: <TOTAL /> },
      { path: 'license', element: <License /> },
    ],
  },
  // Optional: catch-all or auth routes
  { path: '*', element: <Navigate to="/" replace /> },
];
  
