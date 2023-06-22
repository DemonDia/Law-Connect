import { db } from "../../config"

import { collection, addDoc, getDocs } from "firebase/firestore"

interface Skill {
    skillName: string
    // skillDesc: string
}
export const seedSkills = async () => {
    const skills: Array<Skill> = [
        { skillName: "Advanced Patent Law" },
        { skillName: "Applied Research Project" },
        { skillName: "Assessing IP in Branding & Franchising" },
        { skillName: "Assessing Technology" },
        { skillName: "Commercialising Innovation" },
        { skillName: "Contemporary Topics in Technology and Business" },
        { skillName: "IP & Business Strategy" },
        { skillName: "IP Asset Management" },
        { skillName: "IP in R&D and Innovation" },
        { skillName: "IP in the Global Context" },
        { skillName: "IP Intelligence" },
        { skillName: "Commercialising Innovation" },
        { skillName: "Licensing IP" },
        { skillName: "Monetising Innovation: Valuation" },
        { skillName: "Patent Applications" },
        { skillName: "Patent Claims" },
        { skillName: "Patent Information & Search" },
        { skillName: "Patent Infringement & Validity" },
        { skillName: "Patent Office Action" },
        { skillName: "Patent Practice in Singapore" }
      ]
      
    let count: number = 0
    const querySnapshot: any = await getDocs(collection(db, "skills"))
    querySnapshot.forEach((doc: any) => {
        count += 1
    })
    if (count == 0) {
        skills.forEach(async (skill: Skill) => {
            const { skillName, 
                // skillDesc
             } = skill
            await addDoc(collection(db, "skills"), {
                skillName,
                // skillDesc,
            })
                .then((res: any) => {
                    console.log("added")
                })
                .catch((err: any) => {
                    console.log(err)
                })
        })
    }
}
seedSkills()

// ==========find/retrieve functions==========
// get all skills
export const getAllSkills = async () => {
    const querySnapshot: any = await getDocs(collection(db, "skills"))
    let skills: Map<string, any> = new Map()
    querySnapshot.forEach((doc: any) => {
        const { skillName, skillDesc } = doc.data()
        skills.set(doc.id, { skillName, skillDesc })
    })
    return skills
}
