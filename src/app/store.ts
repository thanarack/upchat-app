import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../store/userSlice';
import roomsReducer from '../store/roomsSlice';
import chatReducer from '../store/chatSlice';
import { usersApi } from '../services/users';

export const store = configureStore({
  reducer: {
    // State reducer
    counter: counterReducer,
    user: userReducer,
    rooms: roomsReducer,
    chat: chatReducer,
    // Service reducer
    [usersApi.reducerPath]: usersApi.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
