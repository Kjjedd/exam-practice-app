import { HomeHero } from "../components/home/HomeHero";
import { HomeEntrySection } from "../components/home/HomeEntrySection";
import { HomeNavbar } from "../components/home/HomeNavbar";
import { SecondaryLinks } from "../components/home/SecondaryLinks";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,244,232,0.9),_rgba(236,244,255,0.96)_38%,_rgba(214,228,240,0.88))] text-ink">
      <HomeNavbar />
      <div className="px-4 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-4">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
          <section id="overview" className="overflow-hidden rounded-[2.25rem] bg-[linear-gradient(135deg,_rgba(255,255,255,0.86),_rgba(255,245,238,0.84),_rgba(236,244,255,0.82))] px-6 py-6 shadow-[0_28px_90px_rgba(16,36,62,0.1)] backdrop-blur sm:px-8 sm:py-8">
            <HomeHero />
          </section>

          <section id="start" className="rounded-[2.25rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.8),_rgba(248,251,255,0.88))] px-4 py-4 shadow-[0_20px_64px_rgba(16,36,62,0.08)] backdrop-blur sm:px-5 sm:py-5">
            <HomeEntrySection />
          </section>

          <section id="shortcuts" className="rounded-[2.25rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.78),_rgba(247,250,254,0.88))] px-4 py-4 shadow-[0_20px_64px_rgba(16,36,62,0.08)] backdrop-blur sm:px-5 sm:py-5">
            <SecondaryLinks />
          </section>
        </div>
      </div>
    </main>
  );
}
