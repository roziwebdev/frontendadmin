import prismadb from "@/libs/prismadb";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    const { search = "", page = "1", limit = "10" } = Object.fromEntries(new URL(request.url).searchParams);
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        let whereClause: any = {
            name: {
                contains: search,
            },
        };
        const users = await prismadb.user.findMany({
            where: whereClause,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
        });

        const totalCount = await prismadb.user.count({ where: whereClause });
        const totalPages = Math.ceil(totalCount / pageSize);

        return NextResponse.json({
            users,
            currentPage: pageNumber,
            totalPages,
            totalCount,
        });
}