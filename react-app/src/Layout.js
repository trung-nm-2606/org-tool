import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppNav from './AppNav';

const Layout = ({ children }) => {
  return (
    <BrowserRouter>
      <AppNav />
      <div className="container">
        {children}
      </div>
    </BrowserRouter>
  );
};

export default Layout;
