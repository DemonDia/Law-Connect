// ============== imports: the dependencies ==============
// ======= react ==========
import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom"
// ======= chakra UI ==========
import { SimpleGrid, Box, Text, Icon, Heading } from "@chakra-ui/react"

import { BsPersonRolodex } from "react-icons/bs"
import { IoIosDocument } from "react-icons/io"
import { GiSkills } from "react-icons/gi"
import { BiLogOut } from "react-icons/bi"

// ======= firebase ==========

// ======= zustand/state ==========
import useUser from "../../store/userStore"
// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
type MenuItem = {
    label: string
    to: string
    icon: unknown | null
}
// ============== external variables (if any) ==============
const menteeMenu: MenuItem[] = [
    { label: "Manage Mentors", to: "/mentors", icon: BsPersonRolodex },
    { label: "Manage Applications", to: "/company", icon: IoIosDocument },
    { label: "View Badges", to: "/skills", icon: GiSkills },
    { label: "Logout", to: "/logout", icon: BiLogOut },
]

const mentorMenu: MenuItem[] = [
    { label: "Manage Mentees", to: "/mentees", icon: BsPersonRolodex },
    { label: "Manage Applications", to: "/company", icon: IoIosDocument },
    { label: "Logout", to: "/logout", icon: BiLogOut },
]

const companyMenu: MenuItem[] = [
    { label: "Manage Lawyers", to: "/lawyers", icon: BsPersonRolodex },
    { label: "Logout", to: "/logout", icon: BiLogOut },
]

const emptyMenu: MenuItem[] = []
// ======= external functions  ==========

// ============== main component ==============
export default function HomePage() {
    // ============== constant variables if any ==============
    const { user } = useUser()
    const navigate = useNavigate()
    // ============== states (if any) ==============
    const [menuOptions, setMenuOptions] = useState<MenuItem[]>([])
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
        switch (user?.userType) {
            case "0":
                setMenuOptions(menteeMenu)
                return
            case "1":
                setMenuOptions(mentorMenu)
                return
            case "2":
                setMenuOptions(companyMenu)
                return
            default:
                setMenuOptions(emptyMenu)
                return
        }
    }, [])
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    return (
        <>
            <br />
            <Heading as={"h6"} textAlign={"center"} size={"md"}>
                Hello {user && user.username ? <>{user.username}</> : <>User</>}
                , what would like to do?{" "}
            </Heading>
            <br />
            <SimpleGrid columns={[1, 2, 3, 4]}>
                {menuOptions.map((option: MenuItem, index: number) => {
                    const { label, to, icon } = option
                    return (
                        <HomePageOption
                            key={index}
                            label={label}
                            to={to}
                            icon={icon}
                        />
                    )
                })}
            </SimpleGrid>
        </>
    )
}

// ============== sub component(s) if any ==============
const HomePageOption = ({ label, to, icon }: MenuItem) => {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============

    return (
        <Link to={to}>
            <Box
                background={"#FFFFFF"}
                boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}
                margin="5px"
                padding="10px"
                borderRadius={"5px"}>
                <SimpleGrid columns={2}>
                    <Icon
                        as={icon}
                        margin="0 auto"
                        width="100%"
                        fontSize={"60px"}
                    />
                    <Text>{label}</Text>
                </SimpleGrid>
            </Box>
        </Link>
    )
}
