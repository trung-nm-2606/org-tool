import { configureStore } from '@reduxjs/toolkit';
import appRedux from './app';

const store = configureStore({
  reducer: {
    app: appRedux.reducer
  }
});

export default store;
