import AboutHero from '../components/about/AboutHero';
import OurLegacy from '../components/about/OurLegacy';
import CoreValues from '../components/about/CoreValues';
import GlobalInfrastructure from '../components/about/GlobalInfrastructure';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <AboutHero />
      <OurLegacy />
      <CoreValues />
      <GlobalInfrastructure />
    </div>
  );
}