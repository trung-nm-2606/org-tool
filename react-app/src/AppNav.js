import React from 'react';
import { NavLink } from 'react-router-dom';
import { List } from 'react-bootstrap-icons';

const AppNav = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#app-nav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <List />
        </button>
        <div className="collapse navbar-collapse" id="app-nav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/groups">Groups</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AppNav;
