interface InputFieldProps {
    label: string;
    placeholder: string;
    value: any;
    formType: string;
    changeHandler: any;
}
import { FormControl, FormLabel, Input } from "@chakra-ui/react";
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
    );
}
