import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
    FileUp,
    MessageSquare,
    BarChart2,
    FileText,
    Clock,
    ArrowRight,
} from "lucide-react";
import useAuth from "../../core/hooks/useAuth";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { api, getAuthorization } from "../../core/service/api";
import { User } from "../../core/models/user";

const Dashboard = () => {
    const { userId } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [recentFiles, setRecentFiles] = useState<any[]>([]);
    const [user, setUser] = useState<User>();
    const [countAssistantMessages, setCountAssistantMessages] =
        useState<number>(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [hasMore, setHasMore] = useState(true);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        const fetchFiles = () => {
            api.get(`/rag/collection/${userId}`, getAuthorization())
                .then((response) => {
                    const data = response.data.files;

                    setRecentFiles((prev) => {
                        if (prev.length > 0) return prev;

                        const fileData = data.map((file: any) => ({
                            id: file.id,
                            name: file.source,
                            type: file.type,
                            size: formatFileSize(file.size),
                            uploadedAt: new Date(),
                        }));

                        return [...fileData];
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const fetchUser = () => {
            api.get(`/user`, getAuthorization())
                .then((response) => {
                    setUser(response.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        const fetchContAssistantMessages = () => {
            api.get(`/message/count-assistant`, getAuthorization())
                .then((response) => {
                    const count = response.data.count;
                    setCountAssistantMessages(count);
                })
                .catch((err) => {
                    console.log(err);
                });
        };

        fetchUser();
        fetchFiles();
        fetchContAssistantMessages();

        return () => clearInterval(timer);
    }, []);

    const fetchActivities = async (pageToLoad: number, reset = false) => {
        setIsLoadingActivities(true);
        try {
            const response = await api.get(
                `/activity?page=${pageToLoad}&limit=${limit}`,
                getAuthorization()
            );

            const now = new Date();

            const mapped = response.data.data.map((activity: any) => ({
                id: activity.id,
                type: activity.type,
                description: activity.description,
                documentName: activity.documentName,
                timestamp: new Date(activity.createdAt),
                timeAgoMinutes: Math.floor(
                    (now.getTime() - new Date(activity.createdAt).getTime()) /
                        (1000 * 60)
                ),
            }));

            if (mapped.length === 0 && pageToLoad !== 1) {
                setLimit(5);
                setPage(1);
                setHasMore(false);
                setActivities([]);
                fetchActivities(1, true);
                return;
            }

            setActivities((prev) => (reset ? mapped : [...prev, ...mapped]));

            const totalPages = response.data.totalPages;
            setHasMore(pageToLoad < totalPages);
            setPage(pageToLoad);
        } catch (error) {
            console.error("Erro ao buscar atividades:", error);
        } finally {
            setIsLoadingActivities(false);
        }
    };

    const handleLoadMore = () => {
        if (isLoadingActivities) return;

        if (hasMore) {
            const nextPage = page + 1;
            fetchActivities(nextPage);
        } else {
            setLimit(5);
            setHasMore(true);
            fetchActivities(1, true);
        }
    };

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            fetchActivities(1, true);
        }
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    function formatFileSize(bytes: number): string {
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        if (bytes === 0) return "0 Bytes";
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        const size = bytes / Math.pow(1024, i);
        return `${size.toFixed(1)} ${sizes[i]}`;
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatActivityTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins} min atrás`;
        } else if (diffHours < 24) {
            return `${diffHours}h atrás`;
        } else {
            return `${diffDays}d atrás`;
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "upload":
                return <FileUp className="h-4 w-4 text-purple-400" />;
            case "chat":
                return <MessageSquare className="h-4 w-4 text-purple-400" />;
            case "insight":
                return <BarChart2 className="h-4 w-4 text-purple-400" />;
            default:
                return <Clock className="h-4 w-4 text-purple-400" />;
        }
    };

    return (
        <div className="space-y-12 h-[80%]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                        Bem-vindo, {user?.name}
                    </h1>
                    <p className="text-muted-foreground">
                        {formatDate(currentTime)} • {formatTime(currentTime)}
                    </p>
                </div>
                <Link to="/upload">
                    <Button className="md:w-auto w-full">
                        <FileUp className="mr-2 h-4 w-4" />
                        Novo Upload
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="card-gradient card-hover border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <div className="mr-2 h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-purple-400" />
                            </div>
                            Documentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {recentFiles.length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Documentos carregados
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/upload" className="w-full">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                            >
                                Ver todos
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="card-gradient card-hover border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <div className="mr-2 h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                <MessageSquare className="h-4 w-4 text-purple-400" />
                            </div>
                            Chat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {countAssistantMessages}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Perguntas respondidas
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/chat" className="w-full">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                            >
                                Iniciar chat
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="card-gradient card-hover border-0">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-lg">
                            <div className="mr-2 h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                <BarChart2 className="h-4 w-4 text-purple-400" />
                            </div>
                            Insights
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">
                            Insights gerados
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link to="/insights" className="w-full">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                            >
                                Ver insights
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Documentos Recentes
                        </CardTitle>
                        <CardDescription>
                            Últimos documentos carregados
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentFiles.map((file) => (
                                <div
                                    key={file.id}
                                    className="file-item flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium truncate max-w-[200px]">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {file.size} • {file.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {file.uploadedAt.toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Link to="/upload" className="w-full">
                            <Button variant="outline" className="w-full">
                                Ver todos os documentos
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Atividade Recente
                        </CardTitle>
                        <CardDescription>
                            Suas últimas ações no sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoadingActivities ? (
                                <>
                                    <div className="flex items-center space-x-3">
                                        <Skeleton
                                            circle
                                            width={32}
                                            height={32}
                                        />
                                        <div className="flex-1">
                                            <Skeleton width={150} />
                                            <Skeleton width={100} />
                                        </div>
                                        <Skeleton width={60} />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Skeleton
                                            circle
                                            width={32}
                                            height={32}
                                        />
                                        <div className="flex-1">
                                            <Skeleton width={150} />
                                            <Skeleton width={100} />
                                        </div>
                                        <Skeleton width={60} />
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Skeleton
                                            circle
                                            width={32}
                                            height={32}
                                        />
                                        <div className="flex-1">
                                            <Skeleton width={150} />
                                            <Skeleton width={100} />
                                        </div>
                                        <Skeleton width={60} />
                                    </div>
                                </>
                            ) : (
                                activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-purple-600/20 flex items-center justify-center">
                                            {getActivityIcon(activity.type)}
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {activity.description}
                                            </p>
                                            {activity.documentName && (
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.documentName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="ml-auto text-xs text-muted-foreground">
                                            {formatActivityTime(
                                                activity.timestamp
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleLoadMore}
                            disabled={isLoadingActivities}
                        >
                            {hasMore ? "Carregar mais" : "Voltar ao início"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
