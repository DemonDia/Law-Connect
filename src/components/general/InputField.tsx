// ============== imports: the dependencies ==============
// ======= react ==========

// ======= chakra UI ==========
import { FormControl, FormLabel, Input } from "@chakra-ui/react"

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface InputFieldProps {
    label: string
    placeholder: string
    value: any
    formType: string
    changeHandler: any
}

// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============
export default function InputField({
    label,
    placeholder,
    value,
    formType,
    changeHandler,
}: InputFieldProps) {
    return (
        <FormControl margin={"5px auto"}>
            <FormLabel>{label}</FormLabel>
            <Input
                onChange={changeHandler}
                type={formType}
                value={value}
                placeholder={placeholder}
            />
        </FormControl>
    )
}
