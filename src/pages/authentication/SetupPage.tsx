// ============== imports: the dependencies ==============
// ======= react ==========
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

// ======= chakra UI ==========
import {
    Card,
    Heading,
    Text,
    Flex,
    RadioGroup,
    Stack,
    Radio,
    Box,
    useToast,
} from "@chakra-ui/react"

// ======= firebase ==========
import { auth, db } from "../../config"
import { doc, updateDoc } from "firebase/firestore"
import { updateProfile, onAuthStateChanged } from "firebase/auth"
// ======= zustand/state ==========
import useUser from "../../store/userStore"

// ======= custom components (if any)==========
import InputField from "../../components/general/InputField"
import CustomButton from "../../components/general/CustomButton"
import { SkillSelector } from "../../components/skills/SkillSelctor"
import LoadingComponent from "../../components/general/LoadingComponent"

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
import { findUserById } from "../../helperFunctions/firebase/userFirestore"

// ======= external functions  ==========

// ============== main component ==============

// ============== main component ==============
export default function SetupPage() {
    // ============== constant variables if any ==============
    const { addUser } = useUser()
    // const userTypes = ["Mentor", "Mentee", "Law Firm"];
    const userTypes = [
        { value: "0", label: "Mentee" },
        { value: "1", label: "Mentor" },
        { value: "2", label: "Law Firm" },
    ]
    const { userId } = useParams()
    const navigate = useNavigate()
    const toast = useToast()

    // ============== states (if any) ==============
    // 3 steps
    const [step, setStep] = useState<number>(1)

    // 1: mentor, 2: mentee, 3: law firm
    const [userType, setUserType] = useState<string>("0")

    // name
    const [name, setName] = useState<string>("")

    // skill
    const [skills, setSkills] = useState<Array<string>>([])
    const [selectedSkillId, setSelectedSkillId] = useState<string>("")

    const [loading, setLoading] = useState<boolean>(false)

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============
    const previousStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }
    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1)
        } else {
            // submit
            finishSetup()
        }
    }

    const skillSelector = (e: unknown) => {
        const newId: string = e.target.value
        setSelectedSkillId(newId)
        if (newId) {
            const skillExists: boolean =
                skills.filter(skill => {
                    return skill == newId
                }).length > 0
            if (!skillExists) {
                setSkills([...skills, newId])
            }
        }
    }

    const deleteSkill = (skillId: string) => {
        const remainingSkills = skills.filter(skill => {
            return skill !== skillId
        })
        setSkills(remainingSkills)
    }

    const finishSetup = async () => {
        const errors: Array<string> = []
        if (name == "") {
            errors.push("Name cannot be empty")
        }
        if (skills.length == 0) {
            errors.push("Please select at least one skill")
        }
        if (errors.length > 0) {
            toast({
                title: "Setup unsuccessful",
                description: errors.join("; "),
                status: "error",
                duration: 1000,
                isClosable: true,
            })
        } else {
            setLoading(true)
            await onAuthStateChanged(auth, async user => {
                if (user && auth.currentUser) {
                    const { uid } = user
                    if (uid == userId) {
                        const userRecord: unknown = await findUserById(uid)
                        Promise.resolve(userRecord).then(user => {
                            if (user) {
                                const allPromises = []
                                // change username in auth
                                if (auth.currentUser) {
                                    // working
                                    allPromises.push(
                                        updateProfile(auth.currentUser, {
                                            displayName: name,
                                        }),
                                    )
                                }

                                // update status and userType
                                const userDocRef = doc(
                                    db,
                                    "users",
                                    userRecord.id,
                                )
                                allPromises.push(
                                    updateDoc(userDocRef, {
                                        username: name,
                                        userType,
                                        isSetUp: true,
                                        skills,
                                    }),
                                )
                                addUser({
                                    userId: userRecord.userId,
                                    username: name,
                                    userType,
                                })
                                Promise.allSettled(allPromises).then(() => {
                                    toast({
                                        title: "Setup successful",
                                        description:
                                            "Setup created, thank you!",
                                        status: "success",
                                        duration: 1000,
                                        isClosable: true,
                                    })
                                    setLoading(false)
                                    navigate("/")
                                })
                            }
                        })
                    }
                } else {
                    setLoading(false)
                }
            })
        }
    }

    // ============== key functions if any ==============
    return (
        <>
            {loading ? (
                <>
                    <LoadingComponent message="Setting up ..." />{" "}
                </>
            ) : (
                <>
                    {" "}
                    <Card
                        w={["90vw", "70vw", "60vw", "50vw", "30vw"]}
                        m={"10px auto"}
                        p={"10px"}>
                        <Heading textAlign={"center"}>One-time Setup</Heading>
                        {
                            // step 1
                            step === 1 ? (
                                <Box h={"20vh"} p={"10px"} w={"100%"}>
                                    <Text>I am a:</Text>
                                    <RadioGroup
                                        onChange={setUserType}
                                        value={userType}>
                                        <Stack direction="column">
                                            {userTypes.map(
                                                (userType, index) => {
                                                    const { value, label } =
                                                        userType
                                                    return (
                                                        <Radio
                                                            key={index}
                                                            value={value}>
                                                            {label}
                                                        </Radio>
                                                    )
                                                },
                                            )}
                                        </Stack>
                                    </RadioGroup>
                                </Box>
                            ) : (
                                <>
                                    {step === 2 ? (
                                        <>
                                            <InputField
                                                label={"My name is..."}
                                                placeholder={"Enter your name"}
                                                value={name}
                                                formType="text"
                                                changeHandler={(e: unknown) => {
                                                    setName(e.target.value)
                                                }}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <SkillSelector
                                                handleChangeSelectedSkillId={
                                                    skillSelector
                                                }
                                                selectedSkillId={
                                                    selectedSkillId
                                                }
                                                chosenSkills={skills}
                                                handleDeleteSkillId={
                                                    deleteSkill
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )
                        }

                        <Text align={"center"}>Step {step} of 3</Text>
                        <Flex align={"center"} justify={"center"}>
                            {" "}
                            <CustomButton
                                buttonColor={step === 1 ? "#F8F8F8" : "#808080"}
                                buttonOnClick={previousStep}
                                textColor={step === 1 ? "#CCCCCC" : "#FFFFFF"}
                                buttonText={"Previous"}
                                buttonWidth="40%"
                            />
                            <CustomButton
                                buttonColor={"#3609EA"}
                                buttonOnClick={nextStep}
                                textColor={"#FFFFFF"}
                                buttonText={
                                    step === 3 ? "Finish Setup" : "Next"
                                }
                                buttonWidth="40%"
                            />
                        </Flex>
                    </Card>
                </>
            )}
        </>
    )
}

// ============== sub component(s) if any ==============
