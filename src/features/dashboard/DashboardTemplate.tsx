import { ToastContainer } from 'react-toastify';
import HeaderProfile from './HeaderProfile';
import Search from './Search';
import RoomsSide from './RoomsSide';
import './Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

const PageTitle = (props: { title: string }) => {
  return (
    <h2 className="bg-slate-700 text-white text-lg px-4 py-3 shadow">
      {props.title}
    </h2>
  );
};

type TDashboardTemplate = {
  children?: any;
  isSearch?: boolean;
  pageTitle?: string;
};

const DashboardTemplate: React.FC<TDashboardTemplate> = (props) => {
  const { children, isSearch, pageTitle } = props;

  return (
    <div className="flex flex-row h-screen">
      <ToastContainer />
      {/* Left side */}
      <div id="left-side">
        <div className="flex w-full bg-slate-800 h-full text-gray-100 flex-col relative">
          <HeaderProfile />
          <RoomsSide />
        </div>
      </div>
      {/* Containers */}
      <div id="right-side">
        {isSearch && <Search />}
        {pageTitle && <PageTitle title={pageTitle} />}
        <div id="content-children">{children}</div>
      </div>
    </div>
  );
};

DashboardTemplate.defaultProps = {
  isSearch: true,
  pageTitle: '',
};

export default DashboardTemplate;
