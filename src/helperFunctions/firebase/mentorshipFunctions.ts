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
import { findUsersByUserTypes, findUserById } from "./userFirestore"

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
            mentorshipId: doc.id,
            menteeName: menteeDict[menteeId],
            joinDate,
        }
        mentees.push(menteeToPush)
    })
    return mentees
}

export const getMentorshipById = async (mentorshipId: string) => {
    const docRef = doc(db, "mentorship", mentorshipId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
        const { menteeId, mentorId, joinDate, skills } = docSnap.data()
        const mentee = await findUserById(menteeId)
        const { username: menteeName } = mentee
        return { menteeId, menteeName, mentorId, joinDate, skills }
    } else {
        // docSnap.data() will be undefined in this case
        return null
    }
}

// returns mentorshipId
export const checkMentorshipByMentorAndMentee = async (
    mentorId: string,
    menteeId: string,
) => {
    const findQuery = query(
        collection(db, "mentorship"),
        where("mentorId", "==", mentorId),
        where("menteeId", "==", menteeId),
    )
    let mentorshipId: string = ""
    const docSnap = await getDocs(findQuery)

    docSnap.forEach(doc => {
        mentorshipId = doc.id
    })
    return mentorshipId
}
