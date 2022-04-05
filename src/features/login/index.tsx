import { FormEvent, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useRoute from '../../hooks/useRoute';

const mockData = require('../../mockData.json');

const FeaturesLogin = () => {
  const { userSetLogin, userSetLoginUser } = useAuth();
  const { navigate } = useRoute();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mock map user
    if (username === 'thanarackc@gmail.com') userSetLoginUser(mockData.user);
    if (username === 'nick@gmail.com') userSetLoginUser(mockData.user2);
    if (username === 'chaisri@gmail.com') userSetLoginUser(mockData.user3);
    userSetLogin();
    navigate({ pathname: '/dashboard' });
  };

  return (
    <div className="w-full h-screen flex flex-row bg-slate-800">
      <div className="flex-auto self-center flex justify-center">
        <div className="px-6 py-6 border rounded-md w-1/3 shadow-md bg-slate-100">
          <div className="text-center w-full">
            <label className="text-xl">เข้าสู่ระบบ</label>
          </div>
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
                onChange={(e) => setUsername(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              form="form-login"
              className="rounded-md mt-6 bg-green-700 px-2 py-2 w-full text-base text-white"
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeaturesLogin;
