// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ======= chakra UI ==========
import { useToast } from "@chakra-ui/react";
// ======= custom components (if any)==========
import AuthenticationForm from "../../components/authentication/AuthenticationForm";
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
import { loginUserViaEmail } from "../../helperFunctions/firebaseFunctions";

// ============== main component ==============

export default function LoginPage() {
    const toast = useToast();
    const navigate = useNavigate();
    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============
    // useEffect(() => {}, []);
    const loginFunction = async (submitItems: any) => {
        const { email, password } = submitItems;
        await loginUserViaEmail({ email, password }, navigate, toast);
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
