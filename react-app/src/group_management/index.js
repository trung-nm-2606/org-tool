import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

const ManagementDashboard = React.lazy(() => import('./ManagementDashboard'));
const Groups = React.lazy(() => import('./groups'));
const Members = React.lazy(() => import('./members'));

const GroupManagement = () => (
  <>
    <div className="function-side-bar">
      <ul className="list-group list-group-flush">
        <li role="button" className="list-group-item text-black-50">
          <NavLink className="nav-link" to="/management/dashboard">Dashboard</NavLink>
        </li>
        <li role="button" className="list-group-item text-black-50">
          <NavLink className="nav-link" to="/management/groups">Groups</NavLink>
        </li>
        <li role="button" className="list-group-item text-black-50">
          <NavLink className="nav-link" to="/management/members">Members</NavLink>
        </li>
      </ul>
    </div>
    <div className="container-fluid bg-white working-space mt-2 p-3">
      <div className="bg-white">
        <Routes>
          <Route path="/dashboard" element={<ManagementDashboard />} />
          <Route path="/groups/*" element={<Groups />} />
          <Route path="/members" element={<Members />} />
          <Route
            path="/"
            element={<Navigate to="/management/dashboard" />}
          />
        </Routes>
      </div>
    </div>
  </>
);

export default GroupManagement;
