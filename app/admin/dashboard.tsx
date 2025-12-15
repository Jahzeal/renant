"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import StatCard from "./stat-card";
import BusinessCard from "./business-card";
import { getTotalCustomers } from "@/lib/getCustomers";
import {
  Users,
  MapPin,
  FileText,
  CheckCircle,
  Home,
  Building2,
  TrendingUp,
  Download,
} from "lucide-react";

// Sample data
const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 800 },
  { name: "Apr", value: 1200 },
  { name: "May", value: 1400 },
  { name: "Jun", value: 1600 },
];

const businessPerformance = [
  { name: "Houses", value: 45 },
  { name: "Shortlets", value: 30 },
  { name: "Hostels", value: 25 },
];

const colors = ["#f97316", "#0ea5e9", "#8b5cf6"];

export default function Dashboard() {
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  useEffect(() => {
    const fetchCustomers = async () => {
      const total = await getTotalCustomers();
      setTotalCustomers(total);
      setLoadingCustomers(false);
    };

    fetchCustomers();
  }, []);

  const handleDownloadReport = () => {
    const reportData = {
      totalCustomers: totalCustomers.toLocaleString(),
      totalTours: "568",
      tourRequests: "342",
      doneTours: "156",
      shortlets: "89",
      hotels: "42",
      houses: "127",
      hostels: "34",
      generatedDate: new Date().toLocaleDateString(),
      generatedTime: new Date().toLocaleTimeString(),
    };

    // Create CSV content
    const csvContent = `Admin Dashboard Report
Generated: ${reportData.generatedDate} at ${reportData.generatedTime}

BUSINESS METRICS
================
Total Customers,${reportData.totalCustomers}
Total Tours,${reportData.totalTours}
Tour Requests,${reportData.tourRequests}
Done Tours,${reportData.doneTours}
Total Shortlets,${reportData.shortlets}
Total Hotels,${reportData.hotels}
Total Houses,${reportData.houses}
Total Hostels,${reportData.hostels}
`;

    // Create blob and download
    const element = document.createElement("a");
    const file = new Blob([csvContent], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = `admin-report-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="p-4 md:p-8 bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download size={18} />
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={
            loadingCustomers ? "Loading..." : totalCustomers.toLocaleString()
          }
          change="+12% from last month"
          color="bg-blue-100 text-blue-600"
        />

        <StatCard
          icon={MapPin}
          label="Total Tours"
          value="568"
          change="+8% from last month"
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          icon={FileText}
          label="Tour Requests"
          value="342"
          change="+23% from last month"
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          icon={CheckCircle}
          label="Done Tours"
          value="156"
          change="+5% from last month"
          color="bg-green-100 text-green-600"
        />
        <StatCard
          icon={Home}
          label="Total Shortlets"
          value="89"
          change="+3% from last month"
          color="bg-pink-100 text-pink-600"
        />
        <StatCard
          icon={Building2}
          label="Total Hotels"
          value="42"
          change="+2% from last month"
          color="bg-indigo-100 text-indigo-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={Home}
          label="Total Houses"
          value="127"
          change="+15% from last month"
          color="bg-teal-100 text-teal-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Hotels"
          value="42"
          change="+2% from last month"
          color="bg-cyan-100 text-cyan-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Booking Trends
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: "#f97316", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Performing Business */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Top Performing Business
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={businessPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {businessPerformance.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BusinessCard
          title="Houses"
          count="127"
          description="Active house listings"
          icon={Home}
          color="bg-teal-50 text-teal-600"
        />
        <BusinessCard
          title="Shortlets"
          count="89"
          description="Short-term rentals"
          icon={MapPin}
          color="bg-pink-50 text-pink-600"
        />
        <BusinessCard
          title="Hostels"
          count="34"
          description="Active hostel listings"
          icon={Building2}
          color="bg-cyan-50 text-cyan-600"
        />
      </div>
    </div>
  );
}
