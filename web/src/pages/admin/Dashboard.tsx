import { useQuery } from "@tanstack/react-query";
import { Users, ShieldCheck, Clock, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminApi, AdminStats } from "@/lib/api";
import { cn } from "@/lib/utils";

interface StatDef {
  key: keyof AdminStats;
  label: string;
  icon: typeof Users;
  accent: string;
}

const STATS: StatDef[] = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: Users,
    accent: "bg-mithaq-hot/10 text-mithaq-hot",
  },
  {
    key: "verifiedUsers",
    label: "Verified Users",
    icon: ShieldCheck,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "pendingVerifications",
    label: "Pending Verifications",
    icon: Clock,
    accent: "bg-amber-100 text-amber-700",
  },
  {
    key: "activeMatches",
    label: "Active Matches",
    icon: Heart,
    accent: "bg-mithaq-rose/15 text-mithaq-rose",
  },
];

export default function Dashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => adminApi.stats(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-mithaq-ink">Overview</h2>
        <p className="text-sm text-mithaq-mid2">
          Snapshot of platform activity right now.
        </p>
      </div>

      {isError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-6 flex items-center justify-between gap-4">
            <p className="text-sm text-destructive">
              Couldn't load stats:{" "}
              {error instanceof Error ? error.message : "unknown error"}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ key, label, icon: Icon, accent }) => (
            <Card key={key} className="border-mithaq-blush/40">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-mithaq-mid2">
                  {label}
                </CardTitle>
                <span
                  className={cn(
                    "inline-flex h-9 w-9 items-center justify-center rounded-lg",
                    accent,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-9 w-24" />
                ) : (
                  <p className="font-display text-3xl text-mithaq-ink">
                    {data?.[key] ?? 0}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
