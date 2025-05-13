import { api } from "./api"

interface Insight {
  id: string
  documentId: string
  title: string
  content: string
  type: "summary" | "cause" | "parties" | "action"
}

export const InsightsService = {
  getByDocumentId: async (documentId: string): Promise<Insight[]> => {
    const response = await api.get(`/insights/document/${documentId}`)
    return response.data
  },

  getAll: async (): Promise<Insight[]> => {
    const response = await api.get("/insights")
    return response.data
  },
}
