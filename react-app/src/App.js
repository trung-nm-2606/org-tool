import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from "./AppRoutes";
import Layout from './Layout';
import appRedux from './redux/app';
import axios from 'axios';

const App = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.app.authUser);

  useEffect(() => {
    dispatch(appRedux.actions.setLoginAt(new Date()));
    axios.interceptors.response.use((response) => {
      return response;
    }, (error) => {
      if (error.response.status === 401) {
        console.log('Unauthenticated User')
        window.location.reload();
      }
      return Promise.reject(error.response);
    });
    const id = setInterval(() => {
      axios
        .get('/api/users/ping-auth')
        .then(({ data }) => dispatch(appRedux.actions.setAuthUser(data)))
      ;
    }, 5 * 1000);
    axios
      .get('/api/users/ping-auth')
      .then(({ data }) => dispatch(appRedux.actions.setAuthUser(data)))
    ;
    return () => clearInterval(id);
  }, [/* componentDidMount */]);

  if (!authUser) {
    return (
      <div className="container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
