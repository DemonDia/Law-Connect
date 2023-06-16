import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Popover,
    PopoverTrigger,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as DomLink } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { isOpen, onToggle } = useDisclosure();
    const [navItems, setNavItems] = useState<Array<NavItem>>([]);
    useEffect(() => {
        console.log("notloggedinitems", notLoggedInItems);
        setNavItems(notLoggedInItems);
    }, []);

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
                    align={"center"}
                >
                    <Flex
                        flex={{ base: 1, md: "auto" }}
                        ml={{ base: -2 }}
                        display={{ base: "flex", md: "none" }}
                    >
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
                        flex={{ base: 1 }}
                        justify={{ base: "center", md: "start" }}
                    >
                        <Text
                            textAlign={useBreakpointValue({
                                base: "center",
                                md: "left",
                            })}
                            fontFamily={"heading"}
                            color={useColorModeValue("gray.800", "white")}
                        >
                            Logo
                        </Text>

                        <Flex display={{ base: "none", md: "flex" }} ml={10}>
                            <DesktopNav navItems={navItems} />
                        </Flex>
                    </Flex>
                </Flex>

                <Collapse in={isOpen} animateOpacity>
                    <MobileNav navItems={navItems} />
                </Collapse>
            </Box>
        </>
    );
}

export const DesktopNav = ({ navItems }: Array<NavItem>) => {
    const linkColor = useColorModeValue("gray.600", "gray.200");
    const linkHoverColor = useColorModeValue("gray.800", "white");
    const popoverContentBgColor = useColorModeValue("white", "gray.800");

    return (
        <Stack direction={"row"} spacing={4}>
            {navItems ? (
                <>
                    {navItems.map((navItem: NavItem) => (
                        <Box key={navItem.label}>
                            <Popover
                                trigger={"hover"}
                                placement={"bottom-start"}
                            >
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
    );
};

const MobileNav = ({ navItems }: Array<NavItem>) => {
    console.log("navItems array", navItems);
    return (
        <Stack
            bg={useColorModeValue("white", "gray.800")}
            p={4}
            display={{ md: "none" }}
        >
            {navItems.map((navItem: NavItem, index: number) => {
                return <MobileNavItem key={index} {...navItem} />;
            })}
        </Stack>
    );
};

const MobileNavItem = ({ label, to }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();
    console.log("label,to ", { label, to });

    return (
        <Stack spacing={4} onClick={onToggle}>
            <Flex
                py={2}
                // as={Link}
                justify={"space-between"}
                align={"center"}
                _hover={{
                    textDecoration: "none",
                }}
            >
                <DomLink to={to}>
                    {" "}
                    <Text
                        fontWeight={600}
                        color={useColorModeValue("gray.600", "gray.200")}
                    >
                        {label}
                    </Text>
                </DomLink>
            </Flex>
        </Stack>
    );
};

//  nested class
interface NavItem {
    label: string;
    to?: string;
}

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
];

// for mentees
const menteeItems: Array<NavItem> = [
    { label: "Home", to: "/" },
    {
        label: "Mentors",
        to: "/mentors",
    },
    {
        label: "Applications",
        to: "/applications",
    },
    {
        label: "Skills",
        to: "/skills",
    },
];

// for mentors
const mentorItems: Array<NavItem> = [
    { label: "Home", to: "/" },
    {
        label: "Mentees",
        to: "/mentees",
    },
];

// for firms
const companyItems: Array<NavItem> = [
    { label: "Home", to: "/" },
    {
        label: "lawyers",
        to: "/mentees",
    },
];
