"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Message = {
  role: "user" | "bot"
  content: string
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hi there! I'm your AI assistant created by Dr. Pritam Kumar Modak. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      // Send the entire message history to maintain context
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to get response")
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: data.response,
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[360px] h-[480px] flex flex-col bg-[#0f1117] border-[#1a1d27] text-white shadow-xl">
      <CardHeader className="border-b border-[#1a1d27] py-4">
        <CardTitle className="flex items-center gap-2 text-amber-400">
          <MessageSquare className="w-5 h-5" />
          <span>Pritam's Assistant</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg p-3 ${
                message.role === "user"
                  ? "ml-auto bg-amber-400 text-black max-w-[280px]"
                  : "bg-[#1a1d27] text-white max-w-[280px]"
              }`}
            >
              <div className="text-sm">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="bg-[#1a1d27] text-white max-w-[280px] rounded-lg p-3">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
          {error && <div className="text-xs text-red-400 p-2">Error: {error}</div>}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-[#1a1d27] border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-amber-400"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="bg-amber-400 hover:bg-amber-500 text-black rounded-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

