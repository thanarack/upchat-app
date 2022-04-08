import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addNewRoom, removeRoom, selectRooms, setInitialRooms } from '../store/roomsSlice';

const useRooms = () => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(selectRooms);

  const roomsSetInitialRooms = (payload: any) =>
    dispatch(setInitialRooms(payload));
  const roomsAddNewRoom = (payload: any) => dispatch(addNewRoom(payload));
  const roomsRemoveRoom = (payload: any) => dispatch(removeRoom(payload));

  const myRooms = userSlice.data;

  return { myRooms, roomsSetInitialRooms, roomsAddNewRoom, roomsRemoveRoom };
};

export default useRooms;
