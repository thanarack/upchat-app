import useAuth from '../../hooks/useAuth';
import DashboardTemplate from './DashboardTemplate';
const FeaturesDashboard = () => {
  const { fullName } = useAuth();

  return (
    <DashboardTemplate>
      <div className="px-4 mt-4">
        <div className="text-xl font-ibm">
          😆 <span className="text-gray-500">สวัสดีคุณ</span>
          <span className="font-bold text-gray-700 ml-1">{fullName}.</span>
        </div>
        <div className="text-gray-500 mt-2.5 font-medium font-ibm">
          เริ่มใช้งานโดยเลือกห้องซ้ายเพื่อพูดคุย,
          หรือค้นหาผู้ใช้งานที่ต้องการที่ช่องค้นหา
          <span className="text-emerald-600 text-2xl ml-1">✔</span>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FeaturesDashboard;
