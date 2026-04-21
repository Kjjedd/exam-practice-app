import { HomeHero } from "../components/home/HomeHero";
import { HomeEntrySection } from "../components/home/HomeEntrySection";
import { HomeNavbar } from "../components/home/HomeNavbar";
import { SecondaryLinks } from "../components/home/SecondaryLinks";

export default function HomePage() {
  return (
    <main className="theme-page-shell min-h-screen">
      <HomeNavbar />
      <div className="px-4 pb-8 pt-2 sm:px-6 sm:pb-10 sm:pt-4">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
          <section id="overview" className="theme-home-overview overflow-hidden rounded-[2.25rem] px-6 py-6 backdrop-blur sm:px-8 sm:py-8">
            <HomeHero />
          </section>

          <section id="start" className="theme-home-section rounded-[2.25rem] px-4 py-4 backdrop-blur sm:px-5 sm:py-5">
            <HomeEntrySection />
          </section>

          <section id="shortcuts" className="theme-home-section rounded-[2.25rem] px-4 py-4 backdrop-blur sm:px-5 sm:py-5">
            <SecondaryLinks />
          </section>
        </div>
      </div>
    </main>
  );
}
