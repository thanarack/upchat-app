import PrivateRoute from './index';

const AdminPrivateRoute = ({ children }: any) => {
  return (
    <PrivateRoute>
      <div id="admin-private-children">{children}</div>
    </PrivateRoute>
  );
};

export default AdminPrivateRoute;
