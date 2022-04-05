import { Fragment, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import useRoute from '../hooks/useRoute';

function PrivateRoute({ children }: any) {
  const [ready, setReady] = useState(false);

  const { user } = useAuth();
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

  if (!ready) return null;

  return <Fragment>{children}</Fragment>;
}

export default PrivateRoute;
