export default function CtaBanner() {
  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16" data-aos="fade-up">
      <div
        className="max-w-5xl mx-auto rounded-3xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg, #7A1B1B 0%, #2E7D6D 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(212,175,55,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        ></div>
        <div className="relative p-10 md:p-14 space-y-4">
          <p className="text-xs uppercase tracking-[0.5em] text-gold/80">Taji Signature</p>
          <h2 className="text-3xl md:text-4xl font-playfair text-ivory">Design The Next Chapter</h2>
          <p className="text-base max-w-2xl text-ivory/80">
            Tell us about the celebration or skills you want to elevate. We respond with thoughtful guidance, transparent pricing,
            and a curated pathway.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="https://wa.me/254742574329"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-ivory text-charcoal text-sm uppercase tracking-wide font-medium hover:bg-gold transition"
            >
              Talk to the Front Desk
            </a>
            <a
              href="/academy"
              className="px-6 py-3 rounded-full border border-ivory/40 text-ivory text-sm uppercase tracking-wide hover:border-ivory transition"
            >
              Explore Programs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
