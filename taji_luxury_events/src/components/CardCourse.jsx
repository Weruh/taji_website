import { Link } from 'react-router-dom'
import { academyAdditionalFees } from '../data/content.js'
import { normalizePath } from '../utils/media.js'
import { formatKES } from '../utils/format.js'

export default function CardCourse({ course, priority = false, showAdditionalFees = false }) {
  const image = normalizePath(course.image)
  const separateFeesKES = academyAdditionalFees.reduce((total, fee) => total + Number(fee.amount || 0), 0)
  const separateFeesUSD = academyAdditionalFees.reduce((total, fee) => total + Number(fee.usd || 0), 0)
  const registrationFee = academyAdditionalFees.find((fee) => fee.label === 'Registration Fee')
  const isEstimatedCourseFeeUSD = !course.course_fee_usd
  const schoolFeeUSD = course.course_fee_usd || Math.round(Number(course.course_fee || 0) / 125)
  const totalPayableKES = Number(course.course_fee || 0) + separateFeesKES
  const totalPayableUSD = schoolFeeUSD + separateFeesUSD
  const coursePageUrl = `/academy/courses/${course.slug}`
  const registrationCheckoutUrl = `/academy/courses/${course.slug}?payment=registration#payment`
  const primaryCtaLabel = showAdditionalFees ? 'Start Class' : course.cta

  return (
    <article
      className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 focus-within:-translate-y-1"
      data-aos="fade-up"
    >
      <Link
        to={coursePageUrl}
        aria-label={`View ${course.title} course details and payment options`}
        className="absolute inset-0 z-10 rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
      />
      <div className="h-48 bg-white/5 overflow-hidden">
        <img
          src={image}
          alt={`${course.title} visual`}
          className="h-full w-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          width="640"
          height="360"
        />
      </div>
      <div className="p-6 flex flex-1 flex-col gap-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-wide flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-gold/20 text-gold">{course.level}</span>
          <div className="flex items-center gap-2">
            {course.mode ? (
              <span className="px-2 py-0.5 rounded-full border border-white/10 text-mist/60">{course.mode}</span>
            ) : null}
            <span className="text-mist">{course.duration}</span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <div>
            <h3 className="text-2xl font-playfair text-ivory">{course.title}</h3>
            <p className="text-sm text-mist mt-2">{course.summary}</p>
          </div>
          {course.details ? (
            <div className="space-y-2 text-sm text-ivory/80">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/70">Class details</p>
              <ul className="space-y-1 list-none">
                {course.details.map((detail, index) => (
                  <li key={`${course.slug}-detail-${index}`} className="flex items-start gap-2">
                    <span className="mt-[2px] text-gold">&bull;</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {showAdditionalFees ? (
            <div className="rounded-2xl border border-gold/20 bg-gold/10 p-4 text-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-gold/80">Separate Fees</p>
              <p className="mt-2 text-xs leading-relaxed text-mist/70">
                These fees are not included in the school fees. They are paid separately.
              </p>
              <div className="mt-4 space-y-3">
                {academyAdditionalFees.map((fee, index) => (
                  <div key={`${course.slug}-${fee.label}`} className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <p className="font-semibold text-ivory">
                      {index + 1}. {fee.label} - ${fee.usd}{' '}
                      <span className="text-gold/80">(KES {formatKES(fee.amount)})</span>
                    </p>
                    {fee.note ? <p className="mt-1 text-xs leading-relaxed text-mist/70">{fee.note}</p> : null}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-gold/20 bg-charcoal/60 p-3">
                <div className="flex items-start justify-between gap-3 text-xs text-mist/70">
                  <span>School fee</span>
                  <span className="text-right text-ivory">
                    KES {formatKES(course.course_fee)}
                    <span className="text-mist/60">
                      {' '}
                      / {isEstimatedCourseFeeUSD ? 'approx. ' : ''}${schoolFeeUSD}
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-start justify-between gap-3 text-xs text-mist/70">
                  <span>Separate fees</span>
                  <span className="text-right text-ivory">
                    KES {formatKES(separateFeesKES)} <span className="text-mist/60">/ ${separateFeesUSD}</span>
                  </span>
                </div>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold/70">Subtotal to Pay</p>
                  <p className="mt-1 text-lg font-playfair text-gold">
                    KES {formatKES(totalPayableKES)}{' '}
                    <span className="text-sm text-mist/70">
                      / {isEstimatedCourseFeeUSD ? 'approx. ' : ''}${totalPayableUSD}
                    </span>
                  </p>
                </div>
                <Link
                  to={registrationCheckoutUrl}
                  className="relative z-20 mt-3 inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-wide text-ivory hover:bg-primary/90 transition"
                >
                  Pay - Ksh {formatKES(registrationFee?.amount || course.reg_fee || 2000)}
                </Link>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide text-mist">
            <span>School Fee</span>
            <span>
              <span className="text-gold font-semibold">KES {formatKES(course.course_fee)}</span>
              {course.course_fee_usd ? <span className="text-mist/60"> (${course.course_fee_usd})</span> : null}
            </span>
          </div>
          <ul className="text-sm text-ivory/90 grid grid-cols-2 gap-1">
            {course.outcomes?.map((outcome, index) => (
              <li key={`${course.slug}-outcome-${index}`} className="flex items-center space-x-1">
                <span>&sdot;</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-end mt-auto">
          <Link
            to={coursePageUrl}
            className="relative z-20 inline-flex rounded-full border border-gold px-4 py-2 text-sm tracking-wide"
          >
            {primaryCtaLabel}
          </Link>
        </div>
      </div>
    </article>
  )
}
