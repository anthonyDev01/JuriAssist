import "dotenv/config";
import ollama from "ollama";
import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const modelEmbeddingName = process.env.OLLAMA_EMBEDDING_NAME;
const modelName = process.env.OLLAMA_MODEL_NAME;

export async function generateEmbedding(ask: string): Promise<number[]> {
    try {
        const response = await ollama.embeddings({
            model: "mxbai-embed-large",
            prompt: ask,
        });

        return response.embedding;
    } catch (err: any) {
        console.log("Error generating embeddings", err);
        throw new Error("Error generating embeddings");
    }
}

export function getEmbeddings(): OllamaEmbeddings {
    return new OllamaEmbeddings({
        model: modelEmbeddingName,
    });
}

export function getModel(): ChatOllama {
    return new ChatOllama({ model: modelName });
}

export function spliter(): RecursiveCharacterTextSplitter {
    return new RecursiveCharacterTextSplitter({
        chunkSize: 512,
        chunkOverlap: 50,
    });
}
