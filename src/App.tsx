/* eslint-disable react-hooks/exhaustive-deps */
// Imported route module
import { Routes, Route, useLocation } from 'react-router-dom';
import AppSocket, {
  handlerLoginNoticeType,
  handlerMessageType,
  handlerNewRoomType,
  handlerRemoveRoomType,
} from './app/socket';
import PrivateRoute from './privateRoute';
import FeaturesDashboard from './features/dashboard';
import FeaturesHome from './features/home';
import FeaturesLogin from './features/login';
import FeaturesSettings from './features/settings';
import FeaturesUserProfile from './features/userProfile';
import FeaturesChatRoom from './features/chatRoom';
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
  console.log('message', data);
});

function App() {
  const history = useLocation();
  const { user } = useAuth();
  const [isConnect, setIsConnect] = useState(false);
  const { chatClearChannel } = useChat();

  useEffect(() => {
    // Emit data to server.
    if (user.isAuthenticated && user.user) {
      if (isConnect) {
        console.log('event: login-notice', user);
        AppSocket.emit('sent-message', {
          type: 'login-notice',
          payload: {
            userId: user.user.userId,
            value: true,
          },
        });
        // Call api to update connect has connected.
      } else {
        setIsConnect(true);
      }
    }
  }, [isConnect, user.isAuthenticated, user.user]);

  useEffect(() => {
    if (history.pathname !== '/chatroom') {
      chatClearChannel();
    }
  }, [history.pathname]);

  return (
    <div className="App">
      <Routes>
        <Route key="home" path="/" element={<FeaturesHome />} />
        <Route key="login" path="login" element={<FeaturesLogin />} />
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
