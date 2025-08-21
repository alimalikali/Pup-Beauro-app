"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { PurposeStep } from "@/components/onboarding/purpose-step"
import { FiltersStep } from "@/components/onboarding/filters-step"
import { FinalizeStep } from "@/components/onboarding/finalize-step"
import { motion, AnimatePresence } from "framer-motion"

export function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [purposeData, setPurposeData] = useState({
    domain: "",
    archetype: "",
    modality: "",
    anchor: "",
    narrative: "",
  })
  const [filtersData, setFiltersData] = useState({
    religion: "",
    education: "",
    career: "",
    location: "",
    mandatoryKeys: ["religion", "education"],
  })
  const router = useRouter()

  const totalSteps = 3

  const handlePurposeSubmit = (data: typeof purposeData) => {
    setPurposeData(data)
    setStep(2)
  }

  const handleFiltersSubmit = (data: typeof filtersData) => {
    setFiltersData(data)
    setStep(3)
  }

  const handleFinalSubmit = () => {
    // Mock API call to save profile
    toast({
      title: "Profile created!",
      description: "Your profile has been created successfully.",
    })
    router.push("/dashboard")
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" fill="currentColor" />
            <span className="font-bold text-xl">Pup</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-4xl border-none shadow-lg">
          <CardContent className="p-0">
            <div className="relative h-2 bg-muted mb-8">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary"
                initial={{ width: `${((step - 1) / totalSteps) * 100}%` }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PurposeStep initialData={purposeData} onSubmit={handlePurposeSubmit} />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiltersStep initialData={filtersData} onSubmit={handleFiltersSubmit} onBack={handleBack} />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FinalizeStep
                      purposeData={purposeData}
                      filtersData={filtersData}
                      onSubmit={handleFinalSubmit}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
