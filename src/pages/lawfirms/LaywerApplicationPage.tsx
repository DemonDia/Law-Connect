// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// ======= chakra UI ==========
import { Box, Flex, Heading, Link, Text, useToast } from "@chakra-ui/react";
// ======= external functions  ==========
import {
    getApplicationInfo,
    updateApplication,
} from "../../helperFunctions/firebase/applicationFunctions";
import { formatDate } from "../../helperFunctions/general/dateformatter";
// ======= custom components (if any)==========
import TwoActionTopBar from "../../components/general/TwoActionTopBar";
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
const pageNavigation = [
    {
        label: "Lawyer Info",
        href: "#lawyerInfo",
    },
    {
        label: "Skills Possessed",
        href: "#skillsPossessed",
    },
];

// ============== main component ==============
export default function LaywerApplicationPage({ currentUser }: any) {
    // ============== constant variables if any ==============
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    // ============== states (if any) ==============
    const [currentApplication, setCurrentApplication] = useState<any>({});

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        fetchApplication();
    }, []);

    // ============== helper functions if any ==============
    const fetchApplication = async () => {
        console.log("currentUser", currentUser);
        console.log("applicationId", applicationId);
        const application = await getApplicationInfo(applicationId);
        console.log("targetApplication", application);

        if (
            currentUser &&
            application &&
            application.companyId == currentUser.userId
        ) {
            setCurrentApplication(application);
        } else {
            navigate("/lawyers");
        }
    };

    const acceptApplication = async () => {
        await updateApplication(applicationId, true, toast, navigate);
    };
    const rejectApplication = async () => {
        await updateApplication(applicationId, false, toast, navigate);
    };

    // ============== key functions if any ==============

    return (
        <Box>
            <TwoActionTopBar
                firstButtonWords="Reject Lawyer"
                firstButtonAction={rejectApplication}
                firstButtonColor="#D00000"
                secondButtonWords="Onboard Lawyer"
                secondButtonAction={acceptApplication}
                secondButtonColor="#1D00D0"
                disabled={currentApplication.outcome != -1}
            />
            <Flex>
                <Box
                    w="30%"
                    h="90vh"
                    bg="white"
                    boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}
                    borderRadius={"10px"}
                    padding={"10px"}
                    margin={"10px"}
                >
                    {pageNavigation.map((item, index) => {
                        const { label, href } = item;
                        return (
                            <Link color={"#808080"} href={href} key={index}>
                                <Box
                                    background={"#E6E6E6"}
                                    w={"100%"}
                                    margin={"10px auto"}
                                    padding="5px"
                                >
                                    {label}
                                </Box>
                            </Link>
                        );
                    })}
                </Box>

                <Box
                    w="70%"
                    h="90vh"
                    bg="white"
                    boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}
                    borderRadius={"10px"}
                    padding={"10px"}
                    margin={"10px"}
                >
                    <Box id="lawerInfo" margin={"10px auto"}>
                        <Heading as="h4" size="lg">
                            {currentApplication.username}
                        </Heading>
                        <Text>example@email.com</Text>
                        <Text>
                            Requested at:
                            {formatDate(
                                Date(currentApplication.applicationDate)
                            )}
                        </Text>
                    </Box>

                    <Box id="skillsPossessed" margin={"10px auto"}>
                        <Heading as="h4" size="md">
                            Skills Possessed:
                        </Heading>
                        {currentApplication.skills ? <></> : <>N/A</>}
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}

// ============== sub component(s) if any ==============
