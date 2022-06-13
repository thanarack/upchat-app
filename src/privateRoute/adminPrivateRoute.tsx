import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useRoute from '../hooks/useRoute';
import PrivateRoute from './index';

const AdminPrivateRoute = ({ children }: any) => {
  const { user } = useAuth();
  const { navigate, location } = useRoute();

  // Check admin
  useEffect(() => {
    if (!['adminitrator'].includes(user.user.role)) {
      return navigate({
        pathname: '/dashboard',
        search: '?redirect=' + location.pathname,
      });
    }
  }, [user.user.role]);

  return (
    <PrivateRoute>
      <div id="admin-private-children">{children}</div>
    </PrivateRoute>
  );
};

export default AdminPrivateRoute;
