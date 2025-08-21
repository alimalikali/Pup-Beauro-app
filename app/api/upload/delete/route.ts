import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { getCurrentUser } from "@/lib/utils/auth-helper"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { public_id } = body

    if (!public_id) {
      return NextResponse.json(
        { message: "No public_id provided" },
        { status: 400 }
      )
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id)

    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary')
    }

    return NextResponse.json({
      message: "Image deleted successfully",
      ok: true
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { message: "Failed to delete image" },
      { status: 500 }
    )
  }
} 