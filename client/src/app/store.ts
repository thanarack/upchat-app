import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer, { setForceLogout } from '../store/userSlice';
import roomsReducer from '../store/roomsSlice';
import chatReducer from '../store/chatSlice';
import { usersApi } from '../services/users';
import { adminRoomsApi } from '../services/admin/rooms';
import { adminUsersApi } from '../services/admin/users';
import { adminLogsApi } from '../services/admin/logs';

const tokenExpireCheck = (s: any) => (n: any) => (a: any) => {
  console.log('Middleware triggered:', a);
  if (a.payload?.status === 500 && a.payload?.data.errorCode === 'ER-002') {
    return s.dispatch(setForceLogout(true));
  }
  n(a);
};

export const store = configureStore({
  reducer: {
    // State reducer
    user: userReducer,
    rooms: roomsReducer,
    chat: chatReducer,
    // Service reducer
    [usersApi.reducerPath]: usersApi.reducer,
    [adminRoomsApi.reducerPath]: adminRoomsApi.reducer,
    [adminUsersApi.reducerPath]: adminUsersApi.reducer,
    [adminLogsApi.reducerPath]: adminLogsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tokenExpireCheck),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
