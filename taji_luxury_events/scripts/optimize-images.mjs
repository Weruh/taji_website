import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../', import.meta.url))
const sourceDirectory = path.join(root, 'public/img')
const outputDirectory = path.join(sourceDirectory, 'optimized')
const manifestPath = path.join(root, 'src/generated/images.json')
const widths = [160, 320, 640, 960, 1600]
const quality = 82
const generated = new Map()
const manifest = {}
sharp.concurrency(2)

async function writeAtomic(filename, contents) {
  const temporary = `${filename}.${process.pid}.tmp`
  await writeFile(temporary, contents)
  await rename(temporary, filename)
}

async function findImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name)
    if (filename === outputDirectory) return []
    if (entry.isDirectory()) return findImages(filename)
    return /\.(webp|png|jpe?g)$/i.test(entry.name) ? [filename] : []
  }))
  return files.flat().sort()
}

async function createVariants(input, hash) {
  const metadata = await sharp(input).metadata()
  if (metadata.pages > 1) return null
  const rotated = metadata.orientation >= 5
  const width = rotated ? metadata.height : metadata.width
  const height = rotated ? metadata.width : metadata.height
  const targetWidths = [...new Set(widths.map((size) => Math.min(size, width)))]
  const sources = []
  for (const size of targetWidths) {
    const basename = `${hash}-${size}.webp`
    const destination = path.join(outputDirectory, basename)
    let bytes
    try {
      bytes = (await stat(destination)).size
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
      let output = await sharp(input).rotate().resize({ width: size, withoutEnlargement: true })
        .webp({ quality, effort: 4 }).toBuffer()
      if (size === width && metadata.format === 'webp' && !metadata.orientation && output.length > input.length) {
        output = input
      }
      await writeAtomic(destination, output)
      bytes = output.length
    }
    sources.push({ src: `/img/optimized/${basename}`, width: size, bytes })
  }
  return { width, height, sources }
}

await mkdir(outputDirectory, { recursive: true })
await mkdir(path.dirname(manifestPath), { recursive: true })
const files = await findImages(sourceDirectory)
let cursor = 0
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < files.length) {
    const filename = files[cursor++]
    const input = await readFile(filename)
    const hash = createHash('sha256').update(`webp-v1-${quality}-${widths.join(',')}`).update(input).digest('hex').slice(0, 20)
    if (!generated.has(hash)) generated.set(hash, createVariants(input, hash))
    const result = await generated.get(hash)
    if (result) manifest[`/img/${path.relative(sourceDirectory, filename).split(path.sep).join('/')}`] = result
  }
}))
const contents = `${JSON.stringify(Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`
const existing = await readFile(manifestPath, 'utf8').catch((error) => {
  if (error.code !== 'ENOENT') throw error
  return ''
})
if (existing !== contents) await writeAtomic(manifestPath, contents)
console.log(`Responsive images ready: ${Object.keys(manifest).length} originals, ${generated.size} unique images. Originals preserved.`)
