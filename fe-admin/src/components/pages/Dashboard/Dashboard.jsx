import React from "react";
import { useConfig } from "../SettingPage/ConfigProvider";

function Dashboard() {
  const { config } = useConfig();
  return (
    <section className="dashboard section">
      <div className="row">
        <div className="col-lg-8">
          <div className="row">
            <h1>Dashboard</h1>
          </div>
        </div>
        <div className="col-lg-4"></div>
      </div>
      <div className="row">
        <div className="col-sm-8">
          <h4 className="text-center">
            <i>{config.websiteDescription}</i>
          </h4>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
