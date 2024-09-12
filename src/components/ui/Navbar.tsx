"use client"
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

export default function Navbar() {
const { data: session } = useSession();
  return (
    <div className="  navbar bg-base-100 flex justify-between items-center">
      <Link href={"/"} className="ml-3 text-2xl normal-case">Arjaya Team</Link>
      <div className="flex items-center gap-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                          {
                              session?.user.profilePhotoUrl ? (
                                  <Image
                                  alt="Tailwind CSS Navbar component"
                                  src={session.user.profilePhotoUrl}
                                  width={100}
                                  height={100}
                                  />
                              ) : (
                                  <div className="placeholder avatar w-10 mask mask-squircle bg-neutral-focus text-neutral-content">
                                      <span className="text-3xl">{session?.user.name?.charAt(0)}</span>
                                  </div>
                              )
                          }
                </div>
            </div>
          <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li>
                <Link href={"/profile"} className="justify-between">
                    Profile
                    <span className="badge">New</span>
                </Link>
                </li>
                <li><button onClick={()=>signOut()}>Logout</button></li>
            </ul>
        </div>
      </div>
    </div>
  )
}
