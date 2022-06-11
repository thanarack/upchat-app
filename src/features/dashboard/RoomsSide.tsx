import { useEffect, useState } from 'react';
import classNames from 'classnames';
import useChat from '../../hooks/useChat';
import useRooms from '../../hooks/useRooms';
import useRoute from '../../hooks/useRoute';
import { GetIcon } from '../../utils/icon';
import {
  useAddUserRoomMutation,
  useGetRoomsMutation,
} from '../../services/users';
import useAuth from '../../hooks/useAuth';
import ModalComponent from '../../shared/ModalComponent';
import AppSocket from '../../app/socket';
import ModalConfirmation from '../../shared/ModalConfirmation';

const RoomsSide = () => {
  const { navigate } = useRoute();
  const { chatSetChannel, getChannelId } = useChat();
  const { userSetLogout, userSetLoginUser, user } = useAuth();
  const { myRooms, roomsAddNewRoom, roomsSetInitialRooms } = useRooms();
  const [isOpenNewRoom, setIsOpenNewRoom] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isOpenLogout, setIsOpenLogout] = useState(false);
  const [serviceGetRoomsService] = useGetRoomsMutation();
  const [serviceAddUserRoom] = useAddUserRoomMutation();

  // Initialize setup room
  const initializeSetup = async () => {
    if (myRooms.length === 0) {
      const roomsResult = await serviceGetRoomsService(undefined).unwrap();
      if (roomsResult.statusCode === 200) {
        roomsSetInitialRooms(roomsResult.result.data);
      }
    }
  };

  // Run once after mount component
  useEffect(() => {
    initializeSetup();
  }, []);

  const onGoingToChannel = (data: any) => {
    chatSetChannel(data);
    navigate({ pathname: '/chatroom', search: '?channelId=' + data.channelId });
  };

  const renderRooms = () => {
    return myRooms
      .filter((data: any) => data.roomType === 'group')
      .map((data: any) => {
        const roomsOfUser = user.user.rooms || [];
        if (data.userAllow === 'private' && !roomsOfUser.includes(data.id)) {
          return undefined;
        }
        return (
          <li
            key={data.channelId}
            role="button"
            onClick={() => onGoingToChannel(data)}
            className={classNames({ active: getChannelId === data.channelId })}
          >
            <div>
              <GetIcon
                mode="outline"
                name="hashtag"
                className={classNames({ unread: data.unReadCount > 0 })}
              />
              <span
                id="room"
                className={classNames({ unread: data.unReadCount > 0 })}
              >
                {data.title}
              </span>
              {data.unReadCount > 0 && (
                <span id="unread-count">{data.unReadCount}</span>
              )}
            </div>
          </li>
        );
      });
  };

  const renderRecentContact = () => {
    return myRooms
      .filter((data: any) => data.roomType === 'contact')
      .map((data: any) => (
        <li
          key={data.channelId}
          role="button"
          onClick={() => onGoingToChannel(data)}
          className={classNames({ active: getChannelId === data.channelId })}
        >
          <div>
            <div id="online-status">
              <span
                className={classNames('dot', {
                  online: data.isConnected,
                  offline: !data.isConnected,
                })}
              />
              <img
                src={data.profileUrl}
                className="profile-url"
                alt="Profile"
              />
            </div>
            <span
              id="user"
              className={classNames({ unread: data.unReadCount > 0 })}
            >
              {data.title}
            </span>
            {data.unReadCount > 0 && (
              <span id="unread-count">{data.unReadCount}</span>
            )}
          </div>
        </li>
      ));
  };

  const onAddNewRoom = async () => {
    if (!inputText) return;

    const newRoomBody = {
      title: inputText,
      roomType: 'group',
      userAllow: 'public',
    };

    // Call api to store data new room.
    const resultAddUserRoom = await serviceAddUserRoom(newRoomBody).unwrap();
    if (resultAddUserRoom.statusCode === 200) {
      // Get result from api
      const resultObj = resultAddUserRoom.result.data;

      const createRoomPayload = {
        id: resultObj.id,
        title: resultObj.title,
        channelId: resultObj.id,
        unReadCount: resultObj.unReadCount,
        roomType: resultObj.roomType,
        userAllow: resultObj.userAllow,
      };

      // Push data via socket to every one.
      AppSocket.emit('sent-message', {
        type: 'new-room',
        payload: createRoomPayload,
      });

      // Selected room.
      roomsAddNewRoom(createRoomPayload);
      onGoingToChannel(createRoomPayload);
      setInputText('');
      setIsOpenNewRoom(false);
    }
  };

  const onLogout = () => {
    userSetLogout();
    userSetLoginUser({});
    window.localStorage.removeItem('upchat-app-token');
    window.localStorage.removeItem('upchat-app-client-id');
    AppSocket.emit('sent-message', {
      type: 'login-notice',
      payload: {
        userId: user.user.userId,
        value: false,
      },
    });
    navigate('/');
  };

  return (
    <div>
      <ModalComponent
        title="เพิ่มห้องใหม่"
        isOpen={isOpenNewRoom}
        onClose={() => setIsOpenNewRoom(false)}
      >
        <input
          placeholder="ใส่ชื่อห้อง"
          className="w-full text-sm border rounded-md px-3 py-2 outline-none text-gray-600 bg-white shadow-sm"
          value={inputText}
          maxLength={150}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button
          onClick={onAddNewRoom}
          className="px-4 rounded-md shadow-sm bg-emerald-600 font-medium text-white disabled:bg-gray-400"
          disabled={!inputText}
        >
          <GetIcon mode="outline" name="plus" className="text-white" />
        </button>
      </ModalComponent>
      <ModalConfirmation
        title="ต้องการออกจากระบบใช่หรือไม่"
        isOpen={isOpenLogout}
        onAccept={onLogout}
        onCancel={() => setIsOpenLogout(false)}
        onClose={() => setIsOpenLogout(false)}
      />
      <div className="">
        <div className="px-4 mt-6">
          <div className="px-3 border text-sm py-2 border-slate-900 bg-slate-900 rounded-lg flex items-center justify-between">
            <span>ห้องของคุณ</span>
            <div role="button" onClick={() => setIsOpenNewRoom(true)}>
              <GetIcon mode="outline" name="plus" />
            </div>
          </div>
        </div>

        <ul className="db-rooms">{renderRooms()}</ul>
        <div className="px-4 mt-6">
          <div className="border text-sm px-3 py-2 border-slate-900 bg-slate-900 rounded-lg flex items-center justify-between">
            <span>ผู้ติดต่อล่าสุด</span>
          </div>
        </div>
        <ul className="db-contact">{renderRecentContact()}</ul>
      </div>
      <div className="absolute flex bottom-0 px-4 py-4 bg-slate-900 w-full z-10 border-t border-gray-700">
        <ul className="dh-menu-footer">
          <li
            aria-label="Dashboard"
            title="Dashboard"
            onClick={() => navigate('/dashboard')}
          >
            <GetIcon mode="outline" name="home" />
          </li>
          <li
            aria-label="User account"
            title="User account"
            onClick={() => navigate('/profile')}
          >
            <GetIcon mode="outline" name="user" />
          </li>
          <li
            aria-label="User setting"
            title="User setting"
            onClick={() => navigate('/settings')}
          >
            <GetIcon mode="outline" name="cog" />
          </li>
          <li
            aria-label="Logout"
            title="Logout"
            onClick={() => setIsOpenLogout(true)}
          >
            <GetIcon mode="outline" name="logout" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RoomsSide;