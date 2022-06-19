import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectUser,
  setLogin,
  setLoginUser,
  setLogout,
  setUserConnect,
  reset as userSliceReset,
  setUserImage
  // setUserToLocalContact,
} from '../store/userSlice';
import { reset as roomsSliceReset } from '../store/roomsSlice';
import { reset as chatSliceReset } from '../store/chatSlice';

/**
 * It returns the user slice
 * @returns A slice of the user state.
 */
const useAuth = () => {
  const dispatch = useAppDispatch();
  const userSlice: any = useAppSelector(selectUser);
  const userSetLogin = () => dispatch(setLogin());
  const userSetLoginUser = (user: any) => dispatch(setLoginUser(user));
  const userSetImage = (user: any) => dispatch(setUserImage(user));
  const userSetLogout = () => dispatch(setLogout());
  const userSetIsConnected = (value: any) => dispatch(setUserConnect(value));
  // const userSetUserToLocalContact = (value: any) =>
  //   dispatch(setUserToLocalContact(value));
  const userResetAllState = () => {
    dispatch(userSliceReset());
    dispatch(roomsSliceReset());
    dispatch(chatSliceReset());
  };
  const fullName = userSlice.user.firstName + ' ' + userSlice.user.lastName;
  const profileUrl = userSlice.user.profileUrl;
  const userId = userSlice.user.userId;
  const userRole = userSlice.user.role;
  const userIsConnected = userSlice.user.isConnected;

  return {
    user: userSlice,
    userId,
    userRole,
    fullName,
    profileUrl,
    userSetLogin,
    userSetLogout,
    userSetLoginUser,
    userSetIsConnected,
    userResetAllState,
    userIsConnected,
    userSetImage
    // userSetUserToLocalContact,
  };
};

export default useAuth;
