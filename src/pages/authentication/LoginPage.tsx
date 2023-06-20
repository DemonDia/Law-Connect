// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { useToast } from "@chakra-ui/react"

// ======= firebase ==========
import { auth } from "../../config"
import { signInWithEmailAndPassword } from "@firebase/auth"
import { findUserById } from "../../helperFunctions/firebase/userFirestore"
import { getCompanyMembership } from "../../helperFunctions/firebase/membershipFunctions"
import LoadingComponent from "../../components/general/LoadingComponent"
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
    const [loading, setLoading] = useState(false)
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
        setLoading(true)
        await signInWithEmailAndPassword(auth, email, password)
            .then(async userCredentials => {
                const currentUser = await findUserById(userCredentials.user.uid)
                if (currentUser) {
                    const { isSetUp, userId, username, userType } = currentUser
                    const companyBelonging = await getCompanyMembership(userId)
                    addUser({
                        userId,
                        username,
                        userType,
                        companyId: companyBelonging,
                    })
                    toast({
                        title: "Login successful",
                        description: "Redirecting ...",
                        status: "success",
                        duration: 1000,
                        isClosable: true,
                    })
                    setLoading(false)
                    if (isSetUp) {
                        navigate("/")
                    } else {
                        navigate("/setup/" + userId)
                    }
                } else {
                    setLoading(false)
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
                setLoading(false)
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
            {loading ? (
                <>
                    <LoadingComponent message="Logging in ..." />
                </>
            ) : (
                <>
                    <AuthenticationForm
                        isLogin={true}
                        submitMethod={loginFunction}
                    />
                </>
            )}
        </>
    )
}
// ============== sub component(s) if any ==============
