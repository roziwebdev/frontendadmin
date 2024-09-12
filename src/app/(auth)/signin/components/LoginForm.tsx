"use client";
import Input from '@/components/Input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Login successful");
        router.push("/profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-base-100">
      <div className="card w-full max-w-sm shadow-xl bg-slate-200 rounded-lg">
        <div className="card-body p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-2">Login to your account</p>

          <div className="form-control mb-2">
            <label className="label">
              <span className="label-text text-slate-800 font-semibold">Email</span>
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="input-sm w-full input input-bordered border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text text-slate-800 font-semibold">Password</span>
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter your password"
              disabled={loading}
              className="input-sm w-full input input-bordered border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="form-control mt-3">
            <button
              onClick={login}
              disabled={loading}
              className={`btn bg-slate-800 text-white w-full transition-transform transform hover:scale-105 ${loading ? "loading" : ""}`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link href="/signup" className="text-slate-800 hover:text-indigo-700">
              Dont have an account? <span className="font-semibold">Sign up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
