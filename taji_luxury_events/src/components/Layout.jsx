import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import PlanningModal from './PlanningModal.jsx'
import BackToTop from './BackToTop.jsx'
import WhatsAppFloat from './WhatsAppFloat.jsx'
import ChatbaseWidget from './ChatbaseWidget.jsx';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-inter bg-charcoal text-ivory antialiased selection:bg-gold/30">
      <Navbar />
      <main className="flex-1" id="main-content">
        <Suspense
          fallback={
            <div
              className="flex min-h-[50vh] items-center justify-center"
              role="status"
              aria-live="polite"
              aria-label="Loading page"
            >
              <span
                className="h-12 w-12 animate-spin rounded-full border-4 border-gold/20 border-t-gold"
                aria-hidden="true"
              />
              <span className="sr-only">Loading page</span>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <PlanningModal />
      <Footer />
      <ChatbaseWidget />
      
    </div>
  )
}
