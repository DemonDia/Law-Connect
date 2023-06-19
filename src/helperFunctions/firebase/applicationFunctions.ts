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
export const createApplication = async (
    applicantId: string,
    companyId: string,
    toast: any,
) => {
    // applicant cannot be company
    const validApplicant = await findUserById(applicantId)

    // company only
    const validCompany = await findUserById(companyId)

    if (
        validApplicant &&
        validCompany &&
        validApplicant.userType != "2" &&
        validCompany.userType == "2"
    ) {
        // apply
        await addDoc(collection(db, "application"), {
            applicantId,
            companyId,
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
        console.log("omg")
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
export const getUserApplications = async (userId: string) => {
    const companies = await findUsersByUserTypes("2")
    let companyDict: any = {}
    companies.forEach((company: any) => {
        const { userId, username } = company
        companyDict[userId] = username
    })

    const findQuery = query(
        collection(db, "application"),
        where("applicantId", "==", userId),
    )
    const docSnap = await getDocs(findQuery)
    let applications: Array<any> = []
    docSnap.forEach(doc => {
        let applicationToPush = doc.data()
        const { companyId } = applicationToPush
        applicationToPush = {
            ...applicationToPush,
            id: doc.id,
            companyName: companyDict[companyId],
        }
        applications.push(applicationToPush)
    })
    return applications
}

// =========get company applications=========
// mentors & mentees
export const getCompanyApplications = async (companyId: string) => {
    const mentees = await findUsersByUserTypes("0")
    const mentors = await findUsersByUserTypes("1")
    const allLaywers = [...mentees, ...mentors]

    let lawyerDict: any = {}
    allLaywers.forEach((lawyer: any) => {
        const { userId, username } = lawyer
        lawyerDict[userId] = username
    })

    const findQuery = query(
        collection(db, "application"),
        where("companyId", "==", companyId),
    )
    const docSnap = await getDocs(findQuery)
    let applications: Array<any> = []
    docSnap.forEach(doc => {
        let applicationToPush = doc.data()
        const { applicantId } = applicationToPush
        applicationToPush = {
            ...applicationToPush,
            id: doc.id,
            applicantName: lawyerDict[applicantId],
        }
        applications.push(applicationToPush)
    })
    return applications
}

// =========get applicant info=========
export const getApplicationInfo = async (applicationId: string) => {
    // get
    const docSnap = await getDoc(doc(db, "application", applicationId))

    if (docSnap.exists()) {
        const { applicantId, companyId, applicationDate, outcome } =
            docSnap.data()

        const applicant = await findUserById(applicantId)
        if (applicant) {
            const { username, email } = applicant
            return { username, applicationDate, outcome, companyId, email }
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
export const updateApplication = async (
    applicationId: string,
    isAccept: boolean,
    toast: any,
    navigate: any,
) => {
    // get application by ID
    const applicationRef = doc(db, "application", applicationId)
    const docSnap = await getDoc(applicationRef)

    if (docSnap.exists()) {
        const { applicantId, companyId } = docSnap.data()
        let updateApplicationPromise: Array<any> = []
        updateApplicationPromise.push(
            updateDoc(applicationRef, {
                outcome: isAccept ? 1 : 0,
            }),
        )
        // update data
        if (isAccept) {
            updateApplicationPromise.push()
            addDoc(collection(db, "membership"), {
                joinDate: new Date(),
                memberId: applicantId,
                companyId,
            })
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
                navigate("/lawyers")
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
                navigate("/lawyers")
            })
    } else {
        toast({
            title: "Error",
            description: "Invalid application",
            status: "error",
            duration: 1000,
            isClosable: true,
        })
        navigate("/lawyers")
    }
}
