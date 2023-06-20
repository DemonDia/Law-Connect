// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react"
// ======= chakra UI ==========
import { Select } from "@chakra-ui/react"
// ======= custom components (if any)==========
import { SkillBadge } from "./SkillBadge"

// ============== interfaces (if any) ==============
interface SkillSelectorProps {
    handleDeleteSkillId?: any
    selectedSkillId: string
    handleChangeSelectedSkillId?: any
    chosenSkills: Array<string>
}
// ============== external variables (if any) ==============
import { getAllSkills } from "../../helperFunctions/firebase/skillsFunctions"

// ============== main component ==============

export const SkillSelector = ({
    handleDeleteSkillId,
    selectedSkillId,
    handleChangeSelectedSkillId,
    chosenSkills,
}: SkillSelectorProps) => {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    const [availableSkills, setAvailableSkills] = useState<any>([])
    const [skillDict, setSkillDict] = useState<any>(null)
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        const allSkills = getAllSkills()
        Promise.resolve(allSkills).then(res => {
            setSkillDict(res)
            let skills = []
            for (const [id, skill] of res) {
                const { skillName } = skill
                skills.push({ skillId: id, skillName })
            }
            setAvailableSkills(skills)
        })
    }, [])
    // ============== helper functions if any ==============

    // ============== key functions if any ==============
    return (
        <>
            <Select
                placeholder="Add Skill Name"
                m={"10px auto"}
                value={selectedSkillId}
                onChange={handleChangeSelectedSkillId}>
                {availableSkills ? (
                    <>
                        {availableSkills.map(
                            (availableSkill: any, index: number) => {
                                const { skillId, skillName } = availableSkill
                                return (
                                    <option key={index} value={skillId}>
                                        {skillName}
                                    </option>
                                )
                            },
                        )}
                    </>
                ) : null}
            </Select>
            {chosenSkills && skillDict ? (
                <>
                    {" "}
                    {chosenSkills.map((skillId, index) => {
                        return (
                            <SkillBadge
                                key={index}
                                skillName={
                                    skillDict && skillDict.get(skillId)
                                        ? skillDict.get(skillId).skillName
                                        : "Skill mame"
                                }
                                skillId={skillId}
                                handleDeleteSkillId={handleDeleteSkillId}
                            />
                        )
                    })}
                </>
            ) : (
                <></>
            )}
        </>
    )
}
