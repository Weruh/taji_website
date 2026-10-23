import { localToday, validateForm, validateFormInput } from '../utils/formValidation.js'
import { kenyanPhoneInputProps } from '../utils/phoneValidation.js'
import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import LazyBackground from '../components/LazyBackground.jsx'
import coursesData from '../data/courses.json'
import faqsData from '../data/faqs.json'
import { normalizeMediaList } from '../utils/media.js'
import { formatKES } from '../utils/format.js'
import { feesForCourse, totalForCourse } from '../utils/academyFees.js'

const courses = normalizeMediaList(coursesData, ['image'])

export default function CourseDetail() {
  const { courseSlug } = useParams()
  const location = useLocation()
  const course = useMemo(() => courses.find((item) => item.slug === courseSlug), [courseSlug])
  const [openIndex, setOpenIndex] = useState(null)
  const formRef = useRef(null)

  if (!course) {
    return (
      <section className="px-3 sm:px-4 lg:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-6" data-aos="fade-up">
          <h1 className="text-4xl font-playfair">Page not found</h1>
          <p className="text-sm text-mist">The resource you are after may have moved.</p>
        </div>
      </section>
    )
  }

  if (new URLSearchParams(location.search).get('payment') === 'registration') {
    return <Navigate to={`/checkout/${course.slug}?payment=registration#payment`} replace />
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const form = formRef.current
    if (!form || !validateForm(form)) return
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    if (!name || !phone) {
      alert('Please fill in your name and phone.')
      return
    }
    const lines = [
      'Course Enrollment -- Taji Luxury Events Academy',
      '---',
      `Course: ${course.title}`,
      `Tuition and applicable fees: KES ${formatKES(totalForCourse(course))}`,
      '---',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Class Time: ${data.get('class_time') || ''}`,
      `Payment Plan: ${data.get('payment_plan') || ''}`,
    ].join('\n')
    window.open(`https://wa.me/254742574329?text=${encodeURIComponent(lines)}`, '_blank', 'noopener')
  }

  return (
    <div className="academy-theme">
      <section className="relative px-3 sm:px-4 lg:px-6 py-20">
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5" data-aos="fade-up">
          <LazyBackground className="h-80 bg-cover bg-center" src={course.image} alt={`${course.title} cover`} priority>
            <div className="h-full w-full bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          </LazyBackground>
          <div className="grid min-w-0 gap-8 p-4 sm:p-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-10">
            <div className="min-w-0 space-y-6">
              <Breadcrumbs
                crumbs={[
                  { label: 'Home', url: '/' },
                  { label: 'Academy', url: '/academy' },
                  { label: course.title },
                ]}
              />
              <h1 className="text-4xl font-playfair">{course.title}</h1>
              <p className="text-lg text-mist">{course.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide">
                <span className="px-3 py-1 rounded-full border border-white/10">{course.level}</span>
                <span className="px-3 py-1 rounded-full border border-white/10">{course.duration}</span>
                {course.mode ? (
                  <span className="px-3 py-1 rounded-full border border-gold/30 text-gold/80">{course.mode}</span>
                ) : null}
              </div>
              {course.timetable?.length ? (
                <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:px-5">
                  <h2 className="text-xs uppercase tracking-[0.4em] text-gold mb-3">Class Timetable</h2>
                  <div className="space-y-3 sm:hidden">
                    {course.timetable.map((slot) => (
                      <div key={slot.days} className="border-t border-white/10 pt-3 text-sm first:border-t-0 first:pt-0">
                        <p className="font-semibold">{slot.days}</p>
                        {slot.morning ? <p className="mt-1 text-mist">Morning: {slot.morning}</p> : null}
                        {slot.evening ? <p className="mt-1 text-mist">Evening: {slot.evening}</p> : null}
                      </div>
                    ))}
                  </div>
                  <div className="hidden max-w-full overflow-x-auto sm:block">
                    <table className="w-full min-w-[430px] text-left text-sm">
                      <thead><tr className="border-b border-white/10"><th className="py-2">Days</th><th className="py-2">Morning</th><th className="py-2">Evening</th></tr></thead>
                      <tbody>{course.timetable.map((slot) => <tr key={slot.days} className="border-b border-white/10 last:border-0"><th className="py-2 font-semibold">{slot.days}</th><td className="py-2">{slot.morning || '—'}</td><td className="py-2">{slot.evening || '—'}</td></tr>)}</tbody>
                    </table>
                  </div>
                  {course.class_options?.length > 1 ? <p className="mt-3 text-xs text-mist">Choose one available class option when enrolling.</p> : null}
                </div>
              ) : null}
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Outcomes</p>
                <ul className="mt-4 grid gap-2 md:grid-cols-2">
                  {course.outcomes?.map((outcome, index) => (
                    <li key={`${course.slug}-outcome-${index}`} className="flex items-start space-x-2">
                      <span className="text-gold">&diams;</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-0 rounded-3xl border border-white/10 p-4 sm:p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-gold/80">Investment</p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt>Course fee</dt>
                    <dd className="font-semibold">
                      KES {formatKES(course.course_fee)}
                      {course.course_fee_usd ? <span className="text-mist/60"> (${course.course_fee_usd})</span> : null}
                    </dd>
                  </div>
                  {feesForCourse(course).map((fee) => <div key={fee.label} className="flex justify-between gap-4"><dt>{fee.label}</dt><dd className="font-semibold">KES {formatKES(fee.amount)}</dd></div>)}
                  <div className="flex justify-between gap-4 border-t border-white/10 pt-3 text-lg font-playfair text-gold">
                    <dt>Total listed fees</dt>
                    <dd>KES {formatKES(totalForCourse(course))}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-xs text-mist/60">Tuition and additional fees are shown separately. The training materials fee appears only for applicable courses.</p>
              </div>
            </div>
            <aside className="min-w-0 space-y-4 self-start md:sticky md:top-24">
              <div className="min-w-0 rounded-3xl border border-gold/40 bg-gold/10 p-4 sm:p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-gold/70">Enrol Now</p>
                  <p className="text-2xl font-playfair text-gold mt-1">{course.title}</p>
                  <p className="text-xs text-mist/70 mt-1">
                    KES {formatKES(course.course_fee)} course fee &bull; Reg. KES 2,000
                  </p>
                </div>
                <form ref={formRef} onSubmit={handleSubmit} noValidate onInput={validateFormInput} className="space-y-3">
              <p className="text-xs text-mist/70">All fields are required.</p>
                  <label className="block text-sm text-ivory/80">
                    <span className="block mb-1">Full name *</span>
                    <input type="text" name="name" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required />
                  </label>
                  <label className="block text-sm text-ivory/80">
                    <span className="block mb-1">Phone / WhatsApp *</span>
                    <input {...kenyanPhoneInputProps} name="phone" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required />
                  </label>
                  <label className="block text-sm text-ivory/80">
                    <span className="block mb-1">Preferred class time</span>
                    <select name="class_time" defaultValue="" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required>
                      <option value="" disabled>Choose a class</option>
                      {course.class_options?.map((option) => <option key={option.label} value={`${option.label}: ${option.schedule}`}>{option.label} — {option.schedule}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm text-ivory/80">
                    <span className="block mb-1">Payment plan</span>
                    <select name="payment_plan" className="w-full rounded-lg bg-charcoal border border-white/10 px-3 py-2 text-sm focus:border-gold focus:outline-none" required>
                      <option value="Full payment">Full payment</option>
                      <option value="Three installments">Three installments</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#20bc5a] transition"
                  >
                    <img src="/img/whatsapp.svg" className="w-4 h-4 flex-shrink-0" alt="" aria-hidden="true" />
                    Enrol via WhatsApp
                  </button>
                  <p className="text-xs text-center text-mist/50">Opens WhatsApp with your details pre-filled.</p>
                  <Link to={`/checkout/${course.slug}?payment=registration#payment`} className="block text-center text-xs font-semibold text-gold underline">Pay registration fee online</Link>
                  <Link to={`/checkout/${course.slug}#payment`} className="block text-center text-xs font-semibold text-gold underline">Pay tuition and remaining fees</Link>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 pb-20" data-aos="fade-up">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-playfair">FAQ</h2>
          <div className="space-y-4">
            {faqsData.map((faq, index) => (
              <div key={`${course.slug}-faq-${index}`} className="rounded-2xl border border-white/10">
                <button
                  type="button"
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span>{faq.q}</span>
                  <span>{openIndex === index ? '-' : '+'}</span>
                </button>
                {openIndex === index ? <div className="px-6 pb-4 text-sm text-mist">{faq.a}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
