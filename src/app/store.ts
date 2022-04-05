import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../store/userSlice';
import roomsReducer from '../store/roomsSlice';
import chatReducer from '../store/chatSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    rooms: roomsReducer,
    chat: chatReducer,
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
