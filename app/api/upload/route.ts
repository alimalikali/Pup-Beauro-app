import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  try {
    if (!request.body) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'pup_marrige_uploads',
      resource_type: 'auto',
    })

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      message: "Upload successful",
      version: result.version,
      asset_id: result.asset_id,
      secure_url: result.secure_url,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { message: "Failed to upload image" },
      { status: 500 }
    )
  }
} 