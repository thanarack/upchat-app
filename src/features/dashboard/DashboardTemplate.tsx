import HeaderProfile from './HeaderProfile';
import Search from './Search';
import RoomsSide from './RoomsSide';
import './Dashboard.scss';

const PageTitle = (props: { title: string }) => {
  return (
    <h2 className="bg-sky-900 text-white text-2xl px-4 py-4 shadow">
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
        <div id="content-children">
          {children}
        </div>
      </div>
    </div>
  );
};

DashboardTemplate.defaultProps = {
  isSearch: true,
  pageTitle: '',
};

export default DashboardTemplate;
