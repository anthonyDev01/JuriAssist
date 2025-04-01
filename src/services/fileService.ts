import fs from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { saveToQdrant } from "./ragService";
import { getModel, spliter } from "./ollamaService";

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function uploadFiles(
    files: Express.Multer.File[],
    model: string,
    tenantId: string
): Promise<string[]> {
    try {
        const savedFiles: string[] = [];

        for (const file of files) {
            const filePath = path.join(UPLOADS_DIR, file.originalname);
            const finalFilePath = await getUniqueFilePath(filePath);
            fs.renameSync(file.path, filePath);
            savedFiles.push(finalFilePath);

            try {
                await saveToQdrant(filePath, model, tenantId);
            } catch (error: any) {
                throw new Error(error);
            } finally {
                fs.unlinkSync(filePath);
                console.log(`File ${file.path} deleted successfully.`);
            }
        }

        return savedFiles;
    } catch (error: any) {
        throw error;
    }
}

export async function extractTextFromFile(filePath: string, modelName: string) {
    const splitter = spliter();
    if (!splitter) throw new Error("Splitter not defined.");

    const loader = new DirectoryLoader(UPLOADS_DIR, {
        ".c": (path) => new TextLoader(path),
        ".cs": (path) => new TextLoader(path),
        ".cpp": (path) => new TextLoader(path),
        ".java": (path) => new TextLoader(path),
        ".js": (path) => new TextLoader(path),
        ".ts": (path) => new TextLoader(path),
        ".php": (path) => new TextLoader(path),
        ".py": (path) => new TextLoader(path),
        ".rb": (path) => new TextLoader(path),
        ".sh": (path) => new TextLoader(path),
        ".html": (path) => new TextLoader(path),
        ".css": (path) => new TextLoader(path),
        ".md": (path) => new TextLoader(path),
        ".txt": (path) => new TextLoader(path),
        ".json": (path) => new JSONLoader(path),
        ".pdf": (path) => new PDFLoader(path),
        ".docx": (path) => new DocxLoader(path),
        ".csv": (path) => new CSVLoader(path),
    });

    const allowedExtensions = Object.keys(loader.loaders);
    const fileExtension = path.extname(filePath);

    if (!allowedExtensions.includes(fileExtension)) {
        throw Error(`Unsupported extension ${fileExtension}`);
    }

    const rawDocs = await loader.load();
    const documents = await splitter.splitDocuments(rawDocs);
    console.log(`Total parts stored: ${documents.length}`);

    return documents;
}

export async function getUniqueFilePath(filePath: string): Promise<string> {
    let uniqueFilePath = filePath;
    let count = 1;

    while (fs.existsSync(uniqueFilePath)) {
        const extname = path.extname(filePath);
        const basename = path.basename(filePath, extname);
        uniqueFilePath = path.join(
            UPLOADS_DIR,
            `${basename} (${count})${extname}`
        );
        count++;
    }

    return uniqueFilePath;
}
