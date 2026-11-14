import { useEffect, useSyncExternalStore } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

/**
 * All admin authentication lives here: the session store, sign in, sign out and the route guards.
 *
 * This is a UX gate only. Real protection is Row Level Security in the database; a visitor who
 * skips this check still cannot read or write anything an admin can.
 *
 * The session is owned by supabase-js, which persists it in the browser. Nothing here runs on
 * the server: the store starts as "loading", which is also what the server renders.
 */

export type AuthStatus =
  /** Session check not finished (always the case during server rendering). */
  | "loading"
  /** Supabase env variables are missing, so sign-in is impossible. */
  | "unconfigured"
  | "signed-out"
  /** Signed in and present in public.admins. */
  | "admin";

export type AuthState = {
  status: AuthStatus;
  email: string | null;
  /** A message for the login page after we signed someone out on their behalf. */
  notice: string | null;
};

export type SignInResult = { ok: true } | { ok: false; error: string };

export const AUTH_MESSAGES = {
  invalid: "Wrong email or password",
  notAdmin: "This account does not have admin access.",
  verifyFailed: "We could not check admin access. Please try again.",
  notConfigured: "Supabase is not configured, so admin sign-in is unavailable.",
} as const;

const initialState: AuthState = {
  status: isSupabaseConfigured ? "loading" : "unconfigured",
  email: null,
  notice: null,
};

let state: AuthState = initialState;
const listeners = new Set<() => void>();
let started = false;
// True while signIn() is running, so the auth listener does not run a second admin check.
let signingIn = false;

function setState(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Reads the user's own row from public.admins (RLS only lets them see that row). */
async function hasAdminRow(userId: string): Promise<boolean | "error"> {
  const { data, error } = await getSupabase()
    .from("admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return "error";
  return data !== null;
}

/** Signs out locally even if the network call fails, so a bad connection cannot trap a session. */
async function endSession() {
  try {
    await getSupabase().auth.signOut();
  } catch {
    /* the local session is cleared by supabase-js regardless */
  }
}

async function adoptSession(user: { id: string; email?: string | null }) {
  const result = await hasAdminRow(user.id);
  if (result === true) {
    setState({ status: "admin", email: user.email ?? null, notice: null });
    return;
  }
  await endSession();
  setState({
    status: "signed-out",
    email: null,
    notice: result === "error" ? AUTH_MESSAGES.verifyFailed : AUTH_MESSAGES.notAdmin,
  });
}

function start() {
  if (started || typeof window === "undefined" || !isSupabaseConfigured) return;
  started = true;
  const supabase = getSupabase();

  void supabase.auth.getSession().then(({ data }) => {
    if (signingIn) return;
    const user = data.session?.user;
    if (!user) {
      setState({ status: "signed-out", email: null });
      return;
    }
    void adoptSession(user);
  });

  supabase.auth.onAuthStateChange((event, session) => {
    // Another tab signed out, or the refresh token died.
    if (event === "SIGNED_OUT" && !signingIn) {
      setState({ status: "signed-out", email: null });
      return;
    }
    // Another tab signed in. Defer: supabase-js can deadlock if its own callback awaits a query.
    if (event === "SIGNED_IN" && session && !signingIn && state.status !== "admin") {
      setTimeout(() => void adoptSession(session.user), 0);
    }
  });
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  if (!isSupabaseConfigured) return { ok: false, error: AUTH_MESSAGES.notConfigured };
  signingIn = true;
  try {
    const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
    // One message for every failure, so the form never reveals which accounts exist.
    if (error || !data.user) return { ok: false, error: AUTH_MESSAGES.invalid };

    const result = await hasAdminRow(data.user.id);
    if (result !== true) {
      await endSession();
      setState({ status: "signed-out", email: null, notice: null });
      return {
        ok: false,
        error: result === "error" ? AUTH_MESSAGES.verifyFailed : AUTH_MESSAGES.notAdmin,
      };
    }
    setState({ status: "admin", email: data.user.email ?? email, notice: null });
    return { ok: true };
  } catch {
    return { ok: false, error: AUTH_MESSAGES.invalid };
  } finally {
    signingIn = false;
  }
}

export async function signOut(): Promise<void> {
  await endSession();
  setState({ status: "signed-out", email: null, notice: null });
}

/** Current auth state. Starts the session check on the client the first time it is used. */
export function useAuth(): AuthState {
  const current = useSyncExternalStore(
    subscribe,
    () => state,
    () => initialState,
  );
  useEffect(start, []);
  return current;
}

/** For admin pages: sends anyone who is not a signed-in admin to the login page. */
export function useRequireAdmin(): AuthState {
  const auth = useAuth();
  const navigate = useNavigate();
  const mustLogin = auth.status === "signed-out" || auth.status === "unconfigured";
  useEffect(() => {
    if (mustLogin) void navigate({ to: "/admin/login", replace: true });
  }, [mustLogin, navigate]);
  return auth;
}

/** For the login page: sends an already signed-in admin to the dashboard. */
export function useRedirectIfAdmin(): AuthState {
  const auth = useAuth();
  const navigate = useNavigate();
  const isAdmin = auth.status === "admin";
  useEffect(() => {
    if (isAdmin) void navigate({ to: "/admin", replace: true });
  }, [isAdmin, navigate]);
  return auth;
}
