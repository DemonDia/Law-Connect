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
import CompanyContainer from "../../components/mentee/CompanyContainer"
import ApplicationContainer from "../../components/mentee/ApplicationContainer"
import MentorshipApplicationContainer from "../../components/mentor/MentorshipApplicationContainer"
import MenteeContainer from "../../components/mentor/MenteeContainer"

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
                <>Join a company first</>
            ) : (
                <>
                    <TabTopbar
                        firstTabWords={"View Mentees"}
                        secondTabWords={"View Mentorship Applications"}
                        tab={selectedTab}
                        changeTab={selectTab}
                    />
                    <SimpleGrid columns={[2, null, 3]} spacing={1}>
                        {selectedTab == -1 ? null : (
                            <>
                                {selectedTab == 0 ? (
                                    <>
                                        {mentees.map((mentee: any) => {
                                            const {
                                                menteeId,
                                                menteeName,
                                                joinedDate,
                                            } = mentee
                                            return (
                                                <MenteeContainer
                                                    menteeId={menteeId}
                                                    menteeName={menteeName}
                                                    joinedDate={joinedDate}
                                                />
                                            )
                                        })}
                                    </>
                                ) : (
                                    <>
                                        {" "}
                                        {mentorshipApplications.map(
                                            (mentorshipApplication: any) => {
                                                const {
                                                    menteeId,
                                                    menteeName,
                                                    outcome,
                                                    applicationDate,
                                                    id,
                                                } = mentorshipApplication
                                                return (
                                                    <MentorshipApplicationContainer
                                                        mentorshipApplicationId={
                                                            id
                                                        }
                                                        menteeName={menteeName}
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
