import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppNav from './AppNav';

const Layout = ({ children }) => {
  return (
    <BrowserRouter>
      <AppNav />
      <div className="container-fluid pt-3">
        {children}
      </div>
    </BrowserRouter>
  );
};

export default Layout;
