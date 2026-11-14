import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, HandHeart, Images, Loader2, LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_MESSAGES, signIn, signOut, useRedirectIfAdmin, useRequireAdmin } from "@/lib/auth";

const logoSrc = "/assets/logo.webp";

function AdminLogo({ className }: { className: string }) {
  return (
    <img
      src={logoSrc}
      alt="Burning Bush Ministries International"
      width={1200}
      height={1123}
      className={`logo-blend w-auto ${className}`}
    />
  );
}

/** Shown while the session check runs and while a redirect is in flight. Contains no admin content. */
export function AdminSkeleton() {
  return (
    <div className="min-h-screen" aria-busy="true" aria-label="Loading">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-5 md:px-8">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-8 w-40 rounded-full" />
      </div>
      <div className="church-container mt-10 space-y-6">
        <Skeleton className="h-9 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function AdminLoginPage() {
  const auth = useRedirectIfAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Render nothing but a skeleton until we know whether a session already exists.
  if (auth.status === "loading" || auth.status === "admin") return <AdminSkeleton />;

  const unconfigured = auth.status === "unconfigured";
  const message = error ?? auth.notice;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    const result = await signIn(email.trim(), password);
    if (!result.ok) {
      setError(result.error);
      setPassword("");
      setSubmitting(false);
      passwordRef.current?.focus();
    }
    // On success the auth store flips to "admin" and the guard moves us to /admin.
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <div className="hero-item w-full max-w-[26rem]">
        <div className="flex justify-center">
          <AdminLogo className="h-20" />
        </div>
        <div className="mt-6 rounded-3xl bg-card p-7 shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent),0_24px_48px_-24px_color-mix(in_oklab,var(--foreground)_30%,transparent)] sm:p-9">
          <h1 className="font-display text-3xl leading-tight text-foreground">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">For church administrators only.</p>

          {unconfigured ? (
            <p
              role="alert"
              className="mt-6 rounded-xl bg-secondary px-4 py-3 text-sm text-secondary-foreground"
            >
              {AUTH_MESSAGES.notConfigured}
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6" aria-busy={submitting}>
              <fieldset disabled={submitting} className="space-y-4 border-0 p-0">
                <div className="space-y-1.5">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    autoFocus
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-11 rounded-xl px-3.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    ref={passwordRef}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-11 rounded-xl px-3.5"
                  />
                </div>
                <div aria-live="polite">
                  {message ? (
                    <p
                      role="alert"
                      className="hero-item rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                      {message}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full rounded-full disabled:opacity-80"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" aria-hidden="true" /> Signing in…
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const placeholders: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Events", description: "Services, gatherings and programmes.", icon: CalendarDays },
  { title: "Fundraisers", description: "Giving campaigns and their progress.", icon: HandHeart },
  { title: "Photos", description: "Galleries for events and fundraisers.", icon: Images },
];

export function AdminDashboardPage() {
  const auth = useRequireAdmin();
  const [signingOut, setSigningOut] = useState(false);

  // Never render admin content until the client has confirmed an admin session.
  if (auth.status !== "admin") return <AdminSkeleton />;

  async function onSignOut() {
    setSigningOut(true);
    await signOut();
    // The guard in useRequireAdmin sends us to /admin/login once the session is gone.
  }

  return (
    <div className="min-h-screen">
      <header className="site-header" data-scrolled="true">
        <div className="church-container flex min-h-[72px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/admin" className="press flex shrink-0 items-center" aria-label="Admin home">
              <AdminLogo className="h-11" />
            </Link>
            <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary-foreground">
              Admin
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden min-w-0 truncate text-sm text-muted-foreground sm:block">
              {auth.email}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full px-4"
              onClick={onSignOut}
              disabled={signingOut}
            >
              {signingOut ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <LogOut aria-hidden="true" />
              )}
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="church-container py-10 sm:py-14">
        <div className="hero-item">
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:hidden">{auth.email}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placeholders.map(({ title, description, icon: Icon }, index) => (
            <section
              key={title}
              className="hero-item rounded-3xl bg-card p-6 shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent)]"
              style={{ "--i": index + 1 } as CSSProperties}
            >
              <div className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-display text-xl text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground/80">
                Coming soon
              </p>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
