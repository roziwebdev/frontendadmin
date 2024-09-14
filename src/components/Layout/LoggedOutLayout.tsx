'use client'
import { signOut } from 'next-auth/react'
import React from 'react'
import Sidebar from '../ui/Sidebar'
import Navbar from '../ui/Navbar'

export default function LoggedOutLayout({ children }: { children: React.ReactNode }) {
    return (

      <div className=" bg-slate-200">
        
              {children}
            </div>
    )

}
