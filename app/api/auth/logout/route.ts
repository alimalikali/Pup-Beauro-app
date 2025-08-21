import { NextResponse } from "next/server"
import { clearAuthCookies } from "@/lib/utils/auth-helper"

export async function POST() {
  await clearAuthCookies()

  return NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })
}
