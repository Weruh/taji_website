import Breadcrumbs from '../components/Breadcrumbs.jsx'

export default function Privacy() {
  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-6" data-aos="fade-up">
        <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Privacy' }]} />
        <h1 className="text-4xl font-playfair">Privacy Policy</h1>
        <p className="text-sm text-mist">
          We protect the confidentiality of client and student data. This summary outlines how we collect, use, and store your
          information.
        </p>
        <div className="space-y-6 text-sm leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-ivory">Data we collect</h2>
            <p>Contact information, project briefs, event preferences, and academy application details.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ivory">How we use data</h2>
            <p>To deliver proposals, manage events, enroll students, and share relevant updates. We never sell information.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ivory">Security</h2>
            <p>Access is limited to core team members. Files are stored on encrypted tools with MFA enabled.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-ivory">Your rights</h2>
            <p>Email hello@tajiluxury.com to request updates or deletion of your data.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
