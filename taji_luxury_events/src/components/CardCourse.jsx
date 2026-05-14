import { Link } from 'react-router-dom'
import LazyBackground from './LazyBackground.jsx'
import { normalizePath } from '../utils/media.js'
import { formatKES } from '../utils/format.js'

export default function CardCourse({ course }) {
  return (
    <article className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:-translate-y-1 transition flex h-full flex-col" data-aos="fade-up">
      <LazyBackground
        className="h-48 bg-cover bg-center"
        src={normalizePath(course.image)}
        alt={`${course.title} visual`}
      />
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
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-mist">
            <span>Reg: KES {formatKES(course.reg_fee)}</span>
            <span>
              Fee: <span className="text-gold font-semibold">KES {formatKES(course.course_fee)}</span>
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
          <Link to={`/checkout/${course.slug}`} className="inline-flex px-4 py-2 rounded-full border border-gold text-sm tracking-wide">
            {course.cta}
          </Link>
        </div>
      </div>
    </article>
  )
}
