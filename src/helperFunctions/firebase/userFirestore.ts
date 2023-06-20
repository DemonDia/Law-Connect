import { db } from "../../config"
import { collection, getDocs, where, query } from "firebase/firestore"
import { getCompanyMembers } from "./membershipFunctions"
// find user
// returns user if any
// else return null
export const findUserById = async (userId: string) => {
    const findQuery = query(
        collection(db, "users"),
        where("userId", "==", userId),
    )
    const docSnap = await getDocs(findQuery)
    let foundUser: unknown = null

    docSnap.forEach(doc => {
        // doc.data() is never undefined for query doc snapshots
        foundUser = doc.data()
        foundUser = { ...foundUser, id: doc.id }
    })
    return foundUser
}

// ========== find user by userTypes ==========
// "0" for mentor
// "1" for mentee
// "2" for company
export const findUsersByUserTypes = async (userType: string) => {
    const findQuery = query(
        collection(db, "users"),
        where("userType", "==", userType),
    )
    const docSnap = await getDocs(findQuery)
    const targetUsers: unknown = []

    docSnap.forEach(doc => {
        targetUsers.push(doc.data())
    })
    return targetUsers
}

// ========== find mentors by company ==========
export const findCompanyMentors = async (companyId: string) => {
    const mentorList = await findUsersByUserTypes("1")
    const mentorHashMap = {}
    mentorList.forEach((mentor: unknown) => {
        const { username, email, userId, skills } = mentor
        mentorHashMap[mentor.userId] = { username, email, userId, skills }
    })
    const res = []
    const companyMemberShips = await getCompanyMembers(companyId)
    companyMemberShips.forEach((memberShip: unknown) => {
        const { memberId } = memberShip
        if (mentorHashMap[memberId]) {
            res.push(mentorHashMap[memberId])
        }
    })
    return res
}
