import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from "./AppRoutes";
import Layout from './Layout';
import appRedux from './redux/app';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appRedux.actions.setLoginAt(new Date()));
  }, [/* componentDidMount */]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
