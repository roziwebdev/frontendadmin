import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prismadb from '@/libs/prismadb';
import cloudinary from '@/libs/cloudinary';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { email, password,  role, profilePhotoUrl , name } = body;
        if (!email || !password  || !role || !profilePhotoUrl || !name) {
            return new Response("Missing Credentials", { status: 400 });
        }

        // Check if user already exists
        const userAlreadyExist = await prismadb.user.findFirst({
            where: { email: email },
        });

        if (userAlreadyExist) {
            return new Response("User already exists", { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Upload the profile photo to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePhotoUrl, {
            upload_preset: 'next-14', // Replace with your Cloudinary upload preset
        });

        // Create the new user in the database with the profile photo URL
        const newUser = await prismadb.user.create({
            data: {
                email: email,
                role: role,
                name: name,
                hashedPassword: hashedPassword,
                profilePhotoUrl: uploadResponse.secure_url, // Save the Cloudinary URL
            },
        });

        return NextResponse.json(newUser);

    } catch (error) {
        console.error('Error during user registration:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
