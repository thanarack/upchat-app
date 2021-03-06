import useAuth from '../../hooks/useAuth';
import useRoute from '../../hooks/useRoute';

const HeaderProfile = () => {
  const { navigate } = useRoute();
  const { fullName, user, profileUrl, userSetIsConnected } = useAuth();
  const getUser = user.user;

  const onSetUserConnect = () => userSetIsConnected(!getUser.isConnected);

  return (
    <div className="px-4 pb-4 mt-4 flex flex-row items-center space-x-3">
      <div onClick={() => navigate('/profile')} role="button">
        <img
          src={profileUrl ? profileUrl : `./user-logo.png`}
          className="w-10 h-10 shadow-sm rounded-full -mt-1"
          alt="Login user"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/user-logo.png';
          }}
        />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="text-gray-200 font-ibm font-semibold">{fullName}</div>
        <div
          className="flex dh-profile cursor-pointer w-full font-ibm font-medium"
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
            {getUser.isConnected ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfile;
