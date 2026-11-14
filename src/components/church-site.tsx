import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation, site } from "@/data/site";

const logoSrc = "/assets/logo.webp";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Soft scroll edge: the hairline and shadow fade in once the page has moved.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Close the menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to its button; so does a press outside the header.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="site-header" data-scrolled={scrolled}>
      <div className="church-container flex min-h-[72px] items-center justify-between gap-5">
        <Link to="/" className="press flex min-w-0 items-center" aria-label={`${site.name}, home`}>
          <img
            src={logoSrc}
            alt=""
            width={1200}
            height={1123}
            className="logo-blend h-12 w-auto sm:h-14"
          />
          <span className="sr-only">{site.name}</span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              activeProps={{ className: "text-primary" }}
              className="whitespace-nowrap text-[13px] font-medium text-foreground/85 transition-colors duration-150 hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="hidden rounded-full px-5 lg:inline-flex">
          <Link to="/contact">
            Plan a visit <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button
          ref={menuButtonRef}
          variant="ghost"
          size="icon"
          className="relative rounded-full lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu
            aria-hidden="true"
            className={`absolute transition-[opacity,transform] duration-150 ease-out ${open ? "scale-75 opacity-0" : "scale-100 opacity-100"}`}
          />
          <X
            aria-hidden="true"
            className={`absolute transition-[opacity,transform] duration-150 ease-out ${open ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
          />
        </Button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-menu grid gap-0.5 lg:hidden"
        aria-label="Mobile navigation"
        data-state={open ? "open" : "closed"}
        inert={!open}
      >
        {navigation.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            activeProps={{ className: "text-primary bg-secondary" }}
            className="press rounded-xl px-4 py-3 text-base font-medium"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="church-container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:py-16">
        <div>
          <Link to="/" className="press inline-flex items-center" aria-label={`${site.name}, home`}>
            <span className="grid place-items-center rounded-2xl bg-card p-2.5">
              <img src={logoSrc} alt="" width={1200} height={1123} className="h-16 w-auto" />
            </span>
            <span className="sr-only">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-background/75">“{site.motto}”</p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink label="Facebook">
              <SocialGlyph d={SOCIAL_PATHS.facebook} />
            </SocialLink>
            <SocialLink label="Instagram">
              <SocialGlyph d={SOCIAL_PATHS.instagram} />
            </SocialLink>
            <SocialLink label="YouTube">
              <SocialGlyph d={SOCIAL_PATHS.youtube} />
            </SocialLink>
          </div>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">
            Visit us
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-background/75">{site.address}</p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">
            Get in touch
          </h2>
          <div className="mt-4 grid gap-2 text-sm text-background/75">
            {site.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone}`}
                className="w-fit transition-colors hover:text-gold"
              >
                {phone}
              </a>
            ))}
            <a href={`mailto:${site.email}`} className="w-fit transition-colors hover:text-gold">
              {site.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-background/15">
        <div className="church-container flex flex-col gap-2 py-4 text-xs text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Burning Bush Ministries International</span>
          <span>Meru, Kenya</span>
        </div>
      </div>
    </footer>
  );
}

// Solid brand glyphs (Simple Icons, CC0): crisp and optically even, unlike soft outline icons.
const SOCIAL_PATHS = {
  facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  instagram:
    "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  youtube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
} as const;

function SocialGlyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="size-[18px] fill-current"
    >
      <path d={d} />
    </svg>
  );
}

function SocialLink({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={`${label} social page coming soon`}
      title={`${label} social page coming soon`}
      className="social-link press"
    >
      {children}
    </a>
  );
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
      <h1 className="font-display text-4xl leading-[1.1] text-foreground sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-primary">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 leading-7 text-muted-foreground">{description}</p>}
    </div>
  );
}

/**
 * Reveals a block once as it scrolls into view. Server render and no-JS visitors get the content
 * visible; on the client only blocks that start below the fold are marked pending, so nothing
 * flashes and nothing replays on later scrolls.
 */
function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (el.dataset["reveal"] === "in") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset["reveal"] = "pending";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset["reveal"] = "in";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function PageBand({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRevealOnce<HTMLElement>();
  return (
    <section ref={ref} className={`section-space ${className}`}>
      <div className="church-container">{children}</div>
    </section>
  );
}
