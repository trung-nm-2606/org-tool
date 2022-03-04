import React from 'react';
import { BrowserRouter, NavLink } from "react-router-dom";
import { List, PeopleFill, BoxArrowRight } from 'react-bootstrap-icons';
import AppNav from './AppNav';

// const Layout = ({ children }) => {
//   return (
//     <BrowserRouter>
//       <AppNav />
//       <div className="container-fluid pt-3">
//         {children}
//       </div>
//     </BrowserRouter>
//   );
// };

const Layout = ({ children }) => {
  return (
    <BrowserRouter>
      <div className="root-app d-flex">
        <div className="app-side-bar d-flex flex-column align-items-center justify-content-between">
          <div className="d-flex flex-column align-items-center justify-content-start">
            <div className="top-bar d-flex flex-column align-items-center justify-content-center">
              <List role="button" size={24} />
            </div>
            <div className="menu-icon text-black-50 active">
              <PeopleFill role="button" size={24} />
              <span className="label">Group Mgnt.</span>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-end">
            <a href="/logout" className="menu-icon text-black-50">
              <BoxArrowRight role="button" size={16} />
              <span className="label">Logout</span>
            </a>
          </div>
        </div>
        <div className="function-side-bar">
          {/* <div className="top-bar"></div> */}
          <ul className="list-group list-group-flush">
            <li role="button" className="list-group-item text-black-50">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li role="button" className="list-group-item text-black-50">
              <NavLink className="nav-link" to="/groups">Groups</NavLink>
            </li>
            <li role="button" className="list-group-item text-black-50">
              <NavLink className="nav-link" to="/members">Members</NavLink>
            </li>
          </ul>
        </div>
        <div className="container-fluid bg-white working-space mt-2 p-3">
          <div className="bg-white">
          {children}
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default Layout;
