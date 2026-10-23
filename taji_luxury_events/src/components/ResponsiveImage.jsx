import images from '../generated/images.json'
import { normalizePath } from '../utils/media.js'

export default function ResponsiveImage({
  src,
  alt = '',
  sizes = '(min-width: 1280px) 384px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  loading = 'lazy',
  decoding = 'async',
  ...props
}) {
  const original = normalizePath(src)
  const image = images[original]
  const sources = image?.sources

  return (
    <img
      src={sources ? sources[sources.length - 1].src : original}
      srcSet={sources?.map((source) => `${source.src} ${source.width}w`).join(', ')}
      sizes={sources ? sizes : undefined}
      width={image?.width}
      height={image?.height}
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...props}
    />
  )
}
