// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ======= chakra UI ==========
import { useToast } from "@chakra-ui/react";

// ======= external functions  ==========
import { logoutUser } from "../../helperFunctions/firebase/userAuthFunctions";

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============

export default function LogoutPage() {
    // ============== constant variables if any ==============
    const toast = useToast();
    const navigate = useNavigate();
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        logoutUser(toast, navigate);
    }, []);
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    return <>Logging out...</>;
}
