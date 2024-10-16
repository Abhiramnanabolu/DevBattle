'use client';

import { useSession } from "next-auth/react";
import Appbar from "@/components/ui/appbar";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <Appbar loc="profile" />
      <div className="container mx-auto py-10">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            {session?.user.image && (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover shadow-sm"
              />
            )}
            <h2 className="text-2xl font-semibold mt-4">{session?.user.name}</h2>
            <p className="text-gray-500">{session?.user.email}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
