"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (value: string, public_id?: string) => void
  previousPublicId?: string 
  disabled?: boolean
}

export function ImageUpload({
  value = "",
  onChange,
  previousPublicId,
  disabled
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)


  const deleteImage = async (public_id: string) => {
    try {
      await fetch('/api/upload/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_id }),
      })
    } catch (err) {
      console.error("Failed to delete previous image:", err)
    }
  }

  const onUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file, file.name)

      // Upload to our API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (previousPublicId && previousPublicId !== data.public_id) {
        await deleteImage(previousPublicId)
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload image')
      }

      // Use secure_url instead of url
      onChange(data.secure_url, data.public_id)
    } catch (error) {
      console.error('Error uploading image:', error)
      onChange("", undefined)
    } finally {
      setIsLoading(false)
    }
  }, [onChange, previousPublicId])

  const hasValue = value && value !== ""

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
        disabled={disabled || isLoading}
        id="imageUpload"
      />
      {hasValue ? (
        <div className="relative h-40 w-40">
          <Image
            src={value}
            alt="Avatar"
            className="rounded-full object-cover"
            fill
          />
        </div>
      ) : null}
      <label
        htmlFor="imageUpload"
        className="cursor-pointer"
        onClick={() => {
          // Manually trigger click on input
          document.getElementById('imageUpload')?.click();
        }}
      >
        <Button
          variant="outline"
          disabled={disabled || isLoading}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          <span className="ml-2">
            {hasValue ? 'Change Image' : 'Upload Image'}
          </span>
        </Button>
      </label>
    </div>
  )
}