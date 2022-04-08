import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectUser,
  setLogin,
  setLoginUser,
  setLogout,
  setUserConnect,
  // setUserToLocalContact,
} from '../store/userSlice';

/**
 * It returns the user slice
 * @returns A slice of the user state.
 */
const useAuth = () => {
  const dispatch = useAppDispatch();
  const userSlice: any = useAppSelector(selectUser);
  const userSetLogin = () => dispatch(setLogin());
  const userSetLoginUser = (user: any) => dispatch(setLoginUser(user));
  const userSetLogout = () => dispatch(setLogout());
  const userSetIsConnected = (value: any) => dispatch(setUserConnect(value));
  // const userSetUserToLocalContact = (value: any) =>
  //   dispatch(setUserToLocalContact(value));
  const fullName = userSlice.user.firstName + ' ' + userSlice.user.lastName;
  const profileUrl = userSlice.user.profileUrl;
  const userId = userSlice.user.userId
  const userRole = userSlice.user.role

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
    // userSetUserToLocalContact,
  };
};

export default useAuth
