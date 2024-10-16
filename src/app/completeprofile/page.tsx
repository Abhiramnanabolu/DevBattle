'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Appbar from '@/components/ui/appbar';

const CompleteProfile = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session.status === "loading") return;

      if (!session.data) {
        router.push('/login'); 
        return;
      }

      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUsername(data.user.username || ''); 
        setBio(data.user.bio || 'Default bio text'); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session, router]);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (username.length < 8) {
      setError("Username must be at least 8 characters long");
      return;
    }

    try {
      const res = await fetch('/api/completeprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, bio }),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      setSuccessMessage("Profile updated successfully!"); 
      setError(''); 
      router.push('/dashboard'); 
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div className='flex justify-center items-center w-screen h-screen'>Loading...</div>; 
  }

  return (
    <>
      <Appbar loc="complete-profile" />
      <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border rounded p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block mb-2">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border rounded p-2 w-full"
              rows={4}
              required
            />
          </div>
          <div>
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>} 
          </div>
          <Button type="submit">Update Profile</Button>
        </form>
      </div>
    </>
  );
};

export default CompleteProfile;
