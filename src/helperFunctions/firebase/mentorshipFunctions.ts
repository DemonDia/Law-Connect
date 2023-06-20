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
    setDoc,
} from "firebase/firestore"
import { findUsersByUserTypes, findUserById } from "./userFirestore"
import { getAllSkills } from "./skillsFunctions"

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
    console.log("docSnap", docSnap)

    if (docSnap.exists()) {
        const { menteeId, mentorId, joinDate, skills } = docSnap.data()
        console.log(docSnap.data())
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
export const updateMentorshipSkill = async (
    mentorId: string,
    menteeId: string,
    mentorshipId: string,
    skills: Array<any>,
    toast: any,
) => {
    const skillToUpdateRef = doc(db, "mentorship", mentorshipId)
    await updateDoc(skillToUpdateRef, {
        skills,
    })
        .then(async () => {
            const userObtainedBadgeIds = await getDistinctBadgesOfMentee(
                menteeId,
            )
            console.log("userObtainedBadgeIds", userObtainedBadgeIds)
            skills.forEach(async skill => {
                const { skillId, skillLevel } = skill
                console.log("skillId", skillId)
                console.log("skillLevel", skillLevel)
                console.log(
                    "userObtainedBadgeIds.includes(skillId)",
                    userObtainedBadgeIds.includes(skillId),
                )
                console.log("skillLevel", skillLevel == 100)
                if (
                    !userObtainedBadgeIds.includes(skillId) &&
                    skillLevel == 100
                ) {
                    // add badge
                    console.log("Done")
                    await addDoc(collection(db, "badge"), {
                        senderId: mentorId,
                        recipientId: menteeId,
                        skillId,
                        receivedDate: new Date(),
                    })
                }
            })

            toast({
                title: "Skill updated successfully",
                description: "",
                status: "success",
                duration: 1000,
                isClosable: true,
            })
        })
        .catch(err => {
            toast({
                title: "Error updating skill",
                description: "Please try again later",
                status: "error",
                duration: 1000,
                isClosable: true,
            })
        })
}

// return badge arr
// badge is: {senderId, recipientId, skillId, receivedDate}
export const findMenteeBadges = async (menteeId: string) => {
    console.log("menteeId", menteeId)

    const menteeBadges: any[] = []
    // make a skill dictionary (skillId as the key)
    const skillDict: any = {}
    const allSkills = await getAllSkills()
    for (const [id, skill] of allSkills) {
        const { skillName } = skill
        skillDict[id] = skillName
    }

    // make a mentor dictionary (mentorId as the key)
    const mentorDict: any = {}
    const allMentors = await findUsersByUserTypes("1")
    allMentors.forEach((mentor: any) => {
        const { userId, username } = mentor
        mentorDict[userId] = username
    })

    // find all received badges
    const findQuery = query(
        collection(db, "badge"),
        where("recipientId", "==", menteeId),
    )
    const docSnap = await getDocs(findQuery)
    docSnap.forEach(doc => {
        const { skillId, senderId, receivedDate } = doc.data()
        menteeBadges.push({
            skillName: skillDict[skillId],
            senderName: mentorDict[senderId],
            receivedDate,
        })
    })
    return menteeBadges
}

// get all the skillIds
export const getDistinctBadgesOfMentee = async (menteeId: string) => {
    const findQuery = query(
        collection(db, "badge"),
        where("recipientId", "==", menteeId),
    )
    const badgeIds: unknown[] = []
    const docSnap = await getDocs(findQuery)
    docSnap.forEach(doc => {
        const { skillId } = doc.data()
        badgeIds.push(skillId)
    })
    return badgeIds
}
