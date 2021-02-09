// TODO move to models
import store from '@/store'
import Geo from 'tw/Geo'

const { style, canvases, registry } = (() => {
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
})()

const css = (slug) => `sprite sprite-${slug.replace(/\./g, ' ')}`

const saveSprite = (slug, url) => {
  if (!registry[slug]) {
    const selector = `.sprite.sprite-${slug}`
    style.innerHTML += `${selector} { background-image: url("${url}");}\n`
    registry[slug] = css(slug)
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

const getPieceSprite = (slug, sheet, index) => {
  return saveSprite(slug, getDataUrl(sheet, index))
}

const solo_sprites = ['bat', 'bat-big', 'vampire', 'legday', 'legs4days', 'sixlegs', 'bonetar']
const saveSoloSprite = (slug) => saveSprite(slug, `/static/sprites/${slug}.png`)
solo_sprites.forEach(saveSoloSprite)

export default {
  getSheetSprite,
  getPieceSprite,
  exists: (s) => !!registry[s],
  css,
}
