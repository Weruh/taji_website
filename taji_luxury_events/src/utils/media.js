export const normalizePath = (path) => {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/static/')) return path.replace('/static', '')
  if (path.startsWith('static/')) return path.replace('static', '')
  return path
}

export const normalizeMediaList = (items, fields) =>
  items.map((item) => {
    const next = { ...item }
    fields.forEach((field) => {
      if (next[field]) next[field] = normalizePath(String(next[field]))
    })
    return next
  })
