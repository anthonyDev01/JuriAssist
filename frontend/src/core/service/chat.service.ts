import { api } from "./api"

interface ChatMessage {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

export const ChatService = {
  sendMessage: async (message: string): Promise<ChatMessage> => {
    const response = await api.post("/chat", { message })
    return response.data
  },

  getHistory: async (): Promise<ChatMessage[]> => {
    const response = await api.get("/chat/history")
    return response.data
  },
}
