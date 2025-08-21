import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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

export const LifestyleSection = ({ form }: { form: any }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MemoizedFormField
        control={form.control}
        name="alcohol"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alcohol Consumption</FormLabel>
            <MemoizedSelect onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="OCCASIONAL">Occasional</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="SOCIAL">Social</SelectItem>
                <SelectItem value="TRYING_TO_QUIT">Trying to Quit</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
              </SelectContent>
            </MemoizedSelect>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="smoking"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Smoking Habits</FormLabel>
            <MemoizedSelect onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="OCCASIONAL">Occasional</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="SOCIAL">Social</SelectItem>
                <SelectItem value="TRYING_TO_QUIT">Trying to Quit</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
              </SelectContent>
            </MemoizedSelect>
            <FormMessage />
          </FormItem>
        )}
      />

      <MemoizedFormField
        control={form.control}
        name="drugs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Drug Use</FormLabel>
            <MemoizedSelect onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="OCCASIONAL">Occasional</SelectItem>
                <SelectItem value="REGULAR">Regular</SelectItem>
                <SelectItem value="SOCIAL">Social</SelectItem>
                <SelectItem value="TRYING_TO_QUIT">Trying to Quit</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
              </SelectContent>
            </MemoizedSelect>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 