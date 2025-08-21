"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface FiltersData {
  religion: string
  education: string
  career: string
  location: string
  mandatoryKeys: string[]
}

interface FiltersStepProps {
  initialData: FiltersData
  onSubmit: (data: FiltersData) => void
  onBack: () => void
}

export function FiltersStep({ initialData, onSubmit, onBack }: FiltersStepProps) {
  const [data, setData] = useState<FiltersData>(initialData)

  const religions = [
    "Islam",
    "Christianity",
    "Judaism",
    "Hinduism",
    "Buddhism",
    "Sikhism",
    "Spiritual but not religious",
    "Agnostic",
    "Atheist",
    "Other",
  ]

  const educationLevels = [
    "High School",
    "Associate's Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
    "Professional Degree",
    "Self-Educated",
  ]

  const handleChange = (field: keyof Omit<FiltersData, "mandatoryKeys">, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleMandatory = (field: string) => {
    setData((prev) => {
      const mandatoryKeys = [...prev.mandatoryKeys]

      if (mandatoryKeys.includes(field)) {
        return {
          ...prev,
          mandatoryKeys: mandatoryKeys.filter((key) => key !== field),
        }
      } else {
        return {
          ...prev,
          mandatoryKeys: [...mandatoryKeys, field],
        }
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(data)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Set Your Preferences</h1>
        <p className="text-muted-foreground">
          Define what you're looking for in a partner. Mark attributes as mandatory or optional.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="religion">Religion</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="religionMandatory"
                  checked={data.mandatoryKeys.includes("religion")}
                  onCheckedChange={() => toggleMandatory("religion")}
                />
                <Label htmlFor="religionMandatory" className="text-sm font-normal">
                  Mandatory
                </Label>
              </div>
            </div>
            <Select value={data.religion} onValueChange={(value) => handleChange("religion", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select religion" />
              </SelectTrigger>
              <SelectContent>
                {religions.map((religion) => (
                  <SelectItem key={religion} value={religion}>
                    {religion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="education">Education</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="educationMandatory"
                  checked={data.mandatoryKeys.includes("education")}
                  onCheckedChange={() => toggleMandatory("education")}
                />
                <Label htmlFor="educationMandatory" className="text-sm font-normal">
                  Mandatory
                </Label>
              </div>
            </div>
            <Select value={data.education} onValueChange={(value) => handleChange("education", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="career">Career</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="careerMandatory"
                  checked={data.mandatoryKeys.includes("career")}
                  onCheckedChange={() => toggleMandatory("career")}
                />
                <Label htmlFor="careerMandatory" className="text-sm font-normal">
                  Mandatory
                </Label>
              </div>
            </div>
            <Input
              id="career"
              value={data.career}
              onChange={(e) => handleChange("career", e.target.value)}
              placeholder="e.g., Doctor, Engineer, Artist"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="locationMandatory"
                  checked={data.mandatoryKeys.includes("location")}
                  onCheckedChange={() => toggleMandatory("location")}
                />
                <Label htmlFor="locationMandatory" className="text-sm font-normal">
                  Mandatory
                </Label>
              </div>
            </div>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g., New York, London, Remote"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button type="submit" className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
