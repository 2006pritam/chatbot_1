import ChatBot from "@/components/chat-bot"

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-amber-400 mb-8">Dr. Pritam Kumar Modak's Assistant</h1>
        <ChatBot />
        <p className="text-gray-400 text-sm mt-6 text-center max-w-xs">
          This AI assistant was developed by Dr. Pritam Kumar Modak.
          <br />
          Ask about contact information for details.
        </p>
      </div>
    </div>
  )
}

