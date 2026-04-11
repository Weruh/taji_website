import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { navLinks } from '../data/content.js'
import { usePlanningModal } from '../hooks/usePlanningModal.js'

const linkClass = ({ isActive }) =>
  `inline-flex items-center gap-1 text-sm tracking-wide uppercase ${
    isActive ? 'text-gold' : 'text-mist hover:text-ivory'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const { open: openPlanning } = usePlanningModal()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-charcoal/90 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <NavLink to="/" className="flex items-center gap-3 min-w-0" onClick={() => setOpen(false)}>
            <img
              src="/img/logos/TAJIMAINBRAND.png"
              alt="Taji Luxury Events logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain flex-shrink-0"
            />
            <div className="leading-tight">
              <p className="text-sm md:text-base font-semibold tracking-wide uppercase text-ivory truncate">
                Taji Luxury Events
              </p>
              <p className="text-sm md:text-base font-semibold tracking-wide uppercase text-ivory truncate">
                and Academy
              </p>
            </div>
          </NavLink>

          <nav className="hidden lg:flex items-center space-x-8" aria-label="Primary">
            {navLinks.map((item) =>
              item.label === 'Events' ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setEventsOpen(true)}
                  onMouseLeave={() => setEventsOpen(false)}
                >
                  <NavLink to={item.href} className={linkClass}>
                    {item.label}
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </NavLink>
                  {eventsOpen ? (
                    <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl border border-white/10 bg-charcoal/95 backdrop-blur shadow-xl py-2">
                      <NavLink
                        to="/weddings"
                        className="block px-4 py-2 text-sm text-mist hover:text-gold hover:bg-white/5"
                      >
                        Weddings
                      </NavLink>
                      <NavLink
                        to="/corporate"
                        className="block px-4 py-2 text-sm text-mist hover:text-gold hover:bg-white/5"
                      >
                        Corporate
                      </NavLink>
                    </div>
                  ) : null}
                </div>
              ) : (
                <NavLink key={item.label} to={item.href} className={linkClass}>
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openPlanning}
              className="hidden md:inline-flex items-center px-4 py-2 rounded-full border border-gold text-gold text-xs tracking-widest uppercase hover:bg-gold hover:text-charcoal transition"
            >
              Start Planning
            </button>

            <button
              className="lg:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-5 bg-ivory transition-all duration-300 ${
                  open ? 'rotate-45 translate-y-[7px]' : ''
                }`}
                aria-hidden="true"
              ></span>
              <span
                className={`block h-0.5 w-5 bg-ivory transition-all duration-300 mt-1.5 ${
                  open ? 'opacity-0 scale-x-0' : ''
                }`}
                aria-hidden="true"
              ></span>
              <span
                className={`block h-0.5 w-5 bg-ivory transition-all duration-300 mt-1.5 ${
                  open ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
                aria-hidden="true"
              ></span>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden" aria-label="Mobile navigation">
          <div className="border-t border-white/10 bg-charcoal/98 backdrop-blur-2xl shadow-2xl">
            <nav className="px-3 pt-4 pb-2 space-y-1">
              {navLinks.map((item) => (
                <div key={item.label}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm tracking-widest uppercase font-medium transition-all ${
                        isActive
                          ? 'bg-gold/10 text-gold border border-gold/20'
                          : 'text-mist hover:text-ivory hover:bg-white/5'
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-gold"></span>
                        ) : (
                          <svg className="w-4 h-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </>
                    )}
                  </NavLink>
                  {item.label === 'Events' ? (
                    <div className="pl-4 space-y-1 pb-1">
                      <NavLink
                        to="/weddings"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs tracking-widest uppercase text-mist/70 hover:text-gold hover:bg-white/5 transition"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-gold/40 text-base leading-none">&rsaquo;</span> Weddings
                      </NavLink>
                      <NavLink
                        to="/corporate"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs tracking-widest uppercase text-mist/70 hover:text-gold hover:bg-white/5 transition"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-gold/40 text-base leading-none">&rsaquo;</span> Corporate
                      </NavLink>
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>

            <div className="mx-3 border-t border-white/10"></div>

            <div className="px-3 py-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  openPlanning()
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-primary text-ivory text-xs tracking-widest uppercase font-semibold hover:bg-primary/80 transition"
              >
                Start Planning
              </button>
              <a
                href="https://wa.me/254742574329"
                target="_blank"
                rel="noopener"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-full border border-[#25D366]/30 text-[#25D366] text-xs tracking-widest uppercase font-semibold hover:bg-[#25D366]/10 transition"
                onClick={() => setOpen(false)}
              >
                <img src="/img/whatsapp.svg" className="w-4 h-4 flex-shrink-0" alt="" aria-hidden="true" />
                WhatsApp Us
              </a>
            </div>

            <div className="px-3 pb-4 text-center">
              <a href="tel:+254742574329" className="text-xs text-mist/40 hover:text-gold transition tracking-wider">
                +254 742 574 329
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
