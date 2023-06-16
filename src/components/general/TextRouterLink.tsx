// ============== imports: the dependencies ==============
// ======= react ==========
import { Link } from "react-router-dom";
// ======= chakra UI ==========

// ======= custom components (if any)==========

// ============== interfaces (if any) ==============
interface TextRouterLink {
    to: string;
    linkText: string;
}
// ============== external variables (if any) ==============

// ============== main component ==============

// ============== sub component(s) if any ==============

export default function TextRouterLink({ to, linkText }: TextRouterLink) {
    return (
        <Link
            to={to}
            style={{
                textDecoration: "underline",
                color: "#3609EA",
            }}
        >
            {linkText}
        </Link>
    );
}
