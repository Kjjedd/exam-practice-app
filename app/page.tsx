import { HomeHero } from "../components/home/HomeHero";
import { PrimaryActions } from "../components/home/PrimaryActions";
import { SecondaryLinks } from "../components/home/SecondaryLinks";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10 sm:py-14">
        <HomeHero />
        <PrimaryActions />
        <SecondaryLinks />
      </div>
    </main>
  );
}
