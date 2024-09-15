"use client";
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function AddUser() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePhotoUrl(file);
  };

  const register = async () => {
    if (!email || !name || !role || !password || !profilePhotoUrl) {
        toast.error("Please fill in all the fields"); // Tampilkan pesan jika ada input yang kosong
        return;
      }
    setLoading(true);
    try {
      let profilePhotoBase64 = null;

      if (profilePhotoUrl) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePhotoUrl);
        profilePhotoBase64 = await new Promise<string | null>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string | null);
        });
      }

      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          role,
          password,
          profilePhotoUrl: profilePhotoBase64, // Include the file in the request
        }),
      });

      router.push('/admin/user');
      toast.success("Account created");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-base-100 py-4">
      <div className="card w-full max-w-md shadow-xl bg-slate-200 rounded-lg">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800">Create Account</h2>
          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Email</span>
            </label>
            <Input
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
            <Input
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

          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Password</span>
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              disabled={loading}
              className="input-sm w-full input input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text font-semibold text-slate-800">Profile Photo</span>
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full file-input file-input-sm file-input-bordereds border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mt-6">
            <button
              onClick={register}
              disabled={loading}
              className={`btn bg-slate-800 text-white w-full transition-transform transform hover:scale-105 ${loading ? "loading" : ""}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
