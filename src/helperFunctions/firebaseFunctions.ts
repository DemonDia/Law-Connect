// =======================the necessary imports=======================
import { auth, db } from "../config";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    where,
    query,
} from "firebase/firestore";

import { checkPathName } from "./authentication/checkPathName";

// =======================the key functions=======================
// ==========authentication-related==========
// this is for authentication
// login user

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
export const createUserRecord = async (userId: string) => {
    try {
        const userRecord = await addDoc(collection(db, "users"), {
            userId,
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
    console.log("pathname", pathname);
    await onAuthStateChanged(auth, async (user) => {
        if (user) {
            const { uid } = user;
            const userRecord: any = await findUserById(uid);
            console.log("userRecord", userRecord);
            if (userRecord) {
                const { isSetUp } = userRecord;
                if (isSetUp) {
                    // console.log("A");
                    navigate("/");
                } else {
                    // console.log("B");
                    navigate("/setup");
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
            const checked = checkPathName(pathname);
            console.log("checked", checked);
            if (!checkPathName(pathname)) {
                // console.log("E");
                navigate("/login");
            }
            // console.log("F");
        }
    });
};

// logout user

// submit first time setup
export const firstTimeSetup = async (userSetupData: Object) => {
    try {
        const user = auth.currentUser;

        if (user) {
            // set user name
            // set user type (1=mentor, 2=mentee, 3=firm)
            // set user skills
            // set user isSetUp to true (after promise)
        }
    } catch (e) {
        return false;
    }
};

interface Skill {
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

// ==========find-functions==========

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
    });
    return foundUser;
};
