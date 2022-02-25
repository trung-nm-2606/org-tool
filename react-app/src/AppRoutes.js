import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = React.lazy(() => import('./Home'));
const Groups = React.lazy(() => import('./groups'));

const AppRoutes = () => (
  <Suspense fallback={<>Loading...</>}>
    <Routes>
      <Route path="/groups/*" element={<Groups />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
