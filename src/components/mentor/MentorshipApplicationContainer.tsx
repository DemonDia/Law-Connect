// ======= react ==========
import { Link } from "react-router-dom"

// ======= chakra UI ==========
import { Box, Heading, Text } from "@chakra-ui/react"

// ======= firebase ==========

// ======= zustand/state ==========

// ======= custom components (if any)==========
import ApplicationOutcomeBadge from "../mentee/ApplicationOutcomeBadge"

// ============== interfaces (if any) ==============
interface MentorshipApplicationContainerProps {
    mentorshipApplicationId: string
    menteeName: string
    applicationDate?: any
    applicationOutcome: number
}
// ============== external variables (if any) ==============
import { applicationOutcomes } from "../../externalVariables/applicationOutcome"

// ======= external functions  ==========
import { formatDate } from "../../helperFunctions/general/dateformatter"

// ============== main component ==============

export default function MentorshipApplicationContainer({
    mentorshipApplicationId,
    menteeName,
    applicationDate,
    applicationOutcome,
}: MentorshipApplicationContainerProps) {
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
                {menteeName}
            </Heading>
            {/* <br /> */}
            <Text>Applied at:{formatDate(Date(applicationDate))}</Text>
            {/* <br /> */}
            <ApplicationOutcomeBadge
                text={applicationOutcomes[applicationOutcome].text}
                color={applicationOutcomes[applicationOutcome].color}
            />
            <br />
            <Link to={`/mentees/application/${mentorshipApplicationId}`}>
                <Text>More Info</Text>
            </Link>
        </Box>
    )
}

// ============== sub component(s) if any ==============
