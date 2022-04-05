import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useRooms from '../../hooks/useRooms';
import './Dashboard.scss';
const mockData = require('../../mockData.json');

const Search = () => {
  const { userId, userSetUserToLocalContact } = useAuth();
  const { roomsAddNewRoom } = useRooms();
  const [userList, setUserList]: any = useState([]);
  const [inputText, setInputText] = useState('');

  const onFetchUser = () => {
    setUserList([
      ...mockData.contact,
      ...[
        {
          id: '76j6wecf2342r344rgerdfg334',
          title: 'TestAdd TestAdd',
          profileUrl: 'http://localhost:3000/mock-avatar/4333734.png',
          firstName: 'TestAdd',
          lastName: 'TestAdd',
          isConnected: true,
        },
      ],
    ]);
  };

  const onInput = (e: any) => {
    setInputText(e.target.value);
    onFetchUser();
  };

  const onAddToLocalContact = (data: any) => {
    setInputText('');
    setUserList([]);
    // Add user to contact & Add new room type contact
    const makeChannelId = `${data.id}-${userId}`;
    userSetUserToLocalContact(data);
    roomsAddNewRoom({
      id: nanoid(),
      title: data.title,
      userId: data.id,
      channelId: makeChannelId,
      unReadCount: 0,
      isConnected: data.isConnected,
      roomType: 'contact',
    });
    // Called api to save data
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
