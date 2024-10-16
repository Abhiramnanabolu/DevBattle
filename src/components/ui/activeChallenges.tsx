'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Clock, Code, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Appbar from '@/components/ui/appbar'

interface Challenge {
  id: string
  title: string
  description: string
  duration: number
}

export default function ActiveChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/getChallenges?type=active')
        if (!response.ok) {
          throw new Error('Failed to fetch challenges')
        }
        const data = await response.json()
        setChallenges(data.challenges)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-64 mb-4" />
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
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
        ))}
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
          <p className="text-red-600">{error}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto p-4">
        

        <h1 className="text-2xl font-bold mb-6">Active Challenges</h1>
        
        {challenges.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center h-64">
              <Code className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-600">No active challenges available.</p>
              <Button onClick={() => router.push('/create-challenge')} className="mt-4">
                Create a Challenge
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map(challenge => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-md">{challenge.title}</CardTitle>
                  <CardDescription className="mt-2 pt-2">{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {challenge.duration} minutes
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => router.push(`/challenge/manage/${challenge.id}`)} className="w-full">
                    View Challenge
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}