import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Loader2, ImageOff } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { adminApi, AdminVerification, uploadUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

function formatDate(d?: string) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return d;
  }
}

function DocThumb({ src, label }: { src?: string | null; label: string }) {
  const url = uploadUrl(src);
  if (!url) {
    return (
      <div className="flex h-24 w-32 flex-col items-center justify-center rounded-md border border-dashed border-mithaq-blush bg-mithaq-cream/40 text-xs text-mithaq-mid2">
        <ImageOff className="h-4 w-4 mb-1" />
        {label}
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group block"
      title={`${label} (open)`}
    >
      <img
        src={url}
        alt={label}
        className="h-24 w-32 rounded-md border border-mithaq-blush/60 object-cover transition group-hover:opacity-90"
        loading="lazy"
      />
      <p className="mt-1 text-center text-[11px] text-mithaq-mid2">{label}</p>
    </a>
  );
}

function statusBadge(status: string) {
  const s = (status ?? "").toLowerCase();
  if (s === "approved")
    return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Approved</Badge>;
  if (s === "rejected")
    return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">Rejected</Badge>;
  return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending</Badge>;
}

function VerificationRow({ v }: { v: AdminVerification }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");

  const mutation = useMutation({
    mutationFn: (status: "approved" | "rejected") =>
      adminApi.reviewVerification(v.id, status, note.trim() || undefined),
    onSuccess: (_data, status) => {
      toast.success(`Verification ${status}`);
      qc.invalidateQueries({ queryKey: ["admin", "verifications"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      setNote("");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Action failed";
      toast.error(message);
    },
  });

  return (
    <Card className="border-mithaq-blush/40">
      <CardContent className="p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-mithaq-ink truncate">
                {v.user?.email ?? "Unknown user"}
              </p>
              {statusBadge(v.status)}
            </div>
            {v.user?.profile?.displayName ? (
              <p className="text-xs text-mithaq-mid2">
                {v.user.profile.displayName}
              </p>
            ) : null}
            <p className="text-xs text-mithaq-mid2 mt-1">
              Submitted {formatDate(v.createdAt)}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <DocThumb src={v.cnicFront} label="CNIC Front" />
            <DocThumb src={v.cnicBack} label="CNIC Back" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label
              htmlFor={`note-${v.id}`}
              className="text-xs font-medium text-mithaq-mid2"
            >
              Note (optional)
            </label>
            <Textarea
              id={`note-${v.id}`}
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for the user…"
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate("rejected")}
            >
              {mutation.isPending && mutation.variables === "rejected" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Reject
            </Button>
            <Button
              className="bg-mithaq-hot hover:bg-mithaq-hot/90 text-white"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate("approved")}
            >
              {mutation.isPending && mutation.variables === "approved" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Approve
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Verifications() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "verifications"],
    queryFn: () => adminApi.verifications(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-mithaq-ink">Verifications</h2>
        <p className="text-sm text-mithaq-mid2">
          Review identity documents submitted by new members.
        </p>
      </div>

      {isError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-6 flex items-center justify-between gap-4">
            <p className="text-sm text-destructive">
              Couldn't load verifications:{" "}
              {error instanceof Error ? error.message : "unknown error"}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className={cn("h-44 w-full")} />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((v) => (
            <VerificationRow key={v.id} v={v} />
          ))}
        </div>
      ) : (
        <Card className="border-mithaq-blush/40">
          <CardContent className="py-10 text-center">
            <p className="text-sm text-mithaq-mid2">
              No pending verifications.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
