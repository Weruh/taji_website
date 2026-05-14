import { useMemo, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import CardCourse from '../components/CardCourse.jsx'
import coursesData from '../data/courses.json'
import { academyStudioMedia } from '../data/media.js'
import { academyAdditionalFees, academyOutcomes, academyPaymentDetails, academySteps, signaturePrograms } from '../data/content.js'
import { normalizeMediaList } from '../utils/media.js'
import { formatKES } from '../utils/format.js'

const courses = normalizeMediaList(coursesData, ['image'])

export default function Academy() {
  const [level, setLevel] = useState('All levels')

  const levels = useMemo(() => {
    const set = new Set(courses.map((course) => course.level || 'Flexible'))
    return Array.from(set).sort()
  }, [courses])

  const filteredCourses = courses.filter((course) => level === 'All levels' || course.level === level)

  return (
    <>
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-6" data-aos="fade-up">
          <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Academy' }]} />
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Taji Academy</p>
          <h1 className="text-4xl md:text-5xl font-playfair text-ivory">Taji Luxury Events Academy</h1>
          <p className="text-lg text-mist leading-relaxed">
            Professional training for future event professionals, focused on the practical skills needed to excel in the events
            industry. Early registration is essential for the current intake.
          </p>
          <figure className="rounded-3xl overflow-hidden border border-white/10 bg-white/5">
            <img
              src="/img/academy/Academy.webp"
              alt="Taji Academy training session"
              className="w-full h-[620px] md:h-[840px] object-cover"
              loading="lazy"
            />
          </figure>
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            {academySteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 p-6 bg-white/5 relative overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <span className="absolute top-4 right-5 text-4xl font-playfair text-white/5 select-none">{index + 1}</span>
                <div className="w-6 h-0.5 bg-gold mb-4"></div>
                <h3 className="text-lg font-playfair text-ivory mb-2">{step.title}</h3>
                <p className="text-sm text-mist leading-relaxed">{step.copy}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
              <p className="text-sm uppercase tracking-[0.4em] text-gold">Courses Offered</p>
              <ul className="mt-4 space-y-2">
                {signaturePrograms.map((program) => (
                  <li key={program} className="flex items-center space-x-2 text-sm text-mist">
                    <span className="text-gold">&rarr;</span>
                    <span>{program}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
              <p className="text-sm uppercase tracking-[0.4em] text-gold">Our Promise</p>
              <p className="mt-4 text-base text-mist leading-relaxed">
                Practical, industry-relevant, portfolio-building training that leads to real opportunities. Graduate ready to
                design, plan, and execute with excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-16" id="programs" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="uppercase text-xs tracking-[0.5em] text-gold">Academy Programs</p>
              <h2 className="text-3xl font-playfair">Browse Courses</h2>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className={`px-4 py-2 rounded-full border border-white/10 ${level === 'All levels' ? 'bg-primary text-ivory' : ''}`}
                onClick={() => setLevel('All levels')}
              >
                All levels
              </button>
              {levels.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`px-4 py-2 rounded-full border border-white/10 ${level === item ? 'bg-primary text-ivory' : ''}`}
                  onClick={() => setLevel(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <CardCourse key={course.slug} course={course} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-3xl font-playfair">Inside the Classes</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {academyStudioMedia.map((image) => (
              <figure key={image} className="rounded-3xl overflow-hidden border border-white/10">
                <img src={image} alt="Inside the studio moment" className="h-64 w-full object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 py-16" data-aos="fade-up">
        <div className="max-w-5xl mx-auto space-y-6">
          <h2 className="text-3xl font-playfair">Outcomes</h2>
          <div className="grid gap-4 md:grid-cols-4">
            {academyOutcomes.map((outcome) => (
              <div key={outcome} className="rounded-2xl border border-white/10 px-4 py-6 text-center">
                {outcome}
              </div>
            ))}
          </div>
          <div className="overflow-x-auto rounded-3xl border border-white/10">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead className="bg-gold text-charcoal uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-6 py-3">Course</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Mode</th>
                  <th className="px-6 py-3">Reg. (KES)</th>
                  <th className="px-6 py-3">Course Fee</th>
                  <th className="px-6 py-3">Total With Reg.</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={`${course.slug}-row`} className="border-t border-white/10">
                    <td className="px-6 py-4 font-semibold">{course.title}</td>
                    <td className="px-6 py-4">{course.duration}</td>
                    <td className="px-6 py-4 text-mist/70">{course.mode || '--'}</td>
                    <td className="px-6 py-4">KES {formatKES(course.reg_fee)}</td>
                    <td className="px-6 py-4">KES {formatKES(course.course_fee)}</td>
                    <td className="px-6 py-4 text-gold font-semibold">KES {formatKES(course.total_fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-3xl border border-gold/30 p-8 bg-gradient-to-r from-gold/10 to-transparent">
            <p className="text-lg font-playfair text-gold">Ready to enroll?</p>
            <p className="text-sm text-mist mt-2">
              Secure your spot by completing registration, paying the registration fee, and submitting payment details.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a href="#programs" className="px-6 py-3 rounded-full bg-primary text-ivory text-sm uppercase tracking-wide hover:bg-primary/90 transition">
                Browse Courses
              </a>
              <a
                href="https://paystack.shop/taji-luxury-events-academy"
                className="px-6 py-3 rounded-full border border-gold text-sm uppercase tracking-wide text-gold hover:bg-primary hover:text-ivory transition"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-16" data-aos="fade-up">
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
            <p className="text-sm uppercase tracking-[0.4em] text-gold">Additional Fees</p>
            <div className="mt-5 space-y-4">
              {academyAdditionalFees.map((fee) => (
                <div key={fee.label} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-ivory">{fee.label}</p>
                    <p className="text-gold font-semibold">
                      KES {formatKES(fee.amount)} <span className="text-mist/60">(${fee.usd})</span>
                    </p>
                  </div>
                  {fee.note ? <p className="mt-1 text-xs text-mist/60">{fee.note}</p> : null}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-mist">
              All students receive a professional certificate from Taji Luxury Events Academy upon successful completion.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 p-6 bg-white/5">
            <p className="text-sm uppercase tracking-[0.4em] text-gold">Payment Options</p>
            <div className="mt-5 space-y-4 text-sm text-mist">
              <p>Full payment: full amount cleared before the beginning of classes.</p>
              <p>Two installments: first installment before classes begin, second installment during the class period.</p>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-mist/60">Paybill</dt>
                <dd className="text-ivory font-semibold">{academyPaymentDetails.paybill}</dd>
              </div>
              <div>
                <dt className="text-mist/60">Account Number</dt>
                <dd className="text-ivory font-semibold">{academyPaymentDetails.accountNumber}</dd>
              </div>
              <div>
                <dt className="text-mist/60">Account Name</dt>
                <dd className="text-ivory font-semibold">{academyPaymentDetails.accountName}</dd>
              </div>
              <div>
                <dt className="text-mist/60">Bank</dt>
                <dd className="text-ivory font-semibold">{academyPaymentDetails.bank}</dd>
              </div>
              <div>
                <dt className="text-mist/60">Branch</dt>
                <dd className="text-ivory font-semibold">{academyPaymentDetails.branch}</dd>
              </div>
              <div>
                <dt className="text-mist/60">SWIFT</dt>
                <dd className="text-ivory font-semibold">{academyPaymentDetails.swift}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
