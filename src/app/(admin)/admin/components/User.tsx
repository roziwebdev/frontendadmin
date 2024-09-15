"use client"
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'


interface UserProps {
    id: string;
    index: number;
    name: string;
    email: string;
    role: string;
    profilePhotoUrl: string;
    onDelete: (id:string) =>void
}
export default function User({ id, name, email, role, profilePhotoUrl, onDelete, index }: UserProps) {
  return (

      <tr>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        { index+1}
      </td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <Image className="w-10 h-10 rounded-full"
              src={profilePhotoUrl} alt=""
              width={100}
              height={100}
            />
          </div>

          <div className="ml-4">
            <div className="text-sm font-medium leading-5 text-gray-900">{name}</div>
          </div>
        </div>
      </td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
          <div className="text-sm leading-5 text-gray-900">{email}</div>
      </td>
        <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
          <div className="text-sm leading-5 text-gray-900">{role}</div>
      </td>
         <td className="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
          <div className='flex space-x-2'>
              <button className='btn btn-xs bg-red-500 text-white hover:text-slate-900' onClick={() => onDelete(id)}>Delete</button>
              <Link className='btn btn-xs bg-yellow-500 text-white hover:text-slate-900' href={`/admin/user/${id}`}>Edit</Link>
          </div>
      </td>
      </tr>

  )
}
