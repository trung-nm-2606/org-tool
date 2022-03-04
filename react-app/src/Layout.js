import React from 'react';
import { BrowserRouter, NavLink } from "react-router-dom";
import { List, Command, BoxArrowRight, Bank } from 'react-bootstrap-icons';

const Layout = ({ children }) => {
  return (
    <BrowserRouter>
      <div className="root-app d-flex">
        <div className="app-side-bar d-flex flex-column align-items-center justify-content-between">
          <div className="d-flex flex-column align-items-center justify-content-start">
            <div className="top-bar d-flex flex-column align-items-center justify-content-center">
              <List role="button" size={24} />
            </div>
            <div className="menu-icon text-black-50">
              <NavLink to="/management">
                <Command size={24} />
                <span className="label">Group Mgnt.</span>
              </NavLink>
            </div>
            <div className="menu-icon text-black-50">
              <NavLink to="/bank">
                <Bank size={24} />
                <span className="label">Fund</span>
              </NavLink>
            </div>
          </div>
          <div className="d-flex flex-column align-items-center justify-content-end">
            <div className="menu-icon text-black-50">
              <a href="/logout">
                <BoxArrowRight role="button" size={16} />
                <span className="label">Logout</span>
              </a>
            </div>
          </div>
        </div>
        {children}
      </div>
    </BrowserRouter>
  );
};

export default Layout;
