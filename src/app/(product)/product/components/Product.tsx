"use client"
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    index: number; // Add index to number the rows
    onDelete: (id:string) => void;
}

export default function Product({ name, description, price, image, id, onDelete, index }: ProductProps) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        { index+1}
      </td>
      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-10 h-10">
            <Image className="w-10 h-10 rounded-full"
              src={image} alt=""
              width={100}
              height={100}
            />
          </div>

          <div className="ml-4">
            <div className="text-sm font-medium leading-5 text-gray-900">{ name}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
          <div className="text-sm leading-5 text-gray-900">{description}</div>
      </td>
      <td className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
        {price}
      </td>
      <td className="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
          <div className='flex space-x-2'>
              <Link href={`/product/${id}`} className="btn btn-xs text-white bg-yellow-500  hover:text-slate-900">Edit</Link>
              <button className='btn btn-xs bg-red-500  text-white hover:text-slate-900' onClick={() => onDelete(id)}>Delete</button>
          </div>
      </td>
    </tr>
  );
}
