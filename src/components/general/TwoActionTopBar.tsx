// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Card, Box } from "@chakra-ui/react"

// ======= external functions  ==========

// ======= custom components (if any)==========
import CustomButton from "./CustomButton"
// ============== interfaces (if any) ==============
interface TwoActionTopBarProps {
    firstButtonWords: string
    firstButtonColor: string
    firstButtonAction: any
    disabled?: boolean
    secondButtonWords: string
    secondButtonColor: string
    secondButtonAction: any
}

// ============== external variables (if any) ==============

// ============== main component ==============

export default function TwoActionTopBar({
    firstButtonWords,
    firstButtonColor,
    firstButtonAction,
    disabled,
    secondButtonWords,
    secondButtonColor,
    secondButtonAction,
}: TwoActionTopBarProps) {
    // ============== constant variables if any ==============

    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============
    const firstButtonOnClick = async () => {
        await firstButtonAction()
    }
    const secondButtonOnClick = async () => {
        await secondButtonAction()
    }

    // ============== key functions if any ==============

    return (
        <Card>
            <Box padding="10px" display={"flex"}>
                <Box m="5px">
                    <CustomButton
                        buttonColor={firstButtonColor}
                        textColor="white"
                        buttonText={firstButtonWords}
                        buttonOnClick={() => firstButtonOnClick()}
                        buttonWidth="100%"
                        disabled={disabled}
                    />
                </Box>
                <Box m="5px">
                    <CustomButton
                        buttonColor={secondButtonColor}
                        textColor="white"
                        buttonText={secondButtonWords}
                        buttonOnClick={() => secondButtonOnClick()}
                        buttonWidth="100%"
                        disabled={disabled}
                    />
                </Box>
            </Box>
        </Card>
    )
}

// ============== sub component(s) if any ==============
