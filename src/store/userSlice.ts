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

// Mock
if (isEmpty(initialState.user)) {
  // initialState.user = mockData.user;
}

const getRoomIdByUserId = (contact: any, userId: any) => {
  const roomId = contact.findIndex((data: any) => data.id === userId);
  return roomId;
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
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
    // setUserContactToConnect: (state, action) => {
    //   const contacts = [...state.contacts];
    //   const contactId = getRoomIdByUserId(contacts, action.payload.userId);
    //   if (contactId >= 0) {
    //     contacts[contactId].isConnected = action.payload.value;
    //   }
    //   state.contacts = contacts;
    // },
    // setUserToLocalContact: (state, action) => {
    //   const contacts = [...state.contacts];
    //   const contactId = getRoomIdByUserId(contacts, action.payload.id);
    //   if (contactId === -1) {
    //     contacts.push(action.payload);
    //   }
    //   state.contacts = contacts;
    // },
  },
});

export const {
  setLogin,
  setLogout,
  setLoginUser,
  setUserConnect,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
