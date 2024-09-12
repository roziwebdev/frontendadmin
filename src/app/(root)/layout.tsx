import Dashboard from "@/components/ui/Dashboard"
import Navbar from "@/components/ui/Navbar"
import Sidebar from "@/components/ui/Sidebar"
import { authOptions } from "@/libs/AuthOption"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

interface ProtectedRootLayoutProps {
    children: React.ReactNode
}

export default async function ProtectedRootLayout({ children }: ProtectedRootLayoutProps) {

    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/signin')
    }

    return (
        <>
            
            {children}
        </>
    )
}