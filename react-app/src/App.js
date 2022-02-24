import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import appRedux from './redux/app';

const App = () => {
  const dispatch = useDispatch();
  const loginAt = useSelector(state => state.app.loginAt);

  useEffect(() => {
    dispatch(appRedux.actions.setLoginAt(new Date()));
  }, [/* componentDidMount */]);

  return (
    <BrowserRouter>
      <h1>Organization Tools</h1>
      <p>{`Login at: ${loginAt}`}</p>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
