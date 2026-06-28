import localFont from "next/font/local";

export const vazir = localFont({
    src: [
        {
            path: "../../public/font/Vazir/Vazir-light-FD.woff2",
            weight: "300",
            style: "light",
        },
        {
            path: "../../public/font/Vazir/Vazir-Medium-FD.woff2",
            weight: "400",
            style: "medium",
        },
        {
            path: "../../public/font/Vazir/Vazir-Black-FD.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/font/Vazir/Vazir-Bold-FD.woff2",
            weight: "700",
            style: "bold",
        },
    ],
    variable: "--font-vazir",
    display: "swap",
});
