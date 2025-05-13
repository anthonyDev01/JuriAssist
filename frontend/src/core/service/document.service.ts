import { api } from "./api"
import type { Document } from "../models/document"

export const DocumentService = {
  getAll: async (): Promise<Document[]> => {
    const response = await api.get("/documents")
    return response.data
  },

  getById: async (id: string): Promise<Document> => {
    const response = await api.get(`/documents/${id}`)
    return response.data
  },

  upload: async (files: File[]): Promise<Document[]> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`)
  },
}
