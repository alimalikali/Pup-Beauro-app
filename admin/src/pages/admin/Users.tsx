import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminApi, AdminUser } from "@/lib/api";

function UserRow({ user }: { user: AdminUser }) {
  const qc = useQueryClient();
  const isSuspended = user.isActive === false;

  const mutation = useMutation({
    mutationFn: () =>
      isSuspended
        ? adminApi.unsuspendUser(user.id)
        : adminApi.suspendUser(user.id),
    onSuccess: () => {
      toast.success(isSuspended ? "User unsuspended" : "User suspended");
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Action failed";
      toast.error(message);
    },
  });

  return (
    <TableRow>
      <TableCell className="font-medium text-mithaq-ink">
        {user.email}
      </TableCell>
      <TableCell>{user.profile?.displayName ?? "—"}</TableCell>
      <TableCell className="capitalize">
        {user.profile?.gender ?? "—"}
      </TableCell>
      <TableCell>
        {user.isVerified ? (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Verified
          </Badge>
        ) : (
          <Badge variant="secondary">Unverified</Badge>
        )}
      </TableCell>
      <TableCell>
        {isSuspended ? (
          <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
            Suspended
          </Badge>
        ) : (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Active
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          size="sm"
          variant={isSuspended ? "default" : "outline"}
          className={
            isSuspended
              ? "bg-mithaq-hot hover:bg-mithaq-hot/90 text-white"
              : "border-destructive/40 text-destructive hover:bg-destructive/10"
          }
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : null}
          {isSuspended ? "Unsuspend" : "Suspend"}
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function Users() {
  const [q, setQ] = useState("");
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.users(),
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter((u) => {
      const hay = `${u.email ?? ""} ${u.profile?.displayName ?? ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [data, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl text-mithaq-ink">Users</h2>
          <p className="text-sm text-mithaq-mid2">
            Suspend or reactivate member accounts.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mithaq-mid2" />
          <Input
            placeholder="Search by email or name…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="py-6 flex items-center justify-between gap-4">
            <p className="text-sm text-destructive">
              Couldn't load users:{" "}
              {error instanceof Error ? error.message : "unknown error"}
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-mithaq-blush/40">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((u) => <UserRow key={u.id} user={u} />)
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-sm text-mithaq-mid2 py-10"
                    >
                      {q ? "No users match your search." : "No users yet."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
