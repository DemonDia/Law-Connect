// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { Button } from "@chakra-ui/react"

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface ButtonSettings {
    buttonColor: string // button color in hexadecimal
    textColor: string // text color in hexadecimal
    buttonText: string // text in button
    buttonOnClick: unknown // function
    buttonWidth?: string // width of button
    disabled?: boolean
}

// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============

export default function CustomButton({
    buttonColor,
    textColor,
    buttonText,
    buttonOnClick,
    buttonWidth,
    disabled,
}: ButtonSettings) {
    return (
        <>
            <Button
                margin={"5px auto"}
                color={textColor}
                bg={buttonColor}
                w={buttonWidth}
                onClick={() => {
                    buttonOnClick()
                }}
                boxShadow={"0px 0px 4px rgba(0, 0, 0, 0.35)"}
                isDisabled={disabled ? true : false}
                // isActive={!disabled}
                >
                {buttonText}
            </Button>
        </>
    )
}
