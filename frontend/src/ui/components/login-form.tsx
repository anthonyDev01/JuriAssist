import { cn } from "@/core/lib/utils";
import { Button } from "./button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import type {
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormRegister,
} from "react-hook-form";
import type { User } from "@/core/models/user";

type LoginFormProps = React.ComponentProps<"div"> & {
    onSubmitCustom: SubmitHandler<User>;
    handleSubmit: UseFormHandleSubmit<User, User>;
    loading: boolean;
    register: UseFormRegister<User>;
};

export function LoginForm({
    className,
    onSubmitCustom,
    handleSubmit,
    loading,
    register,
    ...props
}: LoginFormProps) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="h-full flex justify-around">
                <CardHeader>
                    <CardTitle>Entre na sua conta</CardTitle>
                    <CardDescription>
                        Digite seu e-mail abaixo para entrar na sua conta
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmitCustom)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...register("email", { required: true })}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...register("password", {
                                        required: true,
                                        minLength: 8,
                                    })}
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    Login
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <a
                                href="#"
                                className="underline underline-offset-4"
                            >
                                CRIAR CONTA
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
