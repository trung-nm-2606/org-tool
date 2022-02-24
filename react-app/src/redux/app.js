import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loginAt: null
};

const appRedux = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoginAt: (state, { payload: loginAt }) => { state.loginAt = loginAt }
  }
});

export default appRedux;
