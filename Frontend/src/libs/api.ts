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

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/verify-refresh-token")
        ) {
            originalRequest._retry = true;

            try {
                const response = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-refresh-token`,
                    {},
                    {
                        withCredentials: true,
                    },
                );

                const accessToken = response.data.accessToken;

                useAuthStore.getState().setAccessToken(accessToken);

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
