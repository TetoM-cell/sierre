"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Home, Settings } from "lucide-react";
import { Header } from "@/components/ui/header";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Integration Card Component
function IntegrationCard({ 
  name, 
  description, 
  icon, 
  isConnected = false 
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected?: boolean;
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-1">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 leading-relaxed">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          className="w-full bg-black hover:bg-gray-800 text-white font-medium"
          disabled={isConnected}
        >
          {isConnected ? "Connected" : "Connect"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Platform Icons (simplified representations)
const ShopifyIcon = () => (
  <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">S</span>
  </div>
);

const EtsyIcon = () => (
  <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">E</span>
  </div>
);

const WooCommerceIcon = () => (
  <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">W</span>
  </div>
);

const SquarespaceIcon = () => (
  <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
    <span className="text-white text-xs font-bold">□</span>
  </div>
);

const Integrations = () => {
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
          style={{ filter: 'invert(0.6)' }}
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header title="Integrations" />
      </div>
      
      <div className="flex h-screen bg-white">
        {/* Sticky Sidebar */}
        <div className="sticky top-0 h-screen">
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
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Connect your KPI tracker seamlessly with the tools you already use.
              </h1>
            </div>

            {/* Integration Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <IntegrationCard
                name="Shopify"
                description="Connect Shopify to sync all your e-commerce data in real-time. Perfect for tracking your ecommerce business with powerful automation and smooth management."
                icon={<ShopifyIcon />}
              />
              
              <IntegrationCard
                name="Etsy"
                description="Integrate Etsy to automatically sync all aspects of your business metrics with seamless data flow into your KPI tracker."
                icon={<EtsyIcon />}
              />
              
              <IntegrationCard
                name="WooCommerce"
                description="Easily visualize your ecommerce growth and product performance all in one place."
                icon={<WooCommerceIcon />}
              />
              
              <IntegrationCard
                name="Squarespace"
                description="Connect Squarespace to automatically sync your shop's revenue and sales data."
                icon={<SquarespaceIcon />}
              />
            </div>

            {/* How It Works Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                    1
                  </span>
                  <p className="text-gray-700">
                    Select an integration and authorize access.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                    2
                  </span>
                  <p className="text-gray-700">
                    Your data syncs securely and automatically in the background.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                    3
                  </span>
                  <p className="text-gray-700">
                    Manage active integrations or disconnect anytime.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tips Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></span>
                  <p className="text-gray-700">
                    Only enable integrations relevant to your workflow to keep your dashboard focused.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></span>
                  <p className="text-gray-700">
                    Review permissions carefully during connection.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Integrations;