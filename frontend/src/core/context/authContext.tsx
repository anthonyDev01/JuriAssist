import { createContext, ReactNode, useEffect, useState } from "react";
import { AuthResponse, User } from "../models/user";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AuthContextProps {
    children: ReactNode;
}

interface AuthContextType {
    userId: string | null;
    token: string | null;
    login: (data: AuthResponse) => void;
    logout: () => void;
}

interface Token {
    id: string;
    name: string;
    email: string;
    sub: string;
    iat: number;
    exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthContextProps) => {
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [userId, setUserId] = useState<string | null>(
        localStorage.getItem("user_id")
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode<Token>(token);

                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                }
            } catch {
                logout();
            }
        }
    }, [token]);

    const login = (data: AuthResponse) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.id);
        setToken(data.token);
        setUserId(data.id);
        navigate("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setToken(null);
        setUserId(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{ token, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };
