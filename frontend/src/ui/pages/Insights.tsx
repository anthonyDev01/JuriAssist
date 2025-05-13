import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Skeleton from "react-loading-skeleton";
import { api, getAuthorization } from "../../core/service/api";

const documentInsights = [
    {
        id: "1",
        title: "Resumo Simplificado",
        content:
            "Acompanhe um panorama geral e objetivo do andamento dos seus processos jurídicos.",
        fullContent: ``,
    },
    {
        id: "2",
        title: "Causa ou Motivo",
        content:
            "Entenda o que originou o processo e os principais fundamentos legais envolvidos.",
        fullContent: ``,
    },
    {
        id: "3",
        title: "Partes Envolvidas",
        content:
            "Veja quem são os participantes do processo, como autores, réus e advogados.",
        fullContent: ``,
    },
    {
        id: "4",
        title: "O Que Você Deve Fazer?",
        content:
            "Saiba quais são as próximas ações esperadas de você e os prazos importantes.",
        fullContent: ``,
    },
];

const Insights = () => {
    const [selectedInsight, setSelectedInsight] = useState<
        (typeof documentInsights)[0] | null
    >(null);
    const [isLoading, setIsLoading] = useState(false);

    const openModal = (insight: (typeof documentInsights)[0]) => {
        setIsLoading(true);

        const body = {
            insight: insight.title,
        };

        api.post("/rag/insight", JSON.stringify(body), getAuthorization()).then(
            (response) => {
                const updatedInsight = {
                    ...insight,
                    fullContent: response.data.insight,
                };

                setSelectedInsight(updatedInsight);
                setIsLoading(false);
            }
        );
    };

    const closeModal = () => {
        setSelectedInsight(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                    Insights dos Documentos
                </h1>
                <p className="text-muted-foreground">
                    Análise e insights gerados a partir dos seus documentos
                    jurídicos.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {documentInsights.map((insight) => (
                    <Card
                        key={insight.id}
                        className="insight-card border-0 bg-secondary/20"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {insight.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="line-clamp-3">{insight.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => openModal(insight)}
                            >
                                Visualizar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {selectedInsight && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div
                        className="modal-content bg-card border border-border shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {selectedInsight.title}
                            </h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeModal}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="markdown-content">
                            <ReactMarkdown>
                                {selectedInsight.fullContent}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="modal-overlay">
                    <div className="modal-content bg-card border border-border shadow-xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            <Skeleton width={200} />
                        </h2>
                        <div className="space-y-4">
                            <Skeleton count={4} />
                            <Skeleton height={100} />
                            <Skeleton count={3} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Insights;
