/* eslint-disable react-hooks/exhaustive-deps */
// Imported route module
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import AppSocket, {
  handlerLoginNoticeType,
  handlerMessageType,
  handlerNewRoomType,
  handlerRemoveRoomType,
  handlerUpdateRoomType,
} from './app/socket';
import PrivateRoute from './privateRoute';
import FeaturesDashboard from './features/dashboard';
import FeaturesHome from './features/home';
import FeaturesLogin from './features/login';
import FeaturesSettings from './features/settings';
import FeaturesUserProfile from './features/userProfile';
import FeaturesChatRoom from './features/chatRoom';
import FeaturesLogout from './features/logout/Logout';
import { useEffect, useState } from 'react';
import useChat from './hooks/useChat';
import useAuth from './hooks/useAuth';
import AdminPrivateRoute from './privateRoute/adminPrivateRoute';
import './global.scss';

AppSocket.on('connect', () => {
  console.log('Application connected socket ID :', AppSocket.id);
});

AppSocket.on('new-message', (data) => {
  if (data.type === 'message') handlerMessageType(data.payload);
  if (data.type === 'login-notice') handlerLoginNoticeType(data.payload);
  if (data.type === 'new-room') handlerNewRoomType(data.payload);
  if (data.type === 'remove-room') handlerRemoveRoomType(data.payload);
  if (data.type === 'update-room') handlerUpdateRoomType(data.payload);
  console.log('message', data);
});

function App() {
  const history = useLocation();
  const navigate = useNavigate();
  const { user, userForceLogout } = useAuth();
  const [isConnect, setIsConnect] = useState(false);
  const { chatClearChannel } = useChat();
  const userInfo = user.user;

  // When user has connected to server.
  useEffect(() => {
    // Emit data to server.
    if (user.isAuthenticated && userInfo) {
      if (isConnect) {
        console.log('event: login-notice', user);
        AppSocket.emit('sent-message', {
          type: 'login-notice',
          payload: {
            userId: userInfo.userId,
            value: userInfo.isConnected,
          },
        });
        // Call api to update connect has connected.
      } else {
        setIsConnect(true);
      }
    }
  }, [isConnect, user.isAuthenticated, userInfo]);

  // When chat room url has been active.
  useEffect(() => {
    if (history.pathname !== '/chatroom') {
      chatClearChannel();
    }
  }, [history.pathname]);

  // When user lose token or token expired
  useEffect(() => {
    if (userForceLogout) navigate('/logout');
  }, [userForceLogout]);

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route key="home" path="/" element={<FeaturesHome />} />
        <Route key="login" path="login" element={<FeaturesLogin />} />
        <Route key="logout" path="logout" element={<FeaturesLogout />} />
        <Route
          key="dashboard"
          path="dashboard"
          element={
            <PrivateRoute>
              <FeaturesDashboard />
            </PrivateRoute>
          }
        />
        <Route
          key="profile"
          path="profile"
          element={
            <PrivateRoute>
              <FeaturesUserProfile />
            </PrivateRoute>
          }
        />
        <Route
          key="chatroom"
          path="chatroom"
          element={
            <PrivateRoute>
              <FeaturesChatRoom />
            </PrivateRoute>
          }
        />
        <Route
          key="settings"
          path="settings"
          element={
            <AdminPrivateRoute>
              <FeaturesSettings />
            </AdminPrivateRoute>
          }
        />
        <Route
          key="settings/rooms"
          path="settings/rooms"
          element={
            <AdminPrivateRoute>
              <FeaturesSettings />
            </AdminPrivateRoute>
          }
        />
        <Route
          key="settings/users"
          path="settings/users"
          element={
            <AdminPrivateRoute>
              <FeaturesSettings />
            </AdminPrivateRoute>
          }
        />
        <Route
          key="settings/position"
          path="settings/position"
          element={
            <AdminPrivateRoute>
              <FeaturesSettings />
            </AdminPrivateRoute>
          }
        />
        <Route
          key="settings/logs"
          path="settings/logs"
          element={
            <AdminPrivateRoute>
              <FeaturesSettings />
            </AdminPrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
