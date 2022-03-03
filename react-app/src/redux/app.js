import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginAt: null,
  authUser: null
};

const appRedux = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoginAt: (state, { payload: loginAt }) => { state.loginAt = loginAt },
    setAuthUser: (state, { payload: authUser }) => { state.authUser = authUser }
  }
});

export default appRedux;
