import React from 'react';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { CardText, Collection, People } from 'react-bootstrap-icons';

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
    <div>
      <div className="function-side-bar-horizontal d-block d-md-none d-flex flex-row justify-content-start align-items-center">
        <NavLink className="menu-icon ps-2 pe-2 nav-link" to="/management/dashboard">
          <CardText size={24} />
          <span className="label">Dashboard</span>
        </NavLink>
        <NavLink className="menu-icon ps-2 pe-2 nav-link" to="/management/groups">
          <Collection size={24} />
          <span className="label">Groups</span>
        </NavLink>
        <NavLink className="menu-icon ps-2 pe-2 nav-link" to="/management/members">
          <People size={24} />
          <span className="label">Members</span>
        </NavLink>
      </div>
      <div className="bg-white working-space mt-md-2 p-3">
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
    </div>
  </>
);

export default GroupManagement;
