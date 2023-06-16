// ======= react ==========

// ======= chakra UI ==========
import { Badge, IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface SkillBadgeProps {
    skillId: string;
    skillName: string;
    handleDeleteSkillId?: any;
}

// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============

export const SkillBadge = ({
    skillName,
    skillId,
    handleDeleteSkillId,
}: SkillBadgeProps) => {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    return (
        <Badge
            padding={"5px"}
            w={"fit-content"}
            margin={"5px"}
            borderRadius={"5px"}
        >
            {skillName}
            <IconButton
                onClick={() => {
                    handleDeleteSkillId(skillId);
                }}
                aria-label="Remove skill"
                icon={<CloseIcon />}
            />
            {/* <CloseIcon /> */}
        </Badge>
    );
};
