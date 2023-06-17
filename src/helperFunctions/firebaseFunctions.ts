// =======================the necessary imports=======================
import { auth, db } from "../config";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
    User,
} from "firebase/auth";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    where,
    query,
    updateDoc,
} from "firebase/firestore";

import { checkPathName } from "./authentication/checkPathName";
import { getDatabase } from "firebase/database";

// =======================the key functions=======================
// ==========authentication-related==========
// this is for authentication
// login user
interface UserLoginData {
    email: string;
    password: string;
}
export const loginUserViaEmail = async (
    { email, password }: UserLoginData,
    navigate: any,
    toast: any
) => {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // Signed in
            toast({
                title: "Login successful",
                description: "Redirecting ...",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            navigate("/");
        })
        .catch((error) => {
            const errorMessage = error.message;
            toast({
                title: "Login failed",
                description: errorMessage,
                status: "error",
                duration: 1000,
                isClosable: true,
            });
        });
};

// register user (email)
// return user if successful, else return null
export const registerUserViaEmail = async (email: string, password: string) => {
    const newUser = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = newUser;
    if (user) {
        return user;
    }
    return null;
};

// create user in firestore
export const createUserRecord = async (userId: string, email: string) => {
    try {
        const userRecord = await addDoc(collection(db, "users"), {
            userId,
            email,
            userType: -1,
            isSetUp: false,
        });
        if (userRecord) {
            return true;
        }
    } catch (e) {
        return false;
    }
};

// check logged user & finished setup
// [loggedUser, isSetUp]
export const checkLoggedUser = async (navigate: any, pathname: string) => {
    await onAuthStateChanged(auth, async (user) => {
        if (user) {
            const { uid } = user;
            const userRecord: any = await findUserById(uid);
            if (userRecord) {
                const { isSetUp } = userRecord;
                if (!isSetUp) {
                    // console.log("A");
                    navigate("/setup/" + uid);
                } else {
                    // console.log("B");
                    navigate("/setup/" + uid);
                }
            } else {
                // console.log("checked", checked);
                if (!checkPathName(pathname)) {
                    // console.log("C");
                    navigate("/login");
                }
                // console.log("D");
            }
            // ...
        } else {
            if (!checkPathName(pathname)) {
                // console.log("E");
                navigate("/login");
            }
            // console.log("F");
        }
    });
};

// logout user
export const logoutUser = async (toast: any, navigate: any) => {
    await signOut(auth)
        .then(() => {
            // Sign-out successful.
            toast({
                title: "Successfully logged out",
                description: "",
                status: "success",
                duration: 1000,
                isClosable: true,
            });
            navigate("/login");
        })
        .catch((error) => {
            console.log(error.message);
            // An error happened.
            toast({
                title: "Logout failed",
                description: "Something went wrong. Please try again later.",
                status: "error",
                duration: 1000,
                isClosable: true,
            });
        });
};

// submit first time setup
export const firstTimeSetup = async (
    userSetupData: any,
    navigate: any,
    toast: any
) => {
    const { userId, skills, userType, name } = userSetupData;
    await onAuthStateChanged(auth, async (user) => {
        if (user && auth.currentUser) {
            const { uid } = user;
            if (uid == userId) {
                const userRecord: any = await findUserById(uid);
                Promise.resolve(userRecord).then((user) => {
                    if (user) {
                        let allPromises = [];
                        // change username in auth
                        if (auth.currentUser) {
                            // working
                            allPromises.push(
                                updateProfile(auth.currentUser, {
                                    displayName: name,
                                })
                            );
                        }

                        // skills/userId
                        // update skills
                        const skillCollection: any = collection(
                            db,
                            "userSkills"
                        );
                        allPromises.push(
                            addDoc(skillCollection, {
                                userId: skills,
                            })
                        );

                        // update status and userType
                        const userDocRef = doc(db, "users", userRecord.id);
                        allPromises.push(
                            updateDoc(userDocRef, {
                                username: name,
                                userType,
                                isSetUp: true,
                            })
                        );
                        Promise.allSettled(allPromises).then(() => {
                            toast({
                                title: "Setup successful",
                                description: "Setup created, thank you!",
                                status: "success",
                                duration: 1000,
                                isClosable: true,
                            });
                            navigate("/");
                        });
                    }
                });
            }
        }
    });
};

