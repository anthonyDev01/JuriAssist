import { QdrantClient } from "@qdrant/js-client-rest";

import { QdrantVectorStore } from "@langchain/qdrant";
import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { VectorStoreRetrieverInput } from "@langchain/core/vectorstores";

const qdrantUlr = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY || "";

const client = new QdrantClient({
    host: process.env.QDRANT_HOST || "localhost",
    port: parseInt(process.env.QDRANT_PORT?.trim() || "6333"),
    apiKey: apiKey,
    https: process.env.QDRANT_HTTPS === "true",
});

export async function createCollection(
    collectionName: string,
    vectorSize: number
): Promise<void> {
    try {
        await client.createCollection(collectionName, {
            vectors: { size: vectorSize, distance: "Euclid" },
        });
        console.log(`Collection ${collectionName} created successfully.`);
    } catch (err) {
        console.error("Error creating collection:", err);
        throw err;
    }
}

export async function saveVectors(
    data: { id: number; metadata: any; content: string }[],
    embeddings: any,
    collectionName: string
) {
    try {
        await QdrantVectorStore.fromTexts(
            data.map((d) => d.content),
            data.map((d) => ({ id: d.id, metadata: d.metadata })),
            embeddings,
            {
                url: qdrantUlr,
                collectionName: collectionName,
            }
        );
        console.log("Batch successfully saved to Qdrant.");
    } catch (err) {
        console.error("Error saving in Qdrant:", err);
        throw err;
    }
}

export async function getRetriever(
    embeddings: EmbeddingsInterface,
    collectionName: string,
    options?: Partial<VectorStoreRetrieverInput<QdrantVectorStore>>
) {
    const vectorStore = await QdrantVectorStore.fromExistingCollection(
        embeddings,
        {
            url: qdrantUlr,
            collectionName: collectionName,
            apiKey: apiKey,
        }
    );

    return vectorStore.asRetriever(options);
}
