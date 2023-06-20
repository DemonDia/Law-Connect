// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { SimpleGrid } from "@chakra-ui/react"

// ======= firebase ==========
import { getCompanyApplications } from "../../helperFunctions/firebase/applicationFunctions"
import { getCompanyMembers } from "../../helperFunctions/firebase/membershipFunctions"

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import TabTopbar from "../../components/general/TabTopbar"
import LawyerApplicationContainer from "../../components/lawfirms/LawyerApplicationContainer"
import { LawyerContainer } from "../../components/lawfirms/LawyerContainer"
import NoRecordsFoundComponent from "../../components/general/NoRecordsFoundComponent"
import LoadingComponent from "../../components/general/LoadingComponent"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function LawyersPage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const { user } = useUser()

    // ============== states (if any) ==============
    const [applications, setApplications] = useState<any>([])
    const [lawyers, setLawyers] = useState<any>([])
    const [selectedTab, setSelectedTab] = useState<number>(-1)
    const [loading, setLoading] = useState<boolean>(false)

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType == 2) {
            setLoading(true)
            getApplications()
            getLaywers()
            setLoading(false)
        } else {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        if (selectedTab == 0) {
            getApplications()
        } else if (selectedTab == 1) {
            getLaywers()
        }
    }, [selectedTab])

    // ============== helper functions if any ==============
    const getApplications = async () => {
        if (user && user.userId && user.userType == 2) {
            const applications = await getCompanyApplications(user.userId)
            setApplications(applications)
        }
    }

    const getLaywers = async () => {
        const memberLawyers = await getCompanyMembers(user.userId)
        setLawyers(memberLawyers)
    }

    const selectTab = (tabNumber: number) => {
        if (tabNumber === selectedTab) {
            setSelectedTab(-1)
        } else {
            setSelectedTab(tabNumber)
        }
    }

    // ============== key functions if any ==============
    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Loading... Please sit back and wait" />
                </>
            ) : (
                <>
                    {" "}
                    {applications ? (
                        <>
                            <TabTopbar
                                firstTabWords={"View Applications"}
                                secondTabWords={"View Lawyers"}
                                tab={selectedTab}
                                changeTab={selectTab}
                            />
                            <SimpleGrid columns={[2, null, 3]} spacing={1}>
                                {selectedTab == -1 ? null : (
                                    <>
                                        {selectedTab == 0 ? (
                                            <>
                                                {" "}
                                                {applications.map(
                                                    (
                                                        application: any,
                                                        index: number,
                                                    ) => {
                                                        const {
                                                            applicantName,
                                                            outcome,
                                                            id,
                                                            applicationDate,
                                                        } = application
                                                        return (
                                                            <LawyerApplicationContainer
                                                                key={index}
                                                                applicationId={
                                                                    id
                                                                }
                                                                applicantName={
                                                                    applicantName
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
                                                {lawyers.map(
                                                    (
                                                        lawyer: any,
                                                        index: number,
                                                    ) => {
                                                        const {
                                                            memberName,
                                                            joinDate,
                                                        } = lawyer
                                                        return (
                                                            <LawyerContainer
                                                                key={index}
                                                                lawyerName={
                                                                    memberName
                                                                }
                                                                joinedDate={
                                                                    joinDate
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
                    ) : (
                        <>
                            <NoRecordsFoundComponent message="You have not applied to any law firms? Don't worry and keep applying!" />
                        </>
                    )}
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
