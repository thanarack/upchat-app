import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import AppSocket from '../app/socket';
import {
  clearChannel,
  pushMessage,
  selectChat,
  setChannel,
} from '../store/chatSlice';
import { clearUnreadRoom } from '../store/roomsSlice';
import { selectUser } from '../store/userSlice';

/**
 * It returns the chat slice
 * @returns A slice of the user state.
 */
const useChat = () => {
  const dispatch = useAppDispatch();
  const userSlice: any = useAppSelector(selectUser);
  const chatSlice: any = useAppSelector(selectChat);
  const getMessages = chatSlice.messages;
  const getChannelId = chatSlice.channel?.channelId;
  const getChannelTitle = chatSlice.channel?.title;
  const getRoomType = chatSlice.channel?.roomType;

  const chatClearChannel = () => dispatch(clearChannel());

  const chatSetChannel = (room: any) => {
    dispatch(setChannel(room));
    // Called api service clear unread
    dispatch(clearUnreadRoom(room.channelId));
  };

  const chatPushMessage = (message: any) => {
    const setMessage = {
      channelId: getChannelId,
      clientId: userSlice.clientId,
      messageId: nanoid(),
      userId: userSlice.user.userId,
      message,
      timestamp: dayjs().unix(),
      isDelete: false,
      isUnRead: false,
    };

    // Emit data to server.
    AppSocket.emit('sent-message', {
      type: 'message',
      payload: setMessage,
    });

    // Patch data to redux store.
    return dispatch(pushMessage(setMessage));
  };

  return {
    getMessages,
    getChannelId,
    getChannelTitle,
    getRoomType,
    chatSetChannel,
    chatPushMessage,
    chatClearChannel
  };
};

export default useChat;
