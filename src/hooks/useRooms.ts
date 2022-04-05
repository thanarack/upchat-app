import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNewRoom, removeRoom, selectRooms } from '../store/roomsSlice';

const useRooms = () => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(selectRooms);
  const myRooms = userSlice.data;
  const roomsAddNewRoom = (payload: any) => dispatch(addNewRoom(payload));
  const roomsRemoveRoom = (payload: any) => dispatch(removeRoom(payload));

  return { myRooms, roomsAddNewRoom, roomsRemoveRoom };
};

export default useRooms;
