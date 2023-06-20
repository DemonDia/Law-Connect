// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
// ======= chakra UI ==========
import { SimpleGrid, useToast, Heading } from "@chakra-ui/react"

// ======= firebase ==========
import {
    getMentorshipById,
    updateMentorshipSkill,
} from "../../helperFunctions/firebase/mentorshipFunctions"
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
    const [skillDict, setSkillDict] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType == 1) {
            setLoading(true)
            getAllSkillInfo()
            getMentorship()
            setLoading(false)
        } else {
            navigate("/")
        }
    }, [])

    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const updateSkillProgress = async () => {
        // if exceed 100, award a badge
        await updateMentorshipSkill(
            user.userId,
            currentMentorship.menteeId,
            mentorshipId,
            currentMentorship.skills,
            toast,
        )
    }

    const getMentorship = async () => {
        try {
            const mentorship = await getMentorshipById(mentorshipId)
            if (mentorship && mentorship.mentorId != user.userId) {
                navigate("/")
            }
            setCurrentMentorship(mentorship)
        } catch (err) {
            console.log("err", err)
        }
    }

    const getAllSkillInfo = async () => {
        const skills = await getAllSkills()
        Promise.resolve(skills).then(res => {
            setSkillDict(res)
            const currentSkillDict = {}
            for (const [id, skill] of res) {
                const { skillName } = skill
                currentSkillDict[id] = skillName
            }
            setSkillDict(currentSkillDict)
        })
    }

    return (
        <>
            {loading ? (
                <></>
            ) : (
                <>
                    {" "}
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
                                {currentMentorship.skills.map(
                                    (skill: any, key: number) => {
                                        const { skillLevel, skillId } = skill
                                        return (
                                            <SkillProgressContainer
                                                key={key}
                                                skills={
                                                    currentMentorship.skills
                                                }
                                                // skillId={skillId}
                                                skillNum={key}
                                                skillLevel={skillLevel}
                                                skillName={skillDict[skillId]}
                                                handleUpdateSkillProgress={
                                                    updateSkillProgress
                                                }
                                                editable={!(skillLevel == 100)}
                                            />
                                        )
                                    },
                                )}
                            </>
                        ) : (
                            <>Nothing for you to see.</>
                        )}
                    </SimpleGrid>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
