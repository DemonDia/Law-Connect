// ============== imports: the dependencies ==============
// ======= react ==========
import { useEffect, useState } from "react"
// ======= chakra UI ==========
import { Text, Box, Progress, useToast } from "@chakra-ui/react"
import CustomButton from "../general/CustomButton"
// ======= firebase ==========

// ======= zustand/state ==========

// ======= custom components (if any)==========
import InputField from "../general/InputField"

// ============== interfaces (if any) ==============
interface SkillProgressContainerProps {
    // skillId: string
    skills: any[]
    skillNum: number
    skillLevel: number
    skillName: string
    handleUpdateSkillProgress: any
}

// ============== external variables (if any) ==============

// ======= external functions  ==========

// ============== main component ==============

export default function SkillProgressContainer({
    // skillId,
    skills,
    skillNum,
    skillLevel,
    skillName,
    handleUpdateSkillProgress,
}: SkillProgressContainerProps) {
    // ============== constant variables if any ==============
    const toast = useToast()
    // ============== states (if any) ==============
    const [currSkillLevel, setCurrSkillLvl] = useState<number>(skillLevel)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    // ============== useEffect statement(s) ==============
    // ============== helper functions if any ==============
    // ============== key functions if any ==============
    const startEdit = () => {
        setIsEditing(true)
    }
    const cancelEdit = () => {
        setCurrSkillLvl(skillLevel)
        setIsEditing(false)
    }
    const handleEdit = (newVal: number) => {
        setCurrSkillLvl(newVal)
        skills[skillNum].skillLevel = newVal
    }
    const saveEdit = async () => {
        if (currSkillLevel < 0 || currSkillLevel > 100) {
            toast({
                title: "Invalid skill level",
                description: "Skill level must be between 0 and 100",
                status: "error",
                duration: 1000,
                isClosable: true,
            })
        } else {
            await handleUpdateSkillProgress()
            setIsEditing(false)
        }
    }

    return (
        <Box
            background={"white"}
            p="10px"
            m="5px"
            minHeight={["300px", "250px", "260px"]}
            borderRadius={"10px"}
            boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.3)"}>
            <Text fontSize={"2xl"}>{skillName}</Text>
            <Text>Progress: {currSkillLevel}%</Text>
            <Progress
                min={0}
                max={100}
                value={currSkillLevel}
                borderRadius={"5px"}
                colorScheme="green"
                m="10px auto"
            />
            {!isEditing ? (
                <>
                    {" "}
                    <CustomButton
                        buttonColor="#3609EA"
                        textColor="white"
                        buttonText={"Edit"}
                        buttonOnClick={startEdit}
                    />
                </>
            ) : (
                <>
                    <InputField
                        label="Skill level"
                        placeholder="Enter new skill level"
                        formType="number"
                        changeHandler={(e: any) => handleEdit(e.target.value)}
                        value={currSkillLevel}
                    />
                    <CustomButton
                        buttonColor="#6D6D6D"
                        textColor="white"
                        buttonText={"Cancel"}
                        buttonOnClick={cancelEdit}
                        buttonWidth="50%"
                    />
                    <CustomButton
                        buttonColor="#1D00D0"
                        textColor="white"
                        buttonText={"Save"}
                        buttonOnClick={saveEdit}
                        buttonWidth="50%"
                    />
                </>
            )}
        </Box>
    )
}

// ============== sub component(s) if any ==============
