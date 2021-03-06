/* eslint-disable jsx-a11y/alt-text */
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../../components/button/Button';
import useAuth from '../../hooks/useAuth';
import {
  useGetProfileMutation,
  usePostProfileImageUpdateMutation,
  usePostProfileUpdateMutation,
} from '../../services/users';
import isFileImage from '../../utils/isFileImage';

const General = () => {
  // Hook function
  useEffect(() => {
    getInitialProfile();
  }, []);

  // Initialize necessary form function.
  const { userSetLoginUser } = useAuth();
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
        if (data.profileUrl) {
          const generateImageVersion = data.profileUrl + '?v=' + +new Date();
          setPreviewProfile(generateImageVersion);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  // End set Initialize profile

  // Profile image handler
  const [previewProfile, setPreviewProfile] = useState('/user-logo.png');
  const inputFileRef: any = useRef();
  const pickImageHandler = (e: any) => {
    e.preventDefault();
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

      const result = await postProfileUpdate({
        logo: data.profile,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
      }).unwrap();

      if (result.statusCode === 200) {
        toast('????????????????????????????????????', { type: 'success' });
        // Get last update data
        const profileResult = await getProfile(undefined).unwrap();
        if (profileResult.statusCode === 200) {
          const generateImageVersion =
            profileResult.result.data.profileUrl + '?v=' + +new Date();
          userSetLoginUser({
            ...profileResult.result.data,
            profileUrl: generateImageVersion,
          });
        }
      }

      return;
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="container flex justify-center mt-6">
        <div className="md:max-w-2xl w-full">
          <div className="px-4">
            <div className="flex justify-center items-center flex-col">
              <img
                title="profile"
                src={previewProfile}
                className="w-24 h-24 rounded-full"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/user-logo.png';
                }}
              />
              <div className="flex mt-4">
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
                <Button
                  onClick={pickImageHandler}
                  text="????????????????????????"
                  size="sm"
                />
              </div>
            </div>
            <div className="form-group mt-6">
              <label>?????????????????????????????????????????????</label>
              <input
                type="text"
                className="form-input"
                disabled
                {...register('position', { required: false })}
              />
            </div>
            <div className="form-group">
              <label>???????????????</label>
              <input
                type="email"
                className="form-input"
                disabled
                {...register('email', { required: false })}
              />
            </div>
            <div className="form-group">
              <label>????????????</label>
              <input
                type="text"
                className="form-input"
                {...register('firstName', { required: true })}
              />
            </div>
            <div className="form-group">
              <label>?????????????????????</label>
              <input
                type="text"
                className="form-input"
                {...register('lastName', { required: true })}
              />
            </div>
            <div className="form-group">
              <label>?????????????????????</label>
              <input
                type="date"
                className="form-input"
                placeholder="dd-mm-yyyy"
                {...register('birthDate', { required: false })}
              />
            </div>
            <div className="form-group">
              <label>?????????</label>
              <div className="select-wrapper">
                <select
                  className="form-input"
                  {...register('gender', { required: false })}
                >
                  <option value="Male">?????????</option>
                  <option value="Female">????????????</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>??????????????????????????????????????????</label>
              <input
                type="tel"
                className="form-input"
                {...register('phone', { required: false })}
              />
            </div>

            <div className="form-group">
              <label>?????????????????????</label>
              <textarea
                className="form-input"
                {...register('address', { required: false })}
              />
            </div>
            <div className="text-right">
              <Button
                text="??????????????????"
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
  );
};

export default General;
