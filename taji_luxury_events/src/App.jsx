import { lazy, useEffect, useMemo, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { PlanningModalContext } from './hooks/usePlanningModal.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const Academy = lazy(() => import('./pages/Academy.jsx'))
const Events = lazy(() => import('./pages/Events.jsx'))
const Weddings = lazy(() => import('./pages/Weddings.jsx'))
const Corporate = lazy(() => import('./pages/Corporate.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const Privacy = lazy(() => import('./pages/Privacy.jsx'))
const Terms = lazy(() => import('./pages/Terms.jsx'))
const CourseDetail = lazy(() => import('./pages/CourseDetail.jsx'))
const Checkout = lazy(() => import('./pages/Checkout.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const resolveStoredTheme = () => {
  const stored = localStorage.getItem('taji-theme')
  return stored === 'theme-light' ? 'theme-light' : 'theme-dark'
}

export default function App() {
  const [theme, setTheme] = useState(resolveStoredTheme)
  const [planningOpen, setPlanningOpen] = useState(false)
  const location = useLocation()
  const aosRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}
    const loadAOS = async () => {
      try {
        const [{ default: AOS }] = await Promise.all([import('aos'), import('aos/dist/aos.css')])
        if (cancelled) return
        AOS.init({ once: true, duration: 800, easing: 'ease-out' })
        aosRef.current = AOS
      } catch (error) {
        console.error('Failed to load animations', error)
      }
    }

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const idleId = window.requestIdleCallback(loadAOS, { timeout: 1500 })
        cleanup = () => window.cancelIdleCallback?.(idleId)
      } else {
        const timeoutId = window.setTimeout(loadAOS, 600)
        cleanup = () => window.clearTimeout(timeoutId)
      }
    }

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  useEffect(() => {
    if (aosRef.current) {
      aosRef.current.refresh()
    }
  }, [location.pathname])

  useEffect(() => {
    document.documentElement.classList.remove('theme-dark', 'theme-light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('taji-theme', theme)
  }, [theme])

  const planningValue = useMemo(
    () => ({
      isOpen: planningOpen,
      open: () => setPlanningOpen(true),
      close: () => setPlanningOpen(false),
      toggleTheme: () => setTheme((prev) => (prev === 'theme-dark' ? 'theme-light' : 'theme-dark')),
    }),
    [planningOpen]
  )

  return (
    <PlanningModalContext.Provider value={planningValue}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="academy" element={<Academy />} />
          <Route path="events" element={<Events />} />
          <Route path="weddings" element={<Weddings />} />
          <Route path="corporate" element={<Corporate />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="checkout/:courseSlug" element={<Checkout />} />
          <Route path=":courseSlug" element={<CourseDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </PlanningModalContext.Provider>
  )
}
