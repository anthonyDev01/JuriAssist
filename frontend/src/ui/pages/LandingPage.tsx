import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    FileText,
    MessageSquare,
    BarChart2,
    ArrowRight,
    Bot,
    Shield,
    Scale,
    Database,
    Server,
} from "lucide-react";

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col gradient-bg">
            {/* Navbar */}
            <header
                className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                    isScrolled
                        ? "bg-background/80 backdrop-blur-md shadow-md"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                            <Scale className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">JuriAssist</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6">
                        <a
                            href="#features"
                            className="text-sm font-medium hover:text-purple-400 transition-colors"
                        >
                            Recursos
                        </a>
                        <a
                            href="#how-it-works"
                            className="text-sm font-medium hover:text-purple-400 transition-colors"
                        >
                            Como Funciona
                        </a>
                        <a
                            href="#benefits"
                            className="text-sm font-medium hover:text-purple-400 transition-colors"
                        >
                            Benefícios
                        </a>
                        <a
                            href="#privacy"
                            className="text-sm font-medium hover:text-purple-400 transition-colors"
                        >
                            Privacidade
                        </a>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" className="hidden sm:flex">
                                Entrar
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button>Começar Agora</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-purple-600/10 rounded-lg transform rotate-12 animate-float"></div>
                    <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-purple-600/10 rounded-lg transform -rotate-12 animate-float-delay"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-12 h-12 bg-purple-600/10 rounded-lg transform rotate-45 animate-float-slow"></div>
                    <div className="absolute bottom-1/3 right-1/3 w-14 h-14 bg-purple-600/10 rounded-lg transform -rotate-45 animate-float-delay-slow"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Entenda seus{" "}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                                Processos Jurídicos
                            </span>{" "}
                            com facilidade
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                            Simplifique a linguagem jurídica complexa e obtenha
                            respostas claras sobre seus documentos legais com
                            nosso assistente de IA, sem precisar de um advogado.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register">
                                <Button size="lg" className="w-full sm:w-auto">
                                    Começar Gratuitamente
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                >
                                    Como Funciona
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">
                            Recursos Principais
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            O JuriAssist utiliza tecnologia avançada de IA para
                            simplificar a compreensão de documentos jurídicos
                            complexos e ajudar você a entender seus processos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-secondary/30 p-6 rounded-lg">
                            <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Análise de Documentos
                            </h3>
                            <p className="text-muted-foreground">
                                Faça upload de contratos, processos e outros
                                documentos jurídicos para análise automática e
                                obtenha explicações em linguagem simples.
                            </p>
                        </div>

                        <div className="bg-secondary/30 p-6 rounded-lg">
                            <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                                <MessageSquare className="h-6 w-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Chat Jurídico
                            </h3>
                            <p className="text-muted-foreground">
                                Converse com nosso assistente de IA para
                                esclarecer dúvidas sobre seus processos e
                                documentos em linguagem simples e acessível.
                            </p>
                        </div>

                        <div className="bg-secondary/30 p-6 rounded-lg">
                            <div className="h-12 w-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                                <BarChart2 className="h-6 w-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Insights Detalhados
                            </h3>
                            <p className="text-muted-foreground">
                                Receba resumos, análises de riscos e
                                recomendações práticas sobre seus documentos,
                                facilitando a tomada de decisões.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Section */}
            <section id="privacy" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">
                            Privacidade Total dos Seus Dados
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Diferente de outras plataformas de IA, o JuriAssist
                            utiliza modelos do Ollama executados localmente,
                            garantindo que seus dados nunca saiam do seu
                            controle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-secondary/30 p-6 rounded-lg flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                                <Server className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                IA On-Premise
                            </h3>
                            <p className="text-muted-foreground">
                                Nossa solução utiliza modelos de IA do Ollama
                                executados localmente em nossos servidores, sem
                                enviar seus dados para serviços externos como
                                OpenAI ou Claude.
                            </p>
                        </div>

                        <div className="bg-secondary/30 p-6 rounded-lg flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                                <Database className="h-8 w-8 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Seus Dados, Seu Controle
                            </h3>
                            <p className="text-muted-foreground">
                                Seus documentos jurídicos são processados com
                                total segurança e confidencialidade, sem
                                compartilhamento com terceiros ou uso para
                                treinamento de modelos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-secondary/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">
                            Como Funciona
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Em apenas três passos simples, você pode transformar
                            documentos jurídicos complexos em informações claras
                            e acionáveis.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400">
                                    1
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Faça Upload
                            </h3>
                            <p className="text-muted-foreground">
                                Carregue seus documentos jurídicos em PDF, Word
                                ou outros formatos compatíveis.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400">
                                    2
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Processamento por IA
                            </h3>
                            <p className="text-muted-foreground">
                                Nossa IA analisa o conteúdo, identifica termos
                                jurídicos e traduz para linguagem simples e
                                acessível.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="h-16 w-16 rounded-full bg-purple-600/20 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-400">
                                    3
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                Obtenha Respostas
                            </h3>
                            <p className="text-muted-foreground">
                                Visualize resumos, insights e converse com o
                                assistente para esclarecer dúvidas específicas
                                sobre seus processos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Benefícios</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            O JuriAssist oferece vantagens significativas para
                            qualquer pessoa que precise entender documentos
                            legais sem a necessidade de um advogado.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Assistência Inteligente
                                </h3>
                                <p className="text-muted-foreground">
                                    Obtenha respostas imediatas para suas
                                    dúvidas jurídicas, sem necessidade de ler
                                    documentos extensos ou contratar um
                                    advogado.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Segurança e Privacidade
                                </h3>
                                <p className="text-muted-foreground">
                                    Seus documentos são processados com total
                                    segurança e confidencialidade, seguindo os
                                    mais altos padrões de proteção de dados.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                                <Scale className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Economia de Tempo e Dinheiro
                                </h3>
                                <p className="text-muted-foreground">
                                    Reduza drasticamente o tempo e os custos
                                    gastos na compreensão de documentos
                                    jurídicos complexos sem precisar contratar
                                    um profissional.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">
                                    Compreensão Simplificada
                                </h3>
                                <p className="text-muted-foreground">
                                    Transforme linguagem jurídica complexa em
                                    explicações claras e acessíveis que qualquer
                                    pessoa pode entender.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden bg-secondary/20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Pronto para entender seus processos jurídicos?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Junte-se a milhares de pessoas que já estão
                            economizando tempo e obtendo clareza sobre seus
                            documentos legais com o JuriAssist.
                        </p>
                        <Link to="/register">
                            <Button size="lg">Começar Gratuitamente</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                                <Scale className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">
                                JuriAssist
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
                            <a
                                href="#features"
                                className="text-sm hover:text-purple-400 transition-colors"
                            >
                                Recursos
                            </a>
                            <a
                                href="#how-it-works"
                                className="text-sm hover:text-purple-400 transition-colors"
                            >
                                Como Funciona
                            </a>
                            <a
                                href="#benefits"
                                className="text-sm hover:text-purple-400 transition-colors"
                            >
                                Benefícios
                            </a>
                            <a
                                href="#privacy"
                                className="text-sm hover:text-purple-400 transition-colors"
                            >
                                Privacidade
                            </a>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} JuriAssist. Todos
                            os direitos reservados.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
