// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Box, Heading } from "@chakra-ui/react"
// ======= firebase ==========

// ======= zustand/state ==========

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============
export default function NoRecordsFoundComponent({ message }: unknown) {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <Box
            margin="5px auto"
            padding="10px"
            minH={["100px", "150px", "250px"]}
            borderRadius="10px"
            background="white"
            width={["100%", "80%", "50%"]}
            display="flex"
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <Heading
                as="h6"
                size={"md"}
                margin="auto"
                alignItems={"center"}
                textAlign={"center"}>
                {message}
            </Heading>
        </Box>
    )
}

// ============== sub component(s) if any ==============
