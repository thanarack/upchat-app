import { io } from 'socket.io-client';
import { store } from './store';
import { socketPushMessageToChannel } from '../store/chatSlice';
import {
  addNewRoom,
  addUnreadToRoom,
  removeRoom,
  setRoomContactToConnect,
} from '../store/roomsSlice';
// import { setUserContactToConnect } from '../store/userSlice';

const { user }: any = store.getState();

const AppSocket = io('ws://localhost:4000', {
  timeout: 15000,
  transports: ['websocket'],
  query: { userId: user?.user?.userId || null },
});

const handlerMessageType = (payload: any) => {
  const { user, chat, rooms }: any = store.getState();
  payload.currentUserId = user.user.userId;
  // Check if message user id equals session user, don't action.
  if (user.clientId !== payload.clientId) {
    store.dispatch(socketPushMessageToChannel(payload));
    // Update unread to room, and called api to update
    // If focus in same channel as selected, don't push update
    if (chat.channel.channelId !== payload.channelId) {
      store.dispatch(addUnreadToRoom(payload));
    }
  }
  // Check new contact and add new room if dons't exits
  if (payload?.channel?.roomType === 'contact') {
    const roomId = rooms.data.findIndex(
      (data: any) => data.channelId === payload.channelId
    );
    if (roomId === -1) {
      store.dispatch(
        addNewRoom({
          id: payload.channelId,
          title: payload.user.title,
          channelId: payload.channelId,
          unReadCount: 1, // If add new room should start with 1
          roomType: 'contact',
          profileUrl: payload.user.profileUrl,
          isConnected: payload?.channel?.isConnected || false,
          userId: payload.userId,
        })
      );
    }
  }
};

const handlerLoginNoticeType = (payload: any) => {
  store.dispatch(setRoomContactToConnect(payload));
  // store.dispatch(setUserContactToConnect(payload));
};

const handlerNewRoomType = (payload: any) => {
  store.dispatch(addNewRoom(payload));
};

const handlerRemoveRoomType = (payload: any) => {
  store.dispatch(removeRoom(payload));
};

export {
  handlerMessageType,
  handlerLoginNoticeType,
  handlerNewRoomType,
  handlerRemoveRoomType,
};

export default AppSocket;
