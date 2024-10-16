'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { Clock, AlertCircle, ChevronRight, Home, Copy } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Appbar from '@/components/ui/appbar'
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ManageChallengePageProps {
  params: {
    challengeId: string
  }
}

interface Challenge {
  id: string
  title: string
  description?: string
  duration: number
  joinCode: string
  questions: Array<{
    id: string
    title: string
    problemStatement: string
  }>
}

interface Participant {
  id: string
  name: string
  joinedAt: string
}

const useSocket = (challengeId: string): Socket => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io()
    setSocket(newSocket)

    if (challengeId) {
      newSocket.emit('joinChallengeRoom', { challengeId })
    }

    return () => {
      newSocket.close()
    }
  }, [challengeId])

  return socket as Socket
}

export default function ManageChallengePage({ params }: ManageChallengePageProps) {
  const { challengeId } = params
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const socket = useSocket(challengeId)

  const fetchChallenge = useCallback(async () => {
    try {
      const response = await fetch(`/api/challenge/${challengeId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch challenge')
      }
      const data = await response.json()
      setChallenge(data)
      console.log(data)
      setParticipants(data.participants)
    } catch (err: any) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [challengeId])

  useEffect(() => {
    fetchChallenge()

    if (socket) {
      socket.on('userJoined', (data: { userId: string; userName: string }) => {
        setParticipants((prev) => [
          ...prev,
          { id: data.userId, name: data.userName, joinedAt: new Date().toISOString() }
        ])
      })
    }

    return () => {
      if (socket) {
        socket.off('userJoined')
      }
    }
  }, [challengeId, socket, fetchChallenge])

  const copyJoinCode = useCallback(() => {
    if (challenge) {
      navigator.clipboard.writeText(challenge.joinCode)
      toast({
        title: "Join Code Copied",
        description: `The join code ${challenge.joinCode} has been copied to your clipboard.`,
      })
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [challenge, toast])

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
  }, [participants])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="container mx-auto p-4 mt-8 bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <AlertCircle className="mr-2" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error.message}</p>
          <Button onClick={() => router.push('/challenges')} className="mt-4">
            Back to Challenges
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!challenge) {
    return (
      <Card className="container mx-auto p-4 mt-8">
        <CardHeader>
          <CardTitle>Challenge not found</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/challenges')}>
            Back to Challenges
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <Appbar loc="manageChallenge" />
        <main className="container mx-auto p-4">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <Link href="/dashboard" className="flex items-center hover:text-primary transition-colors">
                  <Home className="h-3 w-3 mr-1" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4" />
              </li>
              <li>
                <span className="font-medium text-gray-900" aria-current="page">
                  {challenge.title}
                </span>
              </li>
            </ol>
          </nav>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-3xl font-bold">{challenge.title}</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="lg"
                        className="flex items-center px-2 space-x-2 bg-primary text-primary-foreground hover:text-white hover:bg-primary/90"
                        onClick={copyJoinCode}
                      >
                        <span className="font-semibold">Join Code:</span>
                        <span className="text-lg">{challenge.joinCode}</span>
                        <Copy className="h-4 w-4 ml-2" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={5}>
                      <p>{copied ? 'Copied!' : 'Click to copy join code'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription className='pt-2'>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <Badge variant="secondary" className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {challenge.duration > 1 ? `${challenge.duration} minutes` : `${challenge.duration} minute`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="questions">Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{challenge.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="questions">
              <Card>
                <CardHeader>
                  <CardTitle>Challenge Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {challenge.questions.map((question, index) => (
                      <AccordionItem key={question.id} value={question.id}>
                        <AccordionTrigger>
                          <span className="font-medium">
                            Question {index + 1}: {question.title}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="mt-2">{question.problemStatement}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {sortedParticipants.length > 0 ? (
                  sortedParticipants.map((participant) => (
                    <li key={participant.id} className="mb-2">
                      {participant.name} - Joined at {new Date(participant.joinedAt).toLocaleTimeString()}
                    </li>
                  ))
                ) : (
                  <p>No participants yet.</p>
                )}
              </ul>
            </CardContent>
          </Card>

          <Toaster />
        </main>
      </div>
  )
}