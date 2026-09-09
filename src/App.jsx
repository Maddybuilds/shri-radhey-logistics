import ScrollScene from './components/ScrollScene.jsx'
import StaticHeroFallback from './components/StaticHeroFallback.jsx'
import { QuoteProvider } from './context/QuoteContext.jsx'
import useLowPower from './hooks/useLowPower.js'
import Navbar from './sections/Navbar.jsx'
import SiteContent from './sections/SiteContent.jsx'
import QuoteModal from './components/QuoteModal.jsx'

export default function App() {
  // Top: the existing scroll-driven 3D experience (truck → globe → India tour),
  // or a lightweight static hero on low-power touch devices.
  // Below it: all flat content, which scrolls up over the fixed canvas.
  // Everything is wrapped in QuoteProvider so any CTA can open the Get Quote modal.
  const lowPower = useLowPower()
  return (
    <QuoteProvider>
      <a href="#site-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      {lowPower ? <StaticHeroFallback /> : <ScrollScene />}
      <SiteContent />
      <QuoteModal />
    </QuoteProvider>
  )
}
