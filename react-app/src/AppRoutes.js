import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = React.lazy(() => import('./Home'));
const Groups = React.lazy(() => import('./groups'));
const Members = React.lazy(() => import('./members'));

const Loading = () => (
  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
);

const AppRoutes = () => (
  <Suspense fallback={<Loading/>}>
    <Routes>
      <Route path="/groups/*" element={<Groups />} />
      <Route path="/members" element={<Members />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
