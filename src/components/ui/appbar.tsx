'use client';

import { signOut, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut , Code } from "lucide-react";

interface AppbarProps {
  loc: string;
}

export default function Appbar({ loc }: AppbarProps) {
  const { data: session, status } = useSession();

  if(loc=="complete-profile" || loc=="manageChallenge"){
    return(
    <header className="sticky px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <Code className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">
                DevBattle
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
            {status === "loading" ? (
              <p>Loading...</p>
            ) : session ? (
              <div className="gap-4 mr-2 flex items-center">
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
              </div>
            ) : (
              <Button onClick={() => signIn('google')}>Sign In</Button>
            )}
            </nav>
          </div>
        </div>
      </header>
      )
  }


  return (
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
  );
}