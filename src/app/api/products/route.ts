import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/libs/prismadb";
import cloudinary from "@/libs/cloudinary";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/AuthOption";
import initMiddleware from "@/libs/initMiddleware";
import Cors from "cors";

// Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
  })
);

// Handle GET request
export async function GET(req: NextRequest, res: NextResponse) {
  // Apply CORS middleware
  await cors(req, res);

  try {
    const session = await getServerSession(authOptions);
    const { search = "", page = "1", limit = "10" } = Object.fromEntries(new URL(req.url).searchParams);
    const userRole = session?.user.role;
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    // Construct the filter query based on user role
    let whereClause: any = {
      name: {
        contains: search,
      },
    };

    // Non-admin users only see their own products
    if (userRole !== "Admin") {
      whereClause.userId = session?.user.id;
    }

    // Query the product database
    const totalCount = await prismadb.product.count({ where: whereClause });
    const products = await prismadb.product.findMany({
      where: whereClause,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    // Respond with the paginated product data
    return NextResponse.json({
      products,
      currentPage: pageNumber,
      totalPages,
      totalCount,
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// Handle POST request
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check for user authentication
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, price, description, image } = body;

    // Validate required fields
    if (!name || !price || !description || !image) {
      return new NextResponse('Missing fields', { status: 400 });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'next-14',
    });

    // Create a new product in the database
    const newProduct = await prismadb.product.create({
      data: {
        name,
        description,
        price,
        image: uploadResponse.secure_url,
        userId: session.user.id, // Associate product with the logged-in user
      },
    });

    // Respond with the created product
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
