// ============== imports: the dependencies ==============
// ======= react ==========
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@chakra-ui/react";

// ======= custom components (if any)==========
import InputField from "../../components/general/InputField";
import CustomButton from "../../components/general/CustomButton";
import { SkillSelector } from "../../components/skills/SkillSelctor";

// ============== interfaces (if any) ==============

// ============== external variables (if any) ==============
import { firstTimeSetup } from "../../helperFunctions/firebase/userAuthFunctions";

// ============== main component ==============
export default function SetupPage() {
    // ============== constant variables if any ==============
    // const userTypes = ["Mentor", "Mentee", "Law Firm"];
    const userTypes = [
        { value: "0", label: "Mentee" },
        { value: "1", label: "Mentor" },
        { value: "2", label: "Law Firm" },
    ];
    const { userId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    // ============== states (if any) ==============
    // 3 steps
    const [step, setStep] = useState<number>(1);

    // 1: mentor, 2: mentee, 3: law firm
    const [userType, setUserType] = useState<string>("0");

    // name
    const [name, setName] = useState<string>("");

    // skill
    const [skills, setSkills] = useState<Array<string>>([]);
    const [selectedSkillId, setSelectedSkillId] = useState<string>("");

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============
    const previousStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };
    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // submit
            finishSetup();
        }
    };

    const skillSelector = (e: any) => {
        const newId: string = e.target.value;
        setSelectedSkillId(newId);
        if (newId) {
            const skillExists: boolean =
                skills.filter((skill) => {
                    return skill == newId;
                }).length > 0;
            if (!skillExists) {
                setSkills([...skills, newId]);
            }
        }
    };

    const deleteSkill = (skillId: string) => {
        const remainingSkills = skills.filter((skill) => {
            return skill !== skillId;
        });
        setSkills(remainingSkills);
    };

    const finishSetup = async () => {
        let errors: Array<string> = [];
        if (name == "") {
            errors.push("Name cannot be empty");
        }
        if (skills.length == 0) {
            errors.push("Please select at least one skill");
        }
        if (errors.length > 0) {
            toast({
                title: "Setup unsuccessful",
                description: errors.join("; "),
                status: "error",
                duration: 1000,
                isClosable: true,
            });
        } else {
            await firstTimeSetup(
                { userId, name, skills, userType },
                navigate,
                toast
            );
        }
    };

    // ============== key functions if any ==============
    // console.log("userId param", userId);

    return (
        <Card
            w={["90vw", "70vw", "60vw", "50vw", "30vw"]}
            m={"10px auto"}
            p={"10px"}
        >
            <Heading textAlign={"center"}>One-time Setup</Heading>
            {
                // step 1
                step === 1 ? (
                    <Box h={"20vh"} p={"10px"} w={"100%"}>
                        <Text>I am a:</Text>
                        <RadioGroup onChange={setUserType} value={userType}>
                            <Stack direction="column">
                                {userTypes.map((userType, index) => {
                                    const { value, label } = userType;
                                    return (
                                        <Radio key={index} value={value}>
                                            {label}
                                        </Radio>
                                    );
                                })}
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
                                    changeHandler={(e: any) => {
                                        setName(e.target.value);
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                <SkillSelector
                                    handleChangeSelectedSkillId={skillSelector}
                                    selectedSkillId={selectedSkillId}
                                    chosenSkills={skills}
                                    handleDeleteSkillId={deleteSkill}
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
                    buttonText={step === 3 ? "Finish Setup" : "Next"}
                    buttonWidth="40%"
                />
            </Flex>
        </Card>
    );
}
