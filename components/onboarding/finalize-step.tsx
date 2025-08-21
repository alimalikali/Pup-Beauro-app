"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check } from "lucide-react"

interface PurposeData {
  domain: string
  archetype: string
  modality: string
  anchor: string
  narrative: string
}

interface FiltersData {
  religion: string
  education: string
  career: string
  location: string
  mandatoryKeys: string[]
}

interface FinalizeStepProps {
  purposeData: PurposeData
  filtersData: FiltersData
  onSubmit: () => void
  onBack: () => void
}

export function FinalizeStep({ purposeData, filtersData, onSubmit, onBack }: FinalizeStepProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Finalize Your Profile</h1>
        <p className="text-muted-foreground">Review your purpose and preferences before finalizing your profile.</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Purpose</h2>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Domain</p>
                <p className="font-medium">{purposeData.domain}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Archetype</p>
                <p className="font-medium">{purposeData.archetype}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Modality</p>
                <p className="font-medium">{purposeData.modality}</p>
              </div>
            </div>

            {purposeData.anchor && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Anchor</p>
                <p className="font-medium">{purposeData.anchor}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Purpose Narrative</p>
              <p className="text-sm">{purposeData.narrative}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Preferences</h2>

            <div className="space-y-4">
              {filtersData.religion && (
                <div className="flex items-start">
                  <div className="w-1/3">
                    <p className="text-sm text-muted-foreground">Religion</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{filtersData.religion}</p>
                      {filtersData.mandatoryKeys.includes("religion") && (
                        <Badge variant="outline" className="text-xs">
                          Mandatory
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {filtersData.education && (
                <div className="flex items-start">
                  <div className="w-1/3">
                    <p className="text-sm text-muted-foreground">Education</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{filtersData.education}</p>
                      {filtersData.mandatoryKeys.includes("education") && (
                        <Badge variant="outline" className="text-xs">
                          Mandatory
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {filtersData.career && (
                <div className="flex items-start">
                  <div className="w-1/3">
                    <p className="text-sm text-muted-foreground">Career</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{filtersData.career}</p>
                      {filtersData.mandatoryKeys.includes("career") && (
                        <Badge variant="outline" className="text-xs">
                          Mandatory
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {filtersData.location && (
                <div className="flex items-start">
                  <div className="w-1/3">
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{filtersData.location}</p>
                      {filtersData.mandatoryKeys.includes("location") && (
                        <Badge variant="outline" className="text-xs">
                          Mandatory
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button onClick={onSubmit} className="gap-2">
            <Check className="h-4 w-4" />
            Finalize Profile
          </Button>
        </div>
      </div>
    </div>
  )
}
