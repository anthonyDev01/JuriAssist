import { QdrantClient } from "@qdrant/js-client-rest";

import { QdrantVectorStore } from "@langchain/qdrant";
import { EmbeddingsInterface } from "@langchain/core/embeddings";
import { VectorStoreRetrieverInput } from "@langchain/core/vectorstores";
import { Document } from "@langchain/core/documents";
import * as ollamaService from "../services/ollamaService";

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
    const documents = new Map<string, any>();
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
            const metadata = payload?.metadata?.metadata;

            if (typeof metadata === "object") {
                documents.set(metadata.source, metadata);
            }
        }

        if (!res.next_page_offset) break;
        offset = res.next_page_offset;
    }

    return Array.from(documents.values());
}

export async function fileExistsInCollection(
    collectionName: string,
    fileName: string
): Promise<boolean> {
    const searchResult = await client.scroll(collectionName, {
        limit: 1,
        filter: {
            must: [
                {
                    key: "metadata.metadata.source",
                    match: {
                        value: fileName,
                    },
                },
            ],
        },
    });

    return searchResult.points.length > 0;
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

export async function uploadFile(
    documents: Document<Record<string, any>>[],
    fileName: string,
    fileSize: number,
    type: string,
    userId: string
) {
    const embeddings = ollamaService.getEmbeddings();

    const data = documents.map((doc, index) => ({
        id: index,
        metadata: {
            id: index,
            source: fileName,
            size: fileSize,
            type,
        },
        content: doc.pageContent,
    }));

    await saveVectors(data, embeddings, userId);
}
