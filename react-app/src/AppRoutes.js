import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = React.lazy(() => import('./Home'));
const About = React.lazy(() => import('./About'));

const AppRoutes = () => (
  <Suspense fallback={<>Loading...</>}>
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
