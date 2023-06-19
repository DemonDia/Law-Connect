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
import { findUserById } from "./userFirestore"
import { findUsersByUserTypes } from "./userFirestore"

// =========create application=========
export const createMentorshipApplication = async (
    menteeId: string,
    mentorId: string,
    toast: unknown,
) => {
    console.log({ menteeId, mentorId })
    // mentor only
    const validMentee = await findUserById(menteeId)

    // mentee only
    const validMentor = await findUserById(mentorId)

    if (
        validMentee &&
        validMentor &&
        validMentee.userType == "0" &&
        validMentor.userType == "1"
    ) {
        // apply
        await addDoc(collection(db, "mentorshipApplication"), {
            menteeId,
            mentorId,
            applicationDate: new Date(),
            outcome: -1,
            // -1 means processing
            // 0 means reject
            // 1 means accept
        })
            .then((res: any) => {
                toast({
                    title: "Application Successful",
                    description: "Please wait for the outcome",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                })
            })
            .catch((err: any) => {
                console.log(err.message)
                toast({
                    title: "Error",
                    description: "Invalid application",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                })
            })
        return
    } else {
        toast({
            title: "Error",
            description: "Invalid application",
            status: "error",
            duration: 1000,
            isClosable: true,
        })
        return
    }
}

// =========get user applications=========
export const getUserMentorShipApplications = async (userId: string) => {
    const mentors = await findUsersByUserTypes("1")
    let mentorDict: any = {}
    mentors.forEach((mentor: any) => {
        const { userId, username } = mentor
        mentorDict[userId] = username
    })

    console.log(mentorDict)
    const findQuery = query(
        collection(db, "mentorshipApplication"),
        where("menteeId", "==", userId),
    )
    const docSnap = await getDocs(findQuery)
    let applications: Array<any> = []
    docSnap.forEach(doc => {
        let applicationToPush = doc.data()
        const { mentorId } = applicationToPush
        applicationToPush = {
            ...applicationToPush,
            id: doc.id,
            mentorName: mentorDict[mentorId],
        }
        applications.push(applicationToPush)
    })
    console.log("mentorshipAPplications", applications)
    return applications
}
