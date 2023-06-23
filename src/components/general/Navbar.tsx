// ============== imports: the dependencies ==============
// ======= react ==========
import { Link as DomLink } from "react-router-dom"
import { useEffect, useState } from "react"

// ======= chakra UI ==========
import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    Popover,
    PopoverTrigger,
    useColorModeValue,
    useDisclosure,
    Image,
    Badge,
} from "@chakra-ui/react"
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons"

import useUser from "../../store/userStore"

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface NavItem {
    label: string
    to?: string
}
// ============== external variables (if any) ==============
import Logo from "../../assets/logo.png"
import CustomButton from "./CustomButton"
// the sub arrays
// not logged in
// logged in as mentee
// logged in as mentor
// logged in as company

const notLoggedInItems: Array<NavItem> = [
    {
        label: "Register",
        to: "/register",
    },
    {
        label: "Login",
        to: "/login",
    },
]

// for mentees
const menteeItems: Array<NavItem> = [
    { label: "Home", to: "/home" },
    {
        label: "Mentors",
        to: "/mentors",
    },
    {
        label: "Company",
        to: "/company",
    },
    {
        label: "Resources",
        to: "/resources",
    },
    {
        label: "Badges",
        to: "/skills",
    },
]

// for mentors
const mentorItems: Array<NavItem> = [
    { label: "Home", to: "/home" },
    {
        label: "Mentees",
        to: "/mentees",
    },
    {
        label: "Company",
        to: "/company",
    },
    {
        label: "Resources",
        to: "/resources",
    },
]

// for firms
const companyItems: Array<NavItem> = [
    { label: "Home", to: "/home" },
    {
        label: "Lawyers",
        to: "/lawyers",
    },
    {
        label: "Resources",
        to: "/resources",
    },
]

// ============== main component ==============
export default function Navbar() {
    // ============== constant variables if any ==============
    const { user } = useUser(state => state)

    // ============== states (if any) ==============
    const { isOpen, onToggle } = useDisclosure()
    const [navItems, setNavItems] = useState<Array<NavItem>>([])
    // const [currentUser, setCurrentUser] = useState<currentUserProps>({})

    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user) {
            const { userType } = user
            switch (userType) {
                case 0:
                    setNavItems(menteeItems)
                    break
                case 1:
                    setNavItems(mentorItems)
                    break
                case 2:
                    setNavItems(companyItems)
                    break
                default:
                    setNavItems(notLoggedInItems)
                    break
            }
        } else {
            setNavItems(notLoggedInItems)
        }
    }, [user])

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <>
            <Box>
                <Flex
                    bg={useColorModeValue("white", "gray.800")}
                    color={useColorModeValue("gray.600", "white")}
                    minH={"60px"}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    borderBottom={1}
                    borderStyle={"solid"}
                    borderColor={useColorModeValue("gray.200", "gray.900")}
                    align={"center"}>
                    <Flex
                        flex={{ base: 1, md: "auto" }}
                        ml={{ base: -2 }}
                        display={{ base: "flex", md: "none" }}>
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? (
                                    <CloseIcon w={3} h={3} />
                                ) : (
                                    <HamburgerIcon w={5} h={5} />
                                )
                            }
                            variant={"ghost"}
                            aria-label={"Toggle Navigation"}
                        />
                    </Flex>
                    <Flex
                        direction={"row"}
                        flex={{ base: 1 }}
                        w="100%"
                        justify={{ base: "center", md: "space-between" }}>
                        <Stack direction="row" flex="1">
                            {" "}
                            <DomLink to={user ? "/home" : "/"}>
                                <Image height="60px" src={Logo} alt="logo" />
                            </DomLink>
                            {/* <Text m="0" display="flex" alignItems={"center"}>
                            {user ? user.username : null}
                        </Text> */}
                            <Flex
                                display={{ base: "none", md: "flex" }}
                                ml={10}>
                                <DesktopNav navItems={navItems} />
                            </Flex>
                        </Stack>

                        {user ? (
                            <Stack
                                direction="row"
                                align="center"
                                h="full"
                                m="auto">
                                <Badge
                                    style={{ userSelect: "none" }}
                                    h="full"
                                    px="2"
                                    py="1"
                                    colorScheme={
                                        user.userType === 0
                                            ? "teal" // mentee
                                            : user.userType === 1
                                            ? "green" // mentor
                                            : "purple" // company
                                    }>
                                    {user.userType === 0
                                        ? "Mentee"
                                        : user.userType === 1
                                        ? "Mentor"
                                        : "Company"}
                                </Badge>
                                <Text
                                    style={{ userSelect: "none" }}
                                    m="0"
                                    display="flex"
                                    alignItems={"center"}>
                                    {user.username}
                                </Text>

                                <Box
                                    bg="#eef3fb"
                                    py="1"
                                    px="2"
                                    borderRadius="4">
                                    <DomLink
                                        to="/logout"
                                        style={{ textDecoration: "none" }}>
                                        <Text
                                            m="0"
                                            display="flex"
                                            alignItems={"center"}>
                                            Logout
                                        </Text>
                                    </DomLink>
                                </Box>
                            </Stack>
                        ) : (
                            <></>
                        )}
                    </Flex>
                </Flex>

                <Collapse in={isOpen} animateOpacity>
                    <MobileNav navItems={navItems} />
                </Collapse>
            </Box>
        </>
    )
}

// ============== sub component(s) if any ==============
export const DesktopNav = ({ navItems }: { navItems: Array<NavItem> }) => {
    // ============== constant variables if any ==============
    const linkColor = useColorModeValue("gray.600", "gray.200")

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <Stack direction={"row"} spacing={4}>
            {navItems ? (
                <>
                    {navItems.map((navItem: NavItem) => (
                        <Box
                            key={navItem.label}
                            margin="0 auto"
                            display="flex"
                            alignItems={"center"}>
                            <Popover
                                trigger={"hover"}
                                placement={"bottom-start"}>
                                <PopoverTrigger>
                                    <DomLink to={navItem.to} color={linkColor}>
                                        {navItem.label}
                                    </DomLink>
                                </PopoverTrigger>
                            </Popover>
                        </Box>
                    ))}
                </>
            ) : (
                <></>
            )}
        </Stack>
    )
}

const MobileNav = ({ navItems }: Array<NavItem>) => {
    return (
        <Stack
            bg={useColorModeValue("white", "gray.800")}
            p={4}
            display={{ md: "none" }}>
            {navItems.map((navItem: NavItem, index: number) => {
                return <MobileNavItem key={index} {...navItem} />
            })}
        </Stack>
    )
}

const MobileNavItem = ({ label, to }: NavItem) => {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============
    const { isOpen, onToggle } = useDisclosure()

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============

    return (
        <Stack spacing={4} onClick={onToggle}>
            <Flex
                py={2}
                justify={"space-between"}
                align={"center"}
                _hover={{
                    textDecoration: "none",
                }}>
                <DomLink to={to}>
                    {" "}
                    <Text
                        fontWeight={600}
                        color={useColorModeValue("gray.600", "gray.200")}>
                        {label}
                    </Text>
                </DomLink>
            </Flex>
        </Stack>
    )
}
