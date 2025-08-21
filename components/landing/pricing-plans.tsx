"use client"

import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import Link from "next/link"

export function PricingPlans() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: "Free",
      description: "Basic features to get you started",
      price: { monthly: 0, annual: 0 },
      features: ["5 matches per month", "Basic purpose profile", "Limited filters", "Email support"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium",
      description: "Everything you need for serious matching",
      price: { monthly: 19.99, annual: 14.99 },
      features: [
        "Unlimited matches",
        "Advanced purpose analysis",
        "All filters and preferences",
        "Priority visibility",
        "AI match narrative",
        "Priority support",
      ],
      cta: "Get Premium",
      popular: true,
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4" ref={ref}>
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Choose the plan that works best for your journey to finding a purpose-aligned partner.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className={`text-sm font-medium ${!isAnnual ? "text-primary" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} aria-label="Toggle annual billing" />
            <span className={`text-sm font-medium ${isAnnual ? "text-primary" : "text-muted-foreground"}`}>
              Annual <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">Save 25%</span>
            </span>
          </motion.div>
        </div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 w-full mx-auto"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={item} className="flex">
              <Card className={`flex flex-col h-full border-2 ${plan.popular ? "border-primary" : "border-muted"}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-b-md w-fit mx-auto">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                    <span className="text-muted-foreground ml-2">{plan.price.monthly > 0 ? "/month" : ""}</span>
                    {isAnnual && plan.price.monthly > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (${(plan.price.annual * 12).toFixed(2)})
                      </div>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
