"use client";

import { cn } from "@/lib/utils";
import Image from "next/image"
import { Bell, User } from "lucide-react";

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ title = "Dashboard", className }: HeaderProps) {
  return (
    <header className={cn(
      "flex items-center justify-between px-6 py-2 bg-white border-b border-gray-300",
      className
    )}>
      {/* Left side - Title and Logo */}
      <div className="flex items-center">
        <Image src="/Logo.png" alt="Logo" width={40} height={40} className="mr-2" />
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right side - Plan badge, notifications, user */}
      <div className="flex items-center space-x-4">
        {/* Plan badge */}
        <div className="px-3 py-1 bg-white border border-gray-400 rounded-full">
          <span className="text-sm text-gray-600 font-medium">Plan - Basic</span>
        </div>

        {/* Notifications */}
        <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        {/* User profile */}
        <button className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
