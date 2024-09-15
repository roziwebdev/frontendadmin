"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'


interface EditUserProps {
    userId: string
}

export default function EditUser({ userId }: EditUserProps) {

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState<File | null>(null)
    const [currentProfilePhotoUrl, setCurrentProfilePhotoUrl] = useState<string | null>(null)
    const router = useRouter()
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/users/${userId}`)
            const user = await res.json()
            if (res.ok) {
                setName(user.name)
                setRole(user.role)
                setEmail(user.email)
                setCurrentProfilePhotoUrl(user.profilePhotoUrl)
            } else {
                toast.error('Failed to load user')
            }
        }
        fetchUser()
    }, [userId])
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
      }

      const updateUser = async () => {
        if (!email || !name || !role ) {
            toast.error("Please fill in all the fields"); // Tampilkan pesan jika ada input yang kosong
            return;
          }
        setLoading(true);
        try{
            let imageUrl = currentProfilePhotoUrl;
            if (image) {
                const reader = new FileReader()
                reader.readAsDataURL(image)
                imageUrl = await new Promise<string | null>((resolve) => {
                  reader.onloadend = () => resolve(reader.result as string | null)
                })
              }

            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    role,
                    email,
                    profilePhotoUrl: imageUrl
                })
            })
            if (res.ok) {
                router.push('/admin/user')
                toast.success("User updated")
              } else {
                toast.error("Failed to update user")
              }
            
        }catch(error){
            toast.error("Failed to update product")
        }
      
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-base-100 py-4">
      <div className="card w-full max-w-md shadow-xl bg-slate-200 rounded-lg">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800">Edited Account</h2>
          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Email</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="input-sm w-full input input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Name</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={loading}
              className="input-sm w-full input input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Role</span>
            </label>
            <select 
              value={role} onChange={(e) => setRole(e.target.value)} 
              className='input-sm w-full input input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option>Select Role</option>
              <option value={"Admin"}>Admin</option>
              <option value={"User"}>User</option>
            </select>
           
          </div>

         

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Profile Photo</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full file-input file-input-sm file-input-bordereds border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mt-6">
            <button
              onClick={updateUser}
              disabled={loading}
              className={`btn bg-slate-800 text-white w-full transition-transform transform hover:scale-105 ${loading ? "loading" : ""}`}
            >
              {loading ? "Upadating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
