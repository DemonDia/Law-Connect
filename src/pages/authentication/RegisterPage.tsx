import { useEffect } from "react";
import AuthenticationForm from "../../components/authentication/AuthenticationForm";

export default function RegisterPage() {
    useEffect(() => {}, []);
    const registerFunction = () => {
        alert("Registered in");
    };

    return (
        <>
            <AuthenticationForm
                isLogin={false}
                submitMethod={registerFunction}
            />
        </>
    );
}
