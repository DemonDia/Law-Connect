// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { SimpleGrid, useToast, Heading } from "@chakra-ui/react"

// ======= firebase ==========
import {
    getMentorshipById,
    checkMentorshipByMentorAndMentee,
} from "../../helperFunctions/firebase/mentorshipFunctions"
import { getAllSkills } from "../../helperFunctions/firebase/skillsFunctions"

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import SkillProgressContainer from "../../components/mentorship/SkillProgressContainer"
import LoadingComponent from "../../components/general/LoadingComponent"

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function ViewIndividualMentorship() {
    // ============== constant variables if any ==============
    const { mentorshipId } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()

    // ============== states (if any) ==============
    const [currentMentorship, setCurrentMentorship] = useState<unknown>(null)
    const [allSkills, setAllSkills] = useState<any>([])
    const [skillDict, setSkillDict] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(true)

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType == 0) {
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
    const getMentorship = async () => {
        const mentorship = await getMentorshipById(mentorshipId)
        const isPresent = await checkMentorshipByMentorAndMentee(
            mentorship.mentorId,
            user.userId,
        )
        if (!isPresent) {
            navigate("/")
        }
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
            {loading ? (
                <>
                    <LoadingComponent message="Finding current mentorship ..." />{" "}
                </>
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
                    <SimpleGrid columns={[2, null, 3]} gap={0}>
                        {currentMentorship && currentMentorship.skills ? (
                            <>
                                {currentMentorship.skills.map((skill: any) => {
                                    const { skillLevel, skillId } = skill
                                    return (
                                        <SkillProgressContainer
                                            skillName={skillDict[skillId]}
                                            skillLevel={skillLevel}
                                            editable={false}
                                        />
                                    )
                                })}
                            </>
                        ) : (
                            <></>
                        )}
                    </SimpleGrid>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
