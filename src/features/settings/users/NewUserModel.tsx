import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Button from '../../../components/button/Button';
import {
  useGetAdminUsersPositionMutation,
  usePostAdminNewUsersMutation,
} from '../../../services/admin/users';
import ModalComponent from '../../../shared/ModalComponent';

const NewUserModel = (props: {
  isOpen: boolean;
  onClose: () => void;
  callBack?: () => void;
}) => {
  const { isOpen, onClose, callBack } = props;
  const [position, setPosition] = useState([]);

  // Fetch position data
  const [getAdminUsersPosition] = useGetAdminUsersPositionMutation();
  const getInitialDataPosition = async () => {
    try {
      const result = await getAdminUsersPosition({}).unwrap();
      if (result.statusCode === 200) {
        setPosition(result.result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!position.length) getInitialDataPosition();
  }, []);
  // End fetch data

  // Initialize necessary form function.
  const [postAdminNewUser] = usePostAdminNewUsersMutation();
  const { handleSubmit, register } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const result = await postAdminNewUser({
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        positionId: data.positionId,
      }).unwrap();

      if (result.statusCode === 200) {
        toast('บันทึกสำเร็จ', { type: 'success' });
        onClose();
        if (callBack) callBack();
      }
    } catch (e) {
      console.log(e);
      toast('ชื่อผู้ใช้ซ้ำในระบบ', { type: 'warning' });
    }
  };
  // End form data

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="container flex justify-center mt-6 w-full">
          <div className="md:max-w-xl w-full">
            <div className="text-center text-xl text-gray-500">
              <span className="text-3xl mr-2">👨🏽‍💻</span>เพิ่มผู้ใช้งานใหม่
            </div>
            <div className="form-group mt-6">
              <label>Username (Email)</label>
              <div>
                <input
                  type="email"
                  className="form-input"
                  {...register('username', { required: true })}
                />
              </div>
            </div>
            <div className="form-group mt-6">
              <label>ชื่อ</label>
              <input
                type="text"
                className="form-input"
                {...register('firstName', { required: true })}
              />
            </div>
            <div className="form-group mt-6">
              <label>นามสกุล</label>
              <input
                type="text"
                className="form-input"
                {...register('lastName', { required: true })}
              />
            </div>
            <div className="form-group">
              <label>ตำแหน่ง</label>
              <div className="select-wrapper">
                <select
                  className="form-input"
                  {...register('positionId', { required: false })}
                >
                  {position.map((value: any) => (
                    <option key={value.positionId} value={value.positionId}>
                      {value.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end flex-row gap-4">
              <Button text="บันทึก" form="user-form" />
              <Button text="ยกเลิก" variant="gray" onClick={onClose} />
            </div>
          </div>
        </div>
      </form>
    </ModalComponent>
  );
};

export default NewUserModel;
