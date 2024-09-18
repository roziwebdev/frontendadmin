import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/libs/prismadb";
import cloudinary from "@/libs/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/AuthOption";

function setCORSHeaders(response: NextResponse) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

export async function GET(req: NextRequest, { params }: { params: { productId: string } }) {
    const { productId } = params;
    try {
        const session = await getServerSession(authOptions);
        const userRole = session?.user.role;

        let product;
        if (userRole === "Admin") {
            product = await prismadb.product.findUnique({
                where: { id: productId },
            });
        } else {
            product = await prismadb.product.findUnique({
                where: { id: productId, userId: session?.user.id },
            });
        }

        if (!product) {
            return setCORSHeaders(new NextResponse('Product not found', { status: 404 }));
        }

        return setCORSHeaders(NextResponse.json(product));
    } catch (error) {
        console.error('Error fetching product:', error);
        return setCORSHeaders(new NextResponse('Internal Server Error', { status: 500 }));
    }
}

export async function PUT(req: NextRequest, { params }: { params: { productId: string } }) {
    const { productId } = params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return setCORSHeaders(new NextResponse('Unauthorized', { status: 401 }));
        }

        const userRole = session.user.role;
        const body = await req.json();
        const { name, price, description, image } = body;

        let existingProduct = await prismadb.product.findUnique({
            where: userRole === "Admin" ? { id: productId } : { id: productId, userId: session?.user.id },
        });

        if (!existingProduct) {
            return setCORSHeaders(new NextResponse('Product not found', { status: 404 }));
        }

        let imageUrl = existingProduct.image;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                upload_preset: 'next-14',
            });
            imageUrl = uploadResponse.secure_url;
        }

        const updatedProduct = await prismadb.product.update({
            where: { id: productId },
            data: { name, description, price, image: imageUrl }
        });

        return setCORSHeaders(NextResponse.json(updatedProduct));
    } catch (error) {
        console.error('Error updating product:', error);
        return setCORSHeaders(new NextResponse('Internal Server Error', { status: 500 }));
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
    const { productId } = params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return setCORSHeaders(new NextResponse('Unauthorized', { status: 401 }));
        }

        const userRole = session.user.role;
        const product = await prismadb.product.delete({
            where: userRole === "Admin" ? { id: productId } : { id: productId, userId: session?.user.id },
        });

        return setCORSHeaders(NextResponse.json(product));
    } catch (error) {
        console.error('Error deleting product:', error);
        return setCORSHeaders(new NextResponse('Internal Server Error', { status: 500 }));
    }
}
