import "dotenv/config";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { Prompts } from "../utils/prompt";
import { ChatOllama } from "@langchain/ollama";
import { AzureChatOpenAI } from "@langchain/openai";

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { Runnable } from "@langchain/core/runnables";
import { getEmbeddings, getModel } from "./ollamaService";
import { createCollection, getRetriever, saveVectors } from "./qdrantService";
import { extractTextFromFile } from "./fileService";
import { getMessagesByUserId, saveMessage } from "./messagesService";

export async function createCollectionToQdrant(collectionName: string) {
    try {
        const vectorSize = 1024;
        await createCollection(collectionName, vectorSize);
    } catch (err) {
        console.error("Error creating collection:", err);
    }
}

export async function saveToQdrant(filePath: string, userId: string) {
    try {
        const documents = await extractTextFromFile(filePath);

        console.log(`Total pieces to be stored: ${documents.length}`);

        const embeddings = getEmbeddings();

        const data = documents.map((doc, index) => ({
            id: index,
            metadata: doc.metadata || {},
            content: doc.pageContent,
        }));

        await saveVectors(data, embeddings, userId);
    } catch (err: any) {
        console.error(err);
        throw err;
    }
}

export async function generateResponse(userQuestion: string, userId: string) {
    try {
        const embeddings = getEmbeddings();

        const model = getModel();

        const retriever = await getRetriever(embeddings, userId, {
            k: 10,
        });

        const historyAwareRetriever = await getHistoryAwareRetriever(
            model,
            retriever
        );

        const context = await getContext(userQuestion, historyAwareRetriever);

        const contextualizedRagchain = await createContextualizedRagchain(
            model,
            historyAwareRetriever
        );

        saveUserMessage(userQuestion, "user", userId);

        const ragMessages = await getMessagesByUserId(userId);

        const chatHistory = convertRagMessagesToChatHistory(ragMessages);

        const response = await contextualizedRagchain.invoke({
            input: userQuestion,
            chat_history: chatHistory,
            context,
        });

        saveUserMessage(response.answer, "ia", userId);

        return response.answer;
    } catch (err: any) {
        console.error("Error:", err);
        throw err;
    }
}

async function createContextualizedRagchain(
    model: ChatOllama | AzureChatOpenAI,
    retriever: Runnable
) {
    const qaPrompt = ChatPromptTemplate.fromMessages([
        ["system", Prompts.QA_PROMPT],
        ["system", "{context}"],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
    ]);

    const questionAnswerChain = await createStuffDocumentsChain({
        llm: model,
        prompt: qaPrompt,
    });

    return await createRetrievalChain({
        retriever,
        combineDocsChain: questionAnswerChain,
    });
}

export async function getHistoryAwareRetriever(
    model: ChatOllama | AzureChatOpenAI,
    retriever: Runnable
) {
    const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
        ["system", Prompts.QA_CONTEXTUALIZE_SYSTEM_PROMPT],
        ["system", "{context}"],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
    ]);

    return await createHistoryAwareRetriever({
        llm: model,
        retriever: retriever,
        rephrasePrompt: contextualizeQPrompt,
    });
}

async function getContext(
    userQuestion: string,
    historyAwareRetriever: Runnable
) {
    const retrievedDocs = await historyAwareRetriever.invoke({
        input: userQuestion,
        chat_history: [],
    });

    return retrievedDocs.map((doc: any) => doc.pageContent).join("\n");
}

async function saveUserMessage(content: string, owner: string, userId: string) {
    saveMessage({
        content,
        owner,
        userId,
    });
}

function convertRagMessagesToChatHistory(messages: any[]) {
    return messages.map((msg) =>
        msg.owner === "user"
            ? new HumanMessage(msg.content ?? "")
            : new AIMessage(msg.content ?? "")
    );
}
