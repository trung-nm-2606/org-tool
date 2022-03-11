import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { PersonCircle, ArrowRightCircleFill, Power, PlusCircle, GearWideConnected } from 'react-bootstrap-icons';

const RootLayout = ({ children }) => {
  const authUser = useSelector(state => state.app.authUser);
  const [inGroup, setInGroup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname = '' } = location;
    let pathName = pathname;
    if (pathName.indexOf('/') === 0) {
      pathName = pathName.substring(1);
    }
    const paths = pathName.split('/');
    setInGroup(paths[0] === 'group');
  }, [location]);

  return (
    <div className="root-app">
      <div className="top-nav p-2 w-100 bg-light d-flex align-items-center flex-row">
        <div className="top-nav w-100 d-flex align-items-center flex-row">
          <PersonCircle role="button" className="ms-2 me-2 user-icon" size={24} />
          <div
            role="button"
            className="workspace-switcher bg-success bg-opacity-10 pt-1 pb-1 ps-2 ps-sm-4 pe-2 pe-sm-3 ms-2 me-2 d-flex flex-row align-items-center justify-content-center"
            onClick={() => {
              const pathname = inGroup ? '/group-management' : '/group/dashboard';
              navigate(pathname);
            }}
          >
            <div className="active-group d-flex flex-column align-items-start me-3">
              <small className="text-muted second-label d-none d-sm-block">Active Group</small>
              <div
                className="none-decoration d-flex flex-row align-items-center"
                to={inGroup ? '/group-management' : '/group/dashboard'}
              >
                <span className="label text-success">
                  {authUser?.activeGroup?.name}
                </span>
              </div>
              {/* <NavLink
                className="none-decoration d-flex flex-row align-items-center"
                to={inGroup ? '/group-management' : '/group/dashboard'}
              >
                <span className="label text-success">
                  {authUser?.activeGroup?.name}
                </span>
              </NavLink> */}
            </div>
            <ArrowRightCircleFill className="text-success" size={24} />
          </div>
          <div className="action-button-bar d-flex align-items-center flex-row ms-2 me-2">
            <NavLink to="/group-management/new" className="my-app me-2 d-flex align-items-center flex-row">
              <PlusCircle size={16} className="me-1" />
              <span className="d-none d-sm-block">Tạo nhóm mới</span>
            </NavLink>
            {/* <NavLink to="/group-management" className="my-app ms-2 me-2 d-flex align-items-center flex-row">
              <GearWideConnected size={16} className="me-1" />
              <span className="d-none d-sm-block">Q.Lý Nhóm</span>
            </NavLink> */}
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
  );
};

export default RootLayout;
