import { NextResponse } from "next/server";
import prismadb from "@/libs/prismadb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/AuthOption";
import cloudinary from "@/libs/cloudinary";

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

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
        const body = await request.json();
        const {  name, role, email, profilePhotoUrl } = body;
        const { userId } = params;
        const session = await getServerSession(authOptions);
        const userRole = session?.user.role;
        const currentUserId = session?.user.id;
    try {

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        if (userRole === "Admin") {
            const existingUser = await prismadb.user.findUnique({
                where: { id: userId },
            });
            if (!existingUser) {
                return new NextResponse('User not found', { status: 404 });
            }
            let imageUrl = existingUser.profilePhotoUrl;
            if (profilePhotoUrl) {
                const uploadResponse = await cloudinary.uploader.upload(profilePhotoUrl, {
                    upload_preset: 'next-14',
                })
                imageUrl = uploadResponse.secure_url;
            }

            const updatedUser = await prismadb.user.update({
                where: { id: userId },
                data: {
                    name,
                    role,
                    email,
                    profilePhotoUrl: imageUrl
                }
            });
            return NextResponse.json(updatedUser);
        }

        if (userRole === "User" && currentUserId === userId) {
            const existingUser = await prismadb.user.findUnique({
                where: { id: currentUserId },
            });
            if (!existingUser) {
                return new NextResponse('User not found', { status: 404 });
            }
            let imageUrl = existingUser.profilePhotoUrl;
            if (profilePhotoUrl) {
                const uploadResponse = await cloudinary.uploader.upload(profilePhotoUrl, {
                    upload_preset: 'next-14',
                })
                imageUrl = uploadResponse.secure_url;
            }

            const updatedUser = await prismadb.user.update({
                where: { id: currentUserId },
                data: {
                    name,
                    role,
                    email,
                    profilePhotoUrl: imageUrl
                }
            });
            return NextResponse.json(updatedUser);

        }
    } catch (error) {
        console.log(error)
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

