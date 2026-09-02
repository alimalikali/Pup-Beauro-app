import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, Heart, MapPin, ShieldX, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { matchApi, safetyApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Discover() {
  const queryClient = useQueryClient();
  const feed = useQuery({
    queryKey: ["matches", "feed"],
    queryFn: matchApi.feed,
  });
  const refreshFeed = () =>
    queryClient.invalidateQueries({ queryKey: ["matches"] });
  const interest = useMutation({
    mutationFn: matchApi.interest,
    onSuccess: () => {
      toast.success("Interest sent respectfully");
      refreshFeed();
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const favorite = useMutation({
    mutationFn: safetyApi.favorite,
    onSuccess: () => toast.success("Profile saved"),
    onError: (error: Error) => toast.error(error.message),
  });
  const block = useMutation({
    mutationFn: safetyApi.block,
    onSuccess: () => {
      toast.success("Profile blocked");
      refreshFeed();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-[.2em] text-mithaq-hot">
        Purpose-led discovery
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold">
        People moving in your direction
      </h1>
      {feed.isLoading && (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-3xl bg-white/60"
            />
          ))}
        </div>
      )}
      {feed.isError && (
        <p
          role="alert"
          className="mt-8 rounded-2xl bg-destructive/10 p-4 text-destructive"
        >
          We couldn't load your matches. Please try again.
        </p>
      )}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {feed.data?.map(({ profile, score }) => (
          <article key={profile.userId} className="glass rounded-3xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  {profile.displayName}
                </h2>
                <p className="mt-1 flex items-center gap-1 text-sm text-mithaq-mid2">
                  <MapPin className="h-4 w-4" />
                  {profile.city} · {profile.age}
                </p>
              </div>
              <span className="rounded-full bg-mithaq-light px-3 py-2 text-sm font-bold text-mithaq-hot">
                {score}% aligned
              </span>
            </div>
            <p className="mt-6 border-l-2 border-mithaq-hot pl-4 font-display italic text-mithaq-mid2">
              “
              {profile.purposeStatement ||
                "Building a meaningful life rooted in faith and family."}
              ”
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.lifeTags?.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1 text-xs text-mithaq-mid2"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-mithaq-blush">
              <div
                className="h-full bg-gradient-pink"
                style={{ width: `${score}%` }}
              />
            </div>
            <Button
              onClick={() => interest.mutate(profile.userId)}
              disabled={interest.isPending}
              className="mt-6 w-full bg-gradient-pink"
            >
              <Heart className="mr-2 h-4 w-4" />
              Express interest
            </Button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => favorite.mutate(profile.userId)}
                disabled={favorite.isPending}
              >
                <Bookmark className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={() => block.mutate(profile.userId)}
                disabled={block.isPending}
              >
                <ShieldX className="mr-2 h-4 w-4" />
                Block
              </Button>
            </div>
          </article>
        ))}
      </div>
      {!feed.isLoading && feed.data?.length === 0 && (
        <div className="glass mt-8 rounded-3xl p-12 text-center">
          <Sparkles className="mx-auto h-10 w-10 text-mithaq-hot" />
          <h2 className="mt-4 font-display text-2xl font-bold">
            Your next introduction is being prepared
          </h2>
          <p className="mt-2 text-mithaq-mid2">
            Complete and publish your profile to improve your recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
