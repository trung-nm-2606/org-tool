import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const BankDashboard = React.lazy(() => import('./BankDashboard'));
const GroupManagement = React.lazy(() => import('./group_management'));

const Loading = () => (
  <span className="spinner-border spinner-border-sm m-3" role="status" aria-hidden="true"></span>
);

const AppRoutes = () => (
  <Suspense fallback={<Loading/>}>
    <Routes>
      <Route exact path="/management/*" element={<GroupManagement />} />
      <Route exact path="/bank" element={<BankDashboard />} />
      <Route
        path="*"
        element={<Navigate to="/management" />}
      />
    </Routes>
  </Suspense>
);

export default AppRoutes;
