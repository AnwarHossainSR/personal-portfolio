import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { GetCountVisitors } from "../../redux/actions/UserAction";
import Footer from "../app/Footer";
import Navbar from "../app/Navbar";

const AppLayout = ({ darkMode }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetCountVisitors());
  }, [dispatch]);
  return (
    <>
      <Navbar darkMode={darkMode} />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
