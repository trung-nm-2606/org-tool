import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import { People, Clipboard, PiggyBank, FileSpreadsheet } from 'react-bootstrap-icons';

const Dashboard = React.lazy(() => import('./Dashboard'));
const Members = React.lazy(() => import('./Members'));
const Funds = React.lazy(() => import('./Funds'));
const FundEvents = React.lazy(() => import('./FundEvents'));

const Loading = () => (
  <span className="spinner-border spinner-border-sm m-3" role="status" aria-hidden="true"></span>
);

const navLinks = [
  { to: '/', label: 'Bảng Thông Tin', Icon: Clipboard },
  { to: '/members', label: 'Thành Viên', Icon: People },
  { to: '/funds', label: 'Tiền Quỹ', Icon: PiggyBank },
  { to: '/fund-events', label: 'Sự kiện Thu / Chi Tiền Quỹ', Icon: FileSpreadsheet },
];

const AppRoutes = () => (
  <AppLayout navLinks={navLinks}>
    <Suspense fallback={<Loading/>}>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/members" element={<Members />} />
        <Route exact path="/funds" element={<Funds />} />
        <Route exact path="/fund-events" element={<FundEvents />} />
        <Route
          path="*"
          element={<Navigate to="/" />}
        />
        {/* <Route exact path="/management/*" element={<GroupManagement />} />
        <Route exact path="/bank" element={<BankDashboard />} />
        <Route
          path="*"
          element={<Navigate to="/management" />}
        /> */}
      </Routes>
    </Suspense>
  </AppLayout>
);

export default AppRoutes;
