/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import AppSocket from '../../app/socket';
import useAuth from '../../hooks/useAuth';
import useChat from '../../hooks/useChat';
import { useGetRoomMessageMutation } from '../../services/users';
import { pushGroupMessage } from '../../store/chatSlice';
const localeTh = require('dayjs/locale/th');

const Message = (props: any) => {
  const { message, userId, messageId, user, createdAt } = props.data;
  const isCurrentUser = user.userId === userId;
  const classMessage = isCurrentUser ? `cr-user` : `cr-other`;

  const formatData = () => {
    let display;
    const now = dayjs();
    const messageDate = createdAt ? dayjs(createdAt) : dayjs();
    if (messageDate.format('DD/MM/YYYY') !== now.format('DD/MM/YYYY')) {
      display = `${messageDate.locale(localeTh).format('D/M/YY - HH.mm')}`;
    } else {
      display = `วันนี้ ${messageDate.format('HH.mm')}`;
    }

    return display;
  };

  return (
    <div
      id="text-message"
      className={classNames('cr-box', classMessage)}
      data-message-id={messageId}
    >
      <div className="cr-profile">
        <img
          src={user.profileUrl ? user.profileUrl : `/user-logo.png`}
          className="w-8 h-8 shadow-sm rounded-full"
          alt="Login user"
        />
      </div>
      <div className="cr-message">
        <div className="cr-user-info">
          {user && <span className="cr-user">{user.title}</span>}
          <span className="cr-time">
            <span>-</span>
            <span>{formatData()}</span>
          </span>
        </div>
        <div className="cr-text">{message}</div>
      </div>
    </div>
  );
};

const ChatLogs = () => {
  const dispatch = useAppDispatch();
  const { getChannelId, getMessages, getUnReadCount } = useChat();
  const { user } = useAuth();
  const [serviceGetRoomMessage] = useGetRoomMessageMutation();

  const getRoomMessage: any = getMessages.find(
    (data: any) => data.channelId === getChannelId
  );

  const getChatLogs: Array<[]> = getRoomMessage?.chatLogs || [];

  // Listen new message and scroll to bottom
  useEffect(() => {
    if (window) {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box') as HTMLFormElement;
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight + 100;
        }
      }, 0);
    }
  }, [getChatLogs.length]);

  // Fetch new message into current channel and push to store.
  const chatFetchRoomMessages = async () => {
    try {
      // Emit data to server.
      AppSocket.emit('sent-message', {
        type: 'join-channel',
        payload: {
          channelId: getChannelId,
          userId: user.user.userId,
        },
      });

      const resultMessages = await serviceGetRoomMessage({
        channelId: getChannelId,
        pageNumber: 1,
      }).unwrap();

      if (resultMessages.statusCode === 200) {
        const chatHistory = resultMessages?.result?.data || [];
        const formatMessage = chatHistory.map((val: any) => {
          return {
            ...val,
            message: JSON.parse(val.message),
          };
        });
        dispatch(pushGroupMessage(formatMessage.reverse()));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch once when enter to a room
  useEffect(() => {
    if (getUnReadCount > 0 || !getChatLogs.length) chatFetchRoomMessages();
  }, [getChannelId, getUnReadCount]);

  if (!getRoomMessage) return null;

  return (
    <div id="chat-messages" className="cr-chat-message">
      {getChatLogs.map((data: any) => (
        <Message key={data._id || data.messageId} data={data} />
      ))}
    </div>
  );
};

export default ChatLogs;
