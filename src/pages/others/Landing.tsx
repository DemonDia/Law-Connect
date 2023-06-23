import {
    Box,
    Card,
    Grid,
    GridItem,
    Stack,
    Text,
    Image,
    Heading,
    Icon,
} from "@chakra-ui/react"
import LawyerHero from "../../assets/LawyerHero.png"
import CustomButton from "../../components/general/CustomButton"
import { useNavigate } from "react-router-dom"

import {
    FaUserGraduate,
    FaUserTie,
    FaRegFilePdf,
    FaSuitcase,
    FaMedal,
} from "react-icons/fa"

export const Landing = () => {
    const navigate = useNavigate()

    return (
        <Box maxW="1400px" margin="auto" h="100%" pb="8">
            <Grid
                pb="4"
                templateColumns="repeat(5, 1fr)"
                templateRows="repeat(4, 1fr)"
                gap={4}
                minH="500px"
                margin="auto">
                <GridItem colSpan={3} rowSpan={4} p={8}>
                    <Grid
                        templateColumns="repeat(5, 1fr)"
                        w="100%"
                        h="100%"
                        borderRadius={16}
                        alignItems="center">
                        <GridItem
                            colSpan={3}
                            w="100%"
                            display="flex"
                            gap={4}
                            flexDirection="column"
                            justifyContent="start"
                            alignItems="start">
                            {" "}
                            <Heading>LawConnect</Heading>
                            <Text size="md" fontWeight="600" maxW="80%">
                                Join the premiere lawyer platform that quickly
                                links junior lawyers to their mentors and law
                                firms!
                            </Text>
                            <CustomButton
                                buttonText="Sign up for our platform today!"
                                buttonColor="#3609EA"
                                textColor="white"
                                buttonWidth="100%"
                                disabled={false}
                                buttonOnClick={() => {
                                    navigate("/login")
                                }}
                            />
                        </GridItem>

                        <GridItem colSpan={2}>
                            <Image src={LawyerHero} />
                        </GridItem>
                    </Grid>
                </GridItem>
                <GridItem colSpan={2} rowSpan={2}>
                    <Box
                        p={8}
                        w="full"
                        h="full"
                        bg="white"
                        borderRadius={16}
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center">
                        <Icon as={FaUserGraduate} boxSize={8} color="#61a762" />
                        <Heading
                            size="lg"
                            bgGradient="linear(to-l, #61a762, #528e53)"
                            bgClip="text">
                            Mentees first
                        </Heading>
                        <Text size="md" fontWeight="600">
                            We help you find the right mentor to grow your
                            career
                        </Text>
                    </Box>
                </GridItem>
                <GridItem colSpan={2} rowSpan={2}>
                    <Box
                        p={8}
                        w="full"
                        h="full"
                        bg="white"
                        borderRadius={16}
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center">
                        <Icon as={FaUserTie} boxSize={8} color="#24069d" />
                        <Heading
                            size="lg"
                            bgGradient="linear(to-l, #3609EA, #24069d)"
                            bgClip="text">
                            Skilled Mentors
                        </Heading>
                        <Text
                            size="md"
                            fontWeight="600"
                            maxW="80%"
                            textAlign="center">
                            Our mentors are experienced lawyers from
                            distinguished law firms that wants to help you grow
                            your career!
                        </Text>
                    </Box>
                </GridItem>
            </Grid>
            <Grid
                templateColumns="repeat(4, 1fr)"
                templateRows="repeat(4, 1fr)"
                gap={4}
                minH="300px"
                margin="auto">
                <GridItem colSpan={1} rowSpan={4}>
                    <Box
                        p={8}
                        w="full"
                        h="full"
                        bg="white"
                        borderRadius={16}
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center">
                        <Icon as={FaMedal} boxSize={8} color="#ED8936" />
                        <Heading
                            size="lg"
                            bgGradient="linear(to-l, #ED8936, #e08132)"
                            bgClip="text">
                            Collect them all!
                        </Heading>
                        <Text
                            size="md"
                            fontWeight="600"
                            maxW="80%"
                            textAlign="center">
                            Our badge system helps you track your progress as
                            you learn from your mentors and law firms!
                        </Text>
                    </Box>
                </GridItem>{" "}
                <GridItem colSpan={1} rowSpan={4}>
                    <Box
                        p={8}
                        w="full"
                        h="full"
                        bg="white"
                        borderRadius={16}
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center">
                        <Icon as={FaSuitcase} boxSize={8} color="#2C7A7B" />
                        <Heading
                            size="lg"
                            bgGradient="linear(to-l, #2C7A7B, #2C7A7B)"
                            bgClip="text">
                            100+ Law Firms
                        </Heading>
                        <Text
                            size="md"
                            fontWeight="600"
                            maxW="80%"
                            textAlign="center">
                            We have over 100+ law firms that are known to
                            provide the best training for aspiring lawyers!
                        </Text>
                    </Box>
                </GridItem>{" "}
                <GridItem colSpan={2} rowSpan={4}>
                    <Box
                        p={8}
                        w="full"
                        h="full"
                        bg="white"
                        borderRadius={16}
                        display="flex"
                        flexDir="column"
                        justifyContent="center"
                        alignItems="center">
                        <Icon as={FaRegFilePdf} boxSize={8} color="#319795" />
                        <Heading
                            size="lg"
                            bgGradient="linear(to-l, #319795, #319795)"
                            bgClip="text">
                            In-depth resources
                        </Heading>
                        <Text
                            size="md"
                            fontWeight="600"
                            maxW="50%"
                            textAlign="center">
                            We have detailed documentation and resources
                            provided by our law firm partners to help you learn!
                        </Text>
                    </Box>
                </GridItem>{" "}
            </Grid>
        </Box>
    )
}
