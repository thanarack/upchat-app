import { useEffect, useState } from 'react';
import classNames from 'classnames';
import useChat from '../../hooks/useChat';
import useRooms from '../../hooks/useRooms';
import useRoute from '../../hooks/useRoute';
import { GetIcon } from '../../utils/icon';
import { useGetRoomsMutation } from '../../services/users';
import useAuth from '../../hooks/useAuth';
import AppSocket from '../../app/socket';
import ModalConfirmation from '../../shared/ModalConfirmation';

type IChannelSlide = {
  channelId: string;
  id: string;
  isConnected: boolean;
  profileUrl: string;
  roomType: string;
  title: string;
  unReadCount: number;
};

const RoomsSide = () => {
  const { navigate } = useRoute();
  const { chatSetChannel, getChannelId } = useChat();
  const { userSetLogout, userSetLoginUser, user, userResetAllState } =
    useAuth();
  const { myRooms, roomsSetInitialRooms } = useRooms();
  const [isOpenLogout, setIsOpenLogout] = useState(false);
  const [serviceGetRoomsService] = useGetRoomsMutation();

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

  const onGoingToChannel = (data: IChannelSlide) => {
    chatSetChannel(data);
    navigate({ pathname: '/chatroom', search: '?channelId=' + data.channelId });
  };

  const renderRooms = () => {
    const roomGroup = myRooms.filter((data: any) => data.roomType === 'group');
    if (!roomGroup.length) {
      return <li className="room-not-found">ไม่พบห้องสนทนา</li>;
    }
    return roomGroup.map((data: any) => {
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
    const roomContact = myRooms.filter(
      (data: any) => data.roomType === 'contact'
    );
    if (!roomContact.length) {
      return <li className="room-not-found">ไม่พบผู้ติดต่อ</li>;
    }
    return roomContact.map((data: any) => (
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
              src={data.profileUrl || '/user-logo.png'}
              className="profile-url rounded-full"
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

  const onLogout = () => {
    userSetLogout();
    userSetLoginUser({});
    userResetAllState();
    window.localStorage.removeItem('upchat-app-token');
    window.localStorage.removeItem('upchat-app-client-id');
    window.localStorage.removeItem('ally-supports-cache');
    AppSocket.emit('sent-message', {
      type: 'login-notice',
      payload: {
        userId: user.user.userId,
        value: false,
      },
    });
    setTimeout(() => {
      navigate('/');
    }, 10);
  };

  return (
    <div className="room-slide">
      <ModalConfirmation
        title="ต้องการออกจากระบบใช่หรือไม่"
        isOpen={isOpenLogout}
        onAccept={onLogout}
        onCancel={() => setIsOpenLogout(false)}
        onClose={() => setIsOpenLogout(false)}
      />
      <div className="">
        <div className="px-4">
          <div className="px-3 border text-sm py-2 border-slate-900 bg-slate-900 rounded-lg flex items-center justify-between">
            <span className="font-ibm">ห้องของคุณ</span>
            {['administrator'].includes(user.user.role) && (
              <div role="button" onClick={() => navigate('/settings/rooms')}>
                <GetIcon mode="outline" name="plus" />
              </div>
            )}
          </div>
        </div>
        <ul className="db-rooms">{renderRooms()}</ul>
        <div className="px-4 mt-6">
          <div className="border text-sm px-3 py-2 border-slate-900 bg-slate-900 rounded-lg flex items-center justify-between">
            <span className="font-ibm">ผู้ติดต่อล่าสุด</span>
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
          {['administrator'].includes(user.user.role) && (
            <li
              aria-label="User setting"
              title="User setting"
              onClick={() => navigate('/settings')}
            >
              <GetIcon mode="outline" name="cog" />
            </li>
          )}
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
