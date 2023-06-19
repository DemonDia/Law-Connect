// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
// ======= chakra UI ==========
import { SimpleGrid, useToast, Heading } from "@chakra-ui/react"

// ======= firebase ==========
import { getMentorshipById } from "../../helperFunctions/firebase/mentorshipFunctions"
import { getAllSkills } from "../../helperFunctions/firebase/skillsFunctions"
// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import SkillProgressContainer from "../../components/mentorship/SkillProgressContainer"

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============
export default function IndividualMentorshipPage() {
    // ============== constant variables if any ==============
    const { mentorshipId } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()

    // ============== states (if any) ==============
    const [currentMentorship, setCurrentMentorship] = useState<unknown>(null)
    const [allSkills, setAllSkills] = useState<any>([])
    const [skillDict, setSkillDict] = useState<any>({})
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType == 1) {
            getAllSkillInfo()
            getMentorship()
        } else {
            navigate("/")
        }
    }, [])
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const getMentorship = async () => {
        const mentorship = await getMentorshipById(mentorshipId)
        setCurrentMentorship(mentorship)
    }
    const getAllSkillInfo = async () => {
        const skills = await getAllSkills()
        setAllSkills(skills)

        Promise.resolve(skills).then(res => {
            setSkillDict(res)
            let currentSkillDict = {}
            for (const [id, skill] of res) {
                const { skillName } = skill
                currentSkillDict[id] = skillName
            }
            setSkillDict(currentSkillDict)
        })
    }

    return (
        <>
            <Heading as="h6" textAlign={"center"} size="md">
                Progress for:{" "}
                {currentMentorship && currentMentorship.menteeName ? (
                    <>{currentMentorship.menteeName}</>
                ) : (
                    <>Mentee A</>
                )}{" "}
            </Heading>
            <SimpleGrid columns={3} gap={0}>
                {currentMentorship && currentMentorship.skills ? (
                    <>
                        {currentMentorship.skills.map((skill: any) => {
                            const { skillLevel, skillId } = skill
                            return (
                                <SkillProgressContainer
                                    skillName={skillDict[skillId]}
                                    skillLevel={skillLevel}
                                />
                            )
                        })}
                    </>
                ) : (
                    <></>
                )}
            </SimpleGrid>
        </>
    )
}

// ============== sub component(s) if any ==============
