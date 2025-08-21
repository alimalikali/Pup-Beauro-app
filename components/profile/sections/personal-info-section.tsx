import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

const MemoizedSelect = memo(({ 
  children, 
  ...props 
}: { 
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <Select {...props}>
    {children}
  </Select>
));

export const PersonalInfoSection = ({ form }: { form: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MemoizedFormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="name@example.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <MemoizedSelect onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </MemoizedSelect>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="dob"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="+1234567890" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 