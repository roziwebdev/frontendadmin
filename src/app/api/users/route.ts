import { authOptions } from "@/libs/AuthOption";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }
        const { search = "", page = "1", limit = "10" } = Object.fromEntries(new URL(req.url).searchParams);
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const userRole = session.user.role;

        let whereClause: any = {
            name: {
                contains: search,
            }
        }

        if (userRole !== "Admin") {
            return new NextResponse('Unauthorized', { status: 401 });
        } else if (userRole === "Admin") {
            const totalCount = await prisma.user.count({ where: whereClause });
            const users = await prisma.user.findMany({
                where: whereClause,
                skip: (pageNumber - 1) * pageSize,
                take: pageSize,
            });
            const totalPages = Math.ceil(totalCount / pageSize);

            return NextResponse.json({
                users,
                currentPage: pageNumber,
                totalPages,
                totalCount
            });
        }

    }catch (error) {
        return new NextResponse('Internal Error', { status: 500 });
    }
}

