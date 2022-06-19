/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useRoute from '../hooks/useRoute';
import PrivateRoute from './index';

const AdminPrivateRoute = ({ children }: any) => {
  const [isReady, setIsReady] = useState(false);
  const { userRole, userId } = useAuth();
  const { navigate } = useRoute();

  // Check admin
  useEffect(() => {
    if (userId && userRole && !['administrator'].includes(userRole)) {
      return navigate({
        pathname: '/dashboard',
      });
    }
    if (userId && userRole && ['administrator'].includes(userRole)) {
      setIsReady(true);
    }
  }, [userRole, userId]);

  return (
    <PrivateRoute isLoadingPrivate={!isReady}>
      {isReady && <div id="admin-private-children">{children}</div>}
    </PrivateRoute>
  );
};

export default AdminPrivateRoute;
