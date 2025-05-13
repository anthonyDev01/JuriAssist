import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { spliter } from "./ollamaService";
import * as qdrantService from "./qdrantService";
import { BadRequestException } from "../exceptions/badRequest";

const allowedExtensions = [
    ".c",
    ".cs",
    ".cpp",
    ".java",
    ".js",
    ".ts",
    ".php",
    ".py",
    ".rb",
    ".sh",
    ".html",
    ".css",
    ".md",
    ".txt",
    ".json",
    ".pdf",
    ".docx",
    ".csv",
];

export async function uploadFiles(
    files: Express.Multer.File[],
    userId: string
) {
    for (const file of files) {
        const exists = await qdrantService.fileExistsInCollection(
            userId,
            file.originalname
        );

        if (!exists) {
            const ext = path.extname(file.originalname);
            const type = ext.replace(".", "").toUpperCase();

            const documents = await extractTextFromBuffer(file);
            await qdrantService.uploadFile(
                documents,
                Buffer.from(file.originalname, "latin1").toString("utf8"),
                file.size,
                type,
                userId
            );
        }
    }
}

async function extractTextFromBuffer(file: Express.Multer.File) {
    const splitter = spliter();

    if (!splitter) throw new BadRequestException("Splitter not defined.");

    const loader = getLoader(
        file.buffer,
        file.mimetype,
        path.extname(file.originalname)
    );

    const rawDocs = await loader.load();

    return await splitter.splitDocuments(rawDocs);
}

function getLoader(
    fileContent: Buffer,
    fileMimeType: string,
    fileExtension: string
) {
    if (!allowedExtensions.includes(fileExtension)) {
        throw new BadRequestException(
            `Unsupported file extension: ${fileExtension}`
        );
    }

    const blob = new Blob([fileContent], { type: fileMimeType });

    switch (fileExtension) {
        case ".pdf":
            return new PDFLoader(blob);

        case ".json":
            return new JSONLoader(blob);

        case ".csv":
            return new CSVLoader(blob);

        case ".docx":
            return new DocxLoader(blob);

        default:
            return new TextLoader(blob);
    }
}
