import HeaderProfile from './HeaderProfile';
import Search from './Search';
import RoomsSide from './RoomsSide';
import './Dashboard.scss';

const DashboardTemplate = (props: any) => {
  const { children } = props;

  return (
    <div className="flex flex-row h-screen">
      {/* Left side */}
      <div id="left-side">
        <div className="flex w-full bg-slate-800 h-full text-gray-100 flex-col relative">
          <HeaderProfile />
          <RoomsSide />
        </div>
      </div>
      {/* Containers */}
      <div id="right-side">
        <Search />
        <div id="content-children" className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardTemplate;
