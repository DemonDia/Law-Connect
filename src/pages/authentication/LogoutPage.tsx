// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { useToast } from "@chakra-ui/react"
import useUser from "../../store/userStore"

// ======= firebase ==========
import { auth } from "../../config"
import { signOut } from "firebase/auth"

// ======= zustand/state ==========

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function LogoutPage() {
    // ============== constant variables if any ==============
    const toast = useToast()
    const navigate = useNavigate()
    const { removeUser } = useUser()
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        signOut(auth)
            .then(() => {
                removeUser();
                toast({
                    title: "Successfully logged out",
                    description: "",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                })
                navigate("/login")
            })
            .catch(error => {
                console.log(error.message)
                // An error happened.
                toast({
                    title: "Logout failed",
                    description:
                        "Something went wrong. Please try again later.",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                })
            })
    }, [])
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    return <>Logging out...</>
}
// ============== sub component(s) if any ==============
