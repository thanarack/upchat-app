import { FormEvent, useState } from 'react';
import Button from '../../components/button/Button';
import useAuth from '../../hooks/useAuth';
import useRoute from '../../hooks/useRoute';
import {
  useGetProfileMutation,
  usePostLoginMutation,
} from '../../services/users';

const FeaturesLogin = () => {
  const { userSetLogin, userSetLoginUser } = useAuth();
  const { navigate } = useRoute();

  const [postLogin, { isLoading, isError, reset }] = usePostLoginMutation();
  const [getProfile] = useGetProfileMutation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <div className="w-full h-screen flex flex-row bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="md:flex w-8/12 h-screen hidden">
        <div
          className="w-full h-screen"
          style={{
            background: 'url(/images/login-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        />
      </div>
      <div className="flex flex-auto">
        <div className="flex-auto self-center flex flex-col justify-center px-16">
          <div className="mb-10 w-full flex justify-center">
            <img
              src="/images/logo-app.png"
              title="Logo"
              alt="Application login logo"
              className="w-96 filter"
            />
          </div>
          <div className="px-8 py-8 rounded-3xl w-full shadow-md bg-slate-800">
            <div className="text-center w-full mb-6">
              <label className="text-2xl text-white">เข้าร่วมการพูดคุย</label>
            </div>
            {!isLoading && isError && (
              <div className="text-sm text-rose-500 px-1 py-1 mt-1">
                กรุณาตรวจสอบ ผู้ใช้งาน หรือ รหัสผ่าน ให้ถูกต้อง
              </div>
            )}
            <form id="form-login" onSubmit={onLogin} className="mt-4">
              <div className="mb-6">
                <input
                  required
                  placeholder="ผู้ใช้งาน"
                  type="text"
                  maxLength={200}
                  autoComplete="off"
                  className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
                  value={username}
                  onChange={(e) => {
                    reset();
                    setUsername(e.target.value);
                  }}
                />
              </div>
              <div className="mb-6">
                <input
                  required
                  placeholder="รหัสผ่าน"
                  type="password"
                  maxLength={200}
                  autoComplete="off"
                  className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
                  value={password}
                  onChange={(e) => {
                    reset();
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div className="flex">
                <Button
                  form="form-login"
                  isLoading={isLoading}
                  text="เข้าสู่ระบบ"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesLogin;
