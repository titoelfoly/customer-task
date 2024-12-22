import db from "../../../lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("userId");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDirection =
      searchParams.get("sortDirection") === "desc" ? "desc" : "asc";
    const status = searchParams.get("status");

    const filters = {
      ...(id && { userId: id }),
      ...(status !== null &&
        status !== "null" && {
          status: status === "true",
        }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const customers = await db.customer.findMany({
      where: filters,
      orderBy: {
        [sortBy]: sortDirection,
      },
    });

    if (!customers) {
      return new NextResponse("No users found", { status: 404 });
    }
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.log("[GET USERS ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("userId");
    const body = await req.json();
    const { name, email, phone, status } = body;

    const newCustomer = await db.customer.create({
      data: {
        name,
        email,
        phone,
        status,
        userId: id,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.log("[CREATE CUSTOMER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, email, phone, status } = body;

    const updatedCustomer = await db.customer.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        status,
      },
    });

    return NextResponse.json(updatedCustomer, { status: 200 });
  } catch (error) {
    console.log("[UPDATE CUSTOMER]", error);
    return new NextResponse("Customer not found", { status: 404 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await db.customer.delete({
        where: { id },
      });

      return new NextResponse("Customer deleted successfully", { status: 200 });
    } else {
      const body = await req.json();
      const { ids } = body;

      await db.customer.deleteMany({
        where: {
          id: { in: ids },
        },
      });

      return new NextResponse("Customers deleted successfully", {
        status: 200,
      });
    }
  } catch (error) {
    console.log("[DELETE CUSTOMER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
