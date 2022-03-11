import React from 'react';
import { NavLink } from 'react-router-dom';

const AppLayout = ({ navLinks = [], children }) => {
  return (
    <div className="app-layout w-100 d-flex">
      <div className="left-side-bar pb-3">
        <ul className="list-group list-group-flush">
          {navLinks.map(({ to, label, Icon }, index) => (
            <li role="button" className="list-group-item pe-0" key={`${index}-${to}-sm`}>
              <NavLink
                className="none-decoration text-muted d-flex flex-row align-items-center justify-content-start"
                to={to}
              >
                {Icon && (
                  <span className="ms-1 me-3">
                    <Icon size={16}/>
                  </span>
                )}
                <span className="label d-none d-md-block ms-1">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="app-container">
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
