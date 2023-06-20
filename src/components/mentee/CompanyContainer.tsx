// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Box, Heading } from "@chakra-ui/react"

// ======= external functions  ==========
import CustomButton from "../general/CustomButton"

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface CompanyContainerProps {
    companyId: string
    companyName: string
    applyFunction?: unknown
    applied?: boolean //user have applied to this company?
    disabled?: boolean
}
// ============== external variables (if any) ==============

// ============== main component ==============

export default function CompanyContainer({
    companyId,
    companyName,
    applyFunction,
    applied,
}: CompanyContainerProps) {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const clicked = () => {
        if (applyFunction) {
            applyFunction(companyId)
        }
    }

    return (
        <Box
            background={"white"}
            p="10px"
            borderRadius={"10px"}
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <Heading as="h6" size="lg">
                {companyName}
            </Heading>
            {applied ? (
                <>
                    <br />
                    <Heading as="h6" size="xs">
                        You have already applied here
                    </Heading>
                </>
            ) : (
                <>
                    <CustomButton
                        buttonColor={"#2A07B7"}
                        textColor={"white"}
                        buttonText={"Apply"}
                        buttonOnClick={clicked}
                        buttonWidth="40%"
                    />
                </>
            )}
        </Box>
    )
}
