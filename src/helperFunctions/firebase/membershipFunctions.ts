import { db } from "../../config"
import {
    collection,
    getDocs,
    where,
    query,
    addDoc,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore"
import { findUsersByUserTypes } from "./userFirestore"

// get all members of a company
export const getCompanyMembers = async (companyId: string) => {
    const mentees = await findUsersByUserTypes(0)
    const mentors = await findUsersByUserTypes(1)
    const allLaywers = [...mentees, ...mentors]

    let lawyerDict: any = {}
    allLaywers.forEach((lawyer: any) => {
        const { userId, username } = lawyer
        lawyerDict[userId] = username
    })

    const findQuery = query(
        collection(db, "membership"),
        where("companyId", "==", companyId),
    )
    const docSnap = await getDocs(findQuery)
    let members: Array<any> = []

    docSnap.forEach(doc => {
        let memberToPush = doc.data()
        const { memberId, joinDate } = memberToPush
        memberToPush = {
            memberId,
            memberName: lawyerDict[memberId],
            joinDate,
        }
        members.push(memberToPush)
    })
    return members.sort(function (a, b) {
        var textA = a.username.toUpperCase()
        var textB = b.username.toUpperCase()
        return textA < textB ? -1 : textA > textB ? 1 : 0
    })
}

// return the company the member is from
export const getCompanyMembership = async (companyId: string) => {
    const findQuery = query(
        collection(db, "membership"),
        where("memberId", "==", companyId),
    )
    const docSnap = await getDocs(findQuery)
    let targetMember: unknown = null

    docSnap.forEach(doc => {
        // doc.data() --> {memberId,companyId,joinDate}
        const { companyId } = doc.data()
        targetMember = companyId
    })
    return targetMember
}
