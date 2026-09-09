import Icon from '../lib/icons.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { useQuote } from '../context/QuoteContext.jsx'
import { telLink, whatsappLink, CONTACT } from '../lib/sendQuote.js'

export default function QuoteCTA() {
  const { openQuote } = useQuote()

  return (
    <section className="sr-section quote-cta-section">
      <div className="sr-wrap">
        <Reveal>
          <div className="quote-cta-band">
            <span className="qcta-glyph" aria-hidden="true">
              <Icon name="truck" />
            </span>
            <div className="qcta-inner">
              <span className="sr-eyebrow">Get Started</span>
              <h2>Ready to move your cargo across India?</h2>
              <p>
                Tell us what you need to ship — our team responds within 24 hours with a tailored
                quote built around your route, cargo, and timeline.
              </p>
              <div className="qcta-actions">
                <Button variant="accent" onClick={() => openQuote()} iconRight="arrow-right">
                  Get a Quote
                </Button>
                <Button as="a" variant="secondary" icon="phone" href={telLink()}>
                  Call {CONTACT.phoneDisplay}
                </Button>
                <Button as="a" variant="whatsapp" icon="whatsapp" href={whatsappLink()}>
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
