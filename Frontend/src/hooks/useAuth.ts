import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/stores/auth.store";
import * as authService from "@/src/services/auth.service";

export function useSendOtp() {
    const router = useRouter();

    return useMutation({
        mutationFn: authService.sendOtp,
        onSuccess: (_data, variables) => {
            router.push(`/auth/verify?phone=${encodeURIComponent(variables.phone)}`);
        },
    });
}

export function useCheckOtp() {
    const router = useRouter();
    const setAuth = useAuthStore((s) => s.setAuth);

    return useMutation({
        mutationFn: async (payload: { phone: string; code: string }) => {
            const { accessToken } = await authService.checkOtp(payload);
            const user = await authService.checkLogin();
            setAuth(accessToken, user);
            return user;
        },
        onSuccess: () => {
            router.push("/");
        },
    });
}

export function useCheckLogin() {
    const setUser = useAuthStore((s) => s.setUser);

    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => {
            const user = await authService.checkLogin();
            setUser(user);
            return user;
        },
        enabled: false,
    });
}

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((s) => s.logout);

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            logout();
            router.push("/auth/login");
        },
    });
}
