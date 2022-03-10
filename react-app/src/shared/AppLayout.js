import React from 'react';
import { NavLink } from 'react-router-dom';

const AppLayout = ({ navLinks = [], children }) => {
  return (
    <>
      <div className="function-side-bar d-none d-md-block">
        <ul className="list-group list-group-flush">
          {navLinks.map(({ to, label }, index) => (
            <li role="button" className="list-group-item text-black-50" key={`${index}-${to}-sm`}>
              <NavLink className="nav-link" to={to}>{label}</NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="function-side-bar d-none d-md-block">
          <ul className="list-group list-group-flush">
            {navLinks.map(({ to = '', IconComponent = null, label = 'Unknown NavLink' }, index) => (
              <li role="button" className="list-group-item text-black-50" key={`${index}-${to}`}>
                <NavLink className="menu-icon ps-2 pe-2 nav-link d-flex align-items-center justify-content-start" to={to}>
                  <IconComponent size={16} />
                  <span className="label ms-3">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white working-space mt-md-2 p-3">
          <div className="bg-white">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default AppLayout;
