import { useMemo, useState } from "react"

type View = "signin" | "signup"
type User = { name: string; email: string; role?: string; userId?: string }
type Session = User | null

const MONO = "font-[JetBrains_Mono]"
const SLAB = "font-[Roboto_Slab]"

// Served same-origin from the Express app's /public folder, so the API is a
// relative path — the httpOnly JWT cookie flows without CORS. Override with
// VITE_API_BASE when hosting the UI separately from the API.
const API_BASE =
  (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE ?? "/api/v2"

async function api(path: string, init?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  let body: Record<string, unknown> = {}
  try {
    body = await res.json()
  } catch {
    /* empty / non-json response (e.g. logout) */
  }
  if (!res.ok) {
    const msg =
      (body.msg as string) ||
      (body.message as string) ||
      (body.error as string) ||
      `Request failed (${res.status})`
    throw new Error(msg)
  }
  return body
}

function scorePassword(pw: string) {
  let s = 0
  if (pw.length >= 6) s++
  if (pw.length >= 10) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/[0-9]/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++
  return s // 0..4
}

function Field(props: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  error?: string
  right?: React.ReactNode
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className={`${MONO} text-[11px] uppercase tracking-[0.18em] text-paper/60`}>
          {props.label}
        </span>
        {props.hint && (
          <span className={`${MONO} text-[10px] tracking-widest text-paper/35`}>{props.hint}</span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 border border-paper/15 bg-black/20 px-3.5 transition-colors focus-within:border-acid">
        <input
          type={props.type}
          value={props.value}
          placeholder={props.placeholder}
          onChange={(e) => props.onChange(e.target.value)}
          className="peer h-12 w-full bg-transparent text-[15px] text-paper outline-none placeholder:text-paper/25"
        />
        {props.right}
      </div>
      {props.error && (
        <span className={`${MONO} mt-1.5 block text-[11px] text-[#ff6b57]`}>! {props.error}</span>
      )}
    </label>
  )
}

function AuthPanel({ onAuth }: { onAuth: (s: User) => void }) {
  const [view, setView] = useState<View>("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState("")

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const strength = scorePassword(pw)
  const nameOk = view === "signin" || name.trim().length >= 3
  const pwOk = pw.length >= 6 // backend requires min 6 chars

  const errors = {
    name: touched && !nameOk ? "name must be at least 3 characters" : "",
    email: touched && !emailOk ? "invalid email address" : "",
    pw: touched && !pwOk ? "password must be at least 6 characters" : "",
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    setServerError("")
    if (!emailOk || !pwOk || !nameOk) return
    setBusy(true)
    try {
      const payload =
        view === "signup"
          ? { name: name.trim(), email, password: pw }
          : { email, password: pw }
      const res = await api(`/auth/${view === "signup" ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify(payload),
      })
      // API sets an httpOnly JWT cookie; user shape is returned in the body.
      const u = (res.user as User) ?? (res as User)
      onAuth({
        name: u?.name ?? (view === "signup" ? name.trim() : email.split("@")[0]),
        email: u?.email ?? email,
        role: u?.role,
        userId: u?.userId,
      })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setBusy(false)
    }
  }

  const strengthMeta = ["too short", "weak", "fair", "strong", "excellent"][strength]
  const strengthColor = ["#ff6b57", "#ff6b57", "#ffb020", "#c6f24e", "#c6f24e"][strength]

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      {/* tab switch */}
      <div className="mb-9 inline-flex border border-paper/15">
        {(["signin", "signup"] as View[]).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setView(v)
              setTouched(false)
              setServerError("")
            }}
            className={`${MONO} px-5 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
              view === v ? "bg-acid text-ink" : "text-paper/50 hover:text-paper"
            }`}
          >
            {v === "signin" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      <h1 className={`${SLAB} text-[42px] leading-[0.95] font-black tracking-tight text-paper`}>
        {view === "signin" ? "Welcome back." : "Create access."}
      </h1>
      <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-paper/55">
        {view === "signin"
          ? "Authenticate to reach your account console. A signed, httpOnly session cookie is issued on success."
          : "Provision new credentials. The very first account becomes the admin — everyone after is a standard user."}
      </p>

      <div className="mt-8 space-y-5">
        {view === "signup" && (
          <Field
            label="Full name"
            type="text"
            value={name}
            onChange={setName}
            placeholder="Ada Lovelace"
            error={errors.name}
          />
        )}
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@domain.com"
          error={errors.email}
        />
        <div>
          <Field
            label="Password"
            type={show ? "text" : "password"}
            value={pw}
            onChange={setPw}
            placeholder="••••••••••"
            hint={view === "signin" ? "min 6 chars" : ""}
            error={errors.pw}
            right={
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className={`${MONO} shrink-0 text-[10px] uppercase tracking-widest text-paper/40 hover:text-acid`}
              >
                {show ? "hide" : "show"}
              </button>
            }
          />
          {view === "signup" && pw.length > 0 && (
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex h-1 flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex-1 transition-colors"
                    style={{ background: i < strength ? strengthColor : "rgba(238,240,232,0.12)" }}
                  />
                ))}
              </div>
              <span
                className={`${MONO} w-24 text-right text-[10px] uppercase tracking-widest`}
                style={{ color: strengthColor }}
              >
                {strengthMeta}
              </span>
            </div>
          )}
        </div>

        {view === "signin" && (
          <button
            type="button"
            onClick={() => setRemember((r) => !r)}
            className="flex items-center gap-3 text-left"
          >
            <span
              className={`grid h-4 w-4 place-items-center border transition-colors ${
                remember ? "border-acid bg-acid" : "border-paper/30"
              }`}
            >
              {remember && <span className="h-1.5 w-1.5 bg-ink" />}
            </span>
            <span className={`${MONO} text-[11px] uppercase tracking-[0.15em] text-paper/60`}>
              Keep me signed in
            </span>
          </button>
        )}
      </div>

      {serverError && (
        <div
          className={`${MONO} mt-6 border border-[#ff6b57]/40 bg-[#ff6b57]/10 px-4 py-3 text-[11px] leading-relaxed tracking-wide text-[#ff8a7a]`}
        >
          ! {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className={`${MONO} group mt-8 flex h-12 w-full items-center justify-between border border-acid bg-acid px-5 text-[12px] font-bold uppercase tracking-[0.22em] text-ink transition-all hover:bg-transparent hover:text-acid disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {busy ? "Verifying…" : view === "signin" ? "Authenticate" : "Create account"}
        <span className="transition-transform group-hover:translate-x-1">{busy ? "◌" : "→"}</span>
      </button>

      <p className={`${MONO} mt-6 text-[11px] leading-relaxed tracking-wide text-paper/35`}>
        {view === "signin" ? "No account yet? " : "Already provisioned? "}
        <button
          type="button"
          onClick={() => {
            setView(view === "signin" ? "signup" : "signin")
            setTouched(false)
            setServerError("")
          }}
          className="text-acid underline underline-offset-4 hover:opacity-80"
        >
          {view === "signin" ? "Create one" : "Sign in"}
        </button>
      </p>
    </form>
  )
}

function Dashboard({ session, onSignOut }: { session: User; onSignOut: () => void }) {
  const initials = session.name.slice(0, 2).toUpperCase()
  const isAdmin = session.role === "admin"
  const [signingOut, setSigningOut] = useState(false)
  const since = useMemo(
    () =>
      new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  )

  async function signOut() {
    setSigningOut(true)
    try {
      await api("/auth/logout") // GET, clears the cookie
    } catch {
      /* clear client session regardless */
    } finally {
      onSignOut()
    }
  }

  const stats = [
    { k: "Session", v: "Active", note: "httpOnly · signed cookie" },
    { k: "Role", v: isAdmin ? "Admin" : "User", note: isAdmin ? "full access" : "self-service" },
    { k: "Auth", v: "JWT", note: "bcrypt · rate-limited" },
    { k: "Last sync", v: since.split(",")[1]?.trim() ?? since, note: "just now" },
  ]

  const activity = [
    { t: "Successful sign-in", m: "this device · signed cookie", ok: true },
    { t: "Password verified", m: "bcrypt · compare", ok: true },
    { t: isAdmin ? "Admin role granted" : "Account provisioned", m: isAdmin ? "first user" : "standard user", ok: true },
    { t: "Rate limiter passed", m: "10 / 15min per IP", ok: true },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-paper/15 pb-6">
        <div className="flex items-center gap-4">
          <div className={`${SLAB} grid h-12 w-12 place-items-center bg-acid text-[18px] font-black text-ink`}>
            {initials}
          </div>
          <div>
            <div className={`${SLAB} flex items-center gap-2 text-[22px] font-bold leading-tight text-paper`}>
              {session.name}
              <span
                className={`${MONO} px-2 py-0.5 text-[9px] uppercase tracking-widest ${
                  isAdmin ? "bg-acid text-ink" : "border border-paper/25 text-paper/55"
                }`}
              >
                {session.role ?? "user"}
              </span>
            </div>
            <div className={`${MONO} text-[11px] tracking-wide text-paper/50`}>{session.email}</div>
          </div>
        </div>
        <button
          onClick={signOut}
          disabled={signingOut}
          className={`${MONO} border border-paper/25 px-4 py-2.5 text-[11px] uppercase tracking-[0.2em] text-paper/70 transition-colors hover:border-acid hover:text-acid disabled:opacity-50`}
        >
          {signingOut ? "Clearing…" : "Sign out"}
        </button>
      </header>

      <div className="mt-8 flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse bg-acid" />
        <h2 className={`${MONO} text-[11px] uppercase tracking-[0.25em] text-paper/60`}>
          Account console — authenticated
        </h2>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-px border border-paper/15 bg-paper/10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="bg-ink p-5">
            <div className={`${MONO} text-[10px] uppercase tracking-[0.2em] text-paper/45`}>{s.k}</div>
            <div className={`${SLAB} mt-2 text-[26px] font-bold leading-none text-paper`}>{s.v}</div>
            <div className={`${MONO} mt-2 text-[10px] tracking-wide text-acid/80`}>{s.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-px border border-paper/15 bg-paper/10 lg:grid-cols-[1.6fr_1fr]">
        <section className="bg-ink p-6">
          <h3 className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-paper/50`}>Recent activity</h3>
          <ul className="mt-4 divide-y divide-paper/10">
            {activity.map((a, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className="h-1.5 w-1.5 shrink-0"
                    style={{ background: a.ok ? "#c6f24e" : "#ffb020" }}
                  />
                  <span className="text-[14px] text-paper">{a.t}</span>
                </div>
                <span className={`${MONO} text-[11px] tracking-wide text-paper/45`}>{a.m}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-ink p-6">
          <h3 className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-paper/50`}>
            {isAdmin ? "Admin actions" : "Profile"}
          </h3>
          <div className="mt-4 space-y-3">
            {(isAdmin
              ? [
                  { l: "List all users", ep: "GET /user" },
                  { l: "Inspect any user", ep: "GET /user/:id" },
                  { l: "Remove a user", ep: "DELETE /user/:id" },
                ]
              : [
                  { l: "Update name / email", ep: "PATCH /user/:id" },
                  { l: "Change password", ep: "PATCH /user/:id/password" },
                  { l: "View my profile", ep: "GET /user/:id" },
                ]
            ).map((t) => (
              <div key={t.l} className="flex items-center justify-between gap-3">
                <span className="text-[14px] text-paper/85">{t.l}</span>
                <span className={`${MONO} shrink-0 text-[10px] tracking-wide text-paper/40`}>{t.ep}</span>
              </div>
            ))}
          </div>
          <button
            className={`${MONO} mt-6 w-full border border-paper/25 py-2.5 text-[11px] uppercase tracking-[0.18em] text-paper/70 transition-colors hover:border-acid hover:text-acid`}
          >
            {isAdmin ? "Open user directory" : "Manage credentials"}
          </button>
        </section>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState<Session>(null)

  if (session) {
    return (
      <div className="min-h-full bg-ink">
        <Dashboard session={session} onSignOut={() => setSession(null)} />
      </div>
    )
  }

  return (
    <div className="grid min-h-full bg-ink lg:grid-cols-[1fr_1.05fr]">
      {/* Brand / aside */}
      <aside className="relative hidden overflow-hidden border-r border-paper/15 lg:block">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#eef0e8 1px, transparent 1px), linear-gradient(90deg, #eef0e8 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className={`${MONO} flex items-center gap-2 text-[12px] uppercase tracking-[0.3em] text-paper/70`}>
            <span className="h-2.5 w-2.5 bg-acid" />
            Sentinel / Auth
          </div>

          <div>
            <div className={`${MONO} mb-4 text-[11px] uppercase tracking-[0.25em] text-acid`}>
              // JWT · RBAC · secure by default
            </div>
            <h2 className={`${SLAB} max-w-md text-[54px] font-black leading-[0.95] tracking-tight text-paper`}>
              One gate. Every session, signed.
            </h2>
            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-paper/55">
              A minimal authentication layer — passwords hashed with bcrypt, JWTs held in httpOnly
              signed cookies, role-based access, and rate-limited endpoints. No dark patterns.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-px border border-paper/15 bg-paper/10">
            {[
              ["bcrypt", "hashing"],
              ["httpOnly", "jwt cookie"],
              ["RBAC", "admin / user"],
            ].map(([v, l]) => (
              <div key={l} className="bg-ink p-4">
                <div className={`${SLAB} text-[20px] font-bold text-paper`}>{v}</div>
                <div className={`${MONO} mt-1 text-[10px] uppercase tracking-widest text-paper/45`}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center px-6 py-14 sm:px-12">
        <AuthPanel onAuth={setSession} />
      </main>
    </div>
  )
}
