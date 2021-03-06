/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { FormEvent, useEffect, useState } from 'react';
import AppSocket from '../../app/socket';
import useAuth from '../../hooks/useAuth';
import useChat from '../../hooks/useChat';
import useRoute from '../../hooks/useRoute';
import DashboardTemplate from '../dashboard/DashboardTemplate';
import ChatLogs from './chatLogs';
import './Chatroom.scss';

const FeaturesChatRoom = () => {
  const {
    getChannelTitle,
    getRoomType,
    getChannelId,
    chatPushMessage,
    getChannelProfile,
    getChannelIsConnected,
  } = useChat();
  const [inputText, setInputText] = useState('');
  const { navigate } = useRoute();
  const { user } = useAuth();

  useEffect(() => {
    if (!getChannelId) return navigate('/dashboard');
  }, [getChannelId, navigate]);

  useEffect(() => {
    return () => {
      if (getChannelId) {
        console.log('Set unread count');
        // Emit message to socket to update unread to 0 after change channel
        AppSocket.emit('sent-message', {
          type: 'unread',
          payload: {
            channelId: getChannelId,
            userId: user.user.userId,
            unReadCount: 0,
          },
        });
      }
    };
  }, [getChannelId]);

  const onSetText = (e: any) => {
    setInputText(e.target.value);
  };

  const onPushMessage = () => {
    chatPushMessage(inputText);
    const emptyText = String('').replace(/\r?\n|\r/g, '');
    setInputText(emptyText);
    if (window) {
      setTimeout(() => {
        const chatBox = document.getElementById('chat-box') as HTMLFormElement;
        if (chatBox) {
          chatBox.scrollTop = chatBox.scrollHeight + 100;
        }
      }, 0);
    }
  };

  const onSubmitMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputText) onPushMessage();
  };

  const onKeyPressInput = (e: any) => {
    if (e.which === 13) {
      e.preventDefault();
      if (inputText) onPushMessage();
    }
  };

  return (
    <DashboardTemplate>
      <div className="flex flex-col w-full relative chat-full-height cr-chat-panel mt-4">
        <div
          id="channel-name"
          className="border-b pb-2 pt-1 px-4 border-gray-200 shadow-sm"
        >
          <div className="text-gray-800 font-semibold cr-channel-name flex flex-row items-center">
            {getRoomType === 'group' && <span className="mr-1">#</span>}
            {getRoomType === 'contact' && (
              <div className="online-status-user">
                <span
                  className={classNames('dot', {
                    online: getChannelIsConnected,
                    offline: !getChannelIsConnected,
                  })}
                />
                <img
                  src={getChannelProfile || '/user-logo.png'}
                  className="shadow-sm rounded-full mr-2"
                  title="Avatar"
                  alt="Avatar logo"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/user-logo.png';
                  }}
                />
              </div>
            )}
            <span className="channel-name">{getChannelTitle}</span>
          </div>
        </div>
        <div id="chat-box">
          <ChatLogs />
        </div>
        <div id="chat-input" className="absolute bottom-0 w-full px-4">
          <form
            id="chat-form"
            onSubmit={onSubmitMessage}
            className="flex flex-row space-x-2"
          >
            <textarea
              rows={1}
              className="w-full overflow-hidden resize-none border rounded-md px-3 py-3 h-20 outline-none text-gray-600 bg-slate-100 shadow-sm focus:border-gray-300"
              placeholder="?????????????????????????????????????????????????????????????????? ???(???????c), Enter ?????????????????????????????????????????????"
              onChange={onSetText}
              onKeyPress={onKeyPressInput}
              value={inputText}
            />
            {/* <div className="flex w-1/6">
              <button
                type="submit"
                form="chat-form"
                className="h-full bg-emerald-600 w-full rounded-md text-lg text-white"
              >
                ?????????
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FeaturesChatRoom;
