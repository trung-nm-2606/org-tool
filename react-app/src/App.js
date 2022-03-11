import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import AppRoutes from "./AppRoutes";
import Layout from './Layout';
import RootLayout from './layout/RootLayout';
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

  // if (!authUser) {
  //   return (
  //     <span className="spinner-border spinner-border-sm m-3" role="status" aria-hidden="true"></span>
  //   );
  // }

  return (
    <RootLayout>
      <AppRoutes />
    </RootLayout>
  );
}

export default App;
