import { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../core/hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { toast } from "../components/ui/use-toast";
import { ArrowLeft, Eye, EyeOff, Scale } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api, getHeaders } from "../../core/service/api";

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterFormData) => {
        const { confirmPassword, ...payload } = data;
        setIsLoading(true);
        api.post<any>("/auth/register", JSON.stringify(payload), getHeaders())
            .then((response) => {
                toast({
                    title: "Cadastro realizado com sucesso",
                    description: "Você já pode fazer login no sistema",
                });
                setTimeout(() => {
                    register(response.data);
                    setIsLoading(false);
                    navigate("/login");
                    console.log("aqui");
                }, 2500);
            })
            .catch((err) => {
                if (err.status === 409) {
                    toast({
                        title: "Erro ao cadastrar",
                        description: "O email desse usuario ja foi cadastrado",
                        variant: "destructive",
                    });
                    return;
                }

                toast({
                    title: "Erro ao cadastrar",
                    description: "Verifique os dados e tente novamente",
                    variant: "destructive",
                });
                setIsLoading(false);
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex items-center justify-center min-h-screen gradient-bg">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background"></div>
            </div>

            <div className="absolute top-4 left-4 z-20">
                <Link to="/">
                    <Button variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Voltar
                    </Button>
                </Link>
            </div>

            <Card className="w-full max-w-md relative z-10 border-0 bg-secondary/20 backdrop-blur-sm">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
                            <Scale className="h-7 w-7 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">
                        JuriAssist
                    </CardTitle>
                    <CardDescription className="text-center">
                        Crie sua conta para acessar o sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Nome
                            </label>
                            <Input
                                id="name"
                                placeholder="Seu nome completo"
                                className="bg-secondary/50 border-0"
                                {...register("name", {
                                    required: "Nome é obrigatório",
                                })}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                className="bg-secondary/50 border-0"
                                {...register("email", {
                                    required: "Email é obrigatório",
                                })}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Senha
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="bg-secondary/50 border-0 pr-10"
                                    {...register("password", {
                                        required: "Senha é obrigatória",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "A senha deve ter pelo menos 6 caracteres",
                                        },
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium"
                            >
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="••••••••"
                                    className="bg-secondary/50 border-0 pr-10"
                                    {...register("confirmPassword", {
                                        required:
                                            "Confirmação de senha é obrigatória",
                                        validate: (value) =>
                                            value === watch("password") ||
                                            "As senhas não coincidem",
                                    })}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "Cadastrando..." : "Cadastrar"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-center">
                        Já tem uma conta?{" "}
                        <Link
                            to="/login"
                            className="text-purple-400 hover:underline"
                        >
                            Faça login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Register;
