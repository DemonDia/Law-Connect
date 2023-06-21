// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"

// ======= chakra UI ==========
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    SimpleGrid,
    Box,
    Heading,
    Text,
    useDisclosure,
    useToast,
    Image,
} from "@chakra-ui/react"

// ======= firebase ==========
import { findCompanyMentors } from "../../helperFunctions/firebase/userFirestore"
import {
    createMentorshipApplication,
    getUserMentorShipApplications,
} from "../../helperFunctions/firebase/mentorshipApplication"

import {
    checkMentorshipByMentorAndMentee,
    getMenteeMentors,
} from "../../helperFunctions/firebase/mentorshipFunctions"
import { getAllSkills } from "../../helperFunctions/firebase/skillsFunctions"
// ======= zustand/state ==========
import useUser from "../../store/userStore"
// ======= custom components (if any)==========
import TabTopbar from "../../components/general/TabTopbar"
import { SkillBadge } from "../../components/skills/SkillBadge"
import CustomButton from "../../components/general/CustomButton"
import ApplicationContainer from "../../components/mentee/ApplicationContainer"
import NoRecordsFoundComponent from "../../components/general/NoRecordsFoundComponent"
import LoadingComponent from "../../components/general/LoadingComponent"

// ============== interfaces (if any) ==============
interface Mentor {
    userId: string
    username: string
    email: string
    skills?: string[]
}

interface CurrentMentorProps {
    mentorName: string
    mentorEmail: string
    mentorshipId: string
}

interface MentorContainerProps {
    selectedMentor: Mentor | null
    currentMentor: Mentor | null
    skillDict: unknown
    isApplied: boolean
    handleApplyMentorship: (mentorId: string) => void
    handleToggleOpen?: () => void | null
    handleToggleClose?: () => void | null
}
// ============== external variables (if any) ==============
import ProfilePic from "../../assets/defaultProfilePic.png"

// ======= external functions  ==========

// ============== main component ==============

