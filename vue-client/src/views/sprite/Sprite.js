// TODO move to models
import store from '@/store'
import Geo from 'tw/Geo'

const load = () => {
  if (window.SPRITE_CACHE) {
    console.warn('reusing sprite cache')
    return window.SPRITE_CACHE
  }
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.type = 'text/css'

  const canvases = {}
  const registry = {}
  return (window.SPRITE_CACHE = { canvases, registry, style })
}

const { style, canvases, registry } = load()

const saveSprite = (slug, url) => {
  if (!registry[slug]) {
    const selector = `.sprite.sprite-${slug}`
    style.innerHTML += `${selector} { background-image: url("${url}");}\n`
    const cls = slug.replace('.', ' ')
    registry[slug] = 'sprite sprite-' + cls
  }
  return registry[slug]
}

const sheetSlug = (sheet) => {
  return sheet.fname.replace(/\..*/, '').toLowerCase()
}

const getDataUrl = (sheet, index) => {
  const img = store.sheet.getImage(sheet.fname)
  const { scale, width, height } = sheet
  const W = Math.floor(width / scale)
  const H = Math.floor(height / scale)
  if (!canvases[scale]) {
    const canvas = (canvases[scale] = document.createElement('canvas'))
    canvas.width = canvas.height = scale
  }

  const geo = Geo(W, H)
  const ctx = canvases[scale].getContext('2d')
  ctx.clearRect(0, 0, scale, scale)
  const [x, y] = geo.index2xy(index)
  ctx.drawImage(img, x * scale, y * scale, scale, scale, 0, 0, scale, scale)
  return canvases[scale].toDataURL()
}

const getSheetSprite = (sheet, index) => {
  const slug = `sheet-${sheetSlug(sheet)}.-i-${index}`
  return saveSprite(slug, getDataUrl(sheet, index))
}

export default {
  getSheetSprite,
}
