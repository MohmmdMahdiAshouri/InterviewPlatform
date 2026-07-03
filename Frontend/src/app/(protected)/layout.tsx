import { RouteGuard } from "@/src/components/auth/RouteGuard";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RouteGuard>{children}</RouteGuard>;
}
