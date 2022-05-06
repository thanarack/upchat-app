import { FormEvent, useEffect, useState } from 'react';
import AppSocket from '../../app/socket';
import useAuth from '../../hooks/useAuth';
import useChat from '../../hooks/useChat';
import useRooms from '../../hooks/useRooms';
import useRoute from '../../hooks/useRoute';
import ModalConfirmation from '../../shared/ModalConfirmation';
import { GetIcon } from '../../utils/icon';
import DashboardTemplate from '../dashboard/DashboardTemplate';
import ChatLogs from './chatLogs';
import './Chatroom.scss';

const FeaturesChatRoom = () => {
  const { getChannelTitle, getRoomType, getChannelId, chatPushMessage } =
    useChat();
  const [inputText, setInputText] = useState('');
  const { navigate } = useRoute();
  const { userRole, user } = useAuth();
  const { roomsRemoveRoom } = useRooms();
  const [isOpenRemoveRoom, setIsOpenRemoveRoom] = useState(false);

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

  const onRemoveThisRoom = () => {
    roomsRemoveRoom({
      channelId: getChannelId,
    });
    setIsOpenRemoveRoom(false);
    navigate('/dashboard');

    // Called socket to refresh the store.
    AppSocket.emit('sent-message', {
      type: 'remove-room',
      payload: {
        channelId: getChannelId,
      },
    });
    // Called api to trigger remove this room
  };

  return (
    <DashboardTemplate>
      <ModalConfirmation
        title={`ยืนยันการลบห้อง "${getChannelTitle}"`}
        isOpen={isOpenRemoveRoom}
        onAccept={onRemoveThisRoom}
        onCancel={() => setIsOpenRemoveRoom(false)}
        onClose={() => setIsOpenRemoveRoom(false)}
      />
      <div className="flex flex-col w-full relative chat-full-height cr-chat-panel">
        <div
          id="channel-name"
          className="border-b pb-2 pt-1 px-4 border-gray-200"
        >
          <div className="text-gray-800 font-semibold cr-channel-name">
            {getRoomType === 'group' && <span className="mr-1">#</span>}
            {/* {getRoomType === 'contact' && <span>●</span>} */}
            <span className="channel-name">{getChannelTitle}</span>
            {userRole === 'administrator' && (
              <div
                className="trash"
                title="ลบห้อง"
                role="button"
                onClick={() => setIsOpenRemoveRoom(true)}
              >
                <GetIcon mode="outline" name="trash" />
              </div>
            )}
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
              className="w-full overflow-hidden resize-none border border-gray-300 rounded-md px-3 py-3 h-20 outline-none text-gray-600 bg-slate-100 shadow-sm focus:border-gray-400"
              placeholder="พิมพ์ที่นี้เพื่อพูดคุย ☜(ˆ▿ˆc), Enter เพื่อส่งข้อความ"
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
                ส่ง
              </button>
            </div> */}
          </form>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FeaturesChatRoom;
