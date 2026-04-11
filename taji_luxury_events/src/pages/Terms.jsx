import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function Terms() {
  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-6" data-aos="fade-up">
        <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Terms' }]} />
        <h1 className="text-4xl font-playfair">Terms of Service</h1>
        <p className="text-sm text-mist">Please review these summaries before confirming services or enrollment.</p>
        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-ivory">Events</h2>
            <p>
              Production fees are invoiced in milestones. Vendor payments are managed through approved accounts. Cancellation
              requires written notice and may incur fees tied to progress.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ivory">Academy</h2>
            <p>
              Enrollment secures your seat. Tuition is non-refundable after materials have been issued, but deferrals may be
              arranged with notice.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ivory">Intellectual property</h2>
            <p>
              Visual concepts, templates, and educational resources remain the property of Taji Luxury Events unless otherwise
              stated.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ivory">Liability</h2>
            <p>
              We carry public liability insurance and vetted supplier agreements. Clients are responsible for venue compliance
              and permits outside our scope.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
