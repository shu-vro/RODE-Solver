import { Montserrat } from "next/font/google";
import "./globals.css";
import favicon from "@/app/favicon.ico";
import Header from "@/app/components/Header";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Footer from "@/app/components/Footer";
import LeftSidebar from "@/app/components/LeftSidebar";
import LeftNavProvider from "@/contexts/LeftNavProvider";
import { Toaster } from "@/components/ui/sonner";
import ConfigComponent from "../components/ConfigComponent";
import AuthProvider from "@/contexts/AuthProvider";
import UserQuestionsProvider from "@/contexts/UserQuestionsProvider";
import { Metadata } from "next";
import banner from "@/assets/rode_solver_banner.jpg";

const font = Montserrat({ subsets: ["latin"] });

const APP_NAME = "RODE Solver";
const APP_DEFAULT_TITLE = "RODE Solver";
const APP_TITLE_TEMPLATE = "%s - for solving equations";
const APP_DESCRIPTION =
    "Solve equations with interactive step-by-step solutions.";

const APP_BANNER = {
    url: banner.src,
    width: 960,
    height: 540,
    alt: APP_DEFAULT_TITLE,
};

/**
 * @type {Metadata}
 */
export const metadata = {
    applicationName: APP_NAME,
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
        { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    ],
    title: {
        default: APP_DEFAULT_TITLE,
        template: APP_TITLE_TEMPLATE,
    },
    icons: [
        {
            url: favicon.src,
            sizes: "32x32",
            type: "image/x-icon",
        },
    ],
    description: APP_DESCRIPTION,
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: APP_DEFAULT_TITLE,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: APP_NAME,
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
        images: APP_BANNER,
    },
    twitter: {
        card: "summary",
        title: {
            default: APP_DEFAULT_TITLE,
            template: APP_TITLE_TEMPLATE,
        },
        description: APP_DESCRIPTION,
        images: APP_BANNER,
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
            </head>
            <body className={font.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    <AuthProvider>
                        <UserQuestionsProvider>
                            <LeftNavProvider>
                                <Header />
                                <div className="flex flex-row flex-nowrap">
                                    <LeftSidebar />
                                    {children}
                                </div>
                            </LeftNavProvider>
                            <Footer />
                            <Toaster
                                expand
                                richColors
                                closeButton
                                duration={5000}
                                position="bottom-left"
                            />
                            <ConfigComponent />
                        </UserQuestionsProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
