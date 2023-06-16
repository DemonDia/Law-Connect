// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react";
// ======= chakra UI ==========

// ======= custom components (if any)==========
import AuthenticationForm from "../../components/authentication/AuthenticationForm";
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ============== main component ==============

export default function LoginPage() {
    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============
    useEffect(() => {}, []);
    const loginFunction = () => {
        alert("Logged in");
    };
    // ============== helper functions if any ==============

    // ============== key functions if any ==============
    return (
        <>
            <AuthenticationForm isLogin={true} submitMethod={loginFunction} />
        </>
    );
}
// ============== sub component(s) if any ==============