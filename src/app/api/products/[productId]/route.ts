import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/libs/prismadb"
import cloudinary from "@/libs/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/AuthOption";
import initMiddleware from "@/libs/initMiddleware";

function setCORSHeaders(response: NextResponse) {
    response.headers.set("Access-Control-Allow-Origin", "*"); // Allow all origins
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}




export async function GET(request: NextRequest, response: NextResponse , { params }: { params: { productId: string } }) {
    try {
        const { productId } = params;
        const session = await getServerSession(authOptions)
        const userRole = session?.user.role;

        if (userRole == "Admin") {
            const product = await prismadb.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                return NextResponse.json({ message: 'Product not found' }, { status: 404 });
              return setCORSHeaders(response); // Set CORS headers on error as well
            }
        return NextResponse.json(product);
        } else {
            try {
                const product = await prismadb.product.findUnique({
                    where: {
                        id: productId,
                        userId: session.user.id
                    }
                });
                if (!product) {
                    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
                  return setCORSHeaders(response); // Set CORS headers on error as well
                }
                return NextResponse.json(product);
            }catch (error) {
                return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
              return setCORSHeaders(response); // Set CORS headers on error as well
            }
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      return setCORSHeaders(response); // Set CORS headers on error as well
    }
}

export async function PUT(request: NextRequest, response: NextResponse, { params }: { params: { productId: string } }) {
    try {

        const session = await getServerSession(authOptions)

        const { productId } = params;

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
          return setCORSHeaders(response); // Set CORS headers on error as well
        }

        const userRole = session.user.role;

        const body = await request.json();
        const {  name, price, description, image } = body;
        if (userRole == "Admin") {
            // Fetch the current product to get the existing image if no new image is uploaded
            const existingProduct = await prismadb.product.findUnique({
                where: { id: productId },
            });

            if (!existingProduct) {
                return new NextResponse('Product not found', { status: 404 });
            }
            let imageUrl = existingProduct.image; // Use the existing image if no new image is uploaded
            // If a new image is provided, upload it to Cloudinary
            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    upload_preset: 'next-14',
                });
                imageUrl = uploadResponse.secure_url;
            }

            // Update the product with new data
            const updatedProduct = await prismadb.product.update({
                where: { id: productId },
                data: {
                    name,
                    description,
                    price,
                    image: imageUrl
                }
            });

            return NextResponse.json(updatedProduct);
          return setCORSHeaders(response); // Set CORS headers on error as well
        }

        if (userRole == "User") {

            // Fetch the current product to get the existing image if no new image is uploaded
            const existingProduct = await prismadb.product.findUnique({
                where: {
                    id: productId,
                    userId: session.user.id
                },
            });

            if(session?.user.id !== existingProduct?.userId) {
                return new NextResponse('Not your product', { status: 401 });
              return setCORSHeaders(response); // Set CORS headers on error as well
            }

             if (!existingProduct) {
                return new NextResponse('Product not found', { status: 404 });
               return setCORSHeaders(response); // Set CORS headers on error as well
            }

            let imageUrl = existingProduct.image; // Use the existing image if no new image is uploaded
            // If a new image is provided, upload it to Cloudinary
            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image, {
                    upload_preset: 'next-14',
                });
                imageUrl = uploadResponse.secure_url;
            }

            // Update the product with new data
            const updatedProduct = await prismadb.product.update({
                where: {
                    id: productId,
                    userId: session.user.id
                },
                data: {
                    name,
                    description,
                    price,
                    image: imageUrl
                }
            });
            return NextResponse.json(updatedProduct);
          return setCORSHeaders(response); // Set CORS headers on error as well
         }

    } catch (error) {
        return console.error(error);
      return setCORSHeaders(response); // Set CORS headers on error as well
    }
}

export async function DELETE(request: NextRequest, response: NextResponse, { params }: { params: { productId: string } }) {
    try {
        const session = await getServerSession(authOptions);
        const { productId } = params;
        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
          return setCORSHeaders(response); // Set CORS headers on error as well
        }

        const userRole = session.user.role;
        if (userRole == "Admin") {
            const product = await prismadb.product.delete({
                where: { id: productId },
            });
            return NextResponse.json(product);
          return setCORSHeaders(response); // Set CORS headers on error as well
        }
        if(userRole == "User") {
            const product = await prismadb.product.delete({
                where: {
                    id: productId,
                    userId: session.user.id
                }
            });
            return NextResponse.json(product);
          return setCORSHeaders(response); // Set CORS headers on error as well
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
