import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Position } from './index';
import Button from '../../../components/button/Button';
import {
  usePostAdminNewUserPositionMutation,
  usePostAdminUpdateUserPositionMutation,
} from '../../../services/admin/users';
import ModalComponent from '../../../shared/ModalComponent';
import { useEffect } from 'react';

const NewPositionModel = (props: {
  isOpen: boolean;
  onClose: () => void;
  callBack?: () => void;
  editValue?: Position | null;
}) => {
  const { isOpen, onClose, callBack, editValue } = props;

  // Initialize necessary form function.
  const [postAdminNewUserPosition] = usePostAdminNewUserPositionMutation();
  const [postAdminUpdateUserPosition] =
    usePostAdminUpdateUserPositionMutation();
  const { handleSubmit, register, setValue } = useForm();

  const onSubmit = async (data: any) => {
    if (!data.title.length) return;

    try {
      let result;

      if (editValue) {
        result = await postAdminUpdateUserPosition({
          positionId: editValue.positionId,
          title: data.title,
        }).unwrap();
      } else {
        result = await postAdminNewUserPosition({
          title: data.title,
        }).unwrap();
      }

      if (result.statusCode === 200) {
        toast(editValue ? 'บันทึกสำเร็จ' : 'เพิ่มข้อมูลสำเร็จ', {
          type: 'success',
        });
        onClose();
        if (callBack) callBack();
      }
    } catch (e) {
      console.log(e);
      toast('ชื่อผู้ใช้ซ้ำในระบบ', { type: 'error' });
    }
  };
  // End form data

  useEffect(() => {
    if (editValue) {
      setValue('title', editValue.title);
    }
  }, [editValue]);

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose}>
      <form id="user-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="container flex justify-center mt-6 w-full">
          <div className="md:max-w-xl w-full">
            <div className="text-center text-xl text-gray-500">
              {editValue && (
                <span>
                  <span className="text-3xl mr-2">👔</span>แก้ไขตำแหน่ง
                </span>
              )}
              {!editValue && (
                <span>
                  <span className="text-3xl mr-2">👔</span>เพิ่มตำแหน่งใหม่
                </span>
              )}
            </div>
            <div className="form-group mt-6">
              <label>ชื่อตำแหน่ง</label>
              <input
                type="text"
                className="form-input"
                {...register('title', { required: true })}
              />
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

export default NewPositionModel;
