import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuthUserAction } from "../../redux/actions/UserAction";
import Routes from "../admin/Routes";
import Sidebar from "../admin/Sidebar";
import TopNav from "../admin/TopNav";

const AdminLayout = () => {
  const { unAuthenticated, loading, user } = useSelector(
    (state) => state.users
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id === undefined) dispatch(getAuthUserAction());
    if (unAuthenticated) {
      navigate("/login");
    }
  }, [dispatch, navigate, unAuthenticated, user.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="layout">
      <Sidebar location={location} navigate={navigate} />
      <div className="layout__content">
        <TopNav />
        <div className="layout__content-main">
          <Routes />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
