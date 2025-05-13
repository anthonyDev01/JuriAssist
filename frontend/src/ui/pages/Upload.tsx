"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs";
import {
    UploadIcon,
    X,
    type File,
    FileText,
    FileIcon as FilePdf,
    FileCode,
    Trash2,
    RefreshCw,
    AlertCircle,
} from "lucide-react";
import { toast } from "../components/ui/use-toast";
import {
    api,
    getAuthorizationFormData,
    getAuthorization,
} from "../../core/service/api";
import { ActivityService } from "../../core/service/activity.service";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
import useAuth from "../../core/hooks/useAuth";

interface FileWithPreview extends File {
    preview?: string;
}

interface SavedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
}

const UploadPage = () => {
    const { userId } = useAuth();

    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<SavedFile | null>(null);
    const [activeTab, setActiveTab] = useState("upload");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (activeTab === "saved") {
            fetchSavedFiles();
        }
    }, [activeTab]);

    const fetchSavedFiles = async () => {
        if (!userId) return;

        setIsLoading(true);

        api.get(`/rag/collection/${userId}`, getAuthorization())
            .then((response) => {
                const data = response.data.files;

                const fileData = data.map((file: any) => ({
                    id: file.id,
                    name: file.source,
                    type: file.type,
                    size: formatFileSize(file.size),
                    uploadedAt: new Date(),
                }));

                setSavedFiles(fileData);
            })
            .catch(() => {
                toast({
                    title: "Erro ao carregar arquivos",
                    description:
                        "Não foi possível carregar seus arquivos salvos",
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (newFiles: File[]) => {
        const validFiles = newFiles.filter(
            (file) =>
                file.type === "application/pdf" ||
                file.type === "application/msword" ||
                file.type ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        if (validFiles.length !== newFiles.length) {
            toast({
                title: "Formato inválido",
                description: "Apenas arquivos PDF e Word são aceitos",
                variant: "destructive",
            });
        }

        setFiles((prev) => [...prev, ...validFiles]);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            toast({
                title: "Nenhum arquivo selecionado",
                description:
                    "Por favor, selecione pelo menos um arquivo para upload",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("files", file);
            });

            await api.post(
                "/rag/upload-documents",
                formData,
                getAuthorizationFormData()
            );

            toast({
                title: "Upload concluído",
                description: `${files.length} arquivo(s) enviado(s) com sucesso`,
            });

            files.forEach((file) => {
                ActivityService.saveActivity(
                    "upload",
                    "Upload de documento",
                    file.name
                );
            });

            setFiles([]);
            setActiveTab("saved");
        } catch (error) {
            toast({
                title: "Erro no upload",
                description: "Não foi possível enviar os arquivos",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const confirmDeleteFile = (file: SavedFile) => {
        setFileToDelete(file);
    };

    const handleDeleteFile = async () => {
        if (!fileToDelete || !userId) return;

        setIsDeleting(true);

        api.delete(
            `/rag/collection/${userId}/?fileName=${fileToDelete.name}`,
            getAuthorization()
        )
            .then(() => {
                toast({
                    title: "Arquivo excluído",
                    description: "O arquivo foi excluído com sucesso",
                });

                ActivityService.saveActivity(
                    "delete",
                    "Exclusão de documento",
                    fileToDelete.name
                );

                setSavedFiles((prev) =>
                    prev.filter((file) => file.id !== fileToDelete.id)
                );
            })
            .catch((err) => {
                console.log(err);

                toast({
                    title: "Erro ao excluir",
                    description: "Não foi possível excluir o arquivo",
                    variant: "destructive",
                });
            })
            .finally(() => {
                setIsDeleting(false);
                setFileToDelete(null);
            });
    };

    const getFileIcon = (fileType: string) => {
        if (fileType === "application/pdf" || fileType === "pdf") {
            return <FilePdf className="h-5 w-5 text-red-400" />;
        } else if (
            fileType === "application/msword" ||
            fileType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileType === "doc" ||
            fileType === "docx"
        ) {
            return <FileText className="h-5 w-5 text-blue-400" />;
        } else {
            return <FileCode className="h-5 w-5 text-purple-400" />;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
        else return (bytes / 1048576).toFixed(2) + " MB";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div className="mb-4 md:mb-6">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                    Upload de Documentos
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    Faça upload dos seus documentos jurídicos para análise
                </p>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="saved">Arquivos Salvos</TabsTrigger>
                </TabsList>

                <TabsContent value="upload">
                    <Card className="border-0 bg-secondary/20">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Selecione os arquivos
                            </CardTitle>
                            <CardDescription>
                                Arraste e solte arquivos ou clique para
                                selecionar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div
                                className={`upload-area rounded-lg p-12 text-center cursor-pointer transition-colors ${
                                    isDragging ? "dragging" : ""
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="rounded-full bg-purple-600/20 p-4">
                                        <UploadIcon className="h-8 w-8 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium">
                                            Arraste e solte arquivos aqui
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ou clique para selecionar arquivos
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Suporta arquivos PDF e Word (DOC,
                                            DOCX)
                                        </p>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {files.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Arquivos selecionados
                                    </h3>
                                    <div className="space-y-2">
                                        {files.map((file, index) => (
                                            <div
                                                key={`${file.name}-${index}`}
                                                className="file-item flex items-center justify-between p-3 rounded-md bg-secondary/50"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {getFileIcon(file.type)}
                                                    <div>
                                                        <p className="font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                                                            {file.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(
                                                                file.size /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    disabled={isUploading}
                                                >
                                                    <X className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Remover arquivo
                                                    </span>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setFiles([])}
                                disabled={files.length === 0 || isUploading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleUpload}
                                disabled={files.length === 0 || isUploading}
                                className="bg-purple-600 hover:bg-purple-700"
                            >
                                {isUploading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    "Enviar"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="saved">
                    <Card className="border-0 bg-secondary/20">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl">
                                        Arquivos Salvos
                                    </CardTitle>
                                    <CardDescription>
                                        Documentos que você já enviou para
                                        análise
                                    </CardDescription>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={fetchSavedFiles}
                                    disabled={isLoading}
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${
                                            isLoading ? "animate-spin" : ""
                                        }`}
                                    />
                                    <span className="sr-only">Atualizar</span>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-3">
                                    <Skeleton height={60} />
                                    <Skeleton height={60} />
                                    <Skeleton height={60} />
                                </div>
                            ) : savedFiles.length > 0 ? (
                                <div className="space-y-3">
                                    {savedFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="file-item flex items-center justify-between p-3 rounded-md bg-secondary/50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                {getFileIcon(file.type)}
                                                <div>
                                                    <p className="font-medium truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                                                        {file.name}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row sm:gap-2 text-xs text-muted-foreground">
                                                        <span>
                                                            {formatFileSize(
                                                                file.size
                                                            )}
                                                        </span>
                                                        <span className="hidden sm:inline">
                                                            •
                                                        </span>
                                                        <span>
                                                            {formatDate(
                                                                file.uploadedAt
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    confirmDeleteFile(file)
                                                }
                                                className="text-red-400 hover:text-red-600 hover:bg-red-100/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Excluir arquivo
                                                </span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/30">
                                        <AlertCircle className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium">
                                        Nenhum arquivo encontrado
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Você ainda não enviou nenhum documento
                                        para análise.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-6"
                                        onClick={() => setActiveTab("upload")}
                                    >
                                        Fazer upload de documentos
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog
                open={!!fileToDelete}
                onOpenChange={(open) => !open && setFileToDelete(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir o arquivo "
                            {fileToDelete?.name}"? Esta ação não pode ser
                            desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteFile}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            {isDeleting ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                </>
                            ) : (
                                "Excluir"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UploadPage;
