'use client';

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signIn , signOut } from "next-auth/react";
import { Code, Trophy, Users, BarChart } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import Link from "next/link"

export default function LandingPage() {
  const { data: session, status } = useSession();
  console.log(session)
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Code className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                DevBattle
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#features"
              >
                How It Works
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#explore-challenges"
              >
                Explore Challenges
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : session ? (
              <>
                <Link href={`/dashboard`}>
                  <Button  className="bg-black mr-4 text-sm">
                    Create a Challenge
                  </Button>
                </Link>
                <p>{session.user.name}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full">
                    {session.user.image && <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-full"/>}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-4 w-72 mr-3 rounded-lg bg-white shadow-lg border border-gray-200">
                    <DropdownMenuLabel className="font-semibold text-lg text-gray-900">
                        My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-300 my-3 mx-2" />
                    <Link href={`/profile`}>
                        <DropdownMenuItem className="p-3 text-base text-gray-700 flex items-center gap-3 hover:bg-gray-100 rounded-md transition-all">
                            <User className="w-5 h-5 text-gray-500" />
                            Profile
                        </DropdownMenuItem>
                    </Link>
                    
                    <DropdownMenuItem 
                        className="p-3 text-base text-red-500 flex items-center gap-3 hover:bg-red-50 hover:text-red-500 rounded-md transition-all"
                        onClick={() => signOut()}
                    >
                        <LogOut className="w-5 h-5 text-red-400" />
                        Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => signIn('google')}>Sign In</Button>
            )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl/none">
                  Host and Participate in Coding Challenges!
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Test your skills, compete with others, and climb the
                  leaderboard.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Button size="lg" className="bg-black border-white" variant="outline">Join Challenge</Button>
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Create a Challenge
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32" id="features">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Platform Features
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="flex flex-col items-center text-center p-6">
                <Code className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Create Custom Coding Challenges</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Design and host your own coding challenges with ease.
                </p>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <Trophy className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Real-time Code Execution with Leaderboards</h3>
                <p className="text-sm text-gray-500 mt-2">
                  See results instantly and compete for the top spot.
                </p>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Compete with Friends and Developers Worldwide</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Challenge your peers and meet new coding enthusiasts.
                </p>
              </Card>
              <Card className="flex flex-col items-center text-center p-6">
                <BarChart className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold">Detailed Performance Analytics</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Track your progress and identify areas for improvement.
                </p>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100" id="explore-challenges">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Featured Public Challenges
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Algorithm Marathon",
                "Web Dev Showdown",
                "Data Structures Duel",
              ].map((challenge) => (
                <Card key={challenge} className="flex flex-col p-6">
                  <h3 className="text-xl font-bold mb-2">{challenge}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Join this exciting challenge and test your coding skills!
                  </p>
                  <Button className="mt-auto">Join Now</Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 DevBattle. Abhiram Reddy Nanabolu.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="https://abhiramreddy.online" target="_blank">
            Portfolio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="https://github.com/Abhiramnanabolu" target="_blank">
            Github
          </Link>
        </nav>
      </footer>
    </div>
  )
}