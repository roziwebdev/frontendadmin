"use client";
import React, { useEffect, useState, useCallback } from "react";
import Product from "./components/Product";
import toast from "react-hot-toast";

export default function Page() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // To control number of products per page
  const [searchTerm, setSearchTerm] = useState("");
  
  // Function to fetch products with search and pagination
  const fetchProducts = useCallback(async (page: number, limit: number, search: string) => {
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}&search=${search}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products on load and when page/limit/searchTerm changes
  useEffect(() => {
    fetchProducts(currentPage, limit, searchTerm);
  }, [currentPage, limit, searchTerm, fetchProducts]);

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((product) => product.id !== id));
        toast.success("Product deleted successfully");
      } else {
        console.error("Failed to delete the product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-8">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full max-w"
        />
      </div>

      {/* Table with Product Data */}
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
                    Description</th>
                <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Price</th>
                <th
                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                    Actions</th>
            </tr>
        </thead>
          {/* Table body */}
          <tbody className="bg-white">
            {products.map((product, index) => (
              <Product
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
                onDelete={deleteProduct}
                index={index} // Pass index for row number
              />
            ))}
          </tbody>
            </table>
          </div>
      </div>
      {/* Pagination Controls */}
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
  );
}
