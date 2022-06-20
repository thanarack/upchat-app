/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import AppSocket from '../../app/socket';
import useAuth from '../../hooks/useAuth';
import useRoute from '../../hooks/useRoute';

let count = 1;

const FeaturesLogout = () => {
  const { navigate } = useRoute();
  const {
    userSetLogout,
    userSetLoginUser,
    userId,
    userResetAllState,
    userForceLogout,
  } = useAuth();

  const onLogout = () => {
    count++;

    // Notify the user if lose token
    if (userForceLogout) {
      toast('Token ของคุณหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง', {
        type: 'info',
        position: 'top-center',
        autoClose: false,
      });
    }

    // Set store to initial state
    userSetLogout();
    userSetLoginUser({});
    userResetAllState();

    // Clear local storage
    window.localStorage.removeItem('upchat-app-token');
    window.localStorage.removeItem('upchat-app-client-id');
    window.localStorage.removeItem('ally-supports-cache');

    // Push notification when logout
    AppSocket.emit('sent-message', {
      type: 'login-notice',
      payload: {
        userId: userId,
        value: false,
      },
    });

    // Delay and get back to home page
    setTimeout(() => {
      count = 1
      navigate('/login');
    }, 10);
  };

  useEffect(() => {
    if (userId && count === 1) {
      onLogout();
    }
  }, [userId]);

  return <div />;
};

export default FeaturesLogout;
