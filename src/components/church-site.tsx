import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Facebook, Instagram, Menu, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigation, site } from "@/data/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-20 border-b border-border bg-background">
      <div className="church-container flex min-h-[76px] items-center justify-between gap-5">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Burning Bush Ministries home">
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold text-primary">
            <span className="font-display text-xl font-semibold">B</span>
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-xs">Burning Bush</span>
            <span className="block text-[10px] uppercase tracking-[0.1em] text-muted-foreground sm:text-[11px]">Ministries International</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex xl:gap-6" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} to={item.href} activeProps={{ className: "text-primary" }} className="whitespace-nowrap text-[13px] font-medium text-foreground transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="hidden rounded-sm px-4 lg:inline-flex">
          <Link to="/contact">Plan a visit <ArrowRight aria-hidden="true" /></Link>
        </Button>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && <nav className="church-container grid gap-1 border-t border-border py-4 lg:hidden" aria-label="Mobile navigation">
        {navigation.map((item) => <Link key={item.href} to={item.href} onClick={() => setOpen(false)} activeProps={{ className: "text-primary bg-secondary" }} className="rounded-sm px-3 py-2.5 text-sm font-medium">{item.label}</Link>)}
      </nav>}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="church-container grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr] md:py-16">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-gold text-gold font-display text-lg">B</span>
            <span className="max-w-[230px] text-sm font-semibold leading-snug">{site.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-background/75">“{site.motto}”</p>
          <div className="mt-5 flex items-center gap-2">
            <SocialLink label="Facebook"><Facebook /></SocialLink>
            <SocialLink label="Instagram"><Instagram /></SocialLink>
            <SocialLink label="YouTube"><Youtube /></SocialLink>
          </div>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">Visit us</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-background/75">{site.address}</p>
        </div>
        <div>
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-gold">Get in touch</h2>
          <div className="mt-4 grid gap-2 text-sm text-background/75">
            {site.phones.map((phone) => <a key={phone} href={`tel:${phone}`} className="w-fit transition-colors hover:text-gold">{phone}</a>)}
            <a href={`mailto:${site.email}`} className="w-fit transition-colors hover:text-gold">{site.email}</a>
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
  return <a href="#" aria-label={`${label} social page coming soon`} title={`${label} social page coming soon`} className="grid size-9 place-items-center rounded-full border border-background/25 text-background/80 transition-colors hover:border-gold hover:text-gold">{children}</a>;
}

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return <div className="site-page-enter"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="max-w-3xl">
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
    <h1 className="font-display text-4xl leading-[1.1] text-foreground sm:text-5xl md:text-6xl">{title}</h1>
    {description && <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">{description}</p>}
  </div>;
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return <div className="max-w-2xl">
    {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-primary">{eyebrow}</p>}
    <h2 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 leading-7 text-muted-foreground">{description}</p>}
  </div>;
}

export function PageBand({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`section-space scroll-reveal ${className}`}><div className="church-container">{children}</div></section>;
}