interface Skill {
    skillId: Skill;
    skillName: string;
    skillDesc: string;
}
export const seedSkills = async () => {
    const skills: Array<Skill> = [
        {
            skillName: "Legal Knowledge",
            skillDesc:
                "Lawyers must have a strong foundation in the law, including knowledge of statutes, regulations, case law, and legal principles relevant to their area of practice.",
        },
        {
            skillName: "Research Skills",
            skillDesc:
                "Lawyers need to be proficient in legal research, which involves locating and analyzing relevant legal authorities to support their cases or arguments.",
        },
        {
            skillName: "Analytical Thinking",
            skillDesc:
                "Lawyers must possess strong analytical skills to dissect complex legal issues, identify key components, and evaluate different options or strategies.",
        },
        {
            skillName: "Problem-Solving",
            skillDesc:
                "Lawyers should excel in problem-solving, applying legal principles to specific situations and finding creative solutions to legal challenges.",
        },
        {
            skillName: "Writing Skills",
            skillDesc:
                "Effective written communication is crucial for lawyers. They must be able to draft clear, concise, and persuasive legal documents, such as briefs, contracts, and legal opinions.",
        },
        {
            skillName: "Oral Communication",
            skillDesc:
                "Lawyers need strong oral communication skills to present arguments, negotiate, and interact effectively with clients, judges, juries, and other legal professionals.",
        },
        {
            skillName: "Advocacy",
            skillDesc:
                "Lawyers should be skilled advocates, able to present their clients' cases persuasively in courtrooms or during negotiations, and effectively counter opposing arguments.",
        },
        {
            skillName: "Attention to Detail",
            skillDesc:
                "The legal profession requires meticulous attention to detail to ensure accuracy in legal documents, contracts, and other written materials.",
        },
        {
            skillName: "Organization and Time Management",
            skillDesc:
                "Lawyers handle multiple cases simultaneously and must effectively manage their time, prioritize tasks, and meet deadlines.",
        },
        {
            skillName: "Client Service",
            skillDesc:
                "Lawyers should be able to provide excellent client service, establishing trust, actively listening to clients, and addressing their concerns.",
        },
        {
            skillName: "Negotiation Skills",
            skillDesc:
                "Lawyers frequently engage in negotiations to settle disputes or reach agreements. Strong negotiation skills are crucial for achieving favorable outcomes.",
        },
        {
            skillName: "Mediation and Conflict Resolution",
            skillDesc:
                "Lawyers may be involved in mediating conflicts between parties, requiring skills in facilitating communication and reaching mutually satisfactory resolutions.",
        },
        {
            skillName: "Ethical Conduct",
            skillDesc:
                "Lawyers must adhere to high ethical standards, maintaining client confidentiality, avoiding conflicts of interest, and upholding professional integrity.",
        },
        {
            skillName: "Emotional Intelligence",
            skillDesc:
                "Lawyers benefit from emotional intelligence, understanding and managing their own emotions and empathizing with clients, colleagues, and opposing parties.",
        },
        {
            skillName: "Business and Financial Acumen",
            skillDesc:
                "Many lawyers work in law firms or have their own practices, requiring business and financial skills to manage finances, attract clients, and handle administrative matters.",
        },
        {
            skillName: "Networking",
            skillDesc:
                "Building a professional network is important for lawyers to develop referrals, expand their client base, and collaborate with other legal professionals.",
        },
        {
            skillName: "Adaptability",
            skillDesc:
                "The legal field is constantly evolving, and lawyers should be adaptable, open to new challenges, and able to quickly grasp changes in laws or legal precedents.",
        },
    ];
    let count: number = 0;
    const querySnapshot: any = await getDocs(collection(db, "skills"));
    querySnapshot.forEach((doc: any) => {
        count += 1;
    });
    if (count == 0) {
        skills.forEach(async (skill: Skill) => {
            const { skillName, skillDesc } = skill;
            await addDoc(collection(db, "skills"), {
                skillName,
                skillDesc,
            })
                .then((res: any) => {
                    console.log("added");
                })
                .catch((err: any) => {
                    console.log(err);
                });
        });
    }
};
seedSkills();

// ==========find/retrieve functions==========
// get all skills
export const getAllSkills = async () => {
    const querySnapshot: any = await getDocs(collection(db, "skills"));
    // let skills: Array<any> = [];
    let skills: Map<string, any> = new Map();
    querySnapshot.forEach((doc: any) => {
        const { skillName, skillDesc } = doc.data();
        skills.set(doc.id, { skillName, skillDesc });
        // const { id } = doc;
        // const { skillName, skillDesc } = doc.data();
        // skills.push({ id: { skillName, skillDesc } });
    });
    return skills;
};

// find user
// returns user if any
// else return null
export const findUserById = async (userId: string) => {
    const findQuery = query(
        collection(db, "users"),
        where("userId", "==", userId)
    );
    const docSnap = await getDocs(findQuery);
    let foundUser: any = null;

    docSnap.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        foundUser = doc.data();
        foundUser = { ...foundUser, id: doc.id };
    });
    return foundUser;
};

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

// ========== find user by userTypes ==========
// "0" for mentor
// "1" for mentee
// "2" for company
export const findUsersByUserTypes = async (userType: string) => {
    const findQuery = query(
        collection(db, "users"),
        where("userType", "==", userType)
    );
    const docSnap = await getDocs(findQuery);
    let targetUsers: any = [];

    docSnap.forEach((doc) => {
        targetUsers.push(doc.data());
    });
    return targetUsers;
};
