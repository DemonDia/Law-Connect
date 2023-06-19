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

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function CompanyPage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const toast = useToast()
    const { user } = useUser()
    // ============== states (if any) ==============
    const [selectedTab, setSelectedTab] = useState<number>(-1)
    const [companies, setCompanies] = useState<any>([])
    const [applications, setApplications] = useState<any>([])
    const [companyBelonging, setCompanyBelonging] = useState<any>(null)
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user && user.userId && user.userType != 2) {
            getApplications()
            getCompanies()
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
            {user && user.companyId ? (
                <>Already in a company</>
            ) : (
                <>
                    <TabTopbar
                        firstTabWords={"View Applications"}
                        secondTabWords={"View Companies"}
                        tab={selectedTab}
                        changeTab={selectTab}
                    />
                    {/* show company & applications */}
                    <SimpleGrid columns={[2, null, 3]} spacing={1}>
                        {selectedTab == -1 ? null : (
                            <>
                                {selectedTab == 0 ? (
                                    <>
                                        {" "}
                                        {applications.map(
                                            (application: any) => {
                                                const {
                                                    companyId,
                                                    companyName,
                                                    outcome,
                                                    applicationDate,
                                                    id,
                                                } = application
                                                return (
                                                    <ApplicationContainer
                                                        key={id}
                                                        companyId={companyId}
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
                                        {companies.map((company: any) => {
                                            const found: any =
                                                applications.find(
                                                    (application: any) => {
                                                        return (
                                                            application.companyId ===
                                                            company.userId
                                                        )
                                                    },
                                                )
                                            const isFound = found != null
                                            return (
                                                <CompanyContainer
                                                    key={company.userId}
                                                    companyId={company.userId}
                                                    companyName={
                                                        company.username
                                                    }
                                                    applyFunction={
                                                        applyToCompany
                                                    }
                                                    applied={isFound}
                                                />
                                            )
                                        })}
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
