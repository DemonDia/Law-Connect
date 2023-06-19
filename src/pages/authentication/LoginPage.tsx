// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { useToast } from "@chakra-ui/react"

// ======= firebase ==========
import { auth } from "../../config"
import { signInWithEmailAndPassword } from "@firebase/auth"
import { findUserById } from "../../helperFunctions/firebase/userFirestore"

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import AuthenticationForm from "../../components/authentication/AuthenticationForm"

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function LoginPage() {
    const toast = useToast()
    const navigate = useNavigate()
    const { addUser, user } = useUser()
    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user) {
            navigate("/")
        }
    }, [])
    // ============== helper functions if any ==============

    // ============== key functions if any ==============
    const loginFunction = async (submitItems: any) => {
        const { email, password } = submitItems
        await signInWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                const currentUser = await findUserById(userCredentials.user.uid)
                if (currentUser) {
                    const { isSetUp, userId, username, userType } = currentUser
                    addUser({ userId, username, userType })
                    toast({
                        title: "Login successful",
                        description: "Redirecting ...",
                        status: "success",
                        duration: 1000,
                        isClosable: true,
                    })
                    if (isSetUp) {
                        navigate("/")
                    } else {
                        navigate("/setup")
                    }
                } else {
                    toast({
                        title: "Login failed",
                        description: "Please try again later",
                        status: "error",
                        duration: 1000,
                        isClosable: true,
                    })
                }
            })
            .catch(error => {
                const errorMessage = error.message
                toast({
                    title: "Login failed",
                    description: errorMessage,
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                })
            })
    }
    return (
        <>
            <AuthenticationForm isLogin={true} submitMethod={loginFunction} />
        </>
    )
}
// ============== sub component(s) if any ==============
