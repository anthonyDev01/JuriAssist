import { ChatOllama, OllamaEmbeddings } from "@langchain/ollama";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const modelEmbeddingName = process.env.OLLAMA_EMBEDDING_NAME;
const modelName = process.env.OLLAMA_MODEL_NAME;

export function getEmbeddings(): OllamaEmbeddings {
    return new OllamaEmbeddings({
        baseUrl: process.env.OLLAMA_URL,
        model: modelEmbeddingName,
    });
}

export function getModel(): ChatOllama {
    return new ChatOllama({
        baseUrl: process.env.OLLAMA_URL,
        model: modelName,
    });
}

export function spliter(): RecursiveCharacterTextSplitter {
    return new RecursiveCharacterTextSplitter({
        chunkSize: 512,
        chunkOverlap: 50,
    });
}
