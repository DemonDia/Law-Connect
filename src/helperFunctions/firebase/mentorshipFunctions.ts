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

// get all mentees of a mentor
export const getMentorMentees = async (mentorId: string) => {
    const allMentees = await findUsersByUserTypes("0")

    let menteeDict: any = {}
    allMentees.forEach((mentee: any) => {
        const { userId, username } = mentee
        menteeDict[userId] = username
    })

    const findQuery = query(
        collection(db, "mentorship"),
        where("mentorId", "==", mentorId),
    )
    const docSnap = await getDocs(findQuery)
    let mentees: Array<any> = []

    docSnap.forEach(doc => {
        let menteeToPush = doc.data()
        const { menteeId, joinDate } = menteeToPush
        menteeToPush = {
            menteeId,
            menteeName: menteeDict[menteeId],
            joinDate,
        }
        mentees.push(menteeToPush)
    })
    return mentees
}
