"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquareText, Lightbulb } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DadJokeGenerator() {
  const [joke, setJoke] = useState<string | null>(null);
  const [yesterdayJoke, setYesterdayJoke] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [hasInitialJoke, setHasInitialJoke] = useState(false);
  const [progress, setProgress] = useState(0);
  const [displayedJoke, setDisplayedJoke] = useState("");
  const [showJoke, setShowJoke] = useState(false);
  const [showYesterdayJokeDisplay, setShowYesterdayJokeDisplay] =
    useState(false);

  // new states for explanation
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  useEffect(() => {
    const loadInitialJokes = async () => {
      setIsLoadingInitial(true);
      try {
        const response = await fetch(`/api/jokes/purple`);
        if (!response.ok)
          throw new Error(
            `Failed to fetch initial jokes: ${response.statusText}`
          );
        const data = await response.json();

        if (data.currentJoke) {
          setJoke(data.currentJoke);
          setHasInitialJoke(true);
        }
        setYesterdayJoke(data.currentJoke);
      } catch (error) {
        console.error("Error loading initial jokes:", error);
        setJoke("Oops! Couldn't load today's joke.");
        setYesterdayJoke("Could not load yesterday's joke either.");
        setHasInitialJoke(true);
      } finally {
        setIsLoadingInitial(false);
      }
    };
    loadInitialJokes();
  }, []);

  useEffect(() => {
    if (joke && showJoke && !isLoading) {
      setDisplayedJoke("");
      const currentJoke = joke;
      let i = 0;
      let typewriterInterval: NodeJS.Timeout;
      setDisplayedJoke(currentJoke.charAt(i));
      const timer = setTimeout(() => {
        typewriterInterval = setInterval(() => {
          if (i < currentJoke.length) {
            setDisplayedJoke((prev) => prev + currentJoke.charAt(i));
            i++;
          } else {
            clearInterval(typewriterInterval);
          }
        }, 50);
      }, 500);
      return () => {
        clearTimeout(timer);
        clearInterval(typewriterInterval);
      };
    }
  }, [joke, showJoke, isLoading]);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const fetchDadJoke = async () => {
    setIsLoading(true);
    setShowJoke(false);
    setExplanation(null);

    const currentJokeBecomesYesterday = joke;

    try {
      const response = await fetch(`/api/jokes/purple/new`, { method: "POST" });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to fetch new joke and parse error" }));
        throw new Error(
          errorData.error || `Failed to fetch new joke: ${response.statusText}`
        );
      }
      const data = await response.json();
      setYesterdayJoke(currentJokeBecomesYesterday);
      setJoke(data.currentJoke);
      setHasInitialJoke(true);
      setShowJoke(true);
    } catch (error) {
      console.error("Error fetching new dad joke:", error);
      setJoke(`Oops! ${error.message || "Couldn't fetch a new joke."}`);
      setHasInitialJoke(true);
      setShowJoke(true);
    } finally {
      setIsLoading(false);
    }
  };

  const explainJoke = async () => {
    if (!joke) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joke }),
      });
      if (!response.ok) throw new Error("Failed to explain joke");
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Error explaining joke:", error);
      setExplanation("Oops! Couldn't explain this one.");
    } finally {
      setIsExplaining(false);
    }
  };

  const toggleYesterdayJokeDisplay = () =>
    setShowYesterdayJokeDisplay((prev) => !prev);

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto" />
          <p className="text-purple-700 mt-4 text-lg">
            Loading jokes for Team Purple...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="w-full max-w-xl">
        <Card className="border-purple-300 shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">
              Purple Finch's Dad Joke of the Day
            </CardTitle>
            <CardDescription className="text-purple-100 text-center">
              Get ready to laugh (or groan)!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-2">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4 text-purple-800">
                Good morning team!
              </h2>
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
                    <p className="text-purple-600 font-medium">
                      Preparing a dad-tastic joke...
                    </p>
                    <Progress
                      value={progress}
                      className="h-2 w-full bg-purple-200"
                      indicatorClassName="bg-purple-600"
                    />
                    <p className="text-xs text-purple-400">
                      {Math.round(progress)}% loaded
                    </p>
                  </div>
                ) : showJoke && joke ? (
                  <div className="animate-fadeIn">
                    <p className="text-purple-900 font-medium leading-relaxed">
                      {displayedJoke}
                      {displayedJoke.length < joke.length && (
                        <span className="animate-pulse inline-block ml-0.5 w-2 h-4 bg-purple-400"></span>
                      )}
                    </p>
                    {displayedJoke.length === joke.length &&
                      joke.length > 0 && (
                        <div className="absolute -bottom-6 -right-6 h-12 w-12 bg-purple-100 rounded-full opacity-20 animate-ping"></div>
                      )}
                  </div>
                ) : (
                  <p className="text-purple-500 italic">
                    {hasInitialJoke
                      ? "Your dad joke is ready! Click the button below to reveal it."
                      : "Click the button below to get a dad joke!"}
                  </p>
                )}
              </div>
            </div>

            {explanation && (
              <div className="mt-6 pt-4 border-t border-purple-200 animate-fadeIn">
                <h3 className="text-lg font-semibold text-purple-700 mb-3 text-center flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" /> Joke
                  Explained
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-center shadow-inner">
                  <p className="text-yellow-800 leading-relaxed">
                    {explanation}
                  </p>
                </div>
              </div>
            )}

            {showYesterdayJokeDisplay && yesterdayJoke && (
              <div className="mt-6 pt-4 border-t border-purple-200 animate-fadeIn">
                <h3 className="text-lg font-semibold text-purple-700 mb-3 text-center">
                  Ah, Yesterday's Joke...
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center shadow-inner">
                  <p className="text-purple-800 italic leading-relaxed">
                    {yesterdayJoke}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className=" sm:flex-row justify-center items-center pb-6 pt-4 space-y-3 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={fetchDadJoke}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 w-full sm:w-auto text-sm"
              disabled={isLoading || isLoadingInitial}
            >
              {isLoading
                ? "Drumroll please..."
                : showJoke
                ? "Get New Joke"
                : hasInitialJoke
                ? "Reveal Today's Joke"
                : "Get Today's Joke"}
            </Button>

            {showJoke && joke && (
              <Button
                onClick={explainJoke}
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transform transition-all w-full sm:w-auto text-sm"
                disabled={isExplaining}
              >
                {isExplaining ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                    Explaining...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" /> Explain Joke
                  </span>
                )}
              </Button>
            )}

            {yesterdayJoke && (
              <Button
                onClick={toggleYesterdayJokeDisplay}
                variant="outline"
                className="border-purple-500 text-purple-600 hover:bg-purple-100 hover:text-purple-700 px-4 py-2.5 rounded-full shadow-sm hover:shadow-md transform transition-all w-full sm:w-auto text-sm"
                disabled={isLoadingInitial}
              >
                <MessageSquareText className="mr-2 h-4 w-4" />
                {showYesterdayJokeDisplay
                  ? "Hide Yesterday's Joke"
                  : "Recall Yesterday's Joke"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
