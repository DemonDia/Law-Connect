// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { Box, Flex, Heading, Link, Text, useToast } from "@chakra-ui/react"

// ======= firebase ==========
import {
    getMentorshipApplicationInfo,
    updateMentorshipApplication,
} from "../../helperFunctions/firebase/mentorshipApplication"

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import TwoActionTopBar from "../../components/general/TwoActionTopBar"
import LoadingComponent from "../../components/general/LoadingComponent"

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
const pageNavigation = [
    {
        label: "Mentee Info",
        href: "#menteeInfo",
    },
    {
        label: "Skills Of Interest",
        href: "#skillsOfInterest",
    },
]

// ======= external functions  ==========
import { formatDate } from "../../helperFunctions/general/dateformatter"

// ============== main component ==============
export default function MentorshipApplicationPage() {
    // ============== constant variables if any ==============
    const { mentorshipApplicationId } = useParams()
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    // ============== states (if any) ==============
    const [currentMentorshipApplication, setCurrentMentorshipApplication] =
        useState<any>({})

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        setLoading(true)
        fetchMentorshipApplication()
        setLoading(false)
    }, [])
    // ============== helper functions if any ==============
    const fetchMentorshipApplication = async () => {
        const mentorshipApplication = await getMentorshipApplicationInfo(
            mentorshipApplicationId,
        )
        if (
            user &&
            mentorshipApplication &&
            mentorshipApplication.mentorId == user.userId
        ) {
            setCurrentMentorshipApplication(mentorshipApplication)
        } else {
            navigate("/mentees")
        }
    }

    const acceptApplication = async () => {
        await updateMentorshipApplication(
            mentorshipApplicationId,
            true,
            toast,
            navigate,
        )
    }
    const rejectApplication = async () => {
        await updateMentorshipApplication(
            mentorshipApplicationId,
            false,
            toast,
            navigate,
        )
    }
    // ============== key functions if any ==============

    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Getting mentorship progress ..." />{" "}
                </>
            ) : (
                <>
                    <Box>
                        <TwoActionTopBar
                            firstButtonWords="Reject Mentee"
                            firstButtonAction={rejectApplication}
                            firstButtonColor="#D00000"
                            secondButtonWords="Accept Mentee"
                            secondButtonAction={acceptApplication}
                            secondButtonColor="#1D00D0"
                            disabled={
                                currentMentorshipApplication.outcome != -1
                            }
                        />
                        <Flex>
                            <Box
                                w="30%"
                                h="90vh"
                                bg="white"
                                boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}
                                borderRadius={"10px"}
                                padding={"10px"}
                                margin={"10px"}>
                                {pageNavigation.map((item, index) => {
                                    const { label, href } = item
                                    return (
                                        <Link
                                            color={"#808080"}
                                            href={href}
                                            key={index}>
                                            <Box
                                                background={"#E6E6E6"}
                                                w={"100%"}
                                                margin={"10px auto"}
                                                padding="5px">
                                                {label}
                                            </Box>
                                        </Link>
                                    )
                                })}
                            </Box>

                            <Box
                                w="70%"
                                h="90vh"
                                bg="white"
                                boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}
                                borderRadius={"10px"}
                                padding={"10px"}
                                margin={"10px"}>
                                <Box id="lawerInfo" margin={"10px auto"}>
                                    <Heading as="h4" size="lg">
                                        {currentMentorshipApplication.username}
                                    </Heading>
                                    <Text>
                                        {currentMentorshipApplication.email}
                                    </Text>
                                    <Text>
                                        Requested at:
                                        {formatDate(
                                            Date(
                                                currentMentorshipApplication.applicationDate,
                                            ),
                                        )}
                                    </Text>
                                </Box>

                                <Box id="skillsPossessed" margin={"10px auto"}>
                                    <Heading as="h4" size="md">
                                        Skills Possessed:
                                    </Heading>
                                    {currentMentorshipApplication.skills ? (
                                        <></>
                                    ) : (
                                        <>N/A</>
                                    )}
                                </Box>
                            </Box>
                        </Flex>
                    </Box>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
