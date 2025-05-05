export interface User {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    wallet_id?: string;
}

export interface SignUpResponse {
    id: string;
    name: string;
    wallet_id: string;
}

export interface AuthResponse {
    id: string;
    token: string;
}
