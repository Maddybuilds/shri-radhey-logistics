import { lazy, Suspense } from 'react'
import About from './About.jsx'
import TrustStats from './TrustStats.jsx'
import Vision from './Vision.jsx'
import CoreValues from './CoreValues.jsx'
import GrowthStrategy from './GrowthStrategy.jsx'
import CompanyStructure from './CompanyStructure.jsx'
import Services from './Services.jsx'
import HowWeWork from './HowWeWork.jsx'

// Below-the-fold sections — lazy-loaded (they sit far below the 3D scroll track,
// so their Suspense fallback is never visible; this trims the initial bundle).
const IndustriesSpecialized = lazy(() => import('./IndustriesSpecialized.jsx'))
const CoreOfferings = lazy(() => import('./CoreOfferings.jsx'))
const CostRevenue = lazy(() => import('./CostRevenue.jsx'))
const QuoteCTA = lazy(() => import('./QuoteCTA.jsx'))
const IndustriesServed = lazy(() => import('./IndustriesServed.jsx'))
const StrategicVentures = lazy(() => import('./StrategicVentures.jsx'))
const Insights = lazy(() => import('./Insights.jsx'))
const Testimonials = lazy(() => import('./Testimonials.jsx'))
const Contact = lazy(() => import('./Contact.jsx'))
const Footer = lazy(() => import('./Footer.jsx'))

/**
 * All flat content below the 3D experience. Wrapped in `.sr-site` so it sits at
 * z-index:10 with an opaque background, scrolling up over the fixed 3D canvas
 * once the 1500vh scroll track completes. (No change to the 3D timeline.)
 */
export default function SiteContent() {
  return (
    <main className="sr-site" id="site-content">
      <About />
      <TrustStats />
      <Vision />
      <CoreValues />
      <GrowthStrategy />
      <CompanyStructure />
      <Services />
      <HowWeWork />
      <Suspense fallback={<div style={{ minHeight: '40vh' }} />}>
        <IndustriesSpecialized />
        <CoreOfferings />
        <CostRevenue />
        <QuoteCTA />
        <IndustriesServed />
        <StrategicVentures />
        <Insights />
        <Testimonials />
        <Contact />
        <Footer />
      </Suspense>
    </main>
  )
}
