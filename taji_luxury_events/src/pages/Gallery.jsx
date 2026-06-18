import { useEffect, useMemo, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import galleryFallback from '../data/gallery.json'
import { galleryMedia } from '../data/media.js'
import { normalizeMediaList, normalizePath } from '../utils/media.js'

const fallbackItems = normalizeMediaList(galleryFallback, ['src'])
const tileLayouts = [
  'sm:col-span-2 lg:row-span-2',
  'lg:row-span-2',
  '',
  '',
  'sm:row-span-2',
  '',
]

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSrc, setActiveSrc] = useState('')
  const [activeAlt, setActiveAlt] = useState('')
  const [failedImages, setFailedImages] = useState(() => new Set())

  const items = useMemo(() => {
    if (galleryMedia.length) {
      return galleryMedia
        .filter((src) => !src.endsWith('.svg'))
        .slice(0, 60)
        .map((src, index) => ({
          src: normalizePath(src),
          alt: `Gallery showcase ${index + 1}`,
        }))
    }
    return fallbackItems
  }, [])

  const visibleItems = useMemo(
    () => items.filter((media) => !failedImages.has(media.src)),
    [failedImages, items]
  )

  const open = (src, alt) => {
    setActiveSrc(src)
    setActiveAlt(alt)
    setIsOpen(true)
    document.body.classList.add('overflow-hidden')
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove('overflow-hidden')
  }

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKey = (event) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  return (
    <section className="px-3 sm:px-4 lg:px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-8" data-aos="fade-up">
        <Breadcrumbs crumbs={[{ label: 'Home', url: '/' }, { label: 'Gallery' }]} />
        <div>
          <p className="uppercase text-xs tracking-[0.5em] text-gold">Portfolio</p>
          <h1 className="text-4xl md:text-5xl font-playfair text-ivory mt-2">Gallery</h1>
          <p className="text-mist mt-3 text-sm">A look inside weddings, corporate events, and academy workshops.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[240px] sm:auto-rows-[260px] lg:auto-rows-[280px] gap-4">
          {visibleItems.map((media, index) => (
            <button
              key={`${media.src}-${index}`}
              type="button"
              aria-label={`View ${media.alt}`}
              className={`relative group h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 ${tileLayouts[index % tileLayouts.length]}`}
              onClick={() => open(media.src, media.alt)}
            >
              <span
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url("${media.src}")` }}
                aria-hidden="true"
              />
              <img
                src={media.src}
                alt={media.alt}
                className="sr-only"
                decoding="async"
                fetchPriority={index < 6 ? 'high' : 'auto'}
                onError={() => {
                  setFailedImages((current) => {
                    const next = new Set(current)
                    next.add(media.src)
                    return next
                  })
                }}
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-xs uppercase tracking-[0.4em] text-ivory border border-ivory/50 px-4 py-2 rounded-full">View</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={close}>
          <div className="relative max-w-4xl w-full" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute -top-12 right-0 text-ivory/70 hover:text-ivory text-sm uppercase tracking-widest flex items-center gap-2"
              onClick={close}
            >
              Close <span aria-hidden="true">&times;</span>
            </button>
            <img src={activeSrc} alt={activeAlt} className="rounded-2xl w-full max-h-[80vh] object-contain shadow-2xl" />
            <p className="mt-3 text-sm text-mist/70 text-center">{activeAlt}</p>
          </div>
        </div>
      ) : null}
    </section>
  )
}
