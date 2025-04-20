import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

// Updated model name to the latest version
const MODEL_NAME = "gemini-1.5-flash"

// Developer information to include in responses
const DEVELOPER_INFO = {
  name: "Dr. Pritam Kumar Modak",
  phone: "9064662830",
  email: "modakpritam06@gmail.com",
  address: "Puratan hat, Kalna, West Bengal, 713434",
}

// Keywords that might indicate the user is asking about the developer
const DEVELOPER_KEYWORDS = [
  "who made you",
  "who created you",
  "who developed you",
  "who built you",
  "developer",
  "creator",
  "author",
  "owner",
  "pritam",
  "modak",
  "contact",
  "phone",
  "email",
  "address",
  "personal details",
]

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get the latest user message
    const userMessage = messages[messages.length - 1].content

    // Check if the user is asking about the developer
    const isAskingAboutDeveloper = DEVELOPER_KEYWORDS.some((keyword) => userMessage.toLowerCase().includes(keyword))

    if (isAskingAboutDeveloper) {
      // Return developer information directly without calling the API
      return NextResponse.json({
        response: `This chatbot was developed by ${DEVELOPER_INFO.name}.\n\nContact Information:\nPhone: ${DEVELOPER_INFO.phone}\nEmail: ${DEVELOPER_INFO.email}\nAddress: ${DEVELOPER_INFO.address}`,
      })
    }

    // Initialize the Gemini model with the correct name
    const model = genAI.getGenerativeModel({ model: MODEL_NAME })

    // First, let's extract just the conversation without the latest user message
    const conversationHistory = messages.slice(0, -1)

    // Format the entire conversation as a single prompt
    let prompt = ""

    // If we have previous messages, format them as a conversation
    if (conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        const role = msg.role === "user" ? "User" : "Assistant"
        prompt += `${role}: ${msg.content}\n\n`
      })
    }

    // Add the current user message
    prompt += `User: ${userMessage}\n\nAssistant:`

    // Generate content with the formatted prompt
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
    })

    const response = result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

