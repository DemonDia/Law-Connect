// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
// ======= chakra UI ==========
import { Box, SimpleGrid, Text, Heading } from "@chakra-ui/react"
// ======= firebase ==========
import { findMenteeBadges } from "../../helperFunctions/firebase/mentorshipFunctions"
// ======= zustand/state ==========
import useUser from "../../store/userStore"
// ======= custom components (if any)==========
import NoRecordsFoundComponent from "../../components/general/NoRecordsFoundComponent"
import LoadingComponent from "../../components/general/LoadingComponent"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============

// ======= external functions  ==========
import { formatDate } from "../../helperFunctions/general/dateformatter"
// ============== main component ==============
export default function MenteeBadgePage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()
    const { user } = useUser()
    const [loading, setLoading] = useState(false)

    // ============== states (if any) ==============
    const [menteeBadges, setMenteeBadges] = useState<any[]>([])

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        // user not logged in, kick out
        // if user logged in but not mentee, kick
        if (!user || (user && user.userType != 0)) {
            navigate("/")
        }
        setLoading(true)
        getAllBadges()
        setLoading(false)
    }, [])

    // ============== helper functions if any ==============
    const getAllBadges = async () => {
        const allBadges = await findMenteeBadges(user.userId)
        setMenteeBadges(allBadges)
        // each badge:
        // skillName
        // skillDescription (can hover)
        // mentor name
        // obtainedDate
    }

    // ============== key functions if any ==============

    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Looking for your badges ..." />
                </>
            ) : (
                <>
                    {" "}
                    <Heading>Collected badges by {user.username}</Heading>
                    {menteeBadges && menteeBadges.length > 0 ? (
                        <>
                            {" "}
                            {menteeBadges.map(badge => {
                                return (
                                    <MenteeBadge
                                        skillName={badge.skillName}
                                        skillDescription={
                                            badge.skillDescription
                                        }
                                        senderName={badge.senderName}
                                        obtainedDate={badge.obtainedDate}
                                    />
                                )
                            })}
                        </>
                    ) : (
                        <>
                            <NoRecordsFoundComponent message="You do not have any badges? Perhaps earn some?" />
                        </>
                    )}
                    <SimpleGrid columns={[2, null, 4, 6]}></SimpleGrid>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
interface MenteeBadgeProps {
    skillName: string
    skillDescription?: string
    senderName: string
    obtainedDate: unknown
}
export const MenteeBadge = ({
    skillName,
    skillDescription,
    senderName,
    obtainedDate,
}: MenteeBadgeProps) => {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    return (
        <Box
            margin="10px"
            padding="15px"
            borderRadius={"10px"}
            background="white"
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <Heading as="h3" size="md">
                {skillName}
            </Heading>
            <hr />
            <Text>Awarded by:{senderName}</Text>
            <Text>Awarded at:{formatDate(Date(obtainedDate))}</Text>
        </Box>
    )
}
