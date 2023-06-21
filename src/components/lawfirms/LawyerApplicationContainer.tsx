// ============== imports: the dependencies ==============
// ======= react ==========
import { Link } from "react-router-dom"
// ======= chakra UI ==========
import { Box, Heading, Text } from "@chakra-ui/react"
// ======= external functions  ==========
import { formatDate } from "../../helperFunctions/general/dateformatter"
// ======= custom components (if any)==========
import ApplicationOutcomeBadge from "../mentee/ApplicationOutcomeBadge"

// ============== interfaces (if any) ==============
interface LawyerContainerProps {
    applicationId: string
    applicantName: string
    applicationDate?: any
    applicationOutcome: number
}
// ============== external variables (if any) ==============
import { applicationOutcomes } from "../../externalVariables/applicationOutcome"
// ============== main component ==============
export default function LawyerApplicationContainer({
    applicationId,
    applicantName,
    applicationDate,
    applicationOutcome,
}: LawyerContainerProps) {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============
    return (
        <Box
            background={"white"}
            p="10px"
            borderRadius={"10px"}
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <Heading as="h6" size="lg">
                {applicantName}
            </Heading>
            {/* <br /> */}
            <Text>Applied at:{formatDate(applicationDate)}</Text>
            {/* <br /> */}
            <ApplicationOutcomeBadge
                text={applicationOutcomes[applicationOutcome].text}
                color={applicationOutcomes[applicationOutcome].color}
            />
            <br />
            <Link to={`/lawyers/${applicationId}`}>
                <Text>More Info</Text>
            </Link>
        </Box>
    )
}

// ============== sub component(s) if any ==============
