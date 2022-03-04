import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

const ManagementDashboard = React.lazy(() => import('./ManagementDashboard'));
const Groups = React.lazy(() => import('./groups'));
const Members = React.lazy(() => import('./members'));

const GroupManagement = () => (
  <>
    <div className="function-side-bar d-none d-md-block">
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
    {/* <div className="top-bar d-md-none d-lg-block d-flex flex-column align-items-center justify-content-center">
      Hehe
    </div> */}
    <div className="bg-white working-space mt-5 mt-md-2 p-3">
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
