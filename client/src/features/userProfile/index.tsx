/* eslint-disable jsx-a11y/alt-text */
import { useState } from 'react';
import { GetIcon } from '../../utils/icon';
import DashboardTemplate from '../dashboard/DashboardTemplate';
import General from './General';
import PasswordChange from './PasswordChange';

const FeaturesProfileSetting = () => {
  const [isShowGeneral, setIsShowGeneral] = useState(true);
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <DashboardTemplate isSearch={false} pageTitle="Profile - ข้อมูลผู้ใช้">
      <div className="collect-item md:mt-16 mt-4 mb-12" id="general">
        <div className="collect-title">
          <span
            role="button"
            onClick={() => setIsShowGeneral(!isShowGeneral)}
          >
            # ข้อมูลผู้ใช้ทั่วไป
          </span>
          <div role="button" onClick={() => setIsShowGeneral(!isShowGeneral)}>
            {isShowGeneral && (
              <GetIcon mode="outline" name="chevron-up" size="xl" />
            )}
            {!isShowGeneral && (
              <GetIcon mode="outline" name="chevron-down" size="xl" />
            )}
          </div>
        </div>
        {isShowGeneral && <General />}
      </div>
      <div className="collect-item" id="password">
        <div className="collect-title">
          <span
            role="button"
            onClick={() => setIsShowPassword(!isShowPassword)}
          >
            # เปลี่ยนรหัสผ่าน
          </span>
          <div role="button" onClick={() => setIsShowPassword(!isShowPassword)}>
            {isShowPassword && (
              <GetIcon mode="outline" name="chevron-up" size="xl" />
            )}
            {!isShowPassword && (
              <GetIcon mode="outline" name="chevron-down" size="xl" />
            )}
          </div>
        </div>
        {isShowPassword && <PasswordChange />}
      </div>
      <div className="mb-32" />
    </DashboardTemplate>
  );
};

export default FeaturesProfileSetting;
