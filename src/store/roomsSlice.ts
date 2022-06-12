import { createSlice } from '@reduxjs/toolkit';
import AppSocket from '../app/socket';
import { RootState } from '../app/store';

// const mockData = require('../mockData.json');

const initialState: any = {
  data: [],
};

const getRoomIdByChannelId = (rooms: any, channelId: any) => {
  const roomId = rooms.findIndex((data: any) => data.channelId === channelId);
  return roomId;
};

const getRoomIdByUserId = (rooms: any, userId: any) => {
  const roomId = rooms.findIndex((data: any) => data.userId === userId);
  return roomId;
};

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    reset: () => initialState,
    setInitialRooms: (state, action) => {
      state.data = action.payload;
    },
    addUnreadToRoom: (state, action) => {
      const rooms = [...state.data];
      const roomId = getRoomIdByChannelId(rooms, action.payload.channelId);
      if (roomId >= 0) {
        const unReadCount = state.data[roomId].unReadCount;
        const setUnReadCount = unReadCount + 1;
        rooms[roomId].unReadCount = setUnReadCount;
      }
      state.data = rooms;
    },
    clearUnreadRoom: (state, action) => {
      const rooms = [...state.data];
      const roomId = getRoomIdByChannelId(rooms, action.payload.channelId);
      if (roomId >= 0) {
        rooms[roomId].unReadCount = 0;
        // Emit message to socket to update
        AppSocket.emit('sent-message', {
          type: 'unread',
          payload: {
            channelId: action.payload.channelId,
            userId: action.payload.userId,
            unReadCount: 0,
          },
        });
      }
      state.data = rooms;
    },
    setRoomContactToConnect: (state, action) => {
      const rooms = [...state.data];
      const roomId = getRoomIdByUserId(rooms, action.payload.userId);
      if (roomId >= 0) {
        rooms[roomId].isConnected = action.payload.value;
      }
      state.data = rooms;
    },
    addNewRoom: (state, action) => {
      const rooms = [...state.data];
      const roomId = getRoomIdByChannelId(rooms, action.payload.channelId);
      if (roomId === -1) {
        rooms.push(action.payload);
      }
      state.data = rooms;
    },
    removeRoom: (state, action) => {
      const rooms = [...state.data];
      const roomId = getRoomIdByChannelId(rooms, action.payload.channelId);
      if (roomId >= 0) {
        rooms.splice(roomId, 1);
      }
      state.data = rooms;
    },
  },
});

export const {
  setInitialRooms,
  addUnreadToRoom,
  clearUnreadRoom,
  setRoomContactToConnect,
  addNewRoom,
  removeRoom,
  reset
} = roomsSlice.actions;

export const selectRooms = (state: RootState) => state.rooms;

export default roomsSlice.reducer;
