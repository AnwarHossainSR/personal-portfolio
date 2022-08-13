import React from "react";
import Chart from "react-apexcharts";

const chartOptions = {
  series: [
    {
      name: "Visited Users",
      data: [40, 70, 20, 90, 36, 80, 30, 91, 60],
    },
  ],
  options: {
    color: ["#6ab04c", "#2980b9"],
    chart: {
      background: "transparent",
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
      ],
    },
    legend: {
      position: "top",
    },
    grid: {
      show: false,
    },
  },
};

const Dashboard = () => {
  return (
    <div>
      <h2 className="admin-page-header">Dashboard</h2>
      <div className="admin-row" style={{ flexWrap: "wrap" }}>
        <div className="admin-col-12">
          <div className="admin-card admin-full-height">
            {/* chart */}
            <Chart
              options={{
                ...chartOptions.options,
                theme: { mode: "light" },
              }}
              series={chartOptions.series}
              type="line"
              height="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
