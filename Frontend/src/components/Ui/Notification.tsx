"use client";
import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (
        notification: Omit<Notification, "id">
    ) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
}

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({
    children,
}: NotificationProviderProps) {
    const [notifications, setNotifications] = useState<
        Notification[]
    >([]);

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.filter((n) => n.id !== id)
        );
    }, []);

    const addNotification = useCallback(
        (
            notification: Omit<Notification, "id">
        ) => {
            const id = Math.random().toString(36).substring(2, 9);
            setNotifications((prev) => [
                ...prev,
                { ...notification, id },
            ]);
        },
        []
    );

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
            }}
        >
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
}

const typeConfig: Record<
    NotificationType,
    {
        icon: typeof CheckCircle;
        bgColor: string;
        textColor: string;
        borderColor: string;
        iconColor: string;
    }
> = {
    success: {
        icon: CheckCircle,
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-500",
        borderColor: "border-emerald-500/50",
        iconColor: "text-emerald-500",
    },
    error: {
        icon: XCircle,
        bgColor: "bg-red-600/10",
        textColor: "text-red-500",
        borderColor: "border-red-500/50",
        iconColor: "text-red-500",
    },
    warning: {
        icon: AlertTriangle,
        bgColor: "bg-amber-600/10",
        textColor: "text-amber-600",
        borderColor: "border-amber-500/50",
        iconColor: "text-amber-600",
    },
    info: {
        icon: Info,
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        borderColor: "border-blue-500/50",
        iconColor: "text-blue-400",
    },
};

function NotificationItem({
    notification,
    onRemove,
}: {
    notification: Notification;
    onRemove: (id: string) => void;
}) {
    const config = typeConfig[notification.type];
    const Icon = config.icon;
    const duration = notification.duration ?? 5000;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
                relative overflow-hidden rounded-xl border backdrop-blur-xl shadow-2xl
                ${config.bgColor} ${config.borderColor}
                min-w-[320px] max-w-[400px]
            `}
        >
            <div className="flex items-start gap-3 p-4">
                <Icon
                    className={`size-5 mt-0.5 shrink-0 ${config.iconColor}`}
                />
                <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${config.textColor}`}>
                        {notification.title}
                    </p>
                    {notification.message && (
                        <p className={`mt-1 text-sm ${config.textColor}`}>
                            {notification.message}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => onRemove(notification.id)}
                    className="shrink-0 text-gray-500 hover:text-gray-200 transition-colors"
                >
                    <X className="size-4" />
                </button>
            </div>

            {duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gray-400"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{
                        duration: duration / 1000,
                        ease: "linear",
                    }}
                    onAnimationComplete={() =>
                        onRemove(notification.id)
                    }
                />
            )}
        </motion.div>
    );
}

function NotificationContainer() {
    const { notifications, removeNotification } =
        useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRemove={removeNotification}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

export { NotificationContainer };
export type { NotificationType, Notification };