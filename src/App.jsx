import ScrollScene from './components/ScrollScene.jsx'
import { QuoteProvider } from './context/QuoteContext.jsx'
import Navbar from './sections/Navbar.jsx'
import SiteContent from './sections/SiteContent.jsx'
import QuoteModal from './components/QuoteModal.jsx'

export default function App() {
  // The truck, globe and India tour are available at every viewport size.
  // Below it: all flat content, which scrolls up over the fixed canvas.
  // Everything is wrapped in QuoteProvider so any CTA can open the Get Quote modal.
  return (
    <QuoteProvider>
      <a href="#site-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <ScrollScene />
      <SiteContent />
      <QuoteModal />
    </QuoteProvider>
  )
}
