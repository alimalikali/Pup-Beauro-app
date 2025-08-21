"use client"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useCurrentUserProfile, useUserUpdateProfile } from "@/lib/hooks/use-queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { Country, State, City } from "country-state-city"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { PersonalInfoSection } from "./sections/personal-info-section"
import { LocationSection } from "./sections/location-section"
import { LifestyleSection } from "./sections/lifestyle-section"
import { InterestsSection } from "./sections/interests-section"
import { ProfilePictureSection } from "./sections/profile-picture-section"

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dob: z.string().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  religion: z.enum(["ISLAM", "CHRISTIANITY", "HINDUISM", "BUDDHISM", "JUDAISM", "SIKHISM", "JAINISM", "BAHAI", "ZOROASTRIANISM", "SHINTO", "TAOISM", "AGNOSTIC", "ATHEIST", "SPIRITUAL_BUT_NOT_RELIGIOUS", "PAGAN", "INDIGENOUS", "OTHER"]).optional().nullable(),
  education: z.enum(["NO_FORMAL_EDUCATION", "PRIMARY", "SECONDARY", "HIGH_SCHOOL", "DIPLOMA", "ASSOCIATE", "BACHELORS", "MASTERS", "MBA", "PHD", "POSTDOC", "VOCATIONAL", "SELF_TAUGHT", "BOOTCAMP", "OTHER"]).optional().nullable(),
  profession: z.enum(["ENGINEERING", "SOFTWARE_DEVELOPMENT", "DATA_SCIENCE", "ARTIFICIAL_INTELLIGENCE", "MEDICINE", "DENTISTRY", "NURSING", "EDUCATION", "BUSINESS", "ENTREPRENEUR", "FINANCE", "MARKETING", "SALES", "LAW", "GOVERNMENT", "PUBLIC_SERVICE", "DESIGN", "WRITING", "JOURNALISM", "ARTS", "FILM", "MUSIC", "SPORTS", "AGRICULTURE", "ARCHITECTURE", "PSYCHOLOGY", "SOCIAL_WORK", "FREELANCER", "STUDENT", "UNEMPLOYED", "HOMEMAKER", "OTHER"]).optional().nullable(),
  personality: z.enum(["INTROVERT", "EXTROVERT", "AMBIVERENT", "OTHER"]).optional().nullable(),
  country: z.string().min(2).max(100).optional().nullable(),
  state: z.string().min(2).max(100).optional().nullable(),
  city: z.string().min(2).max(100).optional().nullable(),
  countryCode: z.string().min(2).max(2).optional().nullable(),
  stateCode: z.string().min(2).max(10).optional().nullable(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional().nullable(),
  lookingFor: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional().nullable(),
  height: z.number().min(100).max(250).optional().nullable(),
  weight: z.number().min(30).max(200).optional().nullable(),
  language: z.enum([
    "ENGLISH", "URDU", "HINDI", "PUNJABI", "TAMIL", "TELUGU", "KANNADA", "MARATHI", 
    "GUJARATI", "ODIA", "TURKISH", "ARABIC", "RUSSIAN", "POLISH", "CROATIAN", 
    "BULGARIAN", "ROMANIAN", "BOSNIAN", "SERBIAN", "PERSIAN", "PASHTO", "KURDISH", 
    "AZERBAIJANI", "MALAY", "INDONESIAN", "SWAHILI", "KASHMIRI", "URDU_HINDI", 
    "MALAYALAM", "ALBANIAN", "UZBEK", "TURKMEN", "KAZAKH", "CHECHEN", "Hausa", 
    "BENGALI", "SOMALI", "MOROCCAN", "TUNISIAN", "OTHER"
  ]).optional().nullable(),
  interests: z.array(z.string()).optional().nullable(),
  alcohol: z.enum(["NONE", "OCCASIONAL", "REGULAR", "SOCIAL", "TRYING_TO_QUIT", "OPEN"]).optional().nullable(),
  drugs: z.enum(["NONE", "OCCASIONAL", "REGULAR", "SOCIAL", "TRYING_TO_QUIT", "OPEN"]).optional().nullable(),
  smoking: z.enum(["NONE", "OCCASIONAL", "REGULAR", "SOCIAL", "TRYING_TO_QUIT", "OPEN"]).optional().nullable(),
  politics: z.array(z.string()).optional().nullable(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const { mutateAsync } = useUserUpdateProfile();
  const { data: profileData, isLoading: isLoadingProfile } = useCurrentUserProfile();
  const { toast } = useToast();
  const [previousImageId, setPreviousImageId] = useState<string>();
  const [uploadedImageId, setUploadedImageId] = useState<string>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");

  const defaultValues = useMemo(() => ({
    name: "",
    email: "",
    gender: "MALE" as const,
    dob: "",
    phone: "",
    avatar: "",
    religion: "ISLAM" as const,
    education: "BACHELORS" as const,
    profession: "SOFTWARE_DEVELOPMENT" as const,
    personality: "INTROVERT" as const,
    country: "",
    state: "",
    city: "",
    maritalStatus: "SINGLE" as const,
    lookingFor: "SINGLE" as const,
    height: 170,
    weight: 70,
    language: "ENGLISH" as const,
    interests: [],
    alcohol: "NONE" as const,
    drugs: "NONE" as const,
    smoking: "NONE" as const,
    politics: [],
  }), []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange", // Enable real-time validation
  });

  const locationData = useMemo(() => ({
    countries: Country.getAllCountries(),
    states: selectedCountry ? State.getStatesOfCountry(selectedCountry) : [],
    cities: selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [],
  }), [selectedCountry, selectedState]);

  useEffect(() => {
    if (profileData?.user && form) {
      const user = profileData.user;
      console.log('Database User Data:', {
        fullUser: user,
        location: {
          country: user.country,
          countryCode: user.countryCode,
          state: user.state,
          stateCode: user.stateCode,
          city: user.city
        }
      });

      if (user.avatar) {
        const match = user.avatar.match(/\/upload\/(?:v\d+\/)?(.+?)\.[^.]+$/);
        if (match) {
          setPreviousImageId(match[1]);
        }
      }

      const formData = {
        ...user,
        // Ensure enum fields have valid values, not null
        gender: user.gender || "MALE",
        religion: user.religion || "ISLAM",
        education: user.education || "BACHELORS",
        profession: user.profession || "SOFTWARE_DEVELOPMENT",
        personality: user.personality || "INTROVERT",
        maritalStatus: user.maritalStatus || "SINGLE",
        lookingFor: user.lookingFor || "SINGLE",
        language: user.language || "ENGLISH",
        alcohol: user.alcohol || "NONE",
        drugs: user.drugs || "NONE",
        smoking: user.smoking || "NONE",
        // Handle string fields
        country: user.country || "",
        countryCode: user.countryCode || "",
        state: user.state || "",
        stateCode: user.stateCode || "",
        city: user.city || "",
        // Handle array fields
        interests: user.interests || [],
        politics: user.politics || [],
        // Handle numeric fields
        height: user.height || 170,
        weight: user.weight || 70,
        // Ensure all other fields have proper defaults
        name: user.name || "",
        email: user.email || "",
        dob: user.dob || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      };
      console.log('Setting Form Data:', formData);
      
      // Reset form with proper values
      form.reset(formData);
      
      // Ensure all fields are properly set after reset
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          form.setValue(key as keyof ProfileFormValues, value as any);
        }
      });

      if (user.countryCode) {
        console.log('Setting country code:', user.countryCode);
        setSelectedCountry(user.countryCode);
        
        setTimeout(() => {
          if (user.stateCode) {
            console.log('Setting state code:', user.stateCode);
            setSelectedState(user.stateCode);
          }
        }, 100);
      }
    }
  }, [profileData, form]);

  const onSubmit = useCallback(async (data: ProfileFormValues) => {
    setIsLoading(true); 
    try {
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        // Handle different types of values properly
        if (value === "" || value === null || value === undefined) {
          // For enum fields, set to default values instead of null
          if (key === 'gender') acc[key] = 'MALE';
          else if (key === 'religion') acc[key] = 'ISLAM';
          else if (key === 'education') acc[key] = 'BACHELORS';
          else if (key === 'profession') acc[key] = 'SOFTWARE_DEVELOPMENT';
          else if (key === 'personality') acc[key] = 'INTROVERT';
          else if (key === 'maritalStatus') acc[key] = 'SINGLE';
          else if (key === 'lookingFor') acc[key] = 'SINGLE';
          else if (key === 'language') acc[key] = 'ENGLISH';
          else if (key === 'alcohol') acc[key] = 'NONE';
          else if (key === 'drugs') acc[key] = 'NONE';
          else if (key === 'smoking') acc[key] = 'NONE';
          else if (key === 'interests' || key === 'politics') acc[key] = [];
          else if (key === 'height') acc[key] = 170;
          else if (key === 'weight') acc[key] = 70;
          else acc[key] = null; // For other fields, keep as null
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      if (cleanedData.height) cleanedData.height = Number(cleanedData.height);
      if (cleanedData.weight) cleanedData.weight = Number(cleanedData.weight);

      const response = await mutateAsync(cleanedData);

      if (!response?.ok) {
        throw new Error(response?.message || "Failed to update profile");
      }

      if (previousImageId && uploadedImageId && previousImageId !== uploadedImageId) {
        console.log('Previous image will be deleted:', previousImageId);
      }

      if (uploadedImageId) {
        setPreviousImageId(uploadedImageId);
        setUploadedImageId(undefined);
      }

      toast({
        title: "Profile updated successfully",
        description: "Your profile has been updated successfully",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Profile update error:", error);
      if (uploadedImageId) {
        form.setValue('avatar', previousImageId ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/v1/${previousImageId}` : '');
        setUploadedImageId(undefined);
      }
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error?.message || "Your profile could not be updated. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [mutateAsync, previousImageId, uploadedImageId, toast, router, form]);

  if (isLoadingProfile) {
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-2xl py-10 [&_input:focus]:outline-none [&_select:focus]:outline-none [&_button:focus]:outline-none">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Complete Your Profile</h1>
        <p className="text-muted-foreground">Tell us more about yourself</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ProfilePictureSection 
            form={form}
            previousImageId={previousImageId}
            setUploadedImageId={setUploadedImageId}
          />

          <PersonalInfoSection form={form} />

          <LocationSection 
            form={form}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            locationData={locationData}
          />

          <LifestyleSection form={form} />

          <InterestsSection form={form} />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Form>
    </div>
  )
} 