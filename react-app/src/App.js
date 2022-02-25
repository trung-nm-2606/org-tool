import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from "./AppRoutes";
import Layout from './Layout';
import appRedux from './redux/app';
import axios from 'axios';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(appRedux.actions.setLoginAt(new Date()));
    axios.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      Promise.reject(error);
      if (error.response.status === 401) {
        console.log('Unauthenticated User')
        window.location.reload();
      }
    });
    const id = setInterval(() => axios.get('/api/app/ping-auth'), 5 * 1000);
    return () => clearInterval(id);
  }, [/* componentDidMount */]);

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
