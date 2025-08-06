"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Home, Settings, TrendingUp, TrendingDown, Filter } from "lucide-react";
import { Header } from "@/components/ui/header";
import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Filter Dropdown Component
function KpiFilterDropdown() {
  const [timeRange, setTimeRange] = React.useState("7days");
  const [category, setCategory] = React.useState("all");

  return (
    <div className="flex gap-3">
      {/* Time Range Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {timeRange === "7days" && "Last 7 days"}
            {timeRange === "30days" && "Last 30 days"}
            {timeRange === "90days" && "Last 90 days"}
            {timeRange === "1year" && "Last year"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Time Range</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timeRange} onValueChange={setTimeRange}>
            <DropdownMenuRadioItem value="7days">Last 7 days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="30days">Last 30 days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="90days">Last 90 days</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="1year">Last year</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Category Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {category === "all" && "All Categories"}
            {category === "sales" && "Sales"}
            {category === "marketing" && "Marketing"}
            {category === "operations" && "Operations"}
            {category === "customer" && "Customer"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
            <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sales">Sales</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="marketing">Marketing</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="operations">Operations</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="customer">Customer</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const Dashboard = () => {
  const sidebarLinks = [
    {
      label: "",
      href: "/dashboard",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "",
      href: "/integrations",
      icon: (
        <img 
          src="/integration-icon.svg" 
          alt="Integrations" 
          className="w-5 h-5"
          style={{ filter: 'invert(0.4)' }}
        />
      ),
    },
    {
      label: "",
      href: "/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <>
      <Header title="Dashboard" />
      <div className="flex h-screen bg-white">
        <Sidebar animate={false}>
          <SidebarBody className="bg-white border-r border-gray-200 w-14">
            <div className="flex flex-col h-full">
              {/* Navigation Links */}
              <nav className="flex-1 p-3 space-y-4">
                {sidebarLinks.map((link, index) => (
                  <SidebarLink
                    key={index}
                    link={link}
                    className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg p-2 transition-colors flex justify-center"
                  />
                ))}
              </nav>
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex-1 p-8">
          {/* Header Text Section */}
          <div className="max-w-7xl mx-auto mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome Teto!
            </h1>
            
            {/* Filter Dropdown Section */}
            <div className="mb-8">
              <KpiFilterDropdown />
            </div>
          </div>
          
          <KpiDashboard />
        </div>
      </div>
    </>
  )
}

export default Dashboard;

// Chart data
const revenueData = [
  { month: "Jan", revenue: 90000 },
  { month: "Feb", revenue: 95000 },
  { month: "Mar", revenue: 100000 },
  { month: "Apr", revenue: 110000 },
  { month: "May", revenue: 115000 },
  { month: "Jun", revenue: 118000 },
  { month: "Jul", revenue: 120000 },
];

const usersData = [
  { month: "Jan", users: 2500 },
  { month: "Feb", users: 2600 },
  { month: "Mar", users: 2700 },
  { month: "Apr", users: 2900 },
  { month: "May", users: 3100 },
  { month: "Jun", users: 3200 },
  { month: "Jul", users: 3200 },
];

const ordersData = [
  { month: "Jan", orders: 450 },
  { month: "Feb", orders: 520 },
  { month: "Mar", orders: 480 },
  { month: "Apr", orders: 640 },
  { month: "May", orders: 590 },
  { month: "Jun", orders: 680 },
  { month: "Jul", orders: 720 },
];

const conversionData = [
  { month: "Jan", rate: 2.1 },
  { month: "Feb", rate: 2.3 },
  { month: "Mar", rate: 2.2 },
  { month: "Apr", rate: 2.8 },
  { month: "May", rate: 2.6 },
  { month: "Jun", rate: 3.1 },
  { month: "Jul", rate: 3.4 },
];

// Chart configs
const revenueConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(142, 76%, 36%)",
  },
} satisfies ChartConfig;

const usersConfig = {
  users: {
    label: "Active Users",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig;

const ordersConfig = {
  orders: {
    label: "Orders",
    color: "hsl(262, 83%, 58%)",
  },
} satisfies ChartConfig;

const conversionConfig = {
  rate: {
    label: "Conversion Rate",
    color: "hsl(346, 87%, 43%)",
  },
} satisfies ChartConfig;

// Metric Item Component for the compact stats card
function MetricItem({ label, value, change, trend }: {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}) {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
          <span className={trendColor}>{change}</span>
          <TrendIcon className="h-3 w-3" />
        </span>
      </div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function KpiDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[480px]">
        {/* Large Revenue Chart - Takes 2 columns */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>
              Monthly revenue performance across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="text-3xl font-bold mb-4">$120,000</div>
            <div className="h-[280px]">
              <ChartContainer config={revenueConfig}>
                <AreaChart
                  accessibilityLayer
                  data={revenueData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-revenue)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="revenue"
                    type="natural"
                    fill="url(#fillRevenue)"
                    fillOpacity={0.4}
                    stroke="var(--color-revenue)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 leading-none font-medium text-green-600">
                  Trending up by 8% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground flex items-center gap-2 leading-none">
                  January - July 2025
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Compact Metrics Card - Takes 1 column */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>
              Current period performance
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 px-6">
            <div className="space-y-0">
              <MetricItem 
                label="Active Users" 
                value="3,200" 
                change="+3.2%" 
                trend="up" 
              />
              <MetricItem 
                label="Total Orders" 
                value="720" 
                change="+12%" 
                trend="up" 
              />
              <MetricItem 
                label="Conversion Rate" 
                value="3.4%" 
                change="+0.9%" 
                trend="up" 
              />
              <MetricItem 
                label="Avg Order Value" 
                value="$167" 
                change="+4.2%" 
                trend="up" 
              />
              <MetricItem 
                label="Return Rate" 
                value="2.1%" 
                change="+0.3%" 
                trend="down" 
              />
              <MetricItem 
                label="Acquisition Cost" 
                value="$23" 
                change="-5.1%" 
                trend="up" 
              />
              <MetricItem 
                label="Cart Abandonment" 
                value="68.5%" 
                change="-2.1%" 
                trend="up" 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}