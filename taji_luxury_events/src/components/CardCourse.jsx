import ResponsiveImage from './ResponsiveImage.jsx'
import { Link } from 'react-router-dom'
import { normalizePath } from '../utils/media.js'
import { formatKES } from '../utils/format.js'
import { feeTotalForCourse } from '../utils/academyFees.js'

export default function CardCourse({ course, priority = false, showAdditionalFees = false }) {
  const coursePageUrl = `/academy/courses/${course.slug}`

  return (
    <article className="academy-course-card flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1" data-aos="fade-up">
      <Link to={coursePageUrl} aria-label={`View ${course.title} course details`} className="block h-48 overflow-hidden">
        <ResponsiveImage
          src={normalizePath(course.image)}
          alt={`${course.title} visual`}
          className="h-full w-full object-cover"
          sizes="(min-width: 640px) 384px, 100vw"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          width="640"
          height="360"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide">
          <span className="rounded-full bg-gold/10 px-3 py-1 text-gold">{course.level}</span>
          <span className="text-mist">{course.duration} · {course.mode}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-playfair text-ivory">{course.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mist">{course.summary}</p>
          {course.schedule ? <p className="mt-3 text-xs leading-relaxed text-mist">{course.schedule}</p> : null}
        </div>
        <div className="border-t border-white/10 pt-4 text-sm">
          <p className="flex justify-between gap-2"><span>Tuition</span><strong className="text-gold">KES {formatKES(course.course_fee)}</strong></p>
          {showAdditionalFees ? <p className="mt-1 flex justify-between gap-2 text-mist"><span>Additional fees</span><span>KES {formatKES(feeTotalForCourse(course))}</span></p> : null}
        </div>
        <Link to={coursePageUrl} className="inline-flex justify-center rounded-full border border-gold px-4 py-2 text-sm text-gold transition hover:bg-primary hover:text-white">
          View course & timetable
        </Link>
      </div>
    </article>
  )
}
