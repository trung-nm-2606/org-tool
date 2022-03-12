import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const GroupManagement = React.lazy(() => import('./group_management/GroupManagement'));
const Group = React.lazy(() => import('./group_management/Group'));

const Loading = () => (
  <span className="spinner-border spinner-border-sm m-3" role="status" aria-hidden="true"></span>
);

const AppRoutes = () => (
  <Suspense fallback={<Loading/>}>
    <Routes>
      <Route path="/group-management/*" element={<GroupManagement />} />
      <Route path="/group/*" element={<Group />} />
      <Route
        path="*"
        element={<Navigate to="/group/dashboard" />}
      />
    </Routes>
  </Suspense>
);

export default AppRoutes;
