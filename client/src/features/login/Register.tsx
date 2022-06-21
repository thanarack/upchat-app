import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../../components/button/Button';
import { usePostRegisterMutation } from '../../services/users';
import { GetIcon } from '../../utils/icon';

const Register = (props: any) => {
  const { onBackToLogin } = props;

  const { handleSubmit, register, setValue } = useForm();

  const [postRegister, postRegisterResult] = usePostRegisterMutation();
  const onSubmit = async (data: any) => {
    try {
      if (data.password !== data.confirmPassword) {
        return toast('รหัสผ่านไม่ตรงกัน', { type: 'warning' });
      }

      const result = await postRegister({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
      }).unwrap();
      if (result.statusCode === 200) {
        toast('ลงทะเบียนสำเร็จ สามารถเข้าร่วมการพูดคุยหลังจาก Login', {
          type: 'success',
          position: 'top-center',
          autoClose: false,
        });
        onBackToLogin();
      }
    } catch (e) {
      console.log(e);
      setValue('username', '');
      toast('ชื่อผู้ใช้งานซ้ำ กรุณาตรวจสอบ', { type: 'warning' });
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row gap-2 items-center text-white"
        role="button"
        onClick={onBackToLogin}
      >
        <GetIcon mode="outline" name="arrow-left" size="lg" className="mt-1" />
        <span>ย้อนกลับ</span>
      </div>
      <div className="text-center w-full mb-6 mt-6">
        <label className="text-2xl text-white font-ibm">ลงทะเบียนใช้งาน</label>
      </div>
      <form
        id="form-register"
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4"
      >
        <div className="mb-6">
          <input
            required
            placeholder="ผู้ใช้งาน"
            type="email"
            maxLength={200}
            autoComplete="off"
            className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
            {...register('username', { required: true })}
          />
        </div>
        <div className="mb-6">
          <input
            required
            placeholder="รหัสผ่าน"
            type="password"
            maxLength={200}
            autoComplete="off"
            minLength={8}
            className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
            {...register('password', { required: true })}
          />
        </div>
        <div className="mb-6">
          <input
            required
            placeholder="รหัสผ่านอีกครั้ง"
            type="password"
            maxLength={200}
            autoComplete="off"
            minLength={8}
            className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
            {...register('confirmPassword', { required: true })}
          />
        </div>
        <hr className="py-3 border-slate-700" />
        <div className="mb-6">
          <input
            required
            placeholder="ชื่อ"
            type="text"
            maxLength={200}
            autoComplete="off"
            className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
            {...register('firstName', { required: true })}
          />
        </div>
        <div className="mb-6">
          <input
            required
            placeholder="นามสกุล"
            type="text"
            maxLength={200}
            autoComplete="off"
            className="w-full shadow-sm rounded-md px-3 py-3 outline-none text-sm bg-slate-300"
            {...register('lastName', { required: true })}
          />
        </div>
        <div className="flex flex-row justify-between items-center">
          <Button
            form="form-register"
            isLoading={postRegisterResult.isLoading}
            text="ยืนยัน"
          />
        </div>
      </form>
    </div>
  );
};

export default Register;
