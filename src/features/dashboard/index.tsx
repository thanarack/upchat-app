import { useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import DashboardTemplate from './DashboardTemplate';
const FeaturesDashboard = () => {
  const { fullName } = useAuth();

  return (
    <DashboardTemplate>
      <div className="px-4">
        <div className="text-lg">
          😆 <span className="text-gray-600">สวัสดีคุณ</span>
          <span className="font-medium text-gray-800 ml-1">{fullName}.</span>
        </div>
        <div className="text-gray-600 mt-2">
          เริ่มใช้งานโดยเลือกห้องซ้ายเพื่อพูดคุย,
          หรือค้นหาผู้ใช้งานที่ต้องการที่ช่องค้นหา ✔
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FeaturesDashboard;
