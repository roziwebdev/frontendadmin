'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FiBox, FiUsers, FiChevronDown, FiChevronUp } from "react-icons/fi";



const Sidebar = () => {
  const {data :session} =useSession()
  const [isOpen, setIsOpen] = useState(false);
  const [isProductExpanded, setIsProductExpanded] = useState(false);
  const [isUserExpanded, setIsUserExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const pathName = usePathname();

  // Function to check if current pathname matches the link
  const isActive = (href: string) => pathName === href;
  if(session?.user?.role !== "Admin"){
    return(
      <>
      {/* Button to toggle sidebar on small screens */}
      <div className='bg-slate-800'>
        <button
          className="text-2xl  text-white p-2 top-4 md:fixed left-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>

      </div>

      {/* Sidebar */}
      <div
        className={`text-white bg fixed top-0 left-0 w-64 bg-slate-800 h-screen transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className="p-4 h-full flex flex-col">
          <Link href="/" className="text-xl text font-bold">Dashboard</Link>
          <ul className="menu p-4 space-y-2 flex-grow">
            <li>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsProductExpanded(!isProductExpanded)}
          >
            <div className="flex items-center space-x-2">
              <FiBox />
              <span>Products</span>
            </div>
            {isProductExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isProductExpanded && (
            <ul className="ml-6 mt-2 space-y-2">
              <div className={isActive("/product") ? "bg-slate-700 p-2 text-white rounded" : "p-2"}>
                <Link
                  href="/product"
                >
                  List Product
                </Link>
              </div>
              <div className={isActive("/product/create") ? "bg-slate-700 text-white p-2 rounded" : "p-2"}>
                <Link
                  href="/product/create"
                >
                  Add Product
                </Link>
              </div>
            </ul>
          )}
        </li>
        {/* Users section */}
     
          </ul>
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
    )
  }



  return (
    <>
      {/* Button to toggle sidebar on small screens */}
      <div className='bg-slate-800'>
        <button
          className="text-2xl  text-white p-2 top-4 md:fixed left-4 z-50 md:hidden"
          onClick={toggleSidebar}
        >
          ☰
        </button>

      </div>

      {/* Sidebar */}
      <div
        className={`text-white bg fixed top-0 left-0 w-64 bg-slate-800 h-screen transition-transform transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        <div className="p-4 h-full flex flex-col">
          <Link href="/" className="text-xl text font-bold">Dashboard</Link>
          <ul className="menu p-4 space-y-2 flex-grow">
            <li>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsProductExpanded(!isProductExpanded)}
          >
            <div className="flex items-center space-x-2">
              <FiBox />
              <span>Products</span>
            </div>
            {isProductExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isProductExpanded && (
            <ul className="ml-6 mt-2 space-y-2">
              <div className={isActive("/product") ? "bg-slate-700 p-2 text-white rounded" : "p-2"}>
                <Link
                  href="/product"
                >
                  List Product
                </Link>
              </div>
              <div className={isActive("/product/create") ? "bg-slate-700 text-white p-2 rounded" : "p-2"}>
                <Link
                  href="/product/create"
                >
                  Add Product
                </Link>
              </div>
            </ul>
          )}
        </li>
        {/* Users section */}
        <li className="mt-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsUserExpanded(!isUserExpanded)}
          >
            <div className="flex items-center space-x-2">
              <FiUsers />
              <span>Users</span>
            </div>
            {isUserExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </div>
          {isUserExpanded && (
            <ul className="ml-6 mt-2 space-y-2">
              <div className={isActive("/admin/user/create") ? "bg-slate-700 text-white p-2 rounded" : "p-2"}>
                <Link
                  href="/admin/user/create"
                  
                >
                  Add User
                </Link>
              </div>
              <div className={isActive("/admin/user") ? "bg-slate-700 text-white p-2 rounded" : "p-2"}>
                <Link
                  href="/admin/user/"
                  
                >
                  List Users
                </Link>
              </div>
            </ul>
          )}
        </li>
          </ul>
        </div>
      </div>

      {/* Overlay for small screens when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
