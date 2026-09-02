import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profileApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const priorities = [
  "Deen",
  "Education",
  "Career",
  "Family",
  "Location",
] as const;

type FormValues = Record<string, FormDataEntryValue>;

async function saveProfile(values: FormValues) {
  const age = Number(values.age);
  await profileApi.update({
    displayName: String(values.displayName),
    age,
    city: String(values.city),
    education: String(values.education),
    profession: String(values.profession),
    familyType: String(values.familyType),
    bio: String(values.bio),
  });
  await profileApi.purpose({
    purposeStatement: String(values.purposeStatement),
    lifeTags: String(values.lifeTags)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 10),
  });
  await profileApi.priorities(
    Object.fromEntries(
      priorities.map((priority) => [
        `priority${priority}`,
        Number(values[`priority${priority}`]),
      ]),
    ),
  );
  await profileApi.publish();
}

export default function Profile() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });
  const [saved, setSaved] = useState(false);
  const mutation = useMutation({
    mutationFn: saveProfile,
    onSuccess: () => setSaved(true),
  });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(false);
    mutation.mutate(Object.fromEntries(new FormData(event.currentTarget)));
  };

  if (profile.isLoading) {
    return <div className="h-96 animate-pulse rounded-3xl bg-white/60" />;
  }

  if (profile.isError) {
    return (
      <div
        role="alert"
        className="rounded-3xl bg-destructive/10 p-6 text-destructive"
      >
        We could not load your profile. Refresh the page to try again.
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[.2em] text-mithaq-hot">
        Your complete story
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold">
        Profile &amp; purpose
      </h1>
      <p className="mt-3 text-mithaq-mid2">
        Share enough to support a thoughtful, family-conscious introduction. You
        control what is published.
      </p>
      <form
        onSubmit={submit}
        className="glass mt-8 space-y-8 rounded-3xl p-6 md:p-8"
      >
        <fieldset>
          <legend className="font-display text-2xl font-bold">About you</legend>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              name="displayName"
              placeholder="Display name"
              maxLength={100}
              defaultValue={profile.data?.displayName || ""}
              required
            />
            <Input
              name="age"
              type="number"
              min="18"
              max="65"
              placeholder="Age"
              defaultValue={profile.data?.age || ""}
              required
            />
            <Input
              name="city"
              placeholder="City"
              defaultValue={profile.data?.city || ""}
              required
            />
            <Input
              name="education"
              placeholder="Education"
              defaultValue={profile.data?.education || ""}
            />
            <Input
              name="profession"
              placeholder="Profession"
              defaultValue={profile.data?.profession || ""}
            />
            <Input
              name="familyType"
              placeholder="Family background"
              defaultValue={profile.data?.familyType || ""}
            />
          </div>
          <Textarea
            name="bio"
            maxLength={2000}
            className="mt-4"
            placeholder="Introduce yourself, your family, and the life you are building"
            defaultValue={profile.data?.bio || ""}
          />
        </fieldset>
        <fieldset>
          <legend className="font-display text-2xl font-bold">
            Purpose in marriage
          </legend>
          <p className="mt-1 text-sm text-mithaq-mid2">
            Describe your values, long-term goals, family expectations, and what
            partnership means to you.
          </p>
          <Textarea
            name="purposeStatement"
            required
            minLength={40}
            maxLength={4000}
            className="mt-4 min-h-36"
            defaultValue={profile.data?.purposeStatement || ""}
          />
          <Input
            name="lifeTags"
            className="mt-4"
            placeholder="Values, comma separated — faith, service, family"
            defaultValue={profile.data?.lifeTags?.join(", ") || ""}
          />
        </fieldset>
        <fieldset>
          <legend className="font-display text-2xl font-bold">
            What matters most
          </legend>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {priorities.map((priority) => (
              <label
                key={priority}
                className="rounded-2xl bg-white/60 p-4 text-sm font-semibold"
              >
                {priority}
                <input
                  className="mt-3 w-full accent-mithaq-hot"
                  type="range"
                  name={`priority${priority}`}
                  min="0"
                  max="100"
                  defaultValue={
                    ((profile.data as Record<string, unknown>)?.[
                      `priority${priority}`
                    ] as number) || 50
                  }
                />
              </label>
            ))}
          </div>
        </fieldset>
        {mutation.isError && (
          <p role="alert" className="text-destructive">
            Could not save your profile. Review the fields and try again.
          </p>
        )}
        {saved && (
          <p role="status" className="text-green-700">
            Your profile has been saved and published.
          </p>
        )}
        <Button disabled={mutation.isPending} className="bg-gradient-pink px-8">
          {mutation.isPending ? "Saving…" : "Save and publish"}
        </Button>
      </form>
    </div>
  );
}
