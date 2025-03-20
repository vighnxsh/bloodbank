import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const donors = await db.donor.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(donors);
  } catch (error) {
    console.error("Error fetching donors:", error);
    return NextResponse.json(
      { error: "Failed to fetch donors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert lastDonated to a Date object if it's provided
    if (body.lastDonated) {
      body.lastDonated = new Date(body.lastDonated);
    }
    
    const donor = await db.donor.create({
      data: body
    });
    
    return NextResponse.json(donor, { status: 201 });
  } catch (error) {
    console.error("Error creating donor:", error);
    return NextResponse.json(
      { error: "Failed to create donor" },
      { status: 500 }
    );
  }
} 