"use client";

import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useAllOrders } from "@/hooks/useOrders";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { OrderStatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice, formatDate } from "@/lib/utils";
import {
  Package,
  Folder,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

const PIE_COLORS = ["#f59e0b","#3730a3","#1e40af","#065f46","#475569"];

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: typeof Package; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-medium text-[#76777d] uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">{value}</p>
        {sub && <p className="text-xs text-[#76777d] mt-0.5">{sub}</p>}
      </div>
    </div>
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
    const name = categoryMap[p.categoryId] ?? "Unknown";
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(catCounts).map(([name, count]) => ({ name: name.slice(0, 12), count }));

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

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">Dashboard</h1>
        <p className="text-sm text-[#76777d] mt-1">Welcome back, {/* user name via layout */} here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Total Users" value={usersData?.total ?? 0} color="bg-[#3730a3]" />
        <StatCard icon={Package} label="Products" value={products.length} color="bg-[#065f46]" />
        <StatCard icon={Folder} label="Categories" value={categories?.length ?? 0} color="bg-[#1e40af]" />
        <StatCard icon={FileText} label="Total Orders" value={orders.length} color="bg-[#92400e]" />
        <StatCard
          icon={DollarSign}
          label="Revenue"
          value={formatPrice(revenue)}
          sub="Delivered orders"
          color="bg-[#006c49]"
        />
        <StatCard
          icon={Clock}
          label="Pending Orders"
          value={pendingOrders}
          sub="Awaiting confirmation"
          color="bg-[#475569]"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-[#006c49]" />
            <h3 className="font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)]">Revenue (7 days)</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0edef" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#76777d" }} />
              <YAxis tick={{ fontSize: 12, fill: "#76777d" }} />
              <Tooltip
                formatter={(v) => [formatPrice(Number(v) || 0), "Revenue"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #eae7e9", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#006c49"
                strokeWidth={2}
                dot={{ r: 4, fill: "#006c49" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
          <h3 className="font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] mb-5">Order Status</h3>
          {pieData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-[#76777d]">No orders yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eae7e9", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Products by Category Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] lg:col-span-2">
          <h3 className="font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)] mb-5">Products by Category</h3>
          {barData.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-sm text-[#76777d]">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0edef" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#76777d" }} />
                <YAxis tick={{ fontSize: 12, fill: "#76777d" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eae7e9", fontSize: 12 }} />
                <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#eae7e9]">
          <h3 className="font-semibold text-[#1b1b1d] font-[family-name:var(--font-geist)]">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#f6f3f5] text-left">
                {["Order ID","Customer","Total","Status","Date"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-[#76777d] uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0edef]">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-[#76777d]">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#f9f7f8] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-[#76777d]">#{o.id.slice(0,8).toUpperCase()}</td>
                    <td className="px-5 py-3 font-medium text-[#1b1b1d]">{o.user?.name ?? "—"}</td>
                    <td className="px-5 py-3 font-bold text-[#0f172a] font-[family-name:var(--font-geist)]">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 text-[#76777d] whitespace-nowrap">{formatDate(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
