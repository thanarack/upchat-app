import { createSlice } from '@reduxjs/toolkit';
import isEmpty from 'lodash/isEmpty';
import { nanoid } from 'nanoid';
import { RootState } from '../app/store';

// const mockData = require('../mockData.json');

let clientId: any = '';

const getClientId = window.localStorage.getItem('upchat-app-client-id');
clientId = getClientId;

if (!getClientId) {
  clientId = nanoid();
  window.localStorage.setItem('upchat-app-client-id', clientId);
}

const token = window.localStorage.getItem('upchat-app-token');

const initialState: any = {
  isAuthenticated: token ? true : false,
  user: {},
  token: '',
  clientId,
  contacts: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
    setLogin: (state) => {
      state.isAuthenticated = true;
    },
    setLogout: (state) => {
      state.isAuthenticated = false;
    },
    setLoginUser: (state, action) => {
      state.user = action.payload;
    },
    setUserConnect: (state, action) => {
      if (!isEmpty(state.user)) {
        state.user.isConnected = action.payload;
      }
    },
    setUserImage: (state, action) => {
      state.user.profileUrl = action.payload;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setLoginUser,
  setUserConnect,
  reset,
  setUserImage,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
