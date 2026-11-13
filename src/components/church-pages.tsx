import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight, ArrowRight, BookOpen, CalendarDays, Clock3, Cross, HandHeart, Heart,
  Headphones, MapPin, Music2, Play, Sparkles, Sun, Users, Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout, PageIntro, PageBand, SectionHeading } from "@/components/church-site";
import { vision, serviceTimes, pillars, featuredEvent } from "@/data/home";
import { aboutContent } from "@/data/about";
import { leadershipContent } from "@/data/leadership";
import { programmes, events } from "@/data/programmes";
import { ministries } from "@/data/ministries";
import { sermons } from "@/data/sermons";
import { givingContent } from "@/data/giving";
import { contactContent } from "@/data/contact";

const gatheringImage = "/assets/meru-church-gathering.jpg";

const ministryIcons = [Sun, Sparkles, Music2, Heart, BookOpen, HandHeart];

export function HomePage() {
  return <SiteLayout>
    <section className="relative isolate flex min-h-[550px] items-end overflow-hidden bg-foreground sm:min-h-[600px] md:min-h-[660px]">
      <img src={gatheringImage} alt="A joyful congregation worshipping together" width={1600} height={1056} fetchPriority="high" className="absolute inset-0 -z-20 size-full object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-foreground/55" />
      <div className="church-container w-full pb-14 pt-28 sm:pb-20 md:pb-24">
        <div className="max-w-3xl text-background">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold"><span className="h-px w-9 bg-gold" />A church family in Meru, Kenya</p>
          <h1 className="font-display text-5xl leading-[1.04] sm:text-6xl md:text-7xl">Everybody is <span className="text-gold">somebody.</span></h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-background/90 sm:text-xl">{vision}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-sm px-6"><Link to="/contact">Plan a visit <ArrowRight /></Link></Button>
            <Button asChild variant="outline" size="lg" className="h-12 rounded-sm border-background/60 bg-background/10 px-6 text-background hover:bg-background hover:text-foreground"><Link to="/about">Discover our church</Link></Button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-7 right-8 hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-background/80 md:flex"><span>Welcome home</span><ArrowDownRight className="size-4 text-gold" /></div>
    </section>

    <section className="border-b border-border bg-background">
      <div className="church-container grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {serviceTimes.map((service) => <div key={service.name} className="flex items-center gap-4 py-5 sm:px-5 sm:first:pl-0 sm:last:pr-0">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary"><Clock3 className="size-5" /></span>
          <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{service.day} · {service.time}</p><p className="mt-1 font-semibold">{service.name}</p></div>
        </div>)}
      </div>
    </section>

    <PageBand>
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div><SectionHeading eyebrow="Our calling" title="Faith that reaches beyond Sunday." description="We are committed to sharing the Word, equipping people, and serving our communities with the love of Christ." /><Button asChild variant="link" className="mt-5 h-auto px-0 text-primary"><Link to="/about">Learn more about us <ArrowRight /></Link></Button></div>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {pillars.map((pillar) => <article key={pillar.number} className="border-t border-border pt-4">
            <span className="text-xs font-bold tracking-[0.14em] text-gold">{pillar.number}</span>
            <h3 className="mt-3 font-display text-xl">{pillar.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.description}</p>
          </article>)}
        </div>
      </div>
    </PageBand>

    <section className="bg-primary text-primary-foreground">
      <div className="church-container grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-center sm:py-12">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-gold"><CalendarDays className="size-4" />Save the date · {featuredEvent.date}</p><h2 className="font-display text-3xl sm:text-4xl">{featuredEvent.title}</h2><p className="mt-3 max-w-2xl leading-6 text-primary-foreground/80">{featuredEvent.description}</p></div>
        <Button asChild variant="outline" className="w-fit rounded-sm border-primary-foreground/45 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/services-events">Event details <ArrowRight /></Link></Button>
      </div>
    </section>

    <PageBand className="bg-secondary/55">
      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div><p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-primary">Make a difference</p><h2 className="font-display text-3xl sm:text-4xl">Your generosity helps us serve.</h2><p className="mt-3 max-w-2xl leading-7 text-muted-foreground">Partner with the ministry as we share the Gospel, equip leaders, and care for our community.</p></div>
        <Button asChild size="lg" className="w-fit rounded-sm"><Link to="/give">Give to the ministry <ArrowRight /></Link></Button>
      </div>
    </PageBand>
  </SiteLayout>;
}

