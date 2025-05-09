"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function DadJokeGenerator() {
  const [joke, setJoke] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [displayedJoke, setDisplayedJoke] = useState("")
  const [showJoke, setShowJoke] = useState(false)


  // Reset the joke display when a new joke is loaded
  useEffect(() => {
    if (joke && !isLoading) {
      setDisplayedJoke("")
      setShowJoke(true)
  
      let i = -1
      let typewriterInterval: NodeJS.Timeout
      const timer = setTimeout(() => {
        typewriterInterval = setInterval(() => {
          if (i < joke.length) {
            setDisplayedJoke((prev) => prev + joke.charAt(i))
            i++
          } else {
            clearInterval(typewriterInterval)
          }
        }, 50)
      }, 500)
  
      return () => {
        clearTimeout(timer)
        clearInterval(typewriterInterval)
      }
    }
  }, [joke, isLoading])
  

  // Progress bar animation during loading
  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 4 // Speed of progress bar
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  const fetchDadJoke = async () => {
    setIsLoading(true)
    setShowJoke(false)

    try {
      // Artificial delay for suspense (3 seconds)
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const response = await fetch("https://icanhazdadjoke.com/", {
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch joke")
      }

      const data = await response.json()
      setJoke(data.joke)
    } catch (error) {
      console.error("Error fetching dad joke:", error)
      setJoke("Oops! Couldn't fetch a joke. Dad must be napping.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="w-full max-w-md">
        <Card className="border-purple-300 shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">Purple Finch Dad Joke of the day </CardTitle>
            <CardDescription className="text-purple-100 text-center">Get ready to laugh (or groan)!</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">Good morning, team!</h2>

              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 min-h-32 flex flex-col items-center justify-center relative overflow-hidden">
                {isLoading ? (
                  <div className="space-y-4 w-full">
                    <div className="flex justify-center items-center mb-2">
                      <div className="relative">
                        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-purple-600 font-medium">Preparing a dad-tastic joke...</p>
                    <Progress
                      value={progress}
                      className="h-2 w-full bg-purple-200"
                      indicatorClassName="bg-purple-600"
                    />
                    <p className="text-xs text-purple-400">{Math.round(progress)}% loaded</p>
                  </div>
                ) : showJoke ? (
                  <div className="animate-fadeIn">
                    <p className="text-purple-900 font-medium leading-relaxed">
                      {displayedJoke}
                      {displayedJoke.length < joke.length && (
                        <span className="animate-pulse inline-block ml-0.5 w-2 h-4 bg-purple-400"></span>
                      )}
                    </p>
                    {displayedJoke.length === joke.length && (
                      <div className="absolute -bottom-6 -right-6 h-12 w-12 bg-purple-100 rounded-full opacity-20 animate-ping"></div>
                    )}
                  </div>
                ) : (
                  <p className="text-purple-500 italic">Click the button below to get a dad joke!</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pb-6 pt-4">
            <Button
              onClick={fetchDadJoke}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-2 rounded-full shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <span className="mr-2">Drumroll please...</span>
                </span>
              ) : (
                "Get Dad Joke"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
