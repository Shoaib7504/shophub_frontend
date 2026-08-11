"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useAllOrders } from "@/hooks/useOrders";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Package,
  Folder,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts";
import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

const PIE_COLORS = ["#006c49", "#3730a3", "#1e40af", "#d97706", "#475569"];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
  trend,
}: {
  icon: typeof Package;
  label: string;
  value: string | number;
  sub?: string;
  gradient: string;
  trend?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl p-6 border border-[#f0edef] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0px_10px_30px_rgba(15,23,42,0.08)] transition-all flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${gradient}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#d1fae5] text-[#065f46] font-[family-name:var(--font-geist)]">
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-[#76777d] uppercase tracking-wider mb-1 font-[family-name:var(--font-geist)]">
          {label}
        </p>
        <p className="text-3xl font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] tracking-tight">
          {value}
        </p>
        {sub && <p className="text-xs text-[#76777d] mt-1 font-medium">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: productsData, isLoading: pLoad } = useProducts({ limit: 100 });
  const { data: categories, isLoading: cLoad } = useCategories();
  const { data: ordersData, isLoading: oLoad } = useAllOrders({ limit: 100 });
  const { data: usersData, isLoading: uLoad } = useQuery({
    queryKey: ["users", { limit: 100 }],
    queryFn: () => userService.getUsers({ limit: 100 }),
  });

  const isLoading = pLoad || cLoad || oLoad || uLoad;

  if (isLoading) return <DashboardSkeleton />;

  const orders = ordersData?.orders ?? [];
  const products = productsData?.products ?? [];

  const revenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((s, o) => s + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  // Orders by status for pie chart
  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Products by category for bar chart
  const categoryMap = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));
  const catCounts = products.reduce<Record<string, number>>((acc, p) => {
    const name = categoryMap[p.categoryId] ?? "Uncategorized";
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(catCounts).map(([name, count]) => ({ name: name.slice(0, 14), count }));

  // Revenue over last 7 days (synthetic from real orders)
  const lineData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const total = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.toDateString() === d.toDateString();
      })
      .reduce((s, o) => s + o.total, 0);
    return { day: dayStr, revenue: total };
  });

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Banner */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#006c49]/10 rounded-full text-[#006c49] text-xs font-bold uppercase tracking-wider mb-1 font-[family-name:var(--font-geist)]">
            <Sparkles size={13} /> Executive Overview
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)] tracking-tight">
            Dashboard Analytics
          </h1>
          <p className="text-sm text-[#76777d]">
            Real-time metric summary, revenue breakdown, and order fulfillment status.
          </p>
        </div>
      </motion.div>

      {/* Executive Stat Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatPrice(revenue)}
          sub="Delivered sales volume"
          gradient="bg-gradient-to-br from-[#006c49] to-[#044e36]"
          trend="+14.2%"
        />
        <StatCard
          icon={FileText}
          label="Total Orders"
          value={orders.length}
          sub="Processed orders"
          gradient="bg-gradient-to-br from-[#1e40af] to-[#1e3a8a]"
          trend="+8.5%"
        />
        <StatCard
          icon={Clock}
          label="Pending Confirmation"
          value={pendingOrders}
          sub="Requires fulfillment"
          gradient="bg-gradient-to-br from-[#d97706] to-[#b45309]"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={usersData?.total ?? 0}
          sub="Registered user accounts"
          gradient="bg-gradient-to-br from-[#3730a3] to-[#312e81]"
        />
        <StatCard
          icon={Package}
          label="Active Products"
          value={products.length}
          sub="In-catalog inventory"
          gradient="bg-gradient-to-br from-[#059669] to-[#047857]"
        />
        <StatCard
          icon={Folder}
          label="Categories"
          value={categories?.length ?? 0}
          sub="Product classifications"
          gradient="bg-gradient-to-br from-[#475569] to-[#334155]"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#f0edef] shadow-[0px_4px_20px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#006c49]/10 flex items-center justify-center text-[#006c49]">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">Revenue Trajectory</h3>
                <p className="text-xs text-[#76777d]">7-day order sales trend ($ USD)</p>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006c49" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#006c49" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0edef" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#76777d" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#76777d" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [formatPrice(Number(v) || 0), "Revenue"]}
                contentStyle={{ borderRadius: 16, border: "1px solid #eae7e9", boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#006c49" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#f0edef] shadow-[0px_4px_20px_rgba(15,23,42,0.04)]">
          <h3 className="font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-1">Order Status Distribution</h3>
          <p className="text-xs text-[#76777d] mb-4">Breakdown by current order state</p>

          {pieData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-[#76777d]">No orders logged</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #eae7e9" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Products by Category Bar Chart */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 border border-[#f0edef] shadow-[0px_4px_20px_rgba(15,23,42,0.04)]">
          <h3 className="font-bold text-[#0f172a] font-[family-name:var(--font-geist)] mb-1">Inventory by Department</h3>
          <p className="text-xs text-[#76777d] mb-5">Product distribution across categories</p>
          {barData.length === 0 ? (
            <div className="h-[180px] flex items-center justify-center text-sm text-[#76777d]">No products recorded</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0edef" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#76777d" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#76777d" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #eae7e9" }} />
                <Bar dataKey="count" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl border border-[#f0edef] shadow-[0px_4px_20px_rgba(15,23,42,0.04)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#eae7e9] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#0f172a] font-[family-name:var(--font-geist)] text-lg">Recent Orders</h3>
            <p className="text-xs text-[#76777d]">Latest customer transactions</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-[#fcf8fa] border-b border-[#f0edef]">
                {["Order ID", "Customer", "Total Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="px-6 py-3.5 text-xs font-bold text-[#76777d] uppercase tracking-wider font-[family-name:var(--font-geist)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0edef]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-[#76777d]">No orders available</td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#fcf8fa] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#0f172a] font-bold">
                      #{o.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#1b1b1d]">
                      {o.user?.name ?? "Guest User"}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-[#0f172a] font-[family-name:var(--font-geist)]">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-[#76777d] font-medium whitespace-nowrap">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
