import classNames from 'classnames';
import { useEffect, useState } from 'react';
import useRooms from '../../hooks/useRooms';
import {
  useAddUserRoomMutation,
  useGetContactsMutation,
} from '../../services/users';
import './Dashboard.scss';
// const mockData = require('../../mockData.json');

const Search = () => {
  const { roomsAddNewRoom } = useRooms();
  const [userList, setUserList]: any = useState([]);
  const [inputText, setInputText] = useState('');
  const [serviceGetContacts] = useGetContactsMutation();
  const [serviceAddUserRoom] = useAddUserRoomMutation();

  const onFetchUser = async (text: String) => {
    try {
      if (!text) {
        setUserList([]);
        return;
      }

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
      const resultObj = resultAddUserRoom.result.data;
      const createRoomWithContactPayload = {
        id: resultObj.id,
        title: resultObj.title,
        channelId: resultObj.id,
        unReadCount: resultObj.unReadCount,
        roomType: resultObj.roomType,
        userAllow: resultObj.userAllow,
        profileUrl: resultObj.profileUrl,
        isConnected: resultObj.isConnected || false,
        userId: resultObj.userId,
      };

      // Added new room to store.
      roomsAddNewRoom(createRoomWithContactPayload);

      setInputText('');
      setUserList([]);
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
