import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../../pages/admin";
import About from "./About";
import Portfolio from "./Portfolio";
import AddPortfolio from "./Portfolio/AddPortfolio";
import Settings from "./Settings";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin">
        <Route index element={<Dashboard />} />
        <Route path="portfolio">
          <Route index element={<Portfolio />} />
          <Route path="add" element={<AddPortfolio />} />
        </Route>
        <Route path="settings">
          <Route index element={<Settings />} />
        </Route>
        <Route path="about">
          <Route index element={<About />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
