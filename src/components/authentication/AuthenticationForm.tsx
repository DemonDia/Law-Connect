// ============== imports ==============
// ======= react ==========
import { useState } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { Card, Heading, Text, useToast } from "@chakra-ui/react"

// ======= custom components ==========
import InputField from "../general/InputField"
import CustomButton from "../general/CustomButton"
import TextRouterLink from "../general/TextRouterLink"

import { gmailAuth } from "../../helperFunctions/firebase/userAuthFunctions"

// ============== interfaces ==============
interface AuthManager {
    isLogin: boolean
    submitMethod: unknown
}
export interface AuthObject {
    email: string
    password: string
    confirmPassword?: string
}

import useUser from "../../store/userStore"

// ============== main component ==============

export default function AuthenticationForm({
    isLogin,
    submitMethod,
}: AuthManager) {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const toast = useToast()
    const { addUser } = useUser()

    // ============== states (if any) ==============
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    const handleSubmit = async () => {
        const submitItems: AuthObject = {
            email,
            password,
            confirmPassword,
        }
        await submitMethod(submitItems)
    }

    const googleAuth = async () => {
        await gmailAuth(navigate, toast, addUser)
    }
    return (
        <Card
            w={["90vw", "70vw", "60vw", "50vw", "30vw"]}
            m={"10px auto"}
            p={"10px"}>
            <Heading textAlign={"center"}>
                {isLogin ? "Sign In" : "Sign Up"}
            </Heading>
            <InputField
                label="Email"
                placeholder="Email"
                value={email}
                formType="email"
                changeHandler={(e: unknown) => setEmail(e.target.value)}
            />
            <InputField
                label="Password"
                placeholder="Password"
                value={password}
                formType="password"
                changeHandler={(e: unknown) => setPassword(e.target.value)}
            />
            {isLogin ? (
                <></>
            ) : (
                <>
                    <InputField
                        label="Confirm Password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        formType="password"
                        changeHandler={(e: unknown) =>
                            setConfirmPassword(e.target.value)
                        }
                    />
                </>
            )}

            <CustomButton
                buttonColor={"#3609EA"}
                buttonText={isLogin ? "Login" : "Signup"}
                textColor={"white"}
                buttonWidth={"100%"}
                buttonOnClick={handleSubmit}
            />

            <Text align={"center"} m={"5px auto"}>
                Or
            </Text>

            <CustomButton
                buttonColor={"white"}
                buttonText={isLogin ? "Gmail Login" : "Register with Gmail"}
                textColor={"Black"}
                buttonWidth={"100%"}
                buttonOnClick={googleAuth}
            />
            <br />
            <Text align={"center"} m={"5px auto"}>
                {isLogin ? (
                    <>
                        Don't have an account? Sign up{" "}
                        <TextRouterLink to="/register" linkText="here" />.
                    </>
                ) : (
                    <>
                        Already have an account? Sign in{" "}
                        <TextRouterLink to="/login" linkText="here" />.{" "}
                    </>
                )}
            </Text>
        </Card>
    )
}
