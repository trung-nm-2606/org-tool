import React from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <h1>Organization Tools</h1>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
