import { Component } from 'react'

export default class AppErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Page rendering failed', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main className="min-h-screen bg-charcoal px-4 py-16 text-ivory">
        <div className="mx-auto max-w-lg rounded-2xl border border-gold/30 bg-white p-8 shadow-lg">
          <h1 className="font-playfair text-3xl">This page could not load</h1>
          <p className="mt-4 text-mist">Please reload the page and try again.</p>
          {import.meta.env.DEV && (
            <pre className="mt-5 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg bg-charcoal p-3 text-sm text-primary">{this.state.error.message}</pre>
          )}
          <button className="mt-6 rounded-full bg-primary px-5 py-2 text-white" onClick={() => window.location.reload()} type="button">
            Reload page
          </button>
        </div>
      </main>
    )
  }
}
