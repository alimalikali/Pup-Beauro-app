"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useCurrentUserProfile } from "@/lib/hooks/use-queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { Compass, PenTool, Sparkles, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { domainEnum, archetypeEnum, modalityEnum } from "@/lib/db/schema"

const purposeFormSchema = z.object({
  domain: z.enum(domainEnum.enumValues),
  archetype: z.enum(archetypeEnum.enumValues),
  modality: z.enum(modalityEnum.enumValues),
  narrative: z.string().min(10, 'Narrative must be at least 10 characters').max(1000, 'Narrative must be less than 1000 characters'),
  // Commenting out AI-related fields
  // mission: z.string().optional(),
  // injustice: z.string().optional(),
})

type PurposeFormValues = z.infer<typeof purposeFormSchema>

export default function PurposeProfileForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // Commenting out AI-related state
  // const [isGenerating, setIsGenerating] = useState(false)
  const { data: profileData, isLoading: isLoadingProfile } = useCurrentUserProfile()

  const form = useForm<PurposeFormValues>({
    resolver: zodResolver(purposeFormSchema),
    defaultValues: {
      domain: "PERSONAL_GROWTH",
      archetype: "SEEKER",
      modality: "ONLINE",
      narrative: "",
      // Commenting out AI-related fields
      // mission: "",
      // injustice: "",
    }
  })

  // Update form when profile data is loaded
  useEffect(() => {
    if (profileData?.user) {
      const { domain, archetype, modality, narrative } = profileData.user
      if (domain || archetype || modality || narrative) {
        form.reset({
          domain: domain || "PERSONAL_GROWTH",
          archetype: archetype || "SEEKER",
          modality: modality || "ONLINE",
          narrative: narrative || "",
        })
      }
    }
  }, [profileData, form])

  async function onSubmit(data: PurposeFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile/purpose/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: data.domain,
          archetype: data.archetype,
          modality: data.modality,
          narrative: data.narrative,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update purpose profile')
      }

      toast({
        title: "Success",
        description: "Your purpose profile has been updated.",
      })

      router.refresh()
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your purpose profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Commenting out AI generation function
  /*
  const generatePurposeWithAI = async () => {
    setIsGenerating(true)
    try {
      const formData = form.getValues()
      const response = await fetch('/api/ai/generate-purpose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mission: formData.mission,
          injustice: formData.injustice,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate purpose')
      }

      const generatedPurpose = await response.json()
      form.reset({
        ...formData,
        domain: generatedPurpose.domain,
        archetype: generatedPurpose.archetype,
        modality: generatedPurpose.modality,
        narrative: generatedPurpose.narrative,
      })

      toast({
        title: "Purpose Generated",
        description: "We've generated a purpose profile based on your inputs. Feel free to edit it.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate purpose profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }
  */

  if (isLoadingProfile) {
    return <div className="flex items-center justify-center p-8">Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Commenting out AI section
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
            <FormField
              control={form.control}
              name="mission"
              render={({ field }) => (
                <FormItem>
                  <Label>What's your life mission?</Label>
                  <FormControl>
                    <Textarea placeholder="I want to..." className="mt-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="injustice"
              render={({ field }) => (
                <FormItem>
                  <Label>What injustice keeps you up at night?</Label>
                  <FormControl>
                    <Textarea placeholder="I'm troubled by..." className="mt-1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        */}

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Domain</h3>
                </div>
                <FormField
                  control={form.control}
                  name="domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        What is the primary area or field where you aim to make an impact?
                      </FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your domain" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {domainEnum.enumValues.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Archetype</h3>
                </div>
                <FormField
                  control={form.control}
                  name="archetype"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        What role do you naturally embody in pursuing your purpose?
                      </FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your archetype" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {archetypeEnum.enumValues.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Compass className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Modality</h3>
                </div>
                <FormField
                  control={form.control}
                  name="modality"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        How do you prefer to work towards your purpose?
                      </FormDescription>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your modality" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modalityEnum.enumValues.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <PenTool className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Narrative</h3>
              </div>
              <FormField
                control={form.control}
                name="narrative"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Share your purpose story and vision for impact
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your purpose journey and vision..." 
                        className="min-h-[300px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Purpose Profile"}
          </Button>
        </div>
      </form>
    </Form>
  )
}