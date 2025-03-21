import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid donor ID" },
        { status: 400 }
      );
    }
    
    const donor = await db.donor.findUnique({
      where: { id },
      include: {
        donations: true
      }
    });
    
    if (!donor) {
      return NextResponse.json(
        { error: "Donor not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(donor);
  } catch (error) {
    console.error("Error fetching donor:", error);
    return NextResponse.json(
      { error: "Failed to fetch donor" },
      { status: 500 }
    );
  }
}

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid donor ID" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Convert lastDonated to a Date object if provided
    if (body.lastDonated) {
      body.lastDonated = new Date(body.lastDonated);
    }
    
    const donor = await db.donor.update({
      where: { id },
      data: body
    });
    
    return NextResponse.json(donor);
  } catch (error) {
    console.error("Error updating donor:", error);
    return NextResponse.json(
      { error: "Failed to update donor" },
      { status: 500 }
    );
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid donor ID" },
        { status: 400 }
      );
    }
    
    await db.donor.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { message: "Donor deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting donor:", error);
    return NextResponse.json(
      { error: "Failed to delete donor" },
      { status: 500 }
    );
  }
}