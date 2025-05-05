import useAuth from "@/core/hooks/useAuth";
import { LoginForm } from "../components/login-form";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { AuthResponse, User } from "@/core/models/user";
import { toast } from "react-toastify";
import { api, getHeaders } from "@/core/service/apiService";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<User>();
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();

    const onSubmit: SubmitHandler<User> = (data) => {
        setLoading(true);
        const toastId = toast.loading("Acessando sua conta...");

        api.post<AuthResponse>(
            "/auth/sign-in",
            JSON.stringify(data),
            getHeaders()
        )
            .then((response) => {
                toast.dismiss(toastId);
                toast.success("Login feito com sucesso!");
                setTimeout(() => {
                    login(response.data);
                    setLoading(false);
                }, 2500);
            })
            .catch(() => {
                toast.dismiss(toastId);
                toast.error("Email ou senha inválido!");
                setTimeout(() => {
                    setLoading(false);
                }, 2500);
            });
    };

    return (
        <main className="bg-gray-900 w-full h-screen flex justify-center items-center">
            <LoginForm
                className="w-[30%] h-[60%] "
                handleSubmit={handleSubmit}
                onSubmitCustom={onSubmit}
                loading={loading}
                register={register}
            ></LoginForm>
        </main>
    );
};

export default Login;
