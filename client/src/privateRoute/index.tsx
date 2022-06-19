import { Fragment, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import useAuth from '../hooks/useAuth';
import useRoute from '../hooks/useRoute';
import { useGetProfileMutation } from '../services/users';

const PrivateRoute = ({ children, isLoading }: any) => {
  const [ready, setReady] = useState(false);
  const [isLoadingPrivate, setIsLoadingPrivate] = useState(false);

  const { user, userSetLogin, userSetLoginUser } = useAuth();
  const { navigate, location } = useRoute();

  useEffect(() => {
    if (!user.isAuthenticated) {
      return navigate({
        pathname: '/login',
        search: '?from=' + String(location.pathname).replace('/', ''),
      });
    } else {
      setReady(true);
    }
  }, [location.pathname, navigate, user.isAuthenticated]);

  // Load profile data if lose store
  const [getProfile] = useGetProfileMutation();

  const checkLoseProfileData = async () => {
    try {
      setIsLoadingPrivate(true);
      const profileResult = await getProfile(undefined).unwrap();
      if (profileResult.statusCode === 200) {
        userSetLogin();
        userSetLoginUser(profileResult.result.data);
        setTimeout(() => {
          setIsLoadingPrivate(false);
        }, 500);
      }
    } catch (e) {
      console.log(e);
      navigate({
        pathname: '/login',
        search: '?from=' + String(location.pathname).replace('/', ''),
      });
    }
  };

  useEffect(() => {
    if (isEmpty(user.user)) checkLoseProfileData();
  }, []);
  // End check profile data

  if (!ready) return null;

  const UnReadyComponent = () => (
    <div id="private-loading">
      <div className="w-full h-full absolute top-0 left-0 bg-slate-900 z-40 opacity-80" />
      <div className="w-full h-full absolute top-0 left-0 z-50 flex justify-center items-center">
        <svg
          className="animate-spin h-16 w-16 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>
  );

  return (
    <Fragment>
      {(isLoadingPrivate || isLoading) && <UnReadyComponent />}
      <div id="private-children">{children}</div>
    </Fragment>
  );
};

PrivateRoute.defaultProps = {
  isLoading: false,
};

export default PrivateRoute;
