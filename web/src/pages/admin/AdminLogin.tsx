import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/lib/admin-auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginValues) => {
      const user = await login(values.email, values.password);
      if ((user.role ?? "").toLowerCase() !== "admin") {
        throw new Error("This account does not have admin access.");
      }
      return user;
    },
    onSuccess: () => {
      const from =
        (location.state as { from?: string } | null)?.from ?? "/admin";
      navigate(from, { replace: true });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    },
  });

  const onSubmit = (values: LoginValues) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mithaq-cream via-white to-mithaq-blush/40 p-4">
      <div className="w-full max-w-md">
        <Card className="border-mithaq-blush/40 shadow-pink">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-mithaq-hot text-white font-display text-xl font-bold">
              M
            </div>
            <CardTitle className="font-display text-2xl text-mithaq-ink">
              Mithaq Admin
            </CardTitle>
            <p className="text-sm text-mithaq-mid2">
              Sign in to manage verifications and members.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@mithaq.local"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full bg-mithaq-hot hover:bg-mithaq-hot/90 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-mithaq-mid2 hover:text-mithaq-hot"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
