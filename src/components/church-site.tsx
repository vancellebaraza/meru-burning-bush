import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Facebook, Instagram, Menu, X, Youtube } from "lucide-react";
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
              <Facebook />
            </SocialLink>
            <SocialLink label="Instagram">
              <Instagram />
            </SocialLink>
            <SocialLink label="YouTube">
              <Youtube />
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

function SocialLink({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={`${label} social page coming soon`}
      title={`${label} social page coming soon`}
      className="grid size-9 place-items-center rounded-full border border-background/25 text-background/80 transition-colors hover:border-gold hover:text-gold"
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
