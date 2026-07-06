import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { SpinnerDots, Spinner } from "./Spinner";

type Size = "sm" | "md" | "lg";

interface BaseProps {
    children: ReactNode;
    icon?: ReactNode;
    loading?: boolean;
    size?: Size;
    className?: string;
    spinnerSize?: number;
}

type ButtonProps = BaseProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
    };

type LinkProps = BaseProps &
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
    };

type Props = ButtonProps | LinkProps;

export default function Button(props: Props) {
    const {
        children,
        icon,
        loading = false,
        size = "md",
        className = "",
        spinnerSize,
        ...rest
    } = props;

    const baseClasses = `
    transition-colors
    duration-300
    btn
    btn_${size}
    ${className}
    ${loading && "pointer-events-none opacity-70"}
    `;

    const content = (
        <>
            {children}
            {loading && <SpinnerDots size={spinnerSize} />}
            {!loading && icon}
        </>
    );

    if ("href" in rest && rest.href) {
        const { href, ...linkProps } = rest as LinkProps;

        return (
            <Link
                href={href}
                className={baseClasses}
                aria-disabled={loading}
                {...linkProps}
            >
                {content}
            </Link>
        );
    }

    const buttonProps = rest as ButtonProps;

    return (
        <button
            className={baseClasses}
            disabled={loading || buttonProps.disabled}
            {...buttonProps}
        >
            {content}
        </button>
    );
}
