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
    userId: string
) {
    try {
        await QdrantVectorStore.fromTexts(
            data.map((d) => d.content),
            data.map((d) => ({ id: d.id, metadata: d.metadata })),
            embeddings,
            {
                url: qdrantUlr,
                collectionName: userId,
            }
        );
        console.log("Batch successfully saved to Qdrant.");
    } catch (err) {
        console.error("Error saving in Qdrant:", err);
        throw err;
    }
}

export async function getSavedFiles(collectionName: string) {
    const documents = new Set();
    let offset = undefined;
    const limit = 100;

    while (true) {
        const res = await client.scroll(collectionName, {
            limit,
            offset,
            with_payload: true,
        });

        for (const ponto of res.points) {
            const payload = ponto.payload as any;
            const source = payload?.metadata?.metadata?.source as string;

            if (typeof source === "string") {
                documents.add(source);
            } else {
                console.error("Fonte inválida:", source);
            }
        }

        if (!res.next_page_offset) break;
        offset = res.next_page_offset;
    }

    console.log(documents);

    return Array.from(documents);
}

export async function deleteByFileName(
    collectionName: string,
    fileName: string
) {
    const filter = {
        must: [
            {
                key: "metadata.metadata.source",
                match: {
                    value: fileName,
                },
            },
        ],
    };

    const res = await client.delete(collectionName, {
        filter,
    });

    return res;
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
