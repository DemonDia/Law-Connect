import { useEffect } from "react";
import AuthenticationForm from "../../components/authentication/AuthenticationForm";

export default function LoginPage() {
    useEffect(() => {}, []);
    const loginFunction = () => {
        alert("Logged in");
    };

    return (
        <>
            <AuthenticationForm isLogin={true} submitMethod={loginFunction} />
        </>
    );
}
