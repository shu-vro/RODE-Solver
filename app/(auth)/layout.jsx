import { Montserrat } from "next/font/google";
import "@/app/globals.css";
import favicon from "@/app/favicon.ico";
// import Header from "./components/Header";
import { ThemeProvider } from "@/app/components/ThemeProvider";
// import Footer from "./components/Footer";

const font = Montserrat({ subsets: ["latin"] });

export const metadata = {
    title: "authenticate - RODE Solver",
    description: "An app to solve various equations",
};

export default function RootLayout({ children }) {
    return children;
}
