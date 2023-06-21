// ======= react ==========
// ======= chakra UI ==========
import { Card, Box } from "@chakra-ui/react"
// ======= external functions  ==========

// ======= custom components (if any)==========
import CustomButton from "./CustomButton"
// ============== interfaces (if any) ==============
interface TabTopbarProps {
    tabWords: string[]
    tab: any
    changeTab: any
}

// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============
export default function TabTopbar({
    tabWords,
    tab,
    changeTab,
}: TabTopbarProps) {
    // ============== constant variables if any ==============
    // ============== states (if any) ==============

    // ============== useEffect statement(s) ==============

    // ============== helper functions if any ==============

    // ============== key functions if any ==============
    const selectTab = (newTabIndex: number) => {
        changeTab(newTabIndex)
    }
    return (
        <Card>
            <Box padding="10px" display={"flex"} overflowX={"scroll"}>
                {tabWords.map((word: string, index) => {
                    return (
                        <Box m="5px" key={index}>
                            <CustomButton
                                buttonColor={
                                    tab == index ? "#3609EA" : "#E2E2E2"
                                }
                                textColor={tab == index ? "white" : "black"}
                                buttonText={word}
                                buttonOnClick={() => selectTab(index)}
                                buttonWidth="100%"
                            />
                        </Box>
                    )
                })}
            </Box>
        </Card>
    )
}
