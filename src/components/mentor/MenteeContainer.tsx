// ============== imports: the dependencies ==============
// ======= react ==========
import { Link } from "react-router-dom"
// ======= chakra UI ==========
import { Box, Heading, Text } from "@chakra-ui/react"

// ======= firebase ==========

// ======= zustand/state ==========

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface MenteeContainerProps {
    mentorshipId: string
    menteeName: string
    joinedDate: any
}
// ============== external variables (if any) ==============

// ======= external functions  ==========
import { formatDate } from "../../helperFunctions/general/dateformatter"

// ============== main component ==============

export default function MenteeContainer({
    mentorshipId,
    menteeName,
    joinedDate,
}: MenteeContainerProps) {
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
            <Text>Joined at:{formatDate(joinedDate)}</Text>
            <br />
            <Link to={`/mentorship/${mentorshipId}`}>
                <Text>More Info</Text>
            </Link>
        </Box>
    )
}

// ============== sub component(s) if any ==============
