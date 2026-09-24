import {getServerSession} from "next-auth";
import {authOptions} from "../auth/[...nextauth]/route";
import {NextRequest, NextResponse} from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({message: "Unauthorized"}, {status: 401});
  }

  try {
    const result = await db.insert(users).values({
      email: session?.user?.email,
      name: session?.user?.name,
    }).onConflictDoNothing({
      target: users.email
    })
    .returning();

    if(result.length === 0) {
      return NextResponse.json({message: "User already exists"}, {status: 200});
    }

    return NextResponse.json({message: "User Saved successfully", user: result});

  }
  catch(e)
  {
    return NextResponse.json({message: "Error", error: e}, {status: 500});
  }

}