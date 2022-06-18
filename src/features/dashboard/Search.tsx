import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useChat from '../../hooks/useChat';
import useRooms from '../../hooks/useRooms';
import useRoute from '../../hooks/useRoute';
import {
  useAddUserRoomMutation,
  useGetContactsMutation,
} from '../../services/users';
import './Dashboard.scss';
// const mockData = require('../../mockData.json');

const Search = () => {
  const { roomsAddNewRoom } = useRooms();
  const { navigate } = useRoute();
  const [userList, setUserList]: any = useState([]);
  const [inputText, setInputText] = useState('');
  const { chatSetChannel } = useChat();
  const [serviceGetContacts] = useGetContactsMutation();
  const [serviceAddUserRoom] = useAddUserRoomMutation();

  const onFetchUser = async (text: String) => {
    try {
      if (!text) return setUserList([]);

      const result = await serviceGetContacts(text).unwrap();

      if (result.statusCode === 200) {
        setUserList(result.result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onInput = (e: any) => {
    const text = e.target.value;
    setInputText(text);
    onFetchUser(text);
  };

  const onAddToLocalContact = async (data: any) => {
    // Add user to contact & Add new room type contact
    const newRoomBody = {
      roomType: 'contact',
      targetUserId: data.id,
    };

    const resultAddUserRoom = await serviceAddUserRoom(newRoomBody).unwrap();

    if (resultAddUserRoom.statusCode === 200) {
      const result = resultAddUserRoom.result.data;
      const createRoomWithContactPayload = {
        id: result.id,
        title: result.title,
        channelId: result.id,
        unReadCount: result.unReadCount,
        roomType: result.roomType,
        userAllow: result.userAllow,
        profileUrl: result.profileUrl || '/user-logo.png',
        isConnected: result.isConnected || false,
        userId: result.userId,
      };

      // Added new room to store.
      roomsAddNewRoom(createRoomWithContactPayload);
      // Clear input and search
      setInputText('');
      setUserList([]);
      // Join room
      chatSetChannel({
        channelId: result.id,
        id: result.id,
        isConnected: result.isConnected,
        profileUrl: result.profileUrl || '/user-logo.png',
        roomType: result.roomType,
        title: result.title,
        unReadCount: result.unReadCount,
      });
      navigate({
        pathname: '/chatroom',
        search: '?channelId=' + result.id,
      });
    }
  };

  useEffect(() => {
    if (!inputText) {
      setUserList([]);
    }
  }, [inputText]);

  return (
    <div className="flex w-full px-4 mt-4 flex-col relative">
      <div>
        <input
          placeholder="@ ค้นหาผู้ใช้งานในองค์กร"
          className="w-full border rounded-md px-3 py-2 outline-none text-gray-600 bg-slate-100 shadow-sm"
          onChange={onInput}
          value={inputText}
          maxLength={150}
        />
      </div>
      {userList.length > 0 && (
        <div className="dh-search">
          <ul className="list">
            {userList.map((data: any) => (
              <li
                key={data.id}
                role="button"
                onClick={() => onAddToLocalContact(data)}
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Search;
