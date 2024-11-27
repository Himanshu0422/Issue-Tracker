import authOptions from "@/app/auth/authOption";
import { updateStatusSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });
    }

    const { status } = body;

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(params.id) },
    });

    if (!issue) {
        return NextResponse.json(
            { error: "Issue not found" },
            { status: 404 }
        );
    }

    const updatedIssue = await prisma.issue.update({
        where: { id: issue.id },
        data: { status },
    });

    return NextResponse.json(updatedIssue);
}
