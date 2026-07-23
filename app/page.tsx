import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import WhyWMS from '@/components/WhyWMS';
import Solutions from '@/components/Solutions';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Testimonials from '@/components/Testimonials';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import GlobeBackgroundWrapper from '@/components/GlobeBackgroundWrapper';

export default function Home() {
  return (
    <>
      <GlobeBackgroundWrapper />
      <Navbar />
      <main className="w-full relative z-10">
        <Hero />
        <Services />
        <WhyWMS />
        <Solutions />
        <Portfolio />
        <About />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
