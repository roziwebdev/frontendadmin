"use client";
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

export default function AddForm() {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState<number | undefined>(undefined)
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
    };

    const addProduct = async () => {
        if (!name || !description || !price || !image) {
            toast.error("Please fill in all the fields")
        }
        setLoading(true)
        try {
            let imageUrl = null;
            if (image) {
                const reader = new FileReader()
                reader.readAsDataURL(image)
                imageUrl = await new Promise<string | null>((resolve) => {
                    reader.onloadend = () => resolve(reader.result as string | null)
                })
            }
            await fetch('/api/products', {
                method: 'POST',
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
            router.push('/product')
            toast.success("Product added")
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="card-title text-2xl font-bold text-center mb-2">Add New Product</h2>
            <div className="card  mx-auto mt-3 p-6 bg-base-100 shadow-xl">
            <h2 className="card-title text-xl font-bold text-center mb-2">Form</h2>
                <div className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Product Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            className="input-md input input-bordered w-full"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Product Description</span>
                        </label>
                        <textarea
                            placeholder="Enter product description"
                            className="textarea textarea-bordered w-full"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Product Price</span>
                        </label>
                        <input
                            type="number"
                            placeholder="Enter product price"
                            className="input-md input input-bordered w-full"
                            value={price}
                            onChange={(e) => setPrice(e.target.valueAsNumber)}
                            disabled={loading}
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
                </div>
                <div className="card-actions mt-6">
                    <button
                        className={`btn-md btn bg-slate-800 text-white w-full ${loading ? "loading" : ""}`}
                        onClick={addProduct}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                </div>
            </div>
        </div>
    )
}
