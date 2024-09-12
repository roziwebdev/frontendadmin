"use client";
import { useSession,signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";

const Profile = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/users/${session?.user.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await signOut()
        router.push("/signin");
      } else {
        console.error("Failed to delete the user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="max-w bg-white min-h-96">
      <div className="p-6">
        <h2 className="text-xl font-bold">Profile Details</h2>
        <div className="space-y-8 mt-5">
          <div className="flex items-center border-b-2 mt-">
            <div className="flex-none w-64 ...">
              Profile
            </div>
            <div className="py-3 ">
              <div className="flex-1 w-64  ... ">
                <div className="flex items-center space-x-5">
                  <div className="avatar flex items-center">
                    {session?.user.profilePhotoUrl ? (
                      <div className="w-12 mask mask-squircle">
                    <Image
                      src={session.user.profilePhotoUrl}
                      alt="Profile Photo"
                      width={128}
                      height={128}
                      className="rounded-full"
                    />
                  </div>
                ) : (
                  <div className="placeholder avatar w-32 mask mask-squircle bg-neutral-focus text-neutral-content">
                    <span className="text-4xl">{session?.user.name?.charAt(0)}</span>
                  </div>
                    )}
                  </div>
                    <div className="texl-lg">
                      {session?.user.name}
                    </div>
                </div>
              </div>
            </div>

          </div>
          <div className=" border-b-2">
            <div className="flex py-6">
            <div className="flex-none w-64">
              Email
            </div>
            <div className="flex-1 w-64">
              <h1>{session?.user.email }</h1>
            </div>
            </div>
          </div>
          <div className=" border-b-2">
            <div className="flex py-6">
            <div className="flex-none w-64">
              Role
            </div>
            <div className="flex-1 w-64">
              <h1>{session?.user.role }</h1>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-end p-12">
        <button onClick={handleDelete} className="btn-sm btn btn-error">
          <span><FaTrash/></span>
          Delete Account
        </button>
      </div>
    </div>
   
  );
};

export default Profile;
