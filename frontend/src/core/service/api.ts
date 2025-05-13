import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

console.log(import.meta.env.VITE_API_URL);

export function getHeaders() {
    return {
        headers: { "Content-Type": "application/json" },
    };
}

export function getParamsSearch(value: string) {
    const token = localStorage.getItem("token");
    return {
        params: {
            search: value,
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
}

export function getAuthorization() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    return {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            userId,
        },
    };
}

export function getAuthorizationFormData() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    return {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            userId,
        },
    };
}
