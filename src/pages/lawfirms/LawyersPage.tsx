// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ======= chakra UI ==========
import { SimpleGrid } from "@chakra-ui/react";
// ======= external functions  ==========
import { getCompanyApplications } from "../../helperFunctions/firebase/applicationFunctions";

// ======= custom components (if any)==========
import TabTopbar from "../../components/general/TabTopbar";
import LawyerApplicationContainer from "../../components/lawfirms/LawyerApplicationContainer";
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ============== main component ==============

export default function LawyersPage({ currentUser }: any) {
    // ============== constant variables if any ==============
    const navigate = useNavigate();

    // ============== states (if any) ==============
    const [applications, setApplications] = useState<any>([]);
    const [lawyers, setLawyers] = useState<any>([]);
    const [selectedTab, setSelectedTab] = useState<number>(-1);

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (currentUser && currentUser.userId && currentUser.userType == 2) {
            getApplications();
        } else {
            navigate("/");
        }
    }, []);

    useEffect(() => {
        if (selectedTab == 0) {
            getApplications();
        } else if (selectedTab == 1) {
            getLaywers();
        }
    }, [selectedTab]);

    // ============== helper functions if any ==============
    const getApplications = async () => {
        if (currentUser && currentUser.userId && currentUser.userType == 2) {
            const applications = await getCompanyApplications(
                currentUser.userId
            );
            setApplications(applications);
        }
    };

    const getLaywers = async () => {};

    const selectTab = (tabNumber: number) => {
        if (tabNumber === selectedTab) {
            setSelectedTab(-1);
        } else {
            setSelectedTab(tabNumber);
        }
    };

    // ============== key functions if any ==============
    return (
        <>
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
                                            (application: any) => {
                                                const {
                                                    applicantName,
                                                    outcome,
                                                    id,
                                                    applicationDate,
                                                } = application;
                                                return (
                                                    <>
                                                        <LawyerApplicationContainer
                                                            applicationId={id}
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
                                                    </>
                                                );
                                            }
                                        )}
                                    </>
                                ) : (
                                    <></>
                                )}
                            </>
                        )}
                    </SimpleGrid>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

// ============== sub component(s) if any ==============
