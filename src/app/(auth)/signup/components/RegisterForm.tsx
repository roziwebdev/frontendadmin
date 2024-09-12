"use client";
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegisterForm() {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          role,
          password,
          profilePhotoUrl: profilePhotoBase64, // Include the file in the request
        }),
      });

      router.push('/signin');
      toast.success("Account created");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-base-100">
      <div className="card w-full max-w-md shadow-xl bg-white rounded-lg">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center text-blue-600">Create Account</h2>
          <p className="text-center text-gray-500 mb-3">Register to get started</p>

          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-blue-600">Email</span>
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
              <span className="label-text font-semibold text-blue-600">Name</span>
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
              <span className="label-text font-semibold text-blue-600">Role</span>
            </label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Enter your role"
              disabled={loading}
              className="input-sm w-full input input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-control mb-1">
            <label className="label">
              <span className="label-text font-semibold text-blue-600">Password</span>
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
              <span className="label-text font-semibold text-blue-600">Profile Photo</span>
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
              className={`btn btn-primary w-full transition-transform transform hover:scale-105 ${loading ? "loading" : ""}`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/signin" className="text-blue-500 hover:text-blue-700">
              Already have an account? <span className="font-semibold">Sign in</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
