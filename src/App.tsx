// ============== imports: the dependencies ==============
import "./App.css"

// ======= react ==========
import { useEffect, useState } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"

// ======= chakra UI ==========
import { Box } from "@chakra-ui/react"

// ======= external functions  ==========
import { auth } from "./config"
import { onAuthStateChanged } from "firebase/auth"

// ======= custom components (if any)==========
import Navbar from "./components/general/Navbar"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
import { checkPathName } from "./helperFunctions/authentication/checkPathName"
import { findUserById } from "./helperFunctions/firebase/userFirestore"

// ============== firebase functions ==============
import { seedSkills } from "./helperFunctions/firebase/skillsFunctions"

// ======================== authentication pages ========================
import LoginPage from "./pages/authentication/LoginPage"
import RegisterPage from "./pages/authentication/RegisterPage"
import SetupPage from "./pages/authentication/SetupPage"
import LogoutPage from "./pages/authentication/LogoutPage"

// ======================== mentee pages ========================
import CompanyPage from "./pages/mentees/CompanyPage"

// ======================== law firm pages ========================
import LawyersPage from "./pages/lawfirms/LawyersPage"
import LaywerApplicationPage from "./pages/lawfirms/LaywerApplicationPage"

// ============== main component ==============
function App() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const location = useLocation()

    // ============== states (if any) ==============
    const [currentUser, setCurrentUser] = useState<any>(null)

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        seedSkills()
        onAuthStateChanged(auth, async user => {
            if (user) {
                const { uid } = user
                const userRecord: any = await findUserById(uid)
                if (userRecord) {
                    const { isSetUp, userId, username, userType } = userRecord
                    setCurrentUser({ userId, username, userType })

                    // ====not setup yet====
                    if (!isSetUp) {
                        navigate("/setup/" + uid)
                    }
                } else {
                    // ====user not found====
                    setCurrentUser(null)
                    if (!checkPathName(location.pathname)) {
                        navigate("/login")
                    }
                }
            } else {
                // ====user not found====
                setCurrentUser(null)
                if (!checkPathName(location.pathname)) {
                    navigate("/login")
                }
            }
        })
    }, [location.pathname])

    // monitor logged User (needed especially for navbar and homepage)

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <>
            <Navbar currentUser={currentUser} />
            <Box p="10px">
                <Routes>
                    {/* homepage */}
                    <Route path="/" element={<h1>Home</h1>} />

                    {/* authentication */}
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/setup/:userId" element={<SetupPage />} />
                    <Route path="/logout" element={<LogoutPage />} />

                    {/* mentee */}
                    <Route
                        path="/company"
                        element={<CompanyPage currentUser={currentUser} />}
                    />

                    {/* lawyer */}
                    <Route
                        path="/lawyers"
                        element={<LawyersPage currentUser={currentUser} />}
                    />
                    <Route
                        path="/lawyers/:applicationId"
                        element={
                            <LaywerApplicationPage currentUser={currentUser} />
                        }
                    />
                </Routes>
            </Box>
        </>
    )
}

export default App
