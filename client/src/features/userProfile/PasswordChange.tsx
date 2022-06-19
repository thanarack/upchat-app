import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../../components/button/Button';
import { usePostProfileUpdatePasswordMutation } from '../../services/users';

const PasswordChange = () => {
  const { handleSubmit, register, reset } = useForm();
  const [postProfileUpdatePassword] = usePostProfileUpdatePasswordMutation();

  const onSubmit = async (data: any) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        return toast('รหัสผ่านไม่ตรงกัน', { type: 'warning' });
      }

      const result = await postProfileUpdatePassword(data).unwrap();
      if (result.statusCode === 200) {
        toast('เปลี่ยนรหัสผ่านทำเร็จ', { type: 'success' });
        reset();
      }
    } catch (e) {
      console.log(e);
      return toast('รหัสผ่านเดิมไม่ถูกต้อง', { type: 'warning' });
    }
  };

  return (
    <form id="password-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="container flex justify-center mt-6">
        <div className="md:max-w-2xl w-full">
          <div className="px-4">
            <div className="form-group mt-6">
              <label>รหัสผ่านปัจจุบัน</label>
              <input
                type="password"
                className="form-input"
                autoComplete="off"
                maxLength={50}
                {...register('oldPassword', { required: true })}
              />
            </div>
            <div className="form-group">
              <label>รหัสผ่านใหม่</label>
              <input
                type="password"
                className="form-input"
                autoComplete="off"
                maxLength={50}
                minLength={8}
                {...register('newPassword', { required: true })}
              />
            </div>
            <div className="form-group">
              <label>รหัสผ่านใหม่อีกครั้ง</label>
              <input
                type="password"
                className="form-input"
                autoComplete="off"
                maxLength={50}
                minLength={8}
                {...register('confirmPassword', { required: true })}
              />
            </div>
            <div className="text-right">
              <Button text="บันทึก" form="password-form" />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PasswordChange;
