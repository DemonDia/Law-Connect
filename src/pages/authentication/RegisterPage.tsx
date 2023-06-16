// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react";

// ======= chakra UI ==========

// ======= custom components (if any)==========
import AuthenticationForm from "../../components/authentication/AuthenticationForm";

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============
export default function RegisterPage() {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============
    useEffect(() => {}, []);

    // ============== helper functions if any ==============

    // ============== key functions if any ==============
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
