import { auth, db } from "../../config";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
} from "firebase/auth";
import {
    collection,
    addDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import { findUserById } from "./userFirestore";
import { checkPathName } from "../authentication/checkPathName";
// =======================the key functions=======================
// ==========authentication-related==========
// this is for authentication
// login user
interface UserLoginData {
    email: string;
    password: string;
}
export const loginUserViaEmail = async (
    { email, password }: UserLoginData,
    navigate: any,
    toast: any
) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // Signed in
            toast({
                title: "Login successful",
                description: "Redirecting ...",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            navigate("/");
        })
        .catch((error) => {
            const errorMessage = error.message;
            toast({
                title: "Login failed",
                description: errorMessage,
                status: "error",
                duration: 1000,
                isClosable: true,
            });
        });
};

// register user (email)
// return user if successful, else return null
export const registerUserViaEmail = async (email: string, password: string) => {
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = newUser;
    if (user) {
        return user;
    }
    return null;
};

// create user in firestore
export const createUserRecord = async (userId: string, email: string) => {
    try {
        const userRecord = await addDoc(collection(db, "users"), {
            userId,
            email,
            userType: -1,
            isSetUp: false,
        });
        if (userRecord) {
            return true;
        }
    } catch (e) {
        return false;
    }
};

// check logged user & finished setup
// [loggedUser, isSetUp]
export const checkLoggedUser = async (navigate: any, pathname: string) => {
    await onAuthStateChanged(auth, async (user) => {
        if (user) {
            const { uid } = user;
            const userRecord: any = await findUserById(uid);
            if (userRecord) {
                const { isSetUp } = userRecord;
                if (!isSetUp) {
                    // console.log("A");
                    navigate("/setup/" + uid);
                } else {
                    // console.log("B");
                    navigate("/setup/" + uid);
                }
            } else {
                // console.log("checked", checked);
                if (!checkPathName(pathname)) {
                    // console.log("C");
                    navigate("/login");
                }
                // console.log("D");
            }
            // ...
        } else {
            if (!checkPathName(pathname)) {
                // console.log("E");
                navigate("/login");
            }
            // console.log("F");
        }
    });
};

// logout user
export const logoutUser = async (toast: any, navigate: any) => {
    await signOut(auth)
        .then(() => {
            // Sign-out successful.
            toast({
                title: "Successfully logged out",
                description: "",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            navigate("/login");
        })
        .catch((error) => {
            console.log(error.message);
            // An error happened.
            toast({
                title: "Logout failed",
                description: "Something went wrong. Please try again later.",
                status: "error",
                duration: 1000,
                isClosable: true,
            });
        });
};

// submit first time setup
export const firstTimeSetup = async (
    userSetupData: any,
    navigate: any,
    toast: any
) => {
    const { userId, skills, userType, name } = userSetupData;
    await onAuthStateChanged(auth, async (user) => {
        if (user && auth.currentUser) {
            const { uid } = user;
            if (uid == userId) {
                const userRecord: any = await findUserById(uid);
                Promise.resolve(userRecord).then((user) => {
                    if (user) {
                        let allPromises = [];
                        // change username in auth
                        if (auth.currentUser) {
                            // working
                            allPromises.push(
                                updateProfile(auth.currentUser, {
                                    displayName: name,
                                })
                            );
                        }

                        // skills/userId
                        // update skills
                        const skillCollection: any = collection(
                            db,
                            "userSkills"
                        );
                        allPromises.push(
                            addDoc(skillCollection, {
                                userId: skills,
                            })
                        );

                        // update status and userType
                        const userDocRef = doc(db, "users", userRecord.id);
                        allPromises.push(
                            updateDoc(userDocRef, {
                                username: name,
                                userType,
                                isSetUp: true,
                            })
                        );
                        Promise.allSettled(allPromises).then(() => {
                            toast({
                                title: "Setup successful",
                                description: "Setup created, thank you!",
                                status: "success",
                                duration: 1000,
                                isClosable: true,
                            });
                            navigate("/");
                        });
                    }
                });
            }
        }
    });
};
