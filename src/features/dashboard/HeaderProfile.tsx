import AppSocket from '../../app/socket';
import useAuth from '../../hooks/useAuth';

const HeaderProfile = () => {
  const { fullName, user, profileUrl, userSetIsConnected } = useAuth();
  const getUser = user.user;

  const onSetUserConnect = () => {
    userSetIsConnected(!getUser.isConnected);
    AppSocket.emit('sent-message', {
      type: 'login-notice',
      payload: {
        userId: getUser.userId,
        value: !getUser.isConnected,
      },
    });
  };

  return (
    <div className="px-4 mt-4 flex bg-slate-800 flex-row items-center space-x-3">
      <div>
        <img
          src={profileUrl ? profileUrl : `./user-logo.png`}
          className="w-10 h-10 shadow-sm rounded-full"
          alt="Login user"
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="text-gray-200">{fullName}</div>
        <div
          className="flex dh-profile cursor-pointer w-full"
          onClick={onSetUserConnect}
        >
          <span
            id="online-status"
            className={getUser.isConnected ? 'online' : 'offline'}
          >
            ●
          </span>
          <span
            id="text-status"
            className={getUser.isConnected ? 'online' : 'offline'}
          >
            {getUser.isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;