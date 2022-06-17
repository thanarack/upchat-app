import useRoute from '../../hooks/useRoute';
import AdminPrivateRoute from '../../privateRoute/adminPrivateRoute';
import { GetIcon } from '../../utils/icon';
import DashboardTemplate from '../dashboard/DashboardTemplate';
import SettingGeneral from './general';
import SettingLogs from './logs';
import SettingPosition from './position';
import SettingRooms from './rooms';
import SettingUsers from './users';

const SwitchSettingsComponent = ({ pathName }: { pathName: string }) => {
  let component = <SettingGeneral />;

  switch (pathName) {
    case '/settings/rooms':
      component = <SettingRooms />;
      break;
    case '/settings/users':
      component = <SettingUsers />;
      break;
    case '/settings/position':
      component = <SettingPosition />;
      break;
    case '/settings/logs':
      component = <SettingLogs />;
      break;
  }

  return component;
};

const FeaturesSettings = () => {
  const { navigate, location } = useRoute();

  const onLink = (path: string) => {
    if (!path) return navigate('/settings');

    return navigate('/settings/' + path);
  };

  return (
    <DashboardTemplate isSearch={false} pageTitle="Administration - จัดการระบบ">
      <div className="w-full h-full">
        <div className="flex flex-row gap-2 h-full">
          <div className="admin-left-slide">
            <div className="a-child">
              <ul className="a-menu">
                <li onClick={() => onLink('rooms')} role="button">
                  <GetIcon name="chevron-right" mode="outline" />
                  <span>ห้องสนทนา</span>
                </li>
                <li onClick={() => onLink('users')} role="button">
                  <GetIcon name="chevron-right" mode="outline" />
                  <span>ผู้ใช้งาน</span>
                </li>
                <li onClick={() => onLink('position')} role="button">
                  <GetIcon name="chevron-right" mode="outline" />
                  <span>ตำแหน่ง</span>
                </li>
                <li onClick={() => onLink('logs')} role="button">
                  <GetIcon name="chevron-right" mode="outline" />
                  <span>บันทึกการใช้งาน</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="admin-right-slide">
            <SwitchSettingsComponent pathName={location.pathname} />
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FeaturesSettings;
