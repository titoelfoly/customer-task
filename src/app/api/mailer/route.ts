import { sendEmail } from "@/utils/sendEmails";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;
    if (!file) {
      return NextResponse.json({ success: false });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const path = join("/", "tmp", file.name);
    await writeFile(path, buffer);
    sendEmail("Customer User Data", "Customer User Data", email, buffer);

    return NextResponse.json("", { status: 201 });
  } catch (error) {
    console.log("[CREATE CUSTOMER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}