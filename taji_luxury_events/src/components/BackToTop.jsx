import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-primary text-ivory shadow-[0_12px_30px_rgba(122,27,27,0.45)] transition hover:scale-105 focus:outline-none"
      aria-label="Back to top"
    >
      &uarr;
    </button>
  )
}
