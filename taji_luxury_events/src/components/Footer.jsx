export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-mist border-t border-white/5" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-16 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <p className="text-lg font-playfair text-ivory">Taji Luxury Events</p>
          <p className="text-sm leading-relaxed text-mist/80">
            Luxury event production and an academy committed to mastery, mentorship, and community.
          </p>
          <p className="text-xs text-mist/60">&copy; {year} Taji Luxury Events. All rights reserved.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ivory">Brands</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/events" className="hover:text-gold">
                Taji Luxury Events
              </a>
            </li>
            <li>
              <a href="/academy" className="hover:text-gold">
                Taji Luxury Events Academy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ivory">Visit</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="/about" className="hover:text-gold">
                About
              </a>
            </li>
            <li>
              <a href="/gallery" className="hover:text-gold">
                Gallery
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-gold">
                Privacy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-gold">
                Terms
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ivory">Talk to Us</p>
          <p className="mt-4 text-sm">tajiluxuryevents@gmail.com</p>
          <p className="text-sm">Phone / WhatsApp: +254742574329</p>
          <div className="mt-6 space-y-2">
            <div className="flex space-x-3 text-sm">
              <div className="flex space-x-6 items-center justify-center text-[#c1a36e]">
                <a
                  href="https://www.tiktok.com/@taji.luxury.events?_r=1and_t=ZM-91G5aEEr7fA"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-transform hover:scale-110"
                  aria-label="TikTok"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M12.73 2c.2 1.83 1.14 3.37 2.55 4.26a6.43 6.43 0 0 0 3.06.86v3.07a9.13 9.13 0 0 1-3.72-.8v4.94a6.68 6.68 0 1 1-6.68-6.68c.23 0 .45 0 .67.02v3.28a3.41 3.41 0 1 0 3.41 3.4V2h.71Z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/taji_luxury_events?igsh=dnV1bmpvZnZzdnpmandutm_source=qr"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold transition-transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7Zm10 2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h10Zm-5 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm4.5-.9a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
