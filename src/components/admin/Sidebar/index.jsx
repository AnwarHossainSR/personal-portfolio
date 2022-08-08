import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import sidebar_items from '../../../assets/JsonData/sidebar_routes.json';
import { GetLogoutAction } from '../../../redux/actions/UserAction';

const SidebarItem = (props) => {
  const active = props.active ? 'active' : '';
  return (
    <div
      className='sidebar__item'
      onClick={props.handleEvent}
      style={{
        color: props.title === 'Logout' && 'var(--main-color-red)',
        cursor: props.title === 'Logout' && 'pointer',
      }}
    >
      <div className={`sidebar__item-inner ${active}`}>
        <i className={props.icon}></i>
        <span>{props.title}</span>
      </div>
    </div>
  );
};
const Sidebar = (props) => {
  const dispatch = useDispatch();
  const activeItem = sidebar_items.findIndex(
    (item) => item.route === props.location.pathname
  );
  const logOut = () => {
    dispatch(GetLogoutAction());
  };
  return (
    <div className='sidebar'>
      <div style={{ paddingBottom: 65 }} />
      {sidebar_items.map((item, index) => (
        <Link
          to={item.route}
          key={index}
          onClick={item.display_name === 'Logout' ? logOut : ''}
        >
          <SidebarItem
            title={item.display_name}
            icon={item.icon}
            active={index === activeItem}
          />
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
