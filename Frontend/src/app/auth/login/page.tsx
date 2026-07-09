import LoginPageForm from "./components/LoginPageForm";
import LoginPageHeader from "./components/LoginPageHeader";

export default function LoginPage() {
    
    return (
        <div className="mt-10 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <LoginPageHeader />

                <LoginPageForm />
            </div>
        </div>
    );
}
