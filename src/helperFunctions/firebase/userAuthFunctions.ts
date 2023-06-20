import { auth, db } from "../../config"
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { collection, addDoc } from "firebase/firestore"
import { findUserById } from "./userFirestore"
import { getCompanyMembership } from "./membershipFunctions"
// =======================the key functions=======================
// ==========authentication-related==========

// register user (email)
// return user if successful, else return null
export const registerUserViaEmail = async (email: string, password: string) => {
    const newUser = await createUserWithEmailAndPassword(auth, email, password)
    const { user } = newUser
    if (user) {
        return user
    }
    return null
}

// create user in firestore
export const createUserRecord = async (userId: string, email: string) => {
    try {
        const userRecord = await addDoc(collection(db, "users"), {
            userId,
            email,
            userType: -1,
            isSetUp: false,
        })
        if (userRecord) {
            return true
        }
    } catch (e) {
        return false
    }
}

export const gmailAuth = async (navigate: unknown, toast: unknown, addUser: unknown) => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
        .then(async result => {
            const user = result.user
            const uid = user?.uid
            // check if user exists in firestore
            const existingUser = await findUserById(uid)
            if (!existingUser) {
                await createUserRecord(uid, user.email).then(res => {
                    if (res) {
                        toast({
                            title: "Registration successful",
                            description: "Account created",
                            status: "success",
                            duration: 1000,
                            isClosable: true,
                        })
                        navigate("/setup/" + uid)
                    }
                })
            } else {
                const { isSetUp, userId, username, userType } = existingUser
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
                if (isSetUp) {
                    navigate("/")
                } else {
                    navigate("/setup/" + userId)
                }
            }

            // if user does not exist, create user in firestore
        })
        .catch(error => {
            toast({
                title: "Authentication failed",
                description: error.message,
                status: "error",
                duration: 1000,
            })
        })
}
