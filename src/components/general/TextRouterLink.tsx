interface TextRouterLink {
    to: string;
    linkText: string;
}
import { Link } from "react-router-dom";
// import { Text } from "@chakra-ui/react";
export default function TextRouterLink({ to, linkText }: TextRouterLink) {
    return (
        <Link
            to={to}
            style={{
                textDecoration: "underline",
                color: "#3609EA",
            }}
        >
            {/* <Text color="#3609EA" textDecoration="underline"> */}
            {linkText}
            {/* </Text> */}
        </Link>
    );
}
