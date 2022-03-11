import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import { People, Clipboard, PiggyBank, FileSpreadsheet } from 'react-bootstrap-icons';

const Dashboard = React.lazy(() => import('./Dashboard'));
const Members = React.lazy(() => import('./Members'));
const Funds = React.lazy(() => import('./Funds'));
const FundEvents = React.lazy(() => import('./FundEvents'));

const navLinks = [
  { to: '/group/dashboard', label: 'Bảng Thông Tin', Icon: Clipboard },
  { to: '/group/members', label: 'Thành Viên', Icon: People },
  { to: '/group/funds', label: 'Tiền Quỹ', Icon: PiggyBank },
  { to: '/group/fund-events', label: 'Sự kiện Thu / Chi Tiền Quỹ', Icon: FileSpreadsheet },
];

const Group = () => (
  <AppLayout navLinks={navLinks}>
    <Routes>
      <Route exact path="/dashboard" element={<Dashboard />} />
      <Route exact path="/members" element={<Members />} />
      <Route exact path="/funds" element={<Funds />} />
      <Route exact path="/fund-events" element={<FundEvents />} />
    </Routes>
  </AppLayout>
);

export default Group;
