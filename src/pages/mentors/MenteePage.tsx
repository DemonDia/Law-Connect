// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// ======= chakra UI ==========
import { SimpleGrid, useToast } from "@chakra-ui/react"

// ======= firebase ==========
import { getMentorApplications } from "../../helperFunctions/firebase/mentorshipApplication"
import { getMentorMentees } from "../../helperFunctions/firebase/mentorshipFunctions"
// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import TabTopbar from "../../components/general/TabTopbar"
import MentorshipApplicationContainer from "../../components/mentor/MentorshipApplicationContainer"
import MenteeContainer from "../../components/mentor/MenteeContainer"
import NoRecordsFoundComponent from "../../components/general/NoRecordsFoundComponent"

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

// get current mentees and mentorship application

export default function MenteePage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()

    // ============== states (if any) ==============
    const [selectedTab, setSelectedTab] = useState<number>(-1)
    const [mentees, setMentees] = useState<any>([])
    const [mentorshipApplications, setMentorshipApplications] = useState<any>(
        [],
    )

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType == 1) {
            getUserMentorShipApplications()
            getMentees()
        } else {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        if (selectedTab == 0) {
            getMentees()
        } else if (selectedTab == 1) {
            getUserMentorShipApplications()
        }
    }, [selectedTab])

    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const getUserMentorShipApplications = async () => {
        const allMentorshipApplications = await getMentorApplications(
            user.userId,
        )
        setMentorshipApplications(allMentorshipApplications)
    }

    const getMentees = async () => {
        const allMentees = await getMentorMentees(user.userId)
        setMentees(allMentees)
    }

    const selectTab = (tabNumber: number) => {
        if (tabNumber === selectedTab) {
            setSelectedTab(-1)
        } else {
            setSelectedTab(tabNumber)
        }
    }
    return (
        <>
            {user && !user.companyId ? (
                <>
                    <NoRecordsFoundComponent message="Please join a law firm before you proceed." />
                </>
            ) : (
                <>
                    <TabTopbar
                        firstTabWords={"View Mentees"}
                        secondTabWords={"View Mentorship Applications"}
                        tab={selectedTab}
                        changeTab={selectTab}
                    />
                    <SimpleGrid
                        columns={
                            (selectedTab == 0 && mentees.length > 0) ||
                            (selectedTab == 1 &&
                                mentorshipApplications.length > 0)
                                ? [2, null, 3]
                                : 1
                        }
                        spacing={1}>
                        {selectedTab == -1 ? (
                            <NoRecordsFoundComponent message="Please select an option to continue." />
                        ) : (
                            <>
                                {selectedTab == 0 ? (
                                    <>
                                        {mentees && mentees.length > 0 ? (
                                            <>
                                                {" "}
                                                {mentees.map((mentee: any) => {
                                                    const {
                                                        mentorshipId,
                                                        menteeName,
                                                        joinedDate,
                                                    } = mentee
                                                    return (
                                                        <MenteeContainer
                                                            mentorshipId={
                                                                mentorshipId
                                                            }
                                                            menteeName={
                                                                menteeName
                                                            }
                                                            joinedDate={
                                                                joinedDate
                                                            }
                                                        />
                                                    )
                                                })}
                                            </>
                                        ) : (
                                            <>
                                                <NoRecordsFoundComponent message="You are not in change of any mentees." />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {mentorshipApplications &&
                                        mentorshipApplications.length > 0 ? (
                                            <>
                                                {" "}
                                                {mentorshipApplications.map(
                                                    (
                                                        mentorshipApplication: any,
                                                    ) => {
                                                        const {
                                                            menteeName,
                                                            outcome,
                                                            applicationDate,
                                                            id,
                                                        } =
                                                            mentorshipApplication
                                                        return (
                                                            <MentorshipApplicationContainer
                                                                mentorshipApplicationId={
                                                                    id
                                                                }
                                                                menteeName={
                                                                    menteeName
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
                                            <><NoRecordsFoundComponent message="No mentee has approached you yet, please wait for a bit!" /></>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </SimpleGrid>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
