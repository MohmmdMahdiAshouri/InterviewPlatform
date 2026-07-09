import axios from "axios";
import { useAuthStore } from "@/src/stores/auth.store";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = axios
        .post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-refresh-token`,
            {},
            { withCredentials: true },
        )
        .then((response) => {
            const accessToken = response.data.accessToken;
            useAuthStore.getState().setAccessToken(accessToken);
            return accessToken;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/verify-refresh-token") &&
            !originalRequest.url?.includes("/auth/send-otp") &&
            !originalRequest.url?.includes("/auth/check-otp")
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshAccessToken();

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch {
                useAuthStore.getState().logout();

                window.location.href = "/auth/login";
            }
        }

        return Promise.reject(error);
    },
);
