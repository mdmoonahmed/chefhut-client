import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const COLORS = ["#C9A24D", "#2DD4BF"];

const PlatformStatistics = () => {
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/stats/platform");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="t-muted text-center mt-10">Loading statistics...</div>;
  }

  const {
    totalPayments = 0,
    totalUsers = 0,
    pendingOrders = 0,
    deliveredOrders = 0,
  } = data;

  const orderData = [
    { name: "Pending", value: pendingOrders },
    { name: "Delivered", value: deliveredOrders },
  ];

  const barData = [
    { name: "Payments", value: totalPayments },
    { name: "Users", value: totalUsers },
  ];

  return (
    <div className="b-g-main min-h-screen p-6">
      <h2 className="header-text text-2xl t-primary mb-6">
        Platform Statistics
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <StatCard title="Total Payments" value={`৳ ${totalPayments}`} />
        <StatCard title="Total Users" value={totalUsers} />
        <StatCard title="Pending Orders" value={pendingOrders} />
        <StatCard title="Delivered Orders" value={deliveredOrders} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="b-g-surface b-subtle rounded-xl p-4">
          <h3 className="t-primary mb-4">Payments & Users</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" stroke="#A1A1AA" />
              <YAxis stroke="#A1A1AA" />
              <Tooltip />
              <Bar dataKey="value" fill="#C9A24D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="b-g-surface b-subtle rounded-xl p-4">
          <h3 className="t-primary mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {orderData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="b-g-surface b-subtle rounded-xl p-4">
    <p className="t-muted text-sm">{title}</p>
    <h3 className="text-xl t-accent font-bold mt-1">{value}</h3>
  </div>
);

export default PlatformStatistics;
