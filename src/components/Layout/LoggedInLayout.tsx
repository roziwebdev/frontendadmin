'use client'
import { signOut } from 'next-auth/react'
import React from 'react'
import Sidebar from '../ui/Sidebar'
import Navbar from '../ui/Navbar'

export default function LoggedInLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex">
        {/* Sidebar */}
          <Sidebar />
          <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="md:pl-64">
                  <Navbar />
            </div>
          {/* Dashboard content */}
            <div className="pt-10 md:pl-72 p-4 flex-grow bg-slate-200">
              {children}
            </div>
          </div>
        </div>
    )
}
