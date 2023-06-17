import { db } from "../../config";
import { collection, getDocs, where, query, addDoc } from "firebase/firestore";
import { findUserById } from "./userFirestore";
import { findUsersByUserTypes } from "./userFirestore";
// =========create application=========
export const createApplication = async (
    applicantId: string,
    companyId: string,
    toast: any
) => {
    let validateUsersPromises: Array<any> = [];
    // applicant cannot be company
    const validApplicant = await findUserById(applicantId);
    validateUsersPromises.push(validApplicant);

    // company only
    const validCompany = await findUserById(companyId);
    validateUsersPromises.push(validCompany);

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
                });
            })
            .catch((err: any) => {
                console.log(err.message);
                toast({
                    title: "Error",
                    description: "Invalid application",
                    status: "error",
                    duration: 1000,
                    isClosable: true,
                });
            });
        return;
    } else {
        toast({
            title: "Error",
            description: "Invalid application",
            status: "error",
            duration: 1000,
            isClosable: true,
        });
        return;
    }
};

// =========get user applications=========
export const getUserApplications = async (userId: string) => {
    const companies = await findUsersByUserTypes("2");
    let companyDict: any = {};
    companies.forEach((company: any) => {
        const { userId, username } = company;
        companyDict[userId] = username;
    });

    const findQuery = query(
        collection(db, "application"),
        where("applicantId", "==", userId)
    );
    const docSnap = await getDocs(findQuery);
    let applications: Array<any> = [];
    docSnap.forEach((doc) => {
        let applicationToPush = doc.data();
        // console.log("applicationToPush",applicationToPush)
        const { companyId } = applicationToPush;
        applicationToPush = {
            ...applicationToPush,
            id: doc.id,
            companyName: companyDict[companyId],
        };
        applications.push(applicationToPush);
    });
    console.log("res", applications);
    return applications;
};
