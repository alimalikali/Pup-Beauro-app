import { ImageUpload } from "@/components/image-upload"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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

interface ProfilePictureSectionProps {
  form: any;
  previousImageId?: string;
  setUploadedImageId: (id: string) => void;
}

export const ProfilePictureSection = ({ 
  form, 
  previousImageId, 
  setUploadedImageId 
}: ProfilePictureSectionProps) => {
  return (
    <MemoizedFormField
      control={form.control}
      name="avatar"
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <FormControl>
            <ImageUpload
              value={value || ""}
              onChange={(url, public_id) => {
                onChange(url);
                setUploadedImageId(public_id || "");
              }}
              previousPublicId={previousImageId}
              disabled={false}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 