export default function MentorPage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()
    // for modal
    const { onOpen, onClose } = useDisclosure()
    // ============== states (if any) ==============
    const [selectedTab, setSelectedTab] = useState<number>(-1)
    const [companyMentors, setCompanyMentors] = useState<Mentor[]>([])
    const [currentMentors, setCurrentMentors] = useState<Mentor[]>([])
    const [mentorshipApplications, setMentorshipApplications] = useState<any>(
        [],
    )
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
    const [skillDict, setSkillDict] = useState<unknown>({})
    const [loading, setLoading] = useState(false)

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType == 0 && user.companyId) {
            setLoading(true)
            getMentorApplications()
            getMentors()
            getCurrentMentors()
            getSkills()
            setLoading(false)
        } else {
            navigate("/")
        }
    }, [])
    useEffect(() => {
        if (selectedTab == 0) {
            getMentorApplications()
        } else if (selectedTab == 1) {
            getMentors()
        } else if (selectedTab == 2) {
            getCurrentMentors()
        }
    }, [selectedTab])
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const getMentorApplications = async () => {
        const mentorApplications = await getUserMentorShipApplications(
            user.userId,
        )
        setMentorshipApplications(mentorApplications)

        // get all the mentor applications mentee has applied to
    }
    const getSkills = async () => {
        let currSkillDict = {}
        const skills = await getAllSkills()
        for (const [id, skill] of skills) {
            const { skillName } = skill
            currSkillDict[id] = skillName
        }
        setSkillDict(currSkillDict)
    }

    const getCurrentMentors = async () => {
        let mentors: Mentor[] = await getMenteeMentors(user.userId)
        setCurrentMentors(mentors)
    }
    const getMentors = async () => {
        // get all the mentors from the company
        const mentors = await findCompanyMentors(user.companyId)
        setCompanyMentors(mentors)
    }
    const selectTab = (tabNumber: number) => {
        if (tabNumber === selectedTab) {
            setSelectedTab(-1)
        } else {
            setSelectedTab(tabNumber)
        }
    }
    const displayMentor = async (currMentor: Mentor) => {
        // get the mentor
        if (currMentor) {
            // check if mentee is under this mentor or not
            const existingMentorshipId = await checkMentorshipByMentorAndMentee(
                currMentor.userId,
                user.userId,
            )
            if (existingMentorshipId) {
                navigate(`/mentee/m/${existingMentorshipId}`)
            } else {
                setSelectedMentor(currMentor)
                onOpen()
            }
        }
    }
    const applyMentorship = async () => {
        closeMentor()
        if (selectedMentor) {
            await createMentorshipApplication(
                user.userId,
                selectedMentor.userId,
                toast,
            )
        }
    }
    const closeMentor = () => {
        setSelectedMentor(null)
        onClose()
    }

    // show 2 parts: (no mentor)
    // 1. get mentors from company
    // 2. show mentor application

    // show mentor progress: (have mentor)

    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Retrieving the best mentors for you. . ." />
                </>
            ) : (
                <>
                    {" "}
                    {user && !user.companyId ? (
                        <>
                            <NoRecordsFoundComponent message="Please join a law firm before you proceed" />
                        </>
                    ) : (
                        <>
                            <TabTopbar
                                tabWords={[
                                    "View Mentor Applications",
                                    "View Available Mentors",
                                    "View Current Mentors",
                                ]}
                                tab={selectedTab}
                                changeTab={selectTab}
                            />
                            <SimpleGrid
                                columns={[2, null, 3, 4, 6]}
                                spacing={5}
                                margin="10px">
                                {selectedTab == -1 ? null : (
                                    <>
                                        {selectedTab == 0 ? (
                                            <>
                                                {mentorshipApplications.map(
                                                    (
                                                        mentorshipApplication: unknown,
                                                        index: number,
                                                    ) => {
                                                        const {
                                                            mentorName,
                                                            applicationDate,
                                                            outcome,
                                                        } =
                                                            mentorshipApplication

                                                        return (
                                                            <ApplicationContainer
                                                                key={index}
                                                                companyName={
                                                                    mentorName
                                                                }
                                                                applicationDate={
                                                                    applicationDate
                                                                }
                                                                applicationOutcome={
                                                                    outcome
                                                                }
                                                            />
                                                        )
                                                    },
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {selectedTab == 1 ? (
                                                    <>
                                                        {/* all mentors in compnay */}
                                                        {companyMentors.map(
                                                            (
                                                                mentor: Mentor,
                                                                index: number,
                                                            ) => {
                                                                const found: any =
                                                                    mentorshipApplications.find(
                                                                        (
                                                                            mentorshipApplication: any,
                                                                        ) => {
                                                                            return (
                                                                                mentorshipApplication.mentorId ===
                                                                                mentor.userId
                                                                            )
                                                                        },
                                                                    )
                                                                const isFound =
                                                                    found !=
                                                                    null
                                                                console.log(
                                                                    "mentor",
                                                                    mentor,
                                                                )
                                                                return (
                                                                    <CompanyMentorContainer
                                                                        handleApplyMentorship={
                                                                            applyMentorship
                                                                        }
                                                                        handleToggleOpen={
                                                                            displayMentor
                                                                        }
                                                                        handleToggleClose={
                                                                            closeMentor
                                                                        }
                                                                        key={
                                                                            index
                                                                        }
                                                                        selectedMentor={
                                                                            selectedMentor
                                                                        }
                                                                        skillDict={
                                                                            skillDict
                                                                        }
                                                                        currentMentor={
                                                                            mentor
                                                                        }
                                                                        isApplied={
                                                                            isFound
                                                                        }
                                                                    />
                                                                )
                                                            },
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* current mentors that you have */}
                                                        {currentMentors.map(
                                                            (
                                                                mentor: CurrentMentorProps,
                                                                index: number,
                                                            ) => {
                                                                console.log(
                                                                    "currentMentor",
                                                                    mentor,
                                                                )
                                                                const {
                                                                    mentorName,
                                                                    mentorEmail,
                                                                    mentorshipId,
                                                                } = mentor
                                                                return (
                                                                    <CurrentMentorContainer
                                                                        key={
                                                                            index
                                                                        }
                                                                        mentorName={
                                                                            mentorName
                                                                        }
                                                                        mentorEmail={
                                                                            mentorEmail
                                                                        }
                                                                        mentorshipId={
                                                                            mentorshipId
                                                                        }
                                                                    />
                                                                )
                                                            },
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </SimpleGrid>
                        </>
                    )}
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
const CurrentMentorContainer = ({
    mentorName,
    mentorEmail,
    mentorshipId,
}: CurrentMentorProps) => {
    return (
        <Box
            background={"white"}
            p="10px"
            borderRadius={"10px"}
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <SimpleGrid columns={2}>
                <Box>
                    <Image
                        src={ProfilePic}
                        alt="Profile Picture"
                        margin="10px auto"
                    />
                </Box>

                <Box padding="5px" margin={"5px"} width="100%">
                    <Heading as="h6" size={"sm"} noOfLines={1}>
                        {mentorName}
                    </Heading>
                    <Text noOfLines={1}>{mentorEmail}</Text>
                    <br></br>
                    <Link to={`/mentee/m/${mentorshipId}`}>
                        <Text>More Info</Text>
                    </Link>
                </Box>
            </SimpleGrid>
        </Box>
    )
}

const CompanyMentorContainer = ({
    currentMentor,
    selectedMentor,
    skillDict,
    isApplied,
    handleApplyMentorship,
    handleToggleOpen,
    handleToggleClose,
}: MentorContainerProps) => {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    const { userId, username, email, skills } = currentMentor

    return (
        <Box
            background={"white"}
            p="10px"
            borderRadius={"10px"}
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <SimpleGrid columns={2}>
                <Box>
                    <Image
                        src={ProfilePic}
                        alt="Profile Picture"
                        margin="10px auto"
                    />
                </Box>

                <Box
                    padding="5px"
                    margin={["5px", null, null, "5px auto"]}
                    maxWidth="100%">
                    <Heading
                        as="h6"
                        size={"sm"}
                        noOfLines={1}
                        overflow={"hidden"}>
                        {username}
                    </Heading>
                    <Text noOfLines={1} overflow={"hidden"}>
                        {email}
                    </Text>
                    <br></br>
                    <Text
                        onClick={() => {
                            handleToggleOpen(currentMentor)
                        }}>
                        More Info
                    </Text>
                </Box>
            </SimpleGrid>

            <MentorModalContainer
                currentMentor={currentMentor}
                selectedMentor={selectedMentor}
                skillDict={skillDict}
                handleApplyMentorship={handleApplyMentorship}
                handleToggleClose={handleToggleClose}
                isApplied={isApplied}
            />
        </Box>
    )
}

const MentorModalContainer = ({
    selectedMentor,
    skillDict,
    isApplied,
    handleApplyMentorship,
    handleToggleClose,
}: MentorContainerProps) => {
    return (
        <Modal isOpen={selectedMentor != null} onClose={handleToggleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Apply Mentorship</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Image
                        src={ProfilePic}
                        alt="Dan Abramov"
                        margin="10px auto"
                        width="80%"
                    />
                    <br />
                    <Text>
                        Name:{" "}
                        {selectedMentor
                            ? selectedMentor.username
                            : "exmaple@email.com"}
                    </Text>
                    <Text>
                        Mentor:{" "}
                        {selectedMentor
                            ? selectedMentor.email
                            : "exmaple@email.com"}
                    </Text>

                    <br />

                    <Text>Key skills:</Text>
                    {selectedMentor && selectedMentor.skills ? (
                        <>
                            {selectedMentor.skills.map(
                                (skill: string, index: number) => {
                                    return (
                                        <SkillBadge
                                            skillId={skill}
                                            skillName={
                                                skillDict
                                                    ? skillDict[skill]
                                                    : "N/A"
                                            }
                                        />
                                    )
                                },
                            )}
                        </>
                    ) : (
                        <>N/A</>
                    )}
                </ModalBody>

                <ModalFooter>
                    {isApplied ? (
                        <Text>
                            You have applied to be a mentee. Please wait for the
                            outcome.
                        </Text>
                    ) : (
                        <>
                            {" "}
                            <CustomButton
                                buttonColor="#6D6D6D"
                                textColor="white"
                                buttonText="Cancel"
                                buttonOnClick={handleToggleClose}
                            />
                            <CustomButton
                                buttonColor="#2A07B7"
                                textColor="white"
                                buttonText="Request Mentorship"
                                buttonOnClick={handleApplyMentorship}
                            />
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
