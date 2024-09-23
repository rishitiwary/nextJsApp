import type { Metadata } from "next";
import Login from "@sections/auth/Login";

export const metadata: Metadata = {
  title: "Login Now",
  description:
    "Welcome to grozep",
  authors: [{ name: "grozep", url: "grozep" }],
  keywords: ["grocery"]
};

export default function LoginPage() {
  return <Login />;
}
