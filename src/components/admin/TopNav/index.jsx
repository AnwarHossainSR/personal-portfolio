import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import user_image from "../../../assets/images/tuat.png";
import notifications from "../../../assets/JsonData/notification.json";
import user_menu from "../../../assets/JsonData/user_menus.json";
import { GetLogoutAction } from "../../../redux/actions/UserAction";
import Dropdown from "../Dropdown";

const curr_user = {
  display_name: "Mahedi Hasan",
  image: user_image,
};

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      <img src={user.image} alt="" />
    </div>
    <div className="topnav__right-user__name">{user.display_name}</div>
  </div>
);

const renderUserMenu = (item, index, logOut) => (
  <Link to="/" key={index} onClick={item.content === "Logout" ? logOut : ""}>
    <div className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);

const TopNav = (props) => {
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(GetLogoutAction());
  };
  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>
      <div className="topnav__right">
        <div className="topnav__right-item">
          {/* dropdown here */}
          <Dropdown
            customToggle={() => renderUserToggle(curr_user)}
            contentData={user_menu}
            renderItems={(item, index) => renderUserMenu(item, index, logOut)}
          />
        </div>
        <div className="topnav__right-item">
          <Dropdown
            icon="bx bx-bell"
            badge="12"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          />
        </div>
        {/* <div className='topnav__right-item'>
          <ThemeMenu />
        </div> */}
      </div>
    </div>
  );
};

export default TopNav;
