import { beforeEach, describe, expect, it, vi } from "vitest";

// Fake only the Supabase client; the auth module under test is the real one.
const auth = {
  signInWithPassword: vi.fn(),
  signOut: vi.fn(async () => ({ error: null })),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(),
};
let adminRow: { data: { user_id: string } | null; error: unknown } = { data: null, error: null };

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: true,
  getSupabase: () => ({
    auth,
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: async () => adminRow }) }),
    }),
  }),
}));

async function load() {
  vi.resetModules();
  return import("@/lib/auth");
}

describe("admin auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminRow = { data: null, error: null };
  });

  it("gives one generic error for any sign-in failure", async () => {
    const { signIn, AUTH_MESSAGES } = await load();
    auth.signInWithPassword.mockResolvedValueOnce({ data: { user: null }, error: new Error("x") });
    expect(await signIn("a@b.co", "bad")).toEqual({ ok: false, error: AUTH_MESSAGES.invalid });

    auth.signInWithPassword.mockRejectedValueOnce(new Error("network"));
    expect(await signIn("a@b.co", "bad")).toEqual({ ok: false, error: AUTH_MESSAGES.invalid });
  });

  it("signs out a valid user who has no admins row", async () => {
    const { signIn, AUTH_MESSAGES } = await load();
    auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: "u1", email: "a@b.co" } },
      error: null,
    });
    const result = await signIn("a@b.co", "pw");
    expect(result).toEqual({ ok: false, error: AUTH_MESSAGES.notAdmin });
    expect(auth.signOut).toHaveBeenCalledOnce();
  });

  it("signs out when the admin check itself fails", async () => {
    const { signIn, AUTH_MESSAGES } = await load();
    adminRow = { data: null, error: new Error("boom") };
    auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: "u1", email: "a@b.co" } },
      error: null,
    });
    expect(await signIn("a@b.co", "pw")).toEqual({ ok: false, error: AUTH_MESSAGES.verifyFailed });
    expect(auth.signOut).toHaveBeenCalledOnce();
  });

  it("accepts a user who has an admins row", async () => {
    const { signIn } = await load();
    adminRow = { data: { user_id: "u1" }, error: null };
    auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: "u1", email: "a@b.co" } },
      error: null,
    });
    expect(await signIn("a@b.co", "pw")).toEqual({ ok: true });
    expect(auth.signOut).not.toHaveBeenCalled();
  });
});
