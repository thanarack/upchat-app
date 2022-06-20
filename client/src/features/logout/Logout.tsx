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
      count = 1;
      navigate('/login');
    }, 1500);
  };

  useEffect(() => {
    if (userId && count === 1) {
      onLogout();
    }
  }, [userId]);

  return (
    <div className="w-full font-ibm h-screen flex flex-col gap-y-8 justify-center items-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="text-2xl flex flex-col gap-y-4 items-center">
        <div className="-top-1 relative">
          <svg
            className="animate-spin h-10 w-10 text-white mr-2"
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
        <div>กำลังเปลี่ยนไปยังหน้าเข้าสู่ระบบ</div>
      </div>
      <div className="text-xl flex flex-row gap-2">
        <span>หากนานเกินไป</span>
        <div
          role="button"
          className="text-emerald-400"
          onClick={() => navigate('/login')}
        >
          คลิก
        </div>
      </div>
    </div>
  );
};

export default FeaturesLogout;
