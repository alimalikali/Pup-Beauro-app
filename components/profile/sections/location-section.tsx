import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { City, Country, State, ICountry, IState, ICity } from "country-state-city"
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

interface LocationSectionProps {
  form: any;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedState: string;
  setSelectedState: (value: string) => void;
  locationData: {
    countries: ICountry[];
    states: IState[];
    cities: ICity[];
  };
}

export const LocationSection = ({ 
  form, 
  selectedCountry, 
  setSelectedCountry, 
  selectedState, 
  setSelectedState, 
  locationData 
}: LocationSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MemoizedFormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <Select
              value={selectedCountry}
              onValueChange={(value) => {
                const country = locationData.countries.find(c => c.isoCode === value);
                if (country) {
                  form.setValue("country", country.name);
                  form.setValue("countryCode", country.isoCode);
                  setSelectedCountry(value);
                  setSelectedState("");
                  form.setValue("state", "");
                  form.setValue("stateCode", "");
                  form.setValue("city", "");
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locationData.countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <Select
              disabled={!selectedCountry}
              value={selectedState}
              onValueChange={(value) => {
                const state = locationData.states.find(s => s.isoCode === value);
                if (state) {
                  form.setValue("state", state.name);
                  form.setValue("stateCode", state.isoCode);
                  setSelectedState(value);
                  form.setValue("city", "");
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locationData.states.map((state) => (
                  <SelectItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => {
          const currentCity = field.value;
          const cityNames = locationData.cities.map(city => city.name);
          const cityExists = cityNames.some(
            name => name.trim().toLowerCase() === (currentCity || '').trim().toLowerCase()
          );

          return (
            <FormItem>
              <FormLabel>City</FormLabel>
              <Select
                disabled={!selectedState}
                value={cityExists ? currentCity : ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!cityExists && currentCity && (
                    <SelectItem value={currentCity} disabled>
                      {currentCity} (from profile, not in list)
                    </SelectItem>
                  )}
                  {locationData.cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  )
} 