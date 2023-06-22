import { auth, db } from "../../config"

// import agency from "../../files/agency.json"
// import attorney from "../../files/attorney.json"
// import membership from "../../files/membership.json"

import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { collection, addDoc, getDocs } from "firebase/firestore"
import { findUserById, findUsersByUserTypes } from "./userFirestore"
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

export const gmailAuth = async (navigate: any, toast: any, addUser: any) => {
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

// const seedIndividualUser = async (
//     email: string,
//     username: string,
//     userType: number,
//     userCode: string,
//     skills: string[],
// ) => {
//     await registerUserViaEmail(email, "12345678").then(async createdUser => {
//         console.log("createdUser", createdUser)
//         if (createdUser) {
//             const { uid: userId } = createdUser
//             await createUserRecordSeed(
//                 userId,
//                 username,
//                 email,
//                 userType,
//                 skills,
//                 userCode,
//             )
//         } else {
//             console.log("not created")
//         }
//     })
// }

// ==========mass seed users==========
// export const seedUsers = async () => {
//     const allSkills = await getAllSkillsFromDb()
//     // userCode: userId
//     // username
//     // userType
//     // email
//     // userCode
//     // ============= agency (law firm) =============
//     for (const code in agency) {
//         const lawFirm = { ...agency[code], code }
//         const { username, userType, email } = lawFirm
//         await seedIndividualUser(email, username, userType, code, allSkills)
//     }
//     // ============= attorney =============
//     for (const code in attorney) {
//         const mentor = { ...attorney[code], code }
//         const { username, userType, email } = mentor
//         await seedIndividualUser(email, username, userType, code, allSkills)
//     }
// }

// export const seedMembership = async () => {
//     // find mentors
//     const mentors = await findUsersByUserTypes(1)
//     const mentorDict = {}
//     mentors.forEach(mentor => {
//         const { userId, userCode } = mentor
//         mentorDict[userCode] = userId
//     })

//     // find firms
//     const firms = await findUsersByUserTypes(2)
//     const firmsDict = {}
//     firms.forEach(firm => {
//         const { userId, userCode } = firm
//         firmsDict[userCode] = userId
//     })

//     membership.forEach(async pair => {
//         const { attorney, agency } = pair
//         await addDoc(collection(db, "membership"), {
//             joinDate: new Date(),
//             memberId: mentorDict[attorney],
//             companyId: firmsDict[agency],
//         })
//     })
// }

// export const userSetupAll = async () => {
//     const users = await getAllUsersFromDb()
//     if (users && users.length == 0) {
//         await seedUsers()
//     }
//     // check for membership
//     const memberships = await getAllMembershipsFromDb()
//     if (memberships && memberships.length == 0) {
//         await seedMembership()
//     }
// }

// export const getAllUsersFromDb = async () => {
//     const querySnapshot: any = await getDocs(collection(db, "users"))
//     const users: string[] = []
//     querySnapshot.forEach((doc: any) => {
//         users.push(doc.data())
//     })
//     return users
// }

// export const getAllMembershipsFromDb = async () => {
//     const querySnapshot: any = await getDocs(collection(db, "membership"))
//     const memberships: string[] = []
//     querySnapshot.forEach((doc: any) => {
//         memberships.push(doc.data())
//     })
//     return memberships
// }

// export const getAllSkillsFromDb = async () => {
//     const querySnapshot: any = await getDocs(collection(db, "skills"))
//     const skills: string[] = []
//     querySnapshot.forEach((doc: any) => {
//         skills.push(doc.id)
//     })
//     return skills
// }

// export const createUserRecordSeed = async (
//     userId: string,
//     username: string,
//     email: string,
//     userType: number,
//     skills: string[],
//     userCode: string,
// ) => {
//     console.log("toadd", {
//         userId,
//         username,
//         email,
//         userType,
//         skills,
//         userCode,
//     })
//     await addDoc(collection(db, "users"), {
//         userId,
//         email,
//         username,
//         userType,
//         isSetUp: true,
//         skills,
//         userCode,
//     })
//         .then(() => {
//             console.log("Finished adding")
//         })
//         .catch(err => {
//             console.log("err", err.message)
//         })
//     console.log("Added liao.")
// }
