import 'swiper/css'
import 'swiper/css/pagination'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import HeroCinematic from '../components/HeroCinematic.jsx'
import SectionServicesExquisite from '../components/SectionServicesExquisite.jsx'
import SectionFoundation from '../components/SectionFoundation.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import StatCounter from '../components/StatCounter.jsx'
import CardCourse from '../components/CardCourse.jsx'
import TestimonialCard from '../components/TestimonialCard.jsx'
import coursesData from '../data/courses.json'
import servicesData from '../data/services.json'
import testimonialsData from '../data/testimonials.json'
import { heroMedia, heroFallbacks } from '../data/media.js'
import { normalizeMediaList } from '../utils/media.js'
import { stats } from '../data/content.js'

const services = normalizeMediaList(servicesData, ['image'])
const courses = normalizeMediaList(coursesData, ['image'])
const testimonials = normalizeMediaList(testimonialsData, ['avatar'])

export default function Home() {
  const heroSlides = heroMedia.filter((src) => !src.endsWith('.svg')).slice(0, 8)

  return (
    <>
      <HeroCinematic slides={heroSlides} fallbackSlides={heroFallbacks} />

      <section className="px-3 sm:px-4 lg:px-6 py-10 border-b border-white/5" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((stat) => (
              <StatCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      <SectionServicesExquisite services={services} />
      <SectionFoundation />

      <section className="px-3 sm:px-4 lg:px-6 py-16" data-aos="fade-up">
        <div className="max-w-6xl mx-auto flex flex-col space-y-10 items-center">
          <div className="text-center space-y-3">
            <p className="uppercase text-xs tracking-[0.5em] text-gold">Academy</p>
            <h2 className="text-3xl font-playfair text-ivory">Signature Training Programs</h2>
            <a href="/academy" className="inline-flex text-sm uppercase tracking-wide text-gold hover:text-mist transition">
              About the academy &rarr;
            </a>
          </div>

          <div className="flex w-full space-x-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth py-6">
            {courses.map((course) => (
              <div key={course.slug} className="flex-shrink-0 w-[350px] snap-start">
                <CardCourse course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 sm:px-4 lg:px-6 py-16 bg-white/5" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="uppercase text-xs tracking-[0.5em] text-gold">Voices</p>
              <h2 className="text-3xl font-playfair text-ivory">Testimonials</h2>
            </div>
            <a href="/contact" className="text-sm uppercase tracking-wide text-gold hover:text-mist transition">
              Plan with us &rarr;
            </a>
          </div>
          <Swiper
            modules={[Autoplay, Pagination]}
            className="testimonials-swiper mt-8"
            loop
            autoplay={{ delay: 6000 }}
            pagination={{ clickable: true }}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.name}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