export function AboutPage() {
  return <SiteLayout><PageBand><PageIntro eyebrow={aboutContent.eyebrow} title={aboutContent.title} description="“In Burning Bush Ministries, everybody is somebody.”" /></PageBand>
    <PageBand className="border-y border-border bg-background !pt-0"><div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
      <div className="space-y-5 text-base leading-8 text-muted-foreground">{aboutContent.story.map((p) => <p key={p}>{p}</p>)}</div>
      <div className="grid gap-5 sm:grid-cols-2"><ValuePanel title="Our vision" text={aboutContent.vision} /><ValuePanel title="Our mission" text={aboutContent.mission} /></div>
    </div></PageBand>
    <PageBand><SectionHeading eyebrow="What guides us" title="A faith we live every day." /><div className="mt-9 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">{aboutContent.values.map((value, i) => <article key={value.title} className="border-t border-border pt-4"><span className="text-xs font-bold text-gold">0{i + 1}</span><h3 className="mt-3 font-display text-xl">{value.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{value.text}</p></article>)}</div></PageBand>
    <InvitationBand /></SiteLayout>;
}

export function LeadershipPage() {
  return <SiteLayout><PageBand><PageIntro eyebrow={leadershipContent.eyebrow} title={leadershipContent.title} description={leadershipContent.intro} /></PageBand>
    <PageBand className="border-y border-border bg-background !pt-0"><SectionHeading eyebrow="Ministry board" title="Guided by a shared calling." /><div className="mt-8 grid gap-4 sm:grid-cols-2">{leadershipContent.board.map((person) => <LeaderItem key={person.name} person={person} />)}</div></PageBand>
    <PageBand><SectionHeading eyebrow="Local church pastors" title="Here for our church family." /><div className="mt-8 grid gap-4 sm:grid-cols-2">{leadershipContent.pastors.map((person) => <LeaderItem key={person.name} person={person} />)}</div><p className="mt-6 text-sm text-muted-foreground">{leadershipContent.note}</p></PageBand>
  </SiteLayout>;
}

export function ServicesEventsPage() {
  return <SiteLayout><PageBand><PageIntro eyebrow="Gather with us" title="There’s a place for you here." description="Join us for worship, prayer, fellowship, and the study of God’s Word throughout the week." /></PageBand>
    <PageBand className="border-y border-border bg-background !pt-0"><SectionHeading eyebrow="Weekly programmes" title="A rhythm of worship and fellowship." /><div className="mt-8 divide-y divide-border border-y border-border">{programmes.map((item) => <article key={item.title} className="grid gap-2 py-5 sm:grid-cols-[150px_1fr_auto] sm:items-center"><p className="text-sm font-semibold text-primary">{item.day} <span className="px-1 text-gold">·</span> {item.time}</p><h3 className="font-display text-xl">{item.title}</h3><span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.category}</span></article>)}</div></PageBand>
    <PageBand><SectionHeading eyebrow="Coming together" title="Upcoming events." /><div className="mt-8 grid gap-5 md:grid-cols-2">{events.map((event) => <article key={event.title} className="flex gap-5 border-l-2 border-gold bg-secondary/55 p-6 sm:p-8"><CalendarDays className="mt-1 size-5 shrink-0 text-primary" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{event.date}</p><h3 className="mt-3 font-display text-2xl">{event.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{event.description}</p></div></article>)}</div></PageBand>
  </SiteLayout>;
}

export function MinistriesPage() {
  return <SiteLayout><PageBand><PageIntro eyebrow="Find your place" title="There’s a place to serve and grow." description="Explore the ministries that help our church family grow in faith and make a difference together." /><div className="mt-12 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">{ministries.map((ministry, index) => { const Icon = ministryIcons[index] ?? Heart; return <article key={ministry.title} className="border-t border-border py-7"><span className="grid size-11 place-items-center rounded-full bg-secondary text-primary"><Icon className="size-5" /></span><h2 className="mt-4 font-display text-2xl">{ministry.title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{ministry.description}</p></article>; })}</div></PageBand>
    <InvitationBand /></SiteLayout>;
}

export function SermonsPage() {
  return <SiteLayout><PageBand><PageIntro eyebrow="Listen & grow" title="Messages for your journey." description="Spend time in the Word with our church family. Sermon recordings will be shared here soon." /><div className="mt-12 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">{sermons.map((sermon, index) => <article key={sermon.title} className="group">
      <div className="relative aspect-[1.48] overflow-hidden bg-secondary"><img src={gatheringImage} alt="Worship gathering at Burning Bush Ministries" loading="lazy" width={1600} height={1056} className={`size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${index % 3 === 1 ? "object-[35%_center]" : index % 3 === 2 ? "object-[75%_center]" : "object-center"}`} /><div className="absolute inset-0 grid place-items-center bg-foreground/15"><span className="grid size-12 place-items-center rounded-full bg-background text-primary"><Play className="ml-0.5 size-5 fill-current" /></span></div><span className="absolute bottom-3 left-3 bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]">{sermon.format}</span></div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-primary">{sermon.speaker} · {sermon.date}</p><h2 className="mt-2 font-display text-xl">{sermon.title}</h2>
    </article>)}</div></PageBand></SiteLayout>;
}

export function GivePage() {
  return <SiteLayout><PageBand><PageIntro eyebrow={givingContent.eyebrow} title={givingContent.title} description={givingContent.intro} />
    <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      <div className="grid gap-7 sm:grid-cols-2"><GivingPanel title={givingContent.bank.name} icon={<Cross className="size-5" />} rows={[["Account name", givingContent.bank.accountName], ["Bank", givingContent.bank.bankName], ["Account number", givingContent.bank.accountNumber], ["Branch", givingContent.bank.branch]]} /><GivingPanel title={givingContent.paybill.name} icon={<Heart className="size-5" />} rows={[["Paybill", givingContent.paybill.paybill], ["Account", givingContent.paybill.account]]} /></div>
      <aside className="bg-primary p-7 text-primary-foreground sm:p-9"><p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">Give towards a project</p><h2 className="mt-4 font-display text-3xl">{givingContent.project.title}</h2><p className="mt-4 leading-7 text-primary-foreground/80">{givingContent.project.description}</p><div className="mt-7 border-t border-primary-foreground/20 pt-5"><p className="text-sm leading-6 text-primary-foreground/80">{givingContent.project.note}</p><Button asChild variant="outline" className="mt-6 rounded-sm border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/contact">Ask about giving <ArrowRight /></Link></Button></div></aside>
    </div>
  </PageBand></SiteLayout>;
}

export function ContactPage() {
  return <SiteLayout><PageBand><PageIntro eyebrow={contactContent.eyebrow} title={contactContent.title} description={contactContent.intro} />
    <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="space-y-8"><ContactDetail icon={<MapPin />} title="Visit us"><p>{contactContent.address}</p></ContactDetail><ContactDetail icon={<Clock3 />} title="Call us">{contactContent.phones.map((phone) => <a key={phone} className="block w-fit hover:text-primary" href={`tel:${phone}`}>{phone}</a>)}</ContactDetail><ContactDetail icon={<Heart />} title="Email us"><a className="hover:text-primary" href={`mailto:${contactContent.email}`}>{contactContent.email}</a></ContactDetail>
        <div className="flex aspect-[1.7] items-center justify-center border border-border bg-secondary/60"><div className="text-center"><MapPin className="mx-auto size-7 text-primary" /><p className="mt-3 text-sm font-semibold">Meru, Kenya</p><p className="mt-1 text-xs text-muted-foreground">Map coming soon</p></div></div>
      </div>
      <form className="border-t border-border pt-6" onSubmit={(event) => event.preventDefault()}><h2 className="font-display text-2xl">Send us a message</h2><p className="mt-2 text-sm text-muted-foreground">We’d be glad to hear from you.</p><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Your name<Input name="name" placeholder="Name" autoComplete="name" required /></label><label className="grid gap-2 text-sm font-medium">Email address<Input name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label><label className="grid gap-2 text-sm font-medium sm:col-span-2">Subject<Input name="subject" placeholder="How can we help?" required /></label><label className="grid gap-2 text-sm font-medium sm:col-span-2">Message<Textarea name="message" placeholder="Write your message..." rows={5} required /></label></div><Button type="submit" className="mt-5 rounded-sm">Send message <ArrowRight /></Button><p className="mt-3 text-xs text-muted-foreground">Contact form is a visual preview and does not send messages yet.</p></form>
    </div>
  </PageBand></SiteLayout>;
}

function ValuePanel({ title, text }: { title: string; text: string }) {
  return <article className="border-t-2 border-gold pt-4"><h2 className="font-display text-xl">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></article>;
}

function LeaderItem({ person }: { person: { name: string; role: string; initials: string } }) {
  return <article className="flex items-center gap-5 border-y border-border py-5"><span className="grid size-14 shrink-0 place-items-center rounded-full bg-secondary font-display text-lg text-primary">{person.initials}</span><div><h3 className="font-display text-xl">{person.name}</h3><p className="mt-1 text-sm text-muted-foreground">{person.role}</p></div></article>;
}

function InvitationBand() {
  return <section className="bg-secondary/55"><div className="church-container flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Come as you are</p><h2 className="mt-2 font-display text-2xl">We’d love to welcome you.</h2></div><Button asChild className="w-fit rounded-sm"><Link to="/contact">Plan a visit <ArrowRight /></Link></Button></div></section>;
}

function GivingPanel({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: [string, string][] }) {
  return <article className="border-t border-border pt-5"><span className="grid size-10 place-items-center rounded-full bg-secondary text-primary">{icon}</span><h2 className="mt-4 font-display text-xl">{title}</h2><dl className="mt-4 divide-y divide-border">{rows.map(([label, value]) => <div key={label} className="grid grid-cols-[110px_1fr] gap-3 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl></article>;
}

function ContactDetail({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">{icon}</span><div><h2 className="font-semibold">{title}</h2><div className="mt-1 text-sm leading-6 text-muted-foreground">{children}</div></div></div>;
}