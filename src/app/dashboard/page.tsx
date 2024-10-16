'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Code, LayoutDashboard, Plus, Trophy, Clock, Settings, LogOut, User, ChevronRight, PlusCircle, Users, History } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CreateChallenge from '@/components/ui/createChallenge';
import ActiveChallenges from '@/components/ui/activeChallenges';
import UserProfile from '@/components/ui/profile';
import JoinChallenge from '@/components/ui/joinChallenge';

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const  session  = useSession(); 
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (session.status === "loading") return; 

      if (!session) {
        router.push('/login'); 
        return;
      }

      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await res.json();
        setUserDetails(data.user);
        if(!data.user.username){
          router.replace('/completeprofile')
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [session, session.status, router]);

  if (loading) {
    return <div className='flex w-screen h-screen items-center justify-center'>Loading...</div>; // Show a loading state
  }

  if (!userDetails) {
    return <div className='flex w-screen h-screen items-center justify-center'>Error Please SignUp Again <a href='/'>Click here</a></div>; // Handle the case where user is not found
  }


  const user = {
    name: "Jane Doe",
    username: "janedoe",
    points: 1250,
    achievements: 15,
    profilePicture: "/placeholder.svg"
  }

  const activeChallenges = [
    { id: 1, title: "Advanced Algorithms", participants: 120, submissions: 80, timeLeft: "2 days" },
    { id: 2, title: "Web Security Basics", participants: 85, submissions: 60, timeLeft: "5 days" },
    { id: 3, title: "Machine Learning 101", participants: 150, submissions: 100, timeLeft: "1 week" },
  ]

  const pastChallenges = [
    { id: 4, title: "Data Structures Deep Dive", participants: 200, winner: "codemaster" },
    { id: 5, title: "Frontend Frameworks Battle", participants: 180, winner: "webwizard" },
    { id: 6, title: "Python for Data Science", participants: 220, winner: "dataninja" },
  ]

  const upcomingChallenges = [
    { id: 7, title: "Blockchain Basics", startDate: "2024-03-15", duration: "2 weeks" },
    { id: 8, title: "AI Ethics Hackathon", startDate: "2024-03-20", duration: "3 days" },
    { id: 9, title: "Cloud Computing Challenge", startDate: "2024-03-25", duration: "1 week" },
  ]

  const leaderboard = [
    { rank: 1, username: "codemaster", points: 5000 },
    { rank: 2, username: "algoqueen", points: 4800 },
    { rank: 3, username: "bytewizard", points: 4600 },
    { rank: 4, username: "syntaxking", points: 4400 },
    { rank: 5, username: "logicninja", points: 4200 },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Challenges</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeChallenges.length + pastChallenges.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeChallenges.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.points}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#42</div>
              </CardContent>
            </Card>
          </div>
        )
      case 'create-challenge':
        return (
          <CreateChallenge/>
        )
      case 'active-challenges':
        return (
          <ActiveChallenges/>
        )
      case 'past-challenges':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Past Challenges</CardTitle>
              <CardDescription>Completed coding challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Winner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastChallenges.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell>{challenge.title}</TableCell>
                      <TableCell>{challenge.participants}</TableCell>
                      <TableCell>{challenge.winner}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      case 'join-challenge':
        return (
          <JoinChallenge/>
        )
      case 'leaderboard':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>Top performers worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((item) => (
                    <TableRow key={item.rank}>
                      <TableCell>{item.rank}</TableCell>
                      <TableCell>{item.username}</TableCell>
                      <TableCell>{item.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input id="email" type="email" className="w-full p-2 border rounded" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">New Password</label>
                  <input id="password" type="password" className="w-full p-2 border rounded" placeholder="••••••••" />
                </div>
                <Button>Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        )
      case 'profile':
        return (
          <>
          <UserProfile/>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link className="flex items-center space-x-2" href="/">
            <Code className="h-6 w-6" />
            <span className="font-bold">DevBattle</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-4 space-y-1">
              {[
                { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
                { name: 'Create Challenge', icon: PlusCircle, id: 'create-challenge' },
                { name: 'Join a Challenge', icon: Users, id: 'join-challenge' },
                { name: 'Active Challenges', icon: Code, id: 'active-challenges' },
                { name: 'Past Challenges', icon: History, id: 'past-challenges' },
                { name: 'Leaderboard', icon: Trophy, id: 'leaderboard' },
                { name: 'Settings', icon: Settings, id: 'settings' },
                { name: 'Profile', icon: User, id: 'profile' },
              ].map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className='w-8 h-8 rounded-full'>
              <img className='w-8 h-8 rounded-full' src={session.data?.user.image || ""} alt="" />
            </div>
            <div>
              <p className="text-xs font-medium truncate">{session.data?.user.name}</p>
            </div>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50">
              <LogOut  className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}