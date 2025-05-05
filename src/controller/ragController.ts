import { Request, Response, Router, Express } from "express";
import { requestBodyValidator } from "../middlewares/request-body-validator";
import { chatRagSchema } from "../schemas/chat-schema";
import {
    createCollectionToQdrant,
    generateResponse,
} from "../services/ragService";
import { uploadFiles } from "../services/fileService";
import multer from "multer";
import {
    createCollection,
    deleteByFileName,
    getSavedFiles,
} from "../services/qdrantService";
import verifyAuthentication from "../middlewares/auth-middleware";

export default function ragController(app: Express) {
    const router = Router();
    router.use(verifyAuthentication);
    const upload: multer.Multer = multer({ dest: "uploads/" });

    router.post(
        "/chat",
        requestBodyValidator(chatRagSchema),
        async (req, res) => {
            try {
                const { message } = req.body;
                const userId = req.userId;

                const answer = await generateResponse(message, userId);
                res.status(200).json({ message: answer });
            } catch (error: any) {
                if (error.message === "Assistant not found") {
                    res.status(409).json({ error: error.message });
                    return;
                }

                if (error.message == "This assistant is no longer available") {
                    res.status(404).json({ error: error.message });
                    return;
                }

                res.status(500).json({ error: "Internal server error" });
            }
        }
    );

    router.post(
        "/upload-documents/",
        upload.array("files"),
        async (req: Request, res: Response) => {
            try {
                if (
                    !req.files ||
                    (req.files as Express.Multer.File[]).length === 0
                ) {
                    res.status(400).send({ message: "No files uploaded." });
                    return;
                }

                const userId = req.userId;

                const filePaths = await uploadFiles(
                    req.files as Express.Multer.File[],
                    userId
                );

                res.status(200).json({
                    message: "Files saved!",
                    files: filePaths,
                });
            } catch (error: any) {
                if (
                    error.message &&
                    error.message.includes("Unsupported extension")
                ) {
                    res.status(400).json({ error: error.message });
                    return;
                }

                if (error.message === "Assistant not found") {
                    res.status(409).json({ error: error.message });
                    return;
                }

                if (error.message == "This assistant is no longer available") {
                    res.status(404).json({ error: error.message });
                    return;
                }

                res.status(500).json({ error: "Internal server error" });
            }
        }
    );

    router.post("/create-collection", async (req, res) => {
        try {
            const { collectionName, model } = req.body;
            await createCollectionToQdrant(collectionName);
            res.status(200).json({
                message: "Collection created successfully",
            });
        } catch (error: any) {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/collection/:collectionName", async (req, res) => {
        try {
            const collectionName = req.params.collectionName;
            const files = await getSavedFiles(collectionName);

            res.status(200).json({
                files: Array.from(files),
            });
        } catch (error) {
            console.log(error);

            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.delete("/collection/:collectionName", async (req, res) => {
        try {
            const { collectionName } = req.params;
            const { fileName } = req.body;
            await deleteByFileName(collectionName, fileName);

            res.status(200).json({
                message: `Document with filename "${fileName}" deleted successfully.`,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Failed to delete the document." });
        }
    });

    app.use("/api/rag", router);
}
