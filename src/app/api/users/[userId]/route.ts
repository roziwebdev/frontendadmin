import { NextResponse } from "next/server";
import prismadb from "@/libs/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/AuthOption";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;
        const user = await prismadb.user.findUnique({
            where: {
                id: userId
            }
        })
        return NextResponse.json(user)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const { userId } = params;
        const userRole = session?.user.role;
        const currentUserId = session?.user.id;

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (userRole === "Admin") {
            const user = await prismadb.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                return new NextResponse('User not found', { status: 404 });
            }

            await prismadb.user.delete({
                where: { id: userId },
            });
            return NextResponse.json({ message: "User deleted" });
        }

        if (userRole === "User" && currentUserId === userId) {
            const user = await prismadb.user.findUnique({
                where: { id: currentUserId },
            });

            if (!user) {
                return new NextResponse('User not found', { status: 404 });
            }

            await prismadb.user.delete({
                where: { id: currentUserId },
            });
            return NextResponse.json({ message: "Account deleted" });
        }

        return new NextResponse('Unauthorized', { status: 403 });
    } catch (error) {
        console.log(error); // Log the actual error
        return new NextResponse('Internal Error', { status: 500 });
    }
}

