// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Text, Box, Progress } from "@chakra-ui/react"
// ======= firebase ==========

// ======= zustand/state ==========

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface SkillProgressContainerProps {
    skillLevel: number
    skillName: string
}

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function SkillProgressContainer({
    skillLevel,
    skillName,
}: SkillProgressContainerProps) {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    return (
        <Box
            background={"white"}
            p="10px"
            m="5px"
            borderRadius={"10px"}
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <Text fontSize={"2xl"}>{skillName}</Text>
            <Text>Progress: {skillLevel}%</Text>
            <Progress
                min={0}
                max={100}
                value={skillLevel}
                borderRadius={"5px"}
                colorScheme="green"
                m="10px auto"
            />
        </Box>
    )
}

// ============== sub component(s) if any ==============
