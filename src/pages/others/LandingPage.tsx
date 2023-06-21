// ============== imports: the dependencies ==============
import AOS from "aos"
import "aos/dist/aos.css"
// ======= react ==========
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// ======= chakra UI ==========
import {
    Box,
    Heading,
    Image,
    Flex,
    Text,
    Icon,
    keyframes,
    IconButton,
} from "@chakra-ui/react"

import { BiDownArrowAlt } from "react-icons/bi"
// ======= firebase ==========

// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import CustomButton from "../../components/general/CustomButton"
// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
import LawyerHero from "../../assets/LawyerHero.png"

import FirstScreenshot from "../../assets/screenshot1.png"
import SecondScreenshot from "../../assets/screenshot2.png"
import ThirdScreenshot from "../../assets/screenshot3.png"

interface KeyFeature {
    title: string
    description: string
    image: unknown
}

const keyFeatures: KeyFeature[] = [
    {
        title: "Law Firms Network",
        description:
            "Join the 100 000+ law firms that are in our network today! They are known to provide the best training for you aspiring lawyers!",
        image: FirstScreenshot,
    },
    {
        title: "Lawyer Mentor’s Network",
        description:
            "We have over 1 000 000 professional law mentors joining us today! Feel free to find the right fit for you!",
        image: SecondScreenshot,
    },
    {
        title: "Track Your Progress!",
        description:
            "  Collect them all! Each skill badge is a ladder for your lawyer journey!",
        image: ThirdScreenshot,
    },
]

// ======= external functions  ==========

// ============== main component ==============
export default function LandingPage() {
    // ============== constant variables if any ==============
    const navigate = useNavigate()

    // const spin = keyframes`
    //   from {transform: translateY(0);}
    //   to {transform: translateY(-10px);}
    // `

    const bounce = keyframes`
      0% {transform: translateY(0);}
      50% {transform: translateY(-10px);}
      100% {transform: translateY(0);}
    `

    //     const spin = keyframes`
    //   from {transform: rotate(0deg);}
    //   to {transform: rotate(360deg)}
    // `

    const bounceAnimation = `${bounce} infinite 1s linear`

    // ============== states (if any) ==============
    const { user } = useUser()
    // ============== useEffect statement(s) ==============
    useEffect(() => {
        if (user) {
            navigate("/home")
        }
        AOS.init({ duration: 1000 })
    }, [])
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const buttonClick = () => {
        navigate("/login")
    }
    const goDown = () => {
        var access = document.getElementById("keyFeatures")
        access.scrollIntoView({ behavior: "smooth" }, true)
    }
    return (
        <Box width="90%" margin="5px auto">
            <Box maxHeight="90vh" background="#F9F9F9" display={"grid"}>
                <Flex flexDirection={["column-reverse", null, "row"]}>
                    <Box
                        margin="20px auto"
                        padding="30px"
                        width={["100%", null, "30%"]}
                        display="grid"
                        alignContent={"center"}>
                        <Heading as="h2" size="2xl" fontWeight={"bold"}>
                            LawConnect helps kickstart your career as a lawyer!
                        </Heading>
                        <br />
                        <Heading as="h4" size="md">
                            LawConnect is a portal that quickly links junior
                            lawyers to their mentors and law firms, and to track
                            their progress!
                        </Heading>
                        <br />
                        <CustomButton
                            buttonText="Join us today!"
                            buttonColor="#3609EA"
                            textColor="white"
                            buttonWidth="100%"
                            disabled={false}
                            buttonOnClick={buttonClick}
                        />
                    </Box>
                    <Box margin="20px auto" padding="30px" width="50%">
                        <Image src={LawyerHero} />
                    </Box>
                </Flex>

                <IconButton
                    background="none"
                    color="black"
                    colorScheme="none"
                    aria-label="Search database"
                    margin="auto"
                    icon={
                        <Icon
                            _hover={{ cursor: "pointer", fontSize: "80px" }}
                            as={BiDownArrowAlt}
                            fontSize="60px"
                            lineHeight="80px"
                            transition={"0.5s ease-in-out"}
                            animation={bounceAnimation}
                            onClick={() => {
                                goDown()
                            }}
                        />
                    }
                />
            </Box>
            <Box id="keyFeatures">
                {keyFeatures.map((keyFeature: KeyFeature, index: number) => {
                    const { title, description, image } = keyFeature
                    return (
                        <div data-aos="fade-down" key={index}>
                            <KeyFeatureCard
                                index={index}
                                title={title}
                                description={description}
                                image={image}
                            />
                        </div>
                    )
                })}
            </Box>
        </Box>
    )
}

// ============== sub component(s) if any ==============
const KeyFeatureCard = ({ title, description, image, index }: any) => {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    return (
        <Box
            alignSelf={index % 2 == 0 ? "start" : "end"}
            borderRadius="10px"
            marginTop="15px"
            background="white">
            <Flex
                flexDirection={["column-reverse", null, "row"]}
                // direction={index % 2 == 0 ? "column" : "column-reverse"}
            >
                <Box margin="5px" width={["100%", null, "40%"]} padding="10px">
                    <Heading
                        as="h2"
                        size={["md", null, null, "lg"]}
                        fontWeight={"bold"}
                        color="#0C15FF">
                        {index + 1}. {title}
                    </Heading>
                    <br />
                    <Text>{description}</Text>
                </Box>
                <Image
                    src={image}
                    width={["80%", null, "60%"]}
                    margin="10px auto"
                />
            </Flex>
        </Box>
    )
}
