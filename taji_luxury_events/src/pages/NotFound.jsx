export default function NotFound() {
  return (
    <section className="px-3 sm:px-4 lg:px-6 py-32 text-center" data-aos="fade-up">
      <p className="text-sm uppercase tracking-[0.5em] text-gold">404</p>
      <h1 className="text-5xl font-playfair mt-4">That page drifted away.</h1>
      <p className="text-mist mt-3">Return to the home page or explore our services.</p>
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <a href="/" className="px-6 py-3 rounded-full bg-primary text-ivory hover:bg-primary/90 transition">
          Back Home
        </a>
        <a href="/contact" className="px-6 py-3 rounded-full border border-gold">
          Contact
        </a>
      </div>
    </section>
  )
}
