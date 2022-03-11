import React from 'react';
import { BrowserRouter, NavLink } from "react-router-dom";
import { PersonCircle, ArrowRightCircleFill, Power, PlusCircle, GearWideConnected } from 'react-bootstrap-icons';

const AppLayout = ({ children }) => {
  return (
    <BrowserRouter>
      <div className="root-app d-flex flex-column align-items-center justity-content-start">
        <div className="top-nav p-2 w-100 bg-light d-flex align-items-center flex-row">
          <div className="top-nav w-100 bg-light d-flex align-items-center flex-row">
            <PersonCircle role="button" className="ms-2 me-2 user-icon" size={24} />
            <div role="button" className="workspace-switcher pt-1 pb-1 ps-3 ps-sm-4 pe-1 pe-sm-3 ms-2 me-2 d-flex flex-row align-items-center justify-content-center">
              <div className="d-flex flex-column align-items-start me-3">
                <small className="text-muted second-label d-none d-sm-block">Active Group</small>
                <span className="label text-success">Nhóm Lớp 6</span>
              </div>
              <ArrowRightCircleFill className="text-muted" size={24} />
            </div>
            <div className="action-button-bar d-flex align-items-center flex-row ms-2 me-2">
              <NavLink to="/" className="my-app me-2 d-flex align-items-center flex-row">
                <PlusCircle size={24} className="me-1" />
                <span className="d-none d-sm-block">Tạo nhóm mới</span>
              </NavLink>
              <NavLink to="/" className="my-app ms-2 me-2 d-flex align-items-center flex-row">
                <GearWideConnected size={24} className="me-1" />
                <span className="d-none d-sm-block">Q.Lý Nhóm</span>
              </NavLink>
            </div>
          </div>
          <div>
            <a href="/logout" className="none-decoration text-danger">
              <Power role="button" className="me-2" size={24} />
            </a>
          </div>
        </div>
        <div>
          {children}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AppLayout;
