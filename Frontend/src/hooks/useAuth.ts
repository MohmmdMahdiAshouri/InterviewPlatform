import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";
import * as authService from "@/src/services/auth.service";

export function useSendOtp() {
    const router = useRouter();

    return useMutation({
        mutationFn: authService.sendOtp,
        onSuccess: (data, variables) => {
            const clientReceiveTime = Date.now();
            const offset =
                clientReceiveTime - new Date(data.serverTime).getTime();
            sessionStorage.setItem(
                "otp",
                JSON.stringify({
                    phone: variables.phone,
                    fullName: variables.fullName,
                    expiresAt: data.expiresAt,
                    offset,
                }),
            );
            router.push("/auth/verify");
        },
    });
}

export function useCheckOtp() {
    const router = useRouter();
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.checkOtp,
        onSuccess: (data) => {
            sessionStorage.removeItem("otp");
            setAccessToken(data.accessToken);
            queryClient.prefetchQuery({
                queryKey: ["auth", "me"],
            });
            router.push("/");
        },
    });
}

export function useCheckLogin() {
    const accessToken = useAuthStore((s) => s.accessToken);
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: authService.checkLogin,
        enabled: !!accessToken,
    });
}

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logout();
            queryClient.removeQueries({
                queryKey: ["auth", "me"],
            });
            router.push("/")
        },
    });
}
