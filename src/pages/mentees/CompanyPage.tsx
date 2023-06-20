// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import { SimpleGrid, useToast } from "@chakra-ui/react"

// ======= firebase ==========
import { findUsersByUserTypes } from "../../helperFunctions/firebase/userFirestore"
import {
    createApplication,
    getUserApplications,
} from "../../helperFunctions/firebase/applicationFunctions"

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import TabTopbar from "../../components/general/TabTopbar"
import CompanyContainer from "../../components/mentee/CompanyContainer"
import ApplicationContainer from "../../components/mentee/ApplicationContainer"
import NoRecordsFoundComponent from "../../components/general/NoRecordsFoundComponent"
import LoadingComponent from "../../components/general/LoadingComponent"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function CompanyPage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    // ============== states (if any) ==============
    const [selectedTab, setSelectedTab] = useState<number>(-1)
    const [companies, setCompanies] = useState<any>([])
    const [applications, setApplications] = useState<any>([])
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType != 2) {
            setLoading(true)
            getApplications()
            getCompanies()
            setLoading(false)
        } else {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        if (selectedTab == 0) {
            getApplications()
        } else if (selectedTab == 1) {
            getCompanies()
        }
    }, [selectedTab])
    // ============== helper functions if any ==============
    const getCompanies = async () => {
        const companies = await findUsersByUserTypes("2")
        setCompanies(companies)
    }
    const getApplications = async () => {
        if (user && user.userId) {
            const applications = await getUserApplications(user.userId)
            setApplications(applications)
        }
    }
    // ============== key functions if any ==============
    const applyToCompany = async (companyId: string) => {
        if (user && user.userId) {
            createApplication(user.userId, companyId, toast)
            await getCompanies()
        }
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
            {loading ? (
                <>
                    <LoadingComponent message="Loading companies ..." />
                </>
            ) : (
                <>
                    {" "}
                    {user && user.companyId ? (
                        <>
                            <NoRecordsFoundComponent message="You are aready in a law firm. You can consider leaving first before joining another law firm." />
                        </>
                    ) : (
                        <>
                            <TabTopbar
                                firstTabWords={"View Applications"}
                                secondTabWords={"View Companies"}
                                tab={selectedTab}
                                changeTab={selectTab}
                            />
                            {/* show company & applications */}
                            {selectedTab == -1 ? (
                                <>
                                    {" "}
                                    <NoRecordsFoundComponent message="Please select an option to continue." />
                                </>
                            ) : (
                                <>
                                    {" "}
                                    <SimpleGrid
                                        columns={
                                            //
                                            (selectedTab == 0 &&
                                                applications &&
                                                applications.length) ||
                                            (selectedTab == 1 &&
                                                companies &&
                                                companies.length) > 0
                                                ? [2, null, 3]
                                                : 1

                                            // applications.length > 0 ? [2, null, 3] : 1
                                        }
                                        spacing={1}>
                                        {selectedTab == -1 ? null : (
                                            <>
                                                {selectedTab == 0 ? (
                                                    <>
                                                        {applications &&
                                                        applications.length >
                                                            0 ? (
                                                            <>
                                                                {" "}
                                                                {applications.map(
                                                                    (
                                                                        application: any,
                                                                    ) => {
                                                                        const {
                                                                            companyId,
                                                                            companyName,
                                                                            outcome,
                                                                            applicationDate,
                                                                            id,
                                                                        } =
                                                                            application
                                                                        return (
                                                                            <ApplicationContainer
                                                                                key={
                                                                                    id
                                                                                }
                                                                                companyId={
                                                                                    companyId
                                                                                }
                                                                                companyName={
                                                                                    companyName
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
                                                                <NoRecordsFoundComponent message="You did not apply to any law firms. Do try to apply whenever possible!" />
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {companies.map(
                                                            (company: any) => {
                                                                const found: any =
                                                                    applications.find(
                                                                        (
                                                                            application: any,
                                                                        ) => {
                                                                            return (
                                                                                application.companyId ===
                                                                                company.userId
                                                                            )
                                                                        },
                                                                    )
                                                                const isFound =
                                                                    found !=
                                                                    null
                                                                return (
                                                                    <CompanyContainer
                                                                        key={
                                                                            company.userId
                                                                        }
                                                                        companyId={
                                                                            company.userId
                                                                        }
                                                                        companyName={
                                                                            company.username
                                                                        }
                                                                        applyFunction={
                                                                            applyToCompany
                                                                        }
                                                                        applied={
                                                                            isFound
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
                    )}
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
