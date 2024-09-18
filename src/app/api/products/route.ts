import { NextResponse } from "next/server";
import prismadb from "@/libs/prismadb";
import cloudinary from "@/libs/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/AuthOption";

function setCORSHeaders(response: NextResponse) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        const { search = "", page = "1", limit = "10" } = Object.fromEntries(new URL(req.url).searchParams);
        const userRole = session?.user.role;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);

        let whereClause: any = {
            name: {
                contains: search,
            },
        };

        if (userRole !== "Admin") {
            whereClause.userId = session?.user.id; // Filter by userId for non-admin users
        }

        const totalCount = await prismadb.product.count({ where: whereClause });
        const products = await prismadb.product.findMany({
            where: whereClause,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalPages = Math.ceil(totalCount / pageSize);

        const response = NextResponse.json({
            products,
            currentPage: pageNumber,
            totalPages,
            totalCount,
        });

        return setCORSHeaders(response); // Set CORS headers
    } catch (error) {
        console.error(error);
        const response = new NextResponse('Internal Error', { status: 500 });
        return setCORSHeaders(response); // Set CORS headers on error as well
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            const response = new NextResponse('Unauthorized', { status: 401 });
            return setCORSHeaders(response); // Set CORS headers
        }

        const body = await req.json();
        const { name, price, description, image } = body;

        if (!name || !price || !description || !image) {
            const response = new NextResponse('Missing fields', { status: 400 });
            return setCORSHeaders(response); // Set CORS headers
        }

        const uploadResponse = await cloudinary.uploader.upload(image, {
            upload_preset: 'next-14',
        });

        const newProduct = await prismadb.product.create({
            data: {
                name,
                description,
                price,
                image: uploadResponse.secure_url,
                userId: session.user.id  // Associate the product with the user
            }
        });

        const response = NextResponse.json(newProduct);
        return setCORSHeaders(response); // Set CORS headers
    } catch (error) {
        const response = new NextResponse('Internal Error', { status: 500 });
        return setCORSHeaders(response); // Set CORS headers on error as well
    }
}
