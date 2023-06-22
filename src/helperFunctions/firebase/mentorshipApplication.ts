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
    toast: any,
) => {
    // mentor only
    const validMentee = await findUserById(menteeId)

    // mentee only
    const validMentor = await findUserById(mentorId)

    if (
        validMentee &&
        validMentor &&
        validMentee.userType == 0 &&
        validMentor.userType == 1
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

// =========get user mentorship applications=========
export const getUserMentorShipApplications = async (userId: string) => {
    const mentors = await findUsersByUserTypes(1)
    let mentorDict: any = {}
    mentors.forEach((mentor: any) => {
        const { userId, username } = mentor
        mentorDict[userId] = username
    })

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
    return applications
}

// =========get mentor's applications=========
// mentors & mentees
export const getMentorApplications = async (mentorId: string) => {
    const mentees = await findUsersByUserTypes(0)

    let menteeDict: any = {}
    mentees.forEach((mentee: any) => {
        const { userId, username } = mentee
        menteeDict[userId] = username
    })

    const findQuery = query(
        collection(db, "mentorshipApplication"),
        where("mentorId", "==", mentorId),
    )
    const docSnap = await getDocs(findQuery)

    let applications: Array<any> = []
    docSnap.forEach(doc => {
        let applicationToPush = doc.data()
        const { menteeId } = applicationToPush
        applicationToPush = {
            ...applicationToPush,
            id: doc.id,
            menteeName: menteeDict[menteeId],
        }
        applications.push(applicationToPush)
    })
    return applications
}

// =========get mentorship applicant info=========
export const getMentorshipApplicationInfo = async (applicationId: string) => {
    // get
    const docSnap = await getDoc(
        doc(db, "mentorshipApplication", applicationId),
    )

    if (docSnap.exists()) {
        const { menteeId, mentorId, applicationDate, outcome } = docSnap.data()

        const applicant = await findUserById(menteeId)
        if (applicant) {
            const { username, email } = applicant
            return { username, applicationDate, outcome, mentorId, email }
        } else {
            return null
        }
    } else {
        return null
    }
}

// =========update application=========
// accept/reject
// isAccept: true --> accept
// isAccept: false --> reject
export const updateMentorshipApplication = async (
    mentorshipApplicationId: string,
    isAccept: boolean,
    toast: any,
    navigate: any,
) => {
    // get application by ID
    const applicationRef = doc(
        db,
        "mentorshipApplication",
        mentorshipApplicationId,
    )
    const docSnap = await getDoc(applicationRef)

    if (docSnap.exists()) {
        const { menteeId, mentorId } = docSnap.data()
        let updateApplicationPromise: Array<any> = []
        updateApplicationPromise.push(
            updateDoc(applicationRef, {
                outcome: isAccept ? 1 : 0,
            }),
        )
        const mentor = await findUserById(mentorId)
        const { skills } = mentor
        let mentorshipSkills: any[] = []
        skills.forEach((skill: string) => {
            mentorshipSkills.push({
                skillId: skill,
                skillLevel: 0,
            })
        })

        // update data
        if (isAccept) {
            updateApplicationPromise.push(
                addDoc(collection(db, "mentorship"), {
                    joinDate: new Date(),
                    menteeId,
                    mentorId,
                    skills: mentorshipSkills,
                }),
            )
        }
        Promise.all(updateApplicationPromise)
            .then(() => {
                toast({
                    title:
                        "Application " + (isAccept ? "Accepted" : "Rejected"),
                    description: "",
                    status: "success",
                    duration: 1000,
                    isClosable: true,
                })
                navigate("/mentees")
            })
            .catch((err: any) => {
                console.log(err.message)
                toast({
                    title: "Something went wrong",
                    description: "Please try again later",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                })
                navigate("/mentees")
            })
    } else {
        toast({
            title: "Error",
            description: "Invalid application",
            status: "error",
            duration: 1000,
            isClosable: true,
        })
        navigate("/mentees")
    }
}
