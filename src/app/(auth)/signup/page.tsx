import type { Metadata } from "next";
import Signup from "@sections/auth/Signup";

export const metadata: Metadata = {
  title: "Register now",
  description:
    "Best grocery store in jharkhand",
  authors: [{ name: "UI-LIB", url: "https://ui-lib.com" }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react", "bonik"]
};

export default function SignUpPage() {
  return <Signup />;
}
