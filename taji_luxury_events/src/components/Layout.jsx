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
            <div className="px-3 sm:px-4 lg:px-6 py-16 text-sm uppercase tracking-[0.4em] text-gold/70">
              Loading
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
