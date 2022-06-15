import { useEffect, useState } from 'react';
import Button from '../../../components/button/Button';
import { useGetAdminUserRoomsMutation } from '../../../services/admin/rooms';
import { useGetAdminUsersMutation } from '../../../services/admin/users';
import ModalComponent from '../../../shared/ModalComponent';
import { Users } from '../users';
import UserItem from './UserItem';

const RoomsAssignModal = (props: {
  titleRoom: string;
  isOpen: boolean;
  roomId: string;
  onClose: () => void;
  callBack?: () => void;
}) => {
  const { isOpen, onClose, callBack } = props;
  const [members, setMembers] = useState([]);
  const [membersActive, setMembersActive] = useState([]);
  // const [position, setPosition] = useState([]);

  // Fetch member data
  const [getAdminUsers] = useGetAdminUsersMutation();
  const getInitialDataUser = async () => {
    try {
      const result = await getAdminUsers({}).unwrap();
      if (result.statusCode === 200) {
        setMembers(result.result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch member rooms
  const [getAdminUserRooms] = useGetAdminUserRoomsMutation();
  const getInitialDataUserRooms = async () => {
    try {
      const result = await getAdminUserRooms(props.roomId).unwrap();
      if (result.statusCode === 200) {
        setMembersActive(result.result.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!members.length && props.isOpen) {
      getInitialDataUser();
      getInitialDataUserRooms();
    }
  }, [props.isOpen]);
  // End fetch data

  const isChecked = (userId: string) => {
    if (membersActive.find((ma: any) => ma.userId === userId && !ma.isDelete))
      return true;
    return false;
  };

  const onHandleClose = () => {
    getInitialDataUser();
    getInitialDataUserRooms();
    if (props.callBack) {
      props.callBack();
    }
    onClose();
  };

  return (
    <ModalComponent isOpen={isOpen} onClose={onHandleClose}>
      <div className="container flex justify-center mt-6 w-full">
        <div className="md:max-w-xl w-full">
          <div className="text-center text-xl text-gray-500 flex flex-col">
            <span className="text-xl mr-2 mb-2">
              📬<span>{props.titleRoom}</span>
            </span>
          </div>
          <div className="mt-6 mb-6">
            <div className="select-user">
              <ul>
                {membersActive.length > 0 &&
                  members.map((value: Users) => (
                    <UserItem
                      key={value.userId}
                      data={value}
                      roomId={props.roomId}
                      isChecked={isChecked(value.userId)}
                    />
                  ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-end flex-row gap-4">
            <Button text="ยกเลิก" variant="gray" onClick={onHandleClose} />
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};

export default RoomsAssignModal;
