import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import { toast } from "../components/ui/use-toast";
import { AssistantAvatar } from "../components/AssistantAvatar";
import Skeleton from "react-loading-skeleton";

import { api, getAuthorization } from "../../core/service/api";
import { ActivityService } from "../../core/service/activity.service";

interface Message {
    id: string;
    content: string;
    owner: "user" | "assistant";
    timestamp: Date;
}

const Chat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        api.get("/message/", getAuthorization()).then((response) => {
            const dataMessages = response.data;

            setMessages((prev) => {
                if (prev.length > 0) return prev;

                const welcomeMessage: Message = {
                    id: "welcome",
                    content:
                        "Olá! Sou o assistente jurídico do JuriAssist. Como posso ajudar você hoje?",
                    owner: "assistant",
                    timestamp: new Date(),
                };

                const loadedMessages: Message[] = dataMessages.map(
                    (message: Message) => ({
                        id: message.id,
                        content: message.content,
                        owner: message.owner,
                        timestamp: new Date(),
                    })
                );

                return [welcomeMessage, ...loadedMessages];
            });
        });
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            owner: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            console.log(isLoading);

            const data = { message: userMessage.content };
            api.post(
                "/rag/chat",
                JSON.stringify(data),
                getAuthorization()
            ).then((response) => {
                console.log(response.data);

                const assistantMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    content: response.data.message,
                    owner: "assistant",
                    timestamp: new Date(),
                };

                ActivityService.saveActivity("chat", "Chat com assistente");

                setMessages((prev) => [...prev, assistantMessage]);
                setIsLoading(false);
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível enviar a mensagem",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-3rem)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                    Chat Jurídico
                </h1>
                <p className="text-muted-foreground">
                    Converse com o assistente jurídico sobre seus documentos
                </p>
            </div>

            <Card className="flex-1 overflow-hidden flex flex-col border-0 bg-secondary/20">
                <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${
                                    message.owner === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div className="flex items-start max-w-[80%] gap-2">
                                    {message.owner === "assistant" && (
                                        <AssistantAvatar />
                                    )}
                                    <div
                                        className={`p-3 ${
                                            message.owner === "user"
                                                ? "chat-bubble-user"
                                                : "chat-bubble-assistant"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                        <p className="text-xs opacity-70 mt-1 text-right">
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex items-start max-w-[80%] gap-2">
                                    <AssistantAvatar />
                                    <div className="p-3 chat-bubble-assistant">
                                        <Skeleton
                                            className="!w-80"
                                            count={3}
                                            baseColor="#663f86"
                                            highlightColor="#c2abd4"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </CardContent>

                <div className="p-4 border-t border-border/40">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua pergunta..."
                            disabled={isLoading}
                            className="flex-1 bg-secondary/50 border-0 focus-visible:ring-purple-500"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                            <span className="sr-only">Enviar</span>
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default Chat;
