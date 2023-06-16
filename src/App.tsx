// ============== imports: the dependencies ==============
import "./App.css";

// ======= react ==========
import { useEffect } from "react";

// ======= chakra UI ==========
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// ======= custom components (if any)==========
import Navbar from "./components/general/Navbar";
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ============== firebase functions ==============
import {
    seedSkills,
    checkLoggedUser,
} from "./helperFunctions/firebaseFunctions";

// ======================== authentication pages ========================
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";

// ============== main component ==============
function App() {
    // ============== constant variables if any ==============
    const navigate = useNavigate();
    const location = useLocation();

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        seedSkills();
        checkLoggedUser(navigate, location.pathname);
        // getCurrUser();
    }, []);

    useEffect(() => {
        checkLoggedUser(navigate, location.pathname);
        console.log("path")
    }, [location.pathname]);

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<h1>Home</h1>} />

                {/* authentication */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </>
    );
}

export default App;
