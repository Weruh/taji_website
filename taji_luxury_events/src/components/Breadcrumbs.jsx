import { Link } from 'react-router-dom'

export default function Breadcrumbs({ crumbs = [] }) {
  if (!crumbs.length) return null

  return (
    <nav className="text-xs uppercase tracking-[0.3em] text-mist/60" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-2">
        {crumbs.map((crumb, index) => (
          <li key={`${crumb.label}-${index}`}>
            {crumb.url ? (
              <Link to={crumb.url} className="hover:text-gold">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ivory">{crumb.label}</span>
            )}
            {index < crumbs.length - 1 ? <span>&bull;</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
