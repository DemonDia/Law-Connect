// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Box, Heading } from "@chakra-ui/react";

// ======= external functions  ==========
import ApplicationOutcomeBadge from "./ApplicationOutcomeBadge";

import { formatDate } from "../../helperFunctions/general/dateformatter";

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface CompanyContainerProps {
    companyId: string;
    companyName: string;
    applyFunction?: any;
    // appliedTo?: boolean; //user have applied to this company?
    disabled?: boolean;
    applicationDate?: any;
    applicationOutcome: number;
}
// ============== external variables (if any) ==============
import { applicationOutcomes } from "../../externalVariables/applicationOutcome";
// ============== main component ==============

export default function ApplicationContainer({
    companyName,
    applicationDate,
    applicationOutcome,
}: 
CompanyContainerProps) {
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
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}
        >
            <Heading as="h6" size="lg">
                {companyName}
            </Heading>
            <br />
            <Heading as="h6" size="sm">
                Applied at:{formatDate(Date(applicationDate))}
            </Heading>
            <br />
            <ApplicationOutcomeBadge
                text={applicationOutcomes[applicationOutcome].text}
                color={applicationOutcomes[applicationOutcome].color}
            />
        </Box>
    );
}
