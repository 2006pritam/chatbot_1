"use client"

import { useEffect, useState } from "react"
import PortfolioAssistant from "@/components/portfolio-assistant"

type PortfolioItem = {
  title: string
  description: string
  tags: string[]
  imageUrl: string
}

export default function EmbedPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])

  useEffect(() => {
    // Listen for new portfolio items from the assistant
    const handleNewProject = (event: any) => {
      setPortfolioItems((prev) => [...prev, event.detail])
    }

    window.addEventListener("newPortfolioProject", handleNewProject)

    return () => {
      window.removeEventListener("newPortfolioProject", handleNewProject)
    }
  }, [])

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-2xl font-bold text-white mb-6">Portfolio Assistant Embed</h1>
      <p className="text-gray-300 mb-8 max-w-md text-center">
        This assistant can be embedded in your existing portfolio website to easily add new projects.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
        <div className="flex-1">
          <PortfolioAssistant />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-4">Added Projects</h2>
          <div className="space-y-4">
            {portfolioItems.length === 0 ? (
              <p className="text-gray-400">No projects added yet. Use the assistant to add some!</p>
            ) : (
              portfolioItems.map((item, index) => (
                <div key={index} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
                  <h3 className="text-lg font-semibold text-amber-400">{item.title}</h3>
                  <p className="text-gray-300 my-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-400/10 text-amber-400 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-lg text-center">
        <h2 className="text-xl font-bold text-white mb-4">How to Embed</h2>
        <div className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm text-left">
          <p className="mb-2">Add this component to your existing portfolio:</p>
          <pre className="bg-gray-800 p-3 rounded overflow-x-auto">
            {`<div id="portfolio-assistant-container">
  <PortfolioAssistant />
</div>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

