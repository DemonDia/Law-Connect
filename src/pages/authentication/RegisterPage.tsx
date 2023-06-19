// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { useToast } from "@chakra-ui/react"

// ======= firebase ==========
import {
    registerUserViaEmail,
    createUserRecord,
} from "../../helperFunctions/firebase/userAuthFunctions"

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import AuthenticationForm from "../../components/authentication/AuthenticationForm"

// ============== interfaces (if any) ==============
import { AuthObject } from "../../components/authentication/AuthenticationForm"

// ============== external variables (if any) ==============

// ======= external functions  ==========
import { validateEmail } from "../../helperFunctions/authentication/validateEmail"

// ============== main component ==============
export default function RegisterPage() {
    // ============== constant variables if any ==============
    const { user } = useUser()
    const toast = useToast()
    const navigate = useNavigate()

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId) {
            navigate("/")
        }
    }, [])

    // ============== helper functions if any ==============

    // ============== key functions if any ==============
    const registerFunction = async (items: AuthObject) => {
        let errors: Array<String> = []
        const { email, password, confirmPassword } = items
        if (!validateEmail(email)) {
            errors.push("Invalid email")
        }
        if (password === "") {
            errors.push("Password cannot be empty")
        }
        if (password.length < 8) {
            errors.push("Password cannot be less than 8 characters")
        }
        if (password !== confirmPassword) {
            errors.push("Password and confirm password must be the same")
        }
        if (errors.length > 0) {
            toast({
                title: "Registration unsuccessful",
                description: errors.join("; "),
                status: "error",
                duration: 1000,
                isClosable: true,
            })
        } else {
            const newUser = await registerUserViaEmail(email, password)
            if (newUser) {
                const { uid: userId } = newUser
                await createUserRecord(userId, email).then(res => {
                    if (res) {
                        toast({
                            title: "Registration successful",
                            description: "Account created",
                            status: "success",
                            duration: 1000,
                            isClosable: true,
                        })
                        navigate("/setup/" + userId)
                    } else {
                        toast({
                            title: "Registration unsuccessful",
                            description: "Please try again later",
                            status: "error",
                            duration: 1000,
                            isClosable: true,
                        })
                    }
                })
            } else {
                toast({
                    title: "Registration unsuccessful",
                    description: "Please try again later",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                })
            }
        }
    }

    return (
        <>
            <AuthenticationForm
                isLogin={false}
                submitMethod={registerFunction}
            />
        </>
    )
}

// ============== sub component(s) if any ==============
