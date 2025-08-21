"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Sparkles } from "lucide-react"

interface PurposeData {
  domain: string
  archetype: string
  modality: string
  anchor: string
  narrative: string
}

interface PurposeStepProps {
  initialData: PurposeData
  onSubmit: (data: PurposeData) => void
}

export function PurposeStep({ initialData, onSubmit }: PurposeStepProps) {
  const [data, setData] = useState<PurposeData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)

  const domains = [
    "Political",
    "Educational",
    "Spiritual",
    "Environmental",
    "Social Justice",
    "Health & Wellness",
    "Technology",
    "Arts & Culture",
  ]

  const archetypes = ["Strategist", "Builder", "Healer", "Teacher", "Advocate", "Connector", "Innovator", "Guardian"]

  const modalities = [
    "Teaching",
    "Organizing",
    "Creating",
    "Healing",
    "Advocating",
    "Researching",
    "Building",
    "Leading",
  ]

  const handleChange = (field: keyof PurposeData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(data)
  }

  const generatePurposeWithAI = async () => {
    setIsGenerating(true)

    // Mock AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Sample generated purpose
    const generatedPurpose = {
      domain: "Educational",
      archetype: "Teacher",
      modality: "Organizing",
      anchor: "Islamic Education Reform",
      narrative:
        "I am deeply committed to reforming educational systems to be more inclusive and accessible, particularly for marginalized communities. My approach combines traditional wisdom with modern pedagogical methods, creating bridges between different knowledge traditions. I believe education is the foundation for social justice and community empowerment.",
    }

    setData(generatedPurpose)
    setIsGenerating(false)
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Define Your Purpose</h1>
        <p className="text-muted-foreground">Let's understand what drives you and what you're passionate about.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-muted/50 p-6 rounded-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">AI-Guided Purpose Discovery</h2>
            <Button
              type="button"
              variant="outline"
              onClick={generatePurposeWithAI}
              disabled={isGenerating}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Answer these prompts to help our AI understand your purpose:
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mission">What's your life mission?</Label>
              <Textarea id="mission" placeholder="I want to..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="injustice">What injustice keeps you up at night?</Label>
              <Textarea id="injustice" placeholder="I'm troubled by..." className="mt-1" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Select value={data.domain} onValueChange={(value) => handleChange("domain", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map((domain) => (
                  <SelectItem key={domain} value={domain}>
                    {domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="archetype">Archetype</Label>
            <Select value={data.archetype} onValueChange={(value) => handleChange("archetype", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select archetype" />
              </SelectTrigger>
              <SelectContent>
                {archetypes.map((archetype) => (
                  <SelectItem key={archetype} value={archetype}>
                    {archetype}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modality">Modality</Label>
            <Select value={data.modality} onValueChange={(value) => handleChange("modality", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select modality" />
              </SelectTrigger>
              <SelectContent>
                {modalities.map((modality) => (
                  <SelectItem key={modality} value={modality}>
                    {modality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="anchor">Anchor (Optional)</Label>
            <Input
              id="anchor"
              value={data.anchor}
              onChange={(e) => handleChange("anchor", e.target.value)}
              placeholder="e.g., Islamic Revival, Decolonial Theory"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="narrative">Your Purpose Narrative</Label>
          <Textarea
            id="narrative"
            value={data.narrative}
            onChange={(e) => handleChange("narrative", e.target.value)}
            placeholder="Describe your life purpose and mission in your own words..."
            className="min-h-[150px]"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!data.domain || !data.archetype || !data.modality || !data.narrative}
            className="gap-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
