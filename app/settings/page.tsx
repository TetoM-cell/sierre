"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Home, Settings, User, CreditCard, Plug, Edit2, Trash2, CheckCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Account Settings Section
function AccountSettings() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <CardTitle>Account Settings</CardTitle>
        </div>
        <CardDescription>
          Manage your personal information and account preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">Profile Picture</h3>
            <p className="text-sm text-gray-600">Update your avatar</p>
          </div>
          <Button variant="outline" size="sm">
            <Edit2 className="w-4 h-4 mr-2" />
            Change
          </Button>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue="Teto" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue="Kasane" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue="teto@example.com" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" placeholder="Enter current password" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="Enter new password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button className="bg-black hover:bg-gray-800">Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>

        {/* Danger Zone */}
        <div className="border-t pt-6 mt-6">
          <h3 className="font-medium text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Integration Management Section
function IntegrationManagement() {
  const connectedIntegrations = [
    { name: "Shopify", status: "connected", lastSync: "2 hours ago", color: "bg-green-600" },
    { name: "Etsy", status: "connected", lastSync: "1 day ago", color: "bg-orange-500" },
  ];

  const availableIntegrations = [
    { name: "WooCommerce", status: "available", color: "bg-purple-600" },
    { name: "Squarespace", status: "available", color: "bg-black" },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Plug className="w-5 h-5" />
          <CardTitle>Integration Management</CardTitle>
        </div>
        <CardDescription>
          Manage your connected platforms and data sync settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connected Integrations */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Connected Platforms</h3>
          <div className="space-y-3">
            {connectedIntegrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${integration.color} rounded flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">
                      {integration.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{integration.name}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Last sync: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Reconnect</Button>
                  <Button variant="destructive" size="sm">Disconnect</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Integrations */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Available Integrations</h3>
          <div className="space-y-3">
            {availableIntegrations.map((integration, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${integration.color} rounded flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">
                      {integration.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">{integration.name}</span>
                    <p className="text-sm text-gray-600">Connect to sync your data</p>
                  </div>
                </div>
                <Button className="bg-black hover:bg-gray-800" size="sm">
                  Connect
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Billing & Subscription Section
function BillingSubscription() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          <CardTitle>Billing & Subscription</CardTitle>
        </div>
        <CardDescription>
          Manage your subscription plan and billing information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Current Plan</h3>
            <Badge className="bg-blue-100 text-blue-700">Pro Plan</Badge>
          </div>
          <p className="text-gray-600 mb-4">$29/month • Billed monthly</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">KPIs Tracked:</span>
              <span className="font-medium ml-2">Unlimited</span>
            </div>
            <div>
              <span className="text-gray-600">Integrations:</span>
              <span className="font-medium ml-2">All platforms</span>
            </div>
            <div>
              <span className="text-gray-600">Data Retention:</span>
              <span className="font-medium ml-2">2 years</span>
            </div>
            <div>
              <span className="text-gray-600">Support:</span>
              <span className="font-medium ml-2">Priority</span>
            </div>
          </div>
        </div>

        {/* Usage */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Current Usage</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">API Calls</span>
                <span className="text-gray-900">2,847 / 10,000</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Data Storage</span>
                <span className="text-gray-900">1.2 GB / 5 GB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-600">Expires 12/2027</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline">Change Plan</Button>
          <Button variant="outline">Download Invoice</Button>
          <Button variant="destructive">Cancel Subscription</Button>
        </div>

        {/* Next Billing */}
        <div className="text-sm text-gray-600 pt-4 border-t">
          <p>Next billing date: <span className="font-medium">August 15, 2025</span></p>
          <p>Amount: <span className="font-medium">$29.00</span></p>
        </div>
      </CardContent>
    </Card>
  );
}

const SettingsPage = () => {
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
        <Header title="Settings" />
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
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">
                Manage your account preferences and application settings
              </p>
            </div>

            {/* Settings Sections */}
            <AccountSettings />
            <IntegrationManagement />
            <BillingSubscription />
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;