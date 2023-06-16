import "./App.css";
import Navbar from "./components/general/Navbar";
import { Routes, Route } from "react-router-dom";

// ======================== authentication pages ========================
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";

function App() {
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
