import { Router, Express } from "express";
import { requestBodyValidator } from "../middlewares/request-body-validator";
import { chatRagSchema } from "../schemas/chat-schema";
import * as ragService from "../services/ragService";
import { uploadFiles } from "../services/fileService";
import multer from "multer";
import * as qdrantService from "../services/qdrantService";
import verifyAuthentication from "../middlewares/auth-middleware";
import { insightRagSchema } from "../schemas/insightSchema";

export default function ragController(app: Express) {
    const router = Router();
    router.use(verifyAuthentication);
    const upload = multer({ storage: multer.memoryStorage() });

    router.post(
        "/chat",
        requestBodyValidator(chatRagSchema),
        async (req, res, next) => {
            try {
                const { message } = req.body;
                const userId = req.userId;

                const answer = await ragService.generateResponse(
                    message,
                    userId
                );
                res.status(200).json({ message: answer });
            } catch (error: any) {
                next(error);
            }
        }
    );

    router.post(
        "/insight",
        requestBodyValidator(insightRagSchema),
        async (req, res, next) => {
            try {
                const { insight } = req.body;
                const userId = req.userId;

                const answer = await ragService.generateInsght(insight, userId);
                res.status(200).json({ insight: answer });
            } catch (error: any) {
                next(error);
            }
        }
    );

    router.post(
        "/upload-documents/",
        upload.array("files"),
        async (req, res, next) => {
            try {
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
                next(error);
            }
        }
    );

    router.get("/collection/:collectionName", async (req, res) => {
        try {
            const collectionName = req.params.collectionName;
            const files = await qdrantService.getSavedFiles(collectionName);

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
            const fileName = req.query.fileName?.toString();
            await qdrantService.deleteByFileName(collectionName, fileName!);

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
