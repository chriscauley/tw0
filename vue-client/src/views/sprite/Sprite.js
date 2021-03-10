// TODO move to models
import FileSaver from 'file-saver'
import store from '@/store'
import Geo from 'tw/Geo'
import sprites_json from './sprites.json'

const cache = (() => {
  if (window.SPRITE_CACHE) {
    console.warn('reusing sprite cache')
    return window.SPRITE_CACHE
  }
  const style = document.createElement('style')
  document.head.appendChild(style)
  style.type = 'text/css'

  return (window.SPRITE_CACHE = {
    style,
    css: {},
    json: sprites_json,
    canvas: {},
  })
})()

// lazy way to refresh sprites for now
// delete sprites_json.blood_armor

const cssSafe = (slug) => `sprite sprite-${slug.replace(/\./g, ' ')}`
const css = (slug) => {
  if (!cache.css[slug]) {
    console.warn('missing sprite for ', slug)
    return cssSafe(slug)
  }
  return cache.css[slug]
}

const saveSprite = (slug, { sheet = {}, index, url }) => {
  if (!cache.css[slug]) {
    const selector = `.sprite.sprite-${slug}`
    cache.style.innerHTML += `${selector} { background-image: url("${url}");}\n`
    cache.css[slug] = cssSafe(slug)
  }
  if (!cache.json[slug]) {
    cache.json[slug] = { slug, index, url, sheet_fname: sheet.fname }
    console.warn(`writing ${slug} sprite to cache.json`)
  }
  return cache.css[slug]
}

const getDataUrl = (sheet, index) => {
  const img = store.sheet.getImage(sheet.fname)
  const { scale, width, height } = sheet
  const W = Math.floor(width / scale)
  const H = Math.floor(height / scale)
  if (!cache.canvas[scale]) {
    const canvas = (cache.canvas[scale] = document.createElement('canvas'))
    canvas.width = canvas.height = scale
  }

  const geo = Geo(W, H)
  const ctx = cache.canvas[scale].getContext('2d')
  ctx.clearRect(0, 0, scale, scale)
  const [x, y] = geo.index2xy(index)
  ctx.drawImage(img, x * scale, y * scale, scale, scale, 0, 0, scale, scale)
  return cache.canvas[scale].toDataURL()
}

const getSheetSprite = (sheet, index) => {
  return saveSprite(sheet.sprites[index], { sheet, index, url: getDataUrl(sheet, index) })
}

const getPieceSprite = (slug, sheet, index) => {
  return saveSprite(slug, { sheet, index, url: getDataUrl(sheet, index) })
}

const solo_sprites = [
  'bat',
  'bat-big',
  'bonetaur',
  'blood_armor',
  'floorlock',
  'floorstairs',
  'heart',
  'legday',
  'legs4days',
  'sixlegs',
  'node-1',
  'node-2',
  'vampire',
  'red-zombie',
  'ball-disco',
]
const saveSoloSprite = (slug) => {
  saveSprite(slug, { url: `/static/sprites/${slug}.png` })
}
solo_sprites.forEach(saveSoloSprite)
Object.values(cache.json).forEach(({ slug, url }) => {
  saveSprite(slug, { url })
})

const downloadJson = () => {
  const blob = new Blob([JSON.stringify(cache.json, null, 2)], { type: 'text/plain;charset=utf-8' })
  FileSaver.saveAs(blob, 'sprites.json')
}

export default {
  getSheetSprite,
  getPieceSprite,
  exists: (s) => !!cache.css[s],
  cssSafe,
  downloadJson,
  css,
}
