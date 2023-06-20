import { db } from "../../config"

import { collection, addDoc, getDocs } from "firebase/firestore"

interface Skill {
    skillName: string
    skillDesc: string
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
    ]
    let count = 0
    const querySnapshot: unknown = await getDocs(collection(db, "skills"))
    querySnapshot.forEach(() => {
        count += 1
    })
    if (count == 0) {
        skills.forEach(async (skill: Skill) => {
            const { skillName, skillDesc } = skill
            await addDoc(collection(db, "skills"), {
                skillName,
                skillDesc,
            })
                .then(() => {
                    console.log("added")
                })
                .catch((err: unknown) => {
                    console.log(err)
                })
        })
    }
}
seedSkills()

// ==========find/retrieve functions==========
// get all skills
export const getAllSkills = async () => {
    const querySnapshot: unknown = await getDocs(collection(db, "skills"))
    const skills: Map<string, unknown> = new Map()
    querySnapshot.forEach((doc: unknown) => {
        const { skillName, skillDesc } = doc.data()
        skills.set(doc.id, { skillName, skillDesc })
    })
    return skills
}
