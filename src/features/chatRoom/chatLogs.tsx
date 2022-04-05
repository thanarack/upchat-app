/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useChat from '../../hooks/useChat';
const localeTh = require('dayjs/locale/th');

const Message = (props: any) => {
  const { message, userId, messageId, timestamp } = props.data;
  const { user } = useAuth();
  const [userInfo, setUserInfo]: any = useState(undefined);
  const isCurrentUser = user.user.userId === userId;
  const classMessage = isCurrentUser ? `cr-user` : `cr-other`;
  const getUserFromContact: any = user.contacts.find(
    (data: any) => data.id === userId
  );

  useEffect(() => {
    // If user notfound from contact store, Just get from api then store into contact redux
    if (!getUserFromContact) {
      //
    } else {
      setUserInfo(getUserFromContact);
    }
  }, [getUserFromContact]);

  const formatData = () => {
    let display;
    const now = dayjs();
    const messageDate = dayjs.unix(timestamp);
    if (messageDate.format('DD/MM/YYYY') !== now.format('DD/MM/YYYY')) {
      display = `${messageDate.locale(localeTh).format('D MMM YYYY - HH.mm')}`;
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
          src={userInfo ? userInfo.profileUrl : `./user-logo.png`}
          className="w-8 h-8 shadow-sm rounded-full"
          alt="Login user"
        />
      </div>
      <div className="cr-message">
        <div className="cr-user-info">
          {userInfo && <span className="cr-user">{userInfo.title}</span>}
          <span className="cr-time">{formatData()}</span>
        </div>
        <div className="cr-text">{message}</div>
      </div>
      {/* <div className="cr-date">{formatData()}</div> */}
    </div>
  );
};

const ChatLogs = () => {
  const { getChannelId, getMessages } = useChat();
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

  if (!getRoomMessage) return null;

  return (
    <div id="chat-messages" className="cr-chat-message">
      {getChatLogs.map((data: any) => (
        <Message key={data.messageId} data={data} />
      ))}
    </div>
  );
};

export default ChatLogs;
