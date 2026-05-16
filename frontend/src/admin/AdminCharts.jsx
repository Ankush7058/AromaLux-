import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const AdminCharts = ({ orders }) => {
  const monthlyData = Object.values(
    orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString("default", {
        month: "short",
      });

      if (!acc[month]) {
        acc[month] = {
          month,
          revenue: 0,
          orders: 0,
        };
      }

      acc[month].revenue += order.totalAmount;
      acc[month].orders += 1;

      return acc;
    }, {})
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Monthly Revenue</h2>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Monthly Orders</h2>

        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminCharts;