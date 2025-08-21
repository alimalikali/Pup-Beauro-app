import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { memo } from "react"
import { ControllerRenderProps, FieldValues, UseFormStateReturn } from "react-hook-form"

const MemoizedFormField = memo(({ 
  control, 
  name, 
  render 
}: { 
  control: any; 
  name: string; 
  render: (props: { 
    field: ControllerRenderProps<FieldValues, string>; 
    fieldState: any; 
    formState: UseFormStateReturn<FieldValues>; 
  }) => React.ReactElement;
}) => (
  <FormField
    control={control}
    name={name}
    render={render}
  />
));

export const InterestsSection = ({ form }: { form: any }) => {
  return (
    <>
      <MemoizedFormField
        control={form.control}
        name="interests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Interests</FormLabel>
            <FormControl>
              <MultiSelect
                placeholder="Select your interests"
                options={[
                  { value: "reading", label: "Reading" },
                  { value: "traveling", label: "Traveling" },
                  { value: "cooking", label: "Cooking" },
                  { value: "sports", label: "Sports" },
                  { value: "music", label: "Music" },
                  { value: "art", label: "Art" },
                  { value: "photography", label: "Photography" },
                  { value: "gaming", label: "Gaming" },
                ]}
                selected={field.value || []}
                onChange={(values: string[]) => field.onChange(values)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="politics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Political Views</FormLabel>
            <FormControl>
              <MultiSelect
                placeholder="Select your political views"
                options={[
                  { value: "LIBERAL", label: "Liberal" },
                  { value: "CONSERVATIVE", label: "Conservative" },
                  { value: "CENTRIST", label: "Centrist" },
                  { value: "LIBERTARIAN", label: "Libertarian" },
                  { value: "SOCIALIST", label: "Socialist" },
                  { value: "PROGRESSIVE", label: "Progressive" },
                  { value: "NATIONALIST", label: "Nationalist" },
                  { value: "APOLITICAL", label: "Apolitical" },
                  { value: "FUNDAMENTALIST", label: "Fundamentalist" },
                  { value: "OTHER", label: "Other" }
                ]}
                selected={field.value || []}
                onChange={(values: string[]) => field.onChange(values)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
} 