import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppAuth } from "@/lib/app-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RegistrationRequest } from "@/lib/api";

export default function AuthPage({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useAppAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = Object.fromEntries(
      new FormData(event.currentTarget),
    ) as Record<string, string>;
    try {
      if (mode === "login") await login(data.email, data.password);
      else await register(data as unknown as RegistrationRequest);
      navigate(mode === "login" ? "/app" : "/app/profile");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Something went wrong",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-mithaq-cream px-4 py-12">
      <div className="mesh-orb -left-20 top-12 h-72 w-72 bg-mithaq-mid/40" />
      <div className="mesh-orb -right-20 bottom-12 h-80 w-80 bg-mithaq-rose/20" />
      <section className="glass-strong relative w-full max-w-lg rounded-3xl p-7 shadow-pink-lg md:p-10">
        <Link to="/" className="font-display text-2xl font-bold">
          Mithaq <span className="font-arabic text-mithaq-hot">مِيثَاق</span>
        </Link>
        <h1 className="mt-8 font-display text-4xl font-bold">
          {mode === "login" ? "Welcome back" : "Begin with intention"}
        </h1>
        <p className="mt-2 text-mithaq-mid2">
          {mode === "login"
            ? "Continue your search for a purpose-aligned partner."
            : "Create a thoughtful profile focused on values, direction, and marriage."}
        </p>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          {mode === "register" && (
            <>
              <Input name="displayName" placeholder="Full name" required />
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="gender"
                  required
                  className="h-10 rounded-md border bg-white px-3 text-sm"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <Input name="city" placeholder="City" required />
              </div>
            </>
          )}
          <Input
            name="email"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="Password (8+ characters)"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            minLength={8}
            required
          />
          {error && (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}
          <Button
            disabled={busy}
            className="h-12 w-full bg-gradient-pink shadow-pink"
          >
            {busy
              ? "Please wait…"
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-mithaq-mid2">
          {mode === "login" ? "New to Mithaq?" : "Already have an account?"}{" "}
          <Link
            className="font-semibold text-mithaq-hot"
            to={mode === "login" ? "/register" : "/login"}
          >
            {mode === "login" ? "Create an account" : "Log in"}
          </Link>
        </p>
      </section>
    </main>
  );
}
