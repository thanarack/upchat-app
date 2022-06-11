/* eslint-disable jsx-a11y/alt-text */
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../../components/button/Button';
import {
  useGetProfileMutation,
  usePostProfileImageUpdateMutation,
  usePostProfileUpdateMutation,
} from '../../services/users';
import isFileImage from '../../utils/isFileImage';
import DashboardTemplate from '../dashboard/DashboardTemplate';

const FeaturesProfileSetting = () => {
  // Hook function
  useEffect(() => {
    getInitialProfile();
  }, []);

  // Initialize necessary form function.
  const { handleSubmit, register, resetField, reset } = useForm();

  // Initialize get profile
  const getInitialProfile = async () => {
    try {
      const result = await getProfile(null).unwrap();
      if (result) {
        const data = result.result.data;
        let defaultValue = {
          firstName: data.firstName,
          lastName: data.lastName,
          birthDate: dayjs(data.birthDate).format('YYYY-MM-DD'),
          gender: data.gender,
          phone: data.phone,
          address: data.address,
          position: data.position,
          email: data.email,
        };
        reset({ ...defaultValue });
        setPreviewProfile(data.profileUrl + '?v=' + +new Date());
      }
    } catch (e) {
      console.log(e);
    }
  };
  // End set Initialize profile

  // Profile image handler
  const [previewProfile, setPreviewProfile] = useState('/user-logo.png');
  const inputFileRef: any = useRef();
  const pickImageHandler = () => {
    inputFileRef.current?.click();
  };
  const profileFiled = register('profile');
  const displayImageProfile = (e: any) => {
    const [file] = e.target.files;
    if (file && isFileImage(file)) {
      setPreviewProfile(URL.createObjectURL(file));
    } else {
      setPreviewProfile('/user-logo.png');
      resetField('profile');
    }
  };
  // End Profile image handler

  // Profile api
  const [getProfile] = useGetProfileMutation();
  const [postProfileUpdate, postProfileUpdateResult] =
    usePostProfileUpdateMutation();
  const [postProfileImage, postProfileImageResult] =
    usePostProfileImageUpdateMutation();

  const onSubmit = async (data: any) => {
    try {
      if (data.profile[0]) {
        const formImage = new FormData();
        formImage.append('file', data.profile[0]);
        await postProfileImage(formImage);
      }

      await postProfileUpdate({
        logo: data.profile,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
      }).unwrap();

      toast('บันทึกสำเร็จ', { type: 'success' });

      return;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <DashboardTemplate isSearch={false} pageTitle="Profile - ข้อมูลผู้ใช้">
      <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="container flex justify-center mt-6">
          <div className="md:max-w-2xl w-full">
            <div className="px-4">
              <div className="flex justify-center items-center flex-col">
                <img
                  title="profile"
                  src={previewProfile}
                  className="w-24 h-24 rounded-full"
                />
                <div className="flex mt-2">
                  <input
                    type="file"
                    {...profileFiled}
                    accept="image/*"
                    ref={(instance) => {
                      profileFiled.ref(instance);
                      inputFileRef.current = instance;
                    }}
                    onChange={(e) => {
                      profileFiled.onChange(e);
                      displayImageProfile(e);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={pickImageHandler}
                    type="button"
                    className="px-4 py-1 text-sm bg-neutral-200 rounded"
                  >
                    เลือกรูป
                  </button>
                </div>
              </div>
              <div className="form-group mt-6">
                <label>ตำแหน่งปัจจุบัน</label>
                <input
                  type="text"
                  className="form-input"
                  readOnly
                  {...register('position', { required: false })}
                />
              </div>
              <div className="form-group">
                <label>อีเมล</label>
                <input
                  type="email"
                  className="form-input"
                  readOnly
                  {...register('email', { required: false })}
                />
              </div>
              <div className="form-group">
                <label>ชื่อ</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('firstName', { required: true })}
                />
              </div>
              <div className="form-group">
                <label>นามสกุล</label>
                <input
                  type="text"
                  className="form-input"
                  {...register('lastName', { required: true })}
                />
              </div>
              <div className="form-group">
                <label>วันเกิด</label>
                <input
                  type="date"
                  className="form-input"
                  {...register('birthDate', { required: false })}
                />
              </div>
              <div className="form-group">
                <label>เพศ</label>
                <div className="select-wrapper">
                  <select
                    className="form-input"
                    {...register('gender', { required: false })}
                  >
                    <option value="Male">ชาย</option>
                    <option value="Female">หญิง</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>เบอร์โทรติดต่อ</label>
                <input
                  type="tel"
                  className="form-input"
                  {...register('phone', { required: false })}
                />
              </div>

              <div className="form-group">
                <label>ที่อยู่</label>
                <textarea
                  className="form-input"
                  {...register('address', { required: false })}
                />
              </div>
              <div className="text-right">
                <Button
                  text="บันทึก"
                  isLoading={
                    postProfileUpdateResult.isLoading ||
                    postProfileImageResult.isLoading
                  }
                  form="profile-form"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </DashboardTemplate>
  );
};

export default FeaturesProfileSetting;
