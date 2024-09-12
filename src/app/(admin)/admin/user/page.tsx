"use client"
import React, { useCallback, useEffect, useState } from 'react'
import User from '../components/User'
import toast from 'react-hot-toast'

export default function Page() {

    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [limit, setLimit] = useState(10)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchUsers = useCallback(async(page:number, limit:number, search:string) => {
        try {
            const res = await fetch(`/api/users?page=${page}&limit=${limit}&search=${search}`)
            const data = await res.json()
            setUsers(data.users)
            setTotalPages(data.totalPages)
            setLoading(false)
        }catch (error) {
            toast.error('something error')
        }
    },[])

    useEffect(() => {
        fetchUsers(currentPage, limit, searchTerm)
    }, [currentPage, limit, searchTerm, fetchUsers])

    const deleteUser = async (id:String) => {
        const res = await fetch(`/api/users/${id}`, {
            method: 'DELETE'
        })
        if (res.ok) {
            setUsers(users.filter((user) => user.id !== id))
            toast.success('user successfully deleted')
        } else {
            toast.error('something error')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        )
    }

  return (

      <div className="flex flex-col mt-8">
        <div className="mb-4">
            <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full max-w"
            />
        </div>
              <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
            <table className=" table min-w-full">
          {/* Table header */}
        <thead>
            <tr>
                <th
                    className="w-1 px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      No
                </th>
                <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                      Name
                </th>
                <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Email</th>
                <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Role</th>

                <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Actions</th>
            </tr>
        </thead>
                <tbody className='bg-white'>
                    {users.map((user,index) => (
                        <User key={user.id}
                            index={index}
                            id={user.id}
                            name={user.name}
                            email={user.email}
                            role={user.role}
                            profilePhotoUrl={user.profilePhotoUrl}
                            onDelete={deleteUser}
                        />
                    ))}

                </tbody>
                {/* foot */}
                  </table>
                  </div>
                  </div>
        <div className="mt-4 flex justify-end items-center">
        <div className="flex space-x-2 items-center">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="btn btn-xs"
          >
            Previous
          </button>
          <span className="text-xs">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="btn btn-xs"
          >
            Next
          </button>
        </div>
        <div className="ml-4">
          <label htmlFor="limit" className="mr-2 text-xs">Items per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="select select-bordered select-xs"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
        </div>

  )
}
