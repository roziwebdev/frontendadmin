"use client";
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

interface EditFormProps {
  productId: string;
}

export default function EditForm({ productId }: EditFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [image, setImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  // Fetch product data when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${productId}`)
      const product = await res.json()
      if (res.ok) {
        setName(product.name)
        setDescription(product.description)
        setPrice(product.price)
        setCurrentImageUrl(product.image)
      } else {
        toast.error('Failed to load product')
      }
    }
    fetchProduct()
  }, [productId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
  }

  const updateProduct = async () => {
    setLoading(true)
    try {
      let imageUrl = currentImageUrl

      // If an image is provided, we need to handle file upload
      if (image) {
        const reader = new FileReader()
        reader.readAsDataURL(image)
        imageUrl = await new Promise<string | null>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string | null)
        })
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          price,
          image: imageUrl,
        })
      })

      if (res.ok) {
        router.push('/product')
        toast.success("Product updated")
      } else {
        toast.error("Failed to update product")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="card-title text-2xl font-bold text-center mb-2">Edit Product</h2>
      <div className="card max-w mx-auto mt-2 p-6 bg-base-100 shadow-xl">
        <h2 className="card-title text-xl font-bold text-center mb-2">Form Edit</h2>
        <div className="space-y-2">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input
              type="text"
              className="input-md input input-bordered w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              placeholder="Enter product name"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Product Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              placeholder="Enter product description"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Product Price</span>
            </label>
            <input
              type="number"
              className="input-md input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(e.target.valueAsNumber)}
              disabled={loading}
              placeholder="Enter product price"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Product Image</span>
            </label>
            <input
              type="file"
              className="file-input-md file-input file-input-bordered w-full"
              onChange={handleFileChange}
              disabled={loading}
              accept="image/*"
            />
          </div>
          {currentImageUrl && (
            <div className="w-32 h-32 mx-auto mt-4">
              <Image
                src={currentImageUrl}
                alt="Current product image"
                className="rounded"
                width={128}
                height={128}
              />
            </div>
          )}

          <div className="card-actions mt-6">
            <button
              onClick={updateProduct}
              disabled={loading}
              className={`btn-md btn bg-slate-800 text-white w-full ${loading ? "loading" : ""}`}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
