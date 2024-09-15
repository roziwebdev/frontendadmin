'use client'
import Input from '@/components/Input';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Setting() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(session?.user.name || '');
    const [email, setEmail] = useState(session?.user.email || '');
    const [role, setRole] = useState(session?.user.role || '');
    const [image, setImage] = useState<File | null>(null);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(session?.user.profilePhotoUrl || '');

  const router = useRouter();
  useEffect(() => {
    setName(session?.user.name || '');
    setEmail(session?.user.email || '');
    setRole(session?.user.role || '');
    setProfilePhotoUrl(session?.user.profilePhotoUrl || '');
  },[session?.user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);
    };

const updateUser = async () => {
    setLoading(true);
    try {
        let imageUrl = profilePhotoUrl;
        if (image) {
            const reader = new FileReader();
            reader.readAsDataURL(image);
            imageUrl = await new Promise<string | null>((resolve) => {
                reader.onloadend = () => resolve(reader.result as string | null);
            });
        }

        const res = await fetch(`/api/users/${session?.user.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name,
                email,
                role,
                profilePhotoUrl: imageUrl,
            }),
        });

        if (res.ok) {
            // Refresh the session after successful update
            console.log("User updated successfully, refreshing session...");
            await signIn('credentials', { redirect: false });
            router.push('/profile');
            toast.success("User updated successfully");
        } else {
            toast.error("Failed to update user");
        }

    } catch (error) {
        console.error("Error updating user:", error);
        toast.error("An error occurred while updating user");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-base-100 py-4">
            <div className="card w-full max-w-md shadow-xl bg-slate-200 rounded-lg">
                <div className="card-body p-8">
                    <h2 className="text-2xl font-bold text-center text-slate-800">Update Profile</h2>
                    <p className="text-center text-gray-500 mb-3">Edit your account details</p>

                    <div className="form-control mb-1">
                        <label className="label">
                            <span className="label-text font-semibold text-slate-800">Email</span>
                        </label>
                        <input
                            type="email"
                            className="input-md input input-bordered w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="form-control mb-1">
                        <label className="label">
                            <span className="label-text font-semibold text-slate-800">Name</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            disabled={loading}
                            className="input input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
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
                            className="w-full file-input file-input-sm file-input-bordered border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="form-control mt-6">
                        <button
                            onClick={updateUser}
                            className={`btn bg-slate-800 text-white w-full transition-transform transform hover:scale-105 ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
