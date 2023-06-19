import { auth, db } from "../../config"
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
} from "firebase/auth"
import { collection, addDoc, doc, updateDoc } from "firebase/firestore"
import { findUserById } from "./userFirestore"
import { checkPathName } from "../authentication/checkPathName"
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
