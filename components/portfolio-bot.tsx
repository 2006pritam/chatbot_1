"use client"

import { useState } from "react"
import { Bot, Send, User, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Message = {
  role: "user" | "bot"
  content: string
}

type PortfolioItem = {
  title: string
  description: string
  tags: string[]
  imageUrl: string
}

export default function PortfolioBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hi there! I'm your portfolio assistant. I can help you add new projects to your portfolio. Would you like to add a new project now?",
    },
  ])
  const [input, setInput] = useState("")
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [newProject, setNewProject] = useState<PortfolioItem>({
    title: "",
    description: "",
    tags: [],
    imageUrl: "/placeholder.svg?height=200&width=400",
  })
  const [tagInput, setTagInput] = useState("")

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simple keyword detection for adding a project
    if (
      input.toLowerCase().includes("add") &&
      (input.toLowerCase().includes("project") || input.toLowerCase().includes("portfolio"))
    ) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "Great! Let's add a new project to your portfolio. Please fill out the form below.",
          },
        ])
        setIsAddingProject(true)
      }, 500)
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "I'm here to help you add projects to your portfolio. Would you like to add a new project?",
          },
        ])
      }, 500)
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) return
    setNewProject((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }))
    setTagInput("")
  }

  const removeTag = (index: number) => {
    setNewProject((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const handleSubmitProject = () => {
    if (!newProject.title || !newProject.description) return

    // In a real app, you would save this to a database
    // For this demo, we'll just add it to the DOM
    const portfolioContainer = document.getElementById("portfolio-items")

    if (portfolioContainer) {
      const projectElement = document.createElement("div")
      projectElement.className = "rounded-lg border border-gray-800 bg-gray-900 shadow-lg overflow-hidden"
      projectElement.innerHTML = `
        <div class="h-48 bg-gray-800 relative">
          <img src="${newProject.imageUrl}" alt="${newProject.title}" class="object-cover w-full h-full" />
        </div>
        <div class="p-6 space-y-4">
          <h3 class="text-xl font-semibold text-amber-400">${newProject.title}</h3>
          <p class="text-gray-300">${newProject.description}</p>
          <div class="flex flex-wrap gap-2">
            ${newProject.tags
              .map((tag) => `<span class="px-2 py-1 bg-amber-400/10 text-amber-400 text-xs rounded-full">${tag}</span>`)
              .join("")}
          </div>
        </div>
      `
      portfolioContainer.appendChild(projectElement)
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: `Great! I've added "${newProject.title}" to your portfolio. Would you like to add another project?`,
      },
    ])

    setIsAddingProject(false)
    setNewProject({
      title: "",
      description: "",
      tags: [],
      imageUrl: "/placeholder.svg?height=200&width=400",
    })
  }

  return (
    <Card className="h-full flex flex-col bg-gray-900 border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center gap-2 text-amber-400">
          <Bot size={20} />
          Portfolio Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto pt-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 rounded-lg p-3 ${
                message.role === "user" ? "ml-auto bg-amber-400 text-black" : "bg-gray-800 text-white"
              }`}
            >
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-black text-white" : "bg-amber-400 text-black"
                }`}
              >
                {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className="text-sm">{message.content}</div>
            </div>
          ))}
        </div>

        {isAddingProject && (
          <div className="mt-6 border border-gray-800 rounded-lg p-4 bg-gray-900">
            <h3 className="font-medium mb-4 text-amber-400">Add New Project</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-title" className="text-white">
                  Project Title
                </Label>
                <Input
                  id="project-title"
                  value={newProject.title}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="E.g., Personal Blog"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="project-description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="project-description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project..."
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="project-image" className="text-white">
                  Project Image URL (optional)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="project-image"
                    value={newProject.imageUrl}
                    onChange={(e) => setNewProject((prev) => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button type="button" variant="outline" className="border-gray-700 text-white">
                    <Upload size={16} className="mr-2" /> Upload
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="project-tags" className="text-white">
                  Technologies Used
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="project-tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="E.g., React"
                    className="bg-gray-800 border-gray-700 text-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800"
                  >
                    Add
                  </Button>
                </div>

                {newProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProject.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-amber-400/10 text-amber-400 text-xs rounded-full flex items-center gap-1"
                      >
                        {tag}
                        <button onClick={() => removeTag(index)} className="hover:text-red-400">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleSubmitProject}
                disabled={!newProject.title || !newProject.description}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black"
              >
                Add to Portfolio
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-800">
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
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button type="submit" size="icon" className="bg-amber-400 hover:bg-amber-500 text-black">
            <Send size={16} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

