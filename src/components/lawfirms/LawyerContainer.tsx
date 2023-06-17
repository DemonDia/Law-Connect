// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Box, Heading, Text } from "@chakra-ui/react"
// ======= external functions  ==========
import { formatDate } from "../../helperFunctions/general/dateformatter"
// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface LawyerContainerProps {
    lawyerName: string
    joinedDate: any
}
// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============
export function LawyerContainer({
    lawyerName,
    joinedDate,
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
                {lawyerName}
            </Heading>
            {/* <br /> */}
            <Text>Joined at:{formatDate(Date(joinedDate))}</Text>
            <br />
            <Text>More Info</Text>
        </Box>
    )
}
