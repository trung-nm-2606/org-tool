import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const ManagementDashboard = React.lazy(() => import('./ManagementDashboard'));
const BankDashboard = React.lazy(() => import('./BankDashboard'));
const Groups = React.lazy(() => import('./groups'));
const Members = React.lazy(() => import('./members'));

const Loading = () => (
  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
);

const AppRoutes = () => (
  <Suspense fallback={<Loading/>}>
    <Routes>
      <Route path="/management/groups/*" element={<Groups />} />
      <Route path="/management/members" element={<Members />} />
      <Route path="/management/dashboard" element={<ManagementDashboard />} />
      <Route path="/bank" element={<BankDashboard />} />
      <Route
        path="*"
        element={<Navigate to="/management/dashboard" />}
      />
    </Routes>
  </Suspense>
);

export default AppRoutes;
