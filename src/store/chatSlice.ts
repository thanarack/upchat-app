import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
// const mockData = require('../mockData.json');

const initialState = {
  channel: {},
  messages: [],
};

const pushMessageToExistingChatMessages = (
  oldMessage: any,
  channelId: any,
  payload: any
) => {
  let messages = [...oldMessage];
  let channelIdExist = messages.findIndex(
    (data: any) => data.channelId === channelId
  );
  if (channelIdExist === -1) {
    const newMessage: any = { channelId, chatLogs: [] };
    messages.push(newMessage);
    channelIdExist = messages.length - 1;
  }
  messages[channelIdExist].chatLogs.push(payload);
  return messages;
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChannel: (state, action) => {
      state.channel = action.payload;
    },
    clearChannel: (state) => {
      state.channel = {};
    },
    pushMessage: (state: any, action) => {
      state.messages = pushMessageToExistingChatMessages(
        state.messages,
        state.channel.channelId,
        action.payload
      );
    },
    socketPushMessageToChannel: (state: any, action) => {
      const channelId = action.payload.channelId;
      state.messages = pushMessageToExistingChatMessages(
        state.messages,
        channelId,
        action.payload
      );
    },
  },
});

export const {
  setChannel,
  pushMessage,
  socketPushMessageToChannel,
  clearChannel,
} = chatSlice.actions;

export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
