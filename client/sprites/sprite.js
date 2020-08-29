import types from '../../tw/piece/types'

const registry = {}

let style_tag

const sprite = (name) => {
  if (!registry[name]) {
    if (!style_tag) {
      style_tag = document.createElement('style')
      document.head.appendChild(style_tag)
      style_tag.type = 'text/css'
    }
    const selector = `.sprite.sprite-${name}`
    style_tag.innerHTML += `${selector} { background-image: url("/static/sprites/${name}.png");}\n`
    sprite.list.push(name)
    registry[name] = 'sprite sprite-' + name
  }
  return registry[name]
}
sprite.list = []

Object.keys(types).forEach((type) => {
  sprite(type)
})

export default sprite
