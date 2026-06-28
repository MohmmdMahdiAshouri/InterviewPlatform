import {
    ArrowLeftIcon,
    SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import Button from "./Button";

function Navbar() {
    return (
        <nav className="glassـnavbar backdrop-blur-3xl sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
                {/* LOGO */}
                <Link
                    href={"/"}
                    className="flex items-center gap-3"
                >
                    <div className="size-10 rounded-xl bg_gradient flex items-center justify-center shadow-lg">
                        <SparklesIcon className="size-6 text-white" />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-2xl font-bold bg-clip-text tracking-wider">
                            پلتفرم مصاحبه آنلاین
                        </span>
                    </div>
                </Link>

                <div className="flex gap-2">
                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* AUTH BTN */}
                    <Button 
                        href={"/"} icon={<ArrowLeftIcon className="size-5" />} 
                        size="md"
                    >
                        شروع کردن
                    </Button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
