import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import FeatureGrid from '../components/landing/FeatureGrid'
import ProductShowcase from '../components/landing/ProductShowcase'
import AiAndParentSection from '../components/landing/AiAndParentSection'
import AnalyticsSection from '../components/landing/AnalyticsSection'
import Testimonials from '../components/landing/Testimonials'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

function Landing() {
  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <ProductShowcase />
        <AiAndParentSection />
        <AnalyticsSection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default Landing
