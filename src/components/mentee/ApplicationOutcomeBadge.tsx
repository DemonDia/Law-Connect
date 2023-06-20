// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Badge } from "@chakra-ui/react"
// ======= external functions  ==========

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface ApplicationOutcomeBadgeProps {
    text: string
    color: string
}
// ============== external variables (if any) ==============

// ============== main component ==============

export default function ApplicationOutcomeBadge({ text, color }: any) {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <Badge
            background={color}
            margin={"5px"}
            padding={"5px"}
            borderRadius={"5px"}
            color="white">
            {text}
        </Badge>
    )
}
