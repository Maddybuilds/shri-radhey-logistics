import Icon from '../lib/icons.jsx'
import { CONTACT } from '../lib/sendQuote.js'
import { scrollToId } from './Navbar.jsx'

const NAV = [
  { label: 'About Us', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Company', id: 'company' },
  { label: 'Ventures', id: 'ventures' },
  { label: 'Contact Us', id: 'contact' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="sr-wrap">
        <div className="footer-grid">
          {/* Brand + about */}
          <div className="footer-about-col">
            <div className="brand">
              <span className="brand-mark">SR</span>
              <span className="brand-text">
                <span className="brand-name">Shri Radhey</span>
                <span className="brand-sub">Logistics Pvt Ltd</span>
              </span>
            </div>
            <p className="footer-about">
              With over 15 years of experience, we deliver efficient transportation and logistics
              solutions across India — from FMCG and pharma to heavy equipment and government supply.
            </p>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li className="footer-loc">
                <Icon name="mail" size={16} />
                <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
              </li>
              <li className="footer-loc">
                <Icon name="phone" size={16} />
                <a href="tel:+919359001122">+91 9359001122</a>
              </li>
              <li className="footer-loc">
                <Icon name="phone" size={16} />
                <a href="tel:+919140334550">+91 9140334550</a>
              </li>
              <li className="footer-loc">
                <Icon name="clock" size={16} />
                <span>Mon–Sat 9 AM–6 PM · Sunday emergency only</span>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="footer-col">
            <h5>Locations</h5>
            <ul>
              <li className="footer-loc">
                <span className="dot">•</span> Lucknow (HQ)
              </li>
              <li className="footer-loc">
                <span className="dot">•</span> Noida
              </li>
              <li className="footer-loc">
                <span className="dot">•</span> Ludhiana (upcoming)
              </li>
            </ul>
          </div>

          {/* Nav */}
          <div className="footer-col">
            <h5>Explore</h5>
            <ul>
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(n.id)
                    }}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Shri Radhey Logistics Pvt Ltd. All rights reserved.</span>
          <span>shriradheylogistics.co.in</span>
        </div>
      </div>
    </footer>
  )
}
