import DashboardTemplate from '../dashboard/DashboardTemplate';

const FeaturesProfileSetting = () => {
  return (
    <DashboardTemplate isSearch={false} pageTitle="Profile - ข้อมูลผู้ใช้">
      <div className="container flex justify-center mt-6">
        <div className="md:max-w-2xl w-full">
          <div className="px-4">
            <div className="flex justify-center items-center flex-col">
              <img
                src="http://localhost:3000/user-logo.png"
                className="w-24 h-24"
              />
              <div className="flex mt-2">
                <button className="px-4 py-1 text-sm bg-neutral-200 rounded">
                  เลือกรูป
                </button>
              </div>
            </div>
            <div className="form-group mt-6">
              <label>ตำแหน่งปัจจุบัน</label>
              <input type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label>ชื่อ</label>
              <input type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label>นามสกุล</label>
              <input type="text" className="form-input" />
            </div>
            <div className="form-group">
              <label>วันเกิด</label>
              <input type="date" className="form-input" />
            </div>
            <div className="form-group">
              <label>เพศ</label>
              <div className="select-wrapper">
                <select className="form-input">
                  <option>ชาย</option>
                  <option>หญิง</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>เบอร์โทรติดต่อ</label>
              <input type="tel" className="form-input" />
            </div>
            <div className="form-group">
              <label>อีเมล</label>
              <input type="email" className="form-input" />
            </div>
            <div className="form-group">
              <label>ที่อยู่</label>
              <textarea className="form-input" />
            </div>
            <div className="text-right">
              <button className="btn btn-green">บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardTemplate>
  );
};

export default FeaturesProfileSetting;
