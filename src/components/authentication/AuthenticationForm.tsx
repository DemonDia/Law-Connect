// ============== imports ==============
// ======= react ==========
import React, { useState, useEffect } from "react";

// ======= chakra UI ==========
import { Card, Heading, Text } from "@chakra-ui/react";

// ======= custom components ==========
import InputField from "../general/InputField";
import CustomButton from "../general/CustomButton";
import TextRouterLink from "../general/TextRouterLink";

// ============== interfaces ==============
interface AuthManager {
    isLogin: boolean;
    submitMethod: any;
}
interface AuthObject {
    email: string;
    password: string;
    confirmPassword?: string;
}

// ============== main component ==============

export default function AuthenticationForm({
    isLogin,
    submitMethod,
}: AuthManager) {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    // ============== useEffect statement(s) ==============
    useEffect(() => {}, []);

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    const handleSubmit = () => {
        const submitItems: AuthObject = {
            email,
            password,
            confirmPassword,
        };
        submitMethod(submitItems);
    };
    return (
        <Card w={"40vw"} m={"10px auto"} p={"10"}>
            <Heading textAlign={"center"}>
                {isLogin ? "Sign In" : "Sign Up"}
            </Heading>
            <InputField
                label="Email"
                placeholder="Email"
                value={email}
                formType="email"
                changeHandler={(e: any) => setEmail(e.target.value)}
            />
            <InputField
                label="Password"
                placeholder="Password"
                value={password}
                formType="password"
                changeHandler={(e: any) => setPassword(e.target.value)}
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
                        changeHandler={(e: any) =>
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
                buttonOnClick={handleSubmit}
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
    );
}
