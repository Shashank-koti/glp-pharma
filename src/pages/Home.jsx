import Hero from '../components/home/Hero';
import CompanyIntro from '../components/home/CompanyIntro';
import NewlySynthesizedProducts from '../components/home/NewlySynthesizedProducts';
import Services from '../components/home/Services';
import LogisticsPartners from '../components/home/LogisticsPartners';
import OurClients from '../components/home/OurClients';
import GlobalTrust from '../components/home/GlobalTrust';
import NewsInsights from '../components/home/NewsInsights';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <CompanyIntro />
      <NewlySynthesizedProducts />
      <Services />
      <GlobalTrust />
      <LogisticsPartners />
      <OurClients />
      <NewsInsights />
    </div>
  );
}
