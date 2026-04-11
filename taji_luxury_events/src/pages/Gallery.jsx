import { useEffect, useMemo, useState } from 'react'
import Breadcrumbs from '../components/Breadcrumbs.jsx'
import galleryFallback from '../data/gallery.json'
import { galleryMedia } from '../data/media.js'
import { normalizeMediaList } from '../utils/media.js'

const fallbackItems = normalizeMediaList(galleryFallback, ['src'])

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSrc, setActiveSrc] = useState('')
  const [activeAlt, setActiveAlt] = useState('')

  const items = useMemo(() => {
    if (galleryMedia.length) {
      return galleryMedia
        .filter((src) => !src.endsWith('.svg'))
        .slice(0, 60)
        .map((src, index) => ({
        src,
        alt: `Gallery showcase ${index + 1}`,
      }))
    }
    return fallbackItems
  }, [])

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
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {items.map((media, index) => (
            <button
              key={`${media.src}-${index}`}
              type="button"
              className="relative group w-full rounded-2xl overflow-hidden break-inside-avoid block mb-4"
              onClick={() => open(media.src, media.alt)}
            >
              <img src={media.src} alt={media.alt} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
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
