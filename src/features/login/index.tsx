import { FormEvent, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useRoute from '../../hooks/useRoute';
import {
  useGetProfileMutation,
  usePostLoginMutation,
} from '../../services/users';

// const mockData = require('../../mockData.json');

const FeaturesLogin = () => {
  const { userSetLogin, userSetLoginUser } = useAuth();
  const { navigate } = useRoute();

  const [postLogin, { isLoading, isError, reset }] = usePostLoginMutation();
  const [getProfile] = useGetProfileMutation();

  const [username, setUsername] = useState('thanarackc@gmail.com');
  const [password, setPassword] = useState('123456');

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const getToken = await postLogin({ username, password }).unwrap();
      if (getToken.statusCode === 200) {
        // Set token to local
        window.localStorage.setItem(
          'upchat-app-token',
          getToken.result.data.token
        );
        // Get user after got token
        const profileResult = await getProfile(undefined).unwrap();
        if (profileResult.statusCode === 200) {
          userSetLogin();
          userSetLoginUser(profileResult.result.data);
          navigate({ pathname: '/dashboard' });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex flex-row bg-slate-800">
      <div className="flex-auto self-center flex justify-center">
        <div className="px-6 py-6 border rounded-md w-1/3 shadow-md bg-slate-100">
          <div className="text-center w-full">
            <label className="text-xl">เข้าสู่ระบบ</label>
          </div>
          {!isLoading && isError && (
            <div className="text-center text-sm text-red-600 px-1 py-1 mt-1">
              ไม่พบชื่อผู้ใช้งาน
            </div>
          )}
          <form id="form-login" onSubmit={onLogin} className="mt-4">
            <div className="mb-4">
              <input
                required
                placeholder="ผู้ใช้งาน"
                type="text"
                maxLength={200}
                autoComplete="off"
                className="w-full border rounded-md px-2 py-2 outline-none text-sm"
                value={username}
                onChange={(e) => {
                  reset();
                  setUsername(e.target.value);
                }}
              />
            </div>
            <div className="mb-4">
              <input
                required
                placeholder="รหัสผ่าน"
                type="password"
                maxLength={200}
                autoComplete="off"
                className="w-full border rounded-md px-2 py-2 outline-none text-sm"
                value={password}
                onChange={(e) => {
                  reset();
                  setPassword(e.target.value);
                }}
              />
            </div>
            <button
              form="form-login"
              disabled={isLoading}
              className="flex flex-row items-center space-x-2 justify-center rounded-md mt-6 bg-green-700 px-2 py-2 w-full text-base text-white disabled:bg-gray-600"
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              )}
              <span>เข้าสู่ระบบ</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeaturesLogin;
