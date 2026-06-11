import type { Metadata } from "next";
import { Providers } from "./providers";
import "../styles/global.css";
import { vazir } from "../configs/font.config";

export const metadata: Metadata = {
    title: "پلتفرم مصاحبه آنلاین",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fa"
            dir="rtl"
            suppressHydrationWarning
            className="antialiased"
        >
            <body className={`${vazir.className}`